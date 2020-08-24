import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from '@api/users/users.service';
import { MailHandler, ConfigService, JobService } from '@core/services';
import { EmailSubjects, EmailTemplates, Utils, AccountStatus, SMSTemplates, QueueTasks, DUPLICATE_UNIQUE_CONSTRAINT_CODE } from '@core/helpers';
import { ShortenerService } from '@core/services/shortener.service';
import { User } from '@api/users';
import { SCryptCryptoFactory } from '@core/crypto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { AuthException } from './auth.exception';
import { SendConfirmationDto } from './dto/send-confirmation.dto';
import { UserAvailabilityDto } from './dto/user-availability.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmBvnDto } from './dto/confirm-bvn.dto';
import { PaystackService } from './paystack.service';
import { PhoneUtils } from '@core/helpers/phone.utils';
import { AppException } from '@core/exceptions';
import { CRCJob } from '@core/jobs/crc.job';
import { EmailConflictException } from '@common/exceptions';

@Injectable()
export class AuthService {

    // How long we wait for the user to click confirmation token when creating a new account
    static SECURITY_TOKEN_EXPIRY_SECONDS = 3 * 24 * 3600;

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private usersService: UsersService,
        private paystackService: PaystackService,
        private mailHandler: MailHandler,
        private config: ConfigService,
        private jobService: JobService,
        private jwt: JwtService,
        private shortenerService: ShortenerService, ) { }

    async signup(data: SignupDto): Promise<User> {

        const entity = this.userRepository.create(data);
        const splitedName = data.name.split(' ');
        entity.firstName = splitedName[0];
        entity.lastName = splitedName.length > 1 ? splitedName[splitedName.length - 1] : null;
        entity.passwordHash = await SCryptCryptoFactory.hash(data.pin);
        entity.securityToken = Utils.generateRandomID(12);
        entity.securityTokenRequestedAt = new Date();

        const user = await this.usersService.create(entity);

        // Send confirmation email
        await this.handleWelcomeEmail(user);
        return user;

    }

    async confirmEmail(data: ConfirmAccountDto, currentDate: Date = new Date()) {

        const user = await this.userRepository.findOne({ securityToken: data.token });

        if (!user) {
            throw AuthException.INVALID_TOKEN;
        }

        // Check for token expiration
        if (Utils.secondsBetween(currentDate, user.securityTokenRequestedAt) > AuthService.SECURITY_TOKEN_EXPIRY_SECONDS) {
            throw AuthException.TOKEN_EXPIRED;
        }

        user.securityTokenRequestedAt = null;
        user.securityToken = null;
        user.emailConfirmed = true;
        user.status = AccountStatus.ACTIVE;

        return this.userRepository.save(user);
    }

    async sendEmailConfirmation(data: SendConfirmationDto) {
        const user = await this.userRepository.findOne({ email: data.email });

        if (!user) {
            throw new NotFoundException('Account Not Found');
        }
        user.securityToken = Utils.generateRandomID(12);
        user.securityTokenRequestedAt = new Date();

        await this.userRepository.save(user);

        // Send confirmation email
        await this.handleConfirmationEmail(user);
    }


    async confirmPhone(publicId: string, data: ConfirmAccountDto, currentDate: Date = new Date()) {

        const user = await this.userRepository.findOne({ publicId, securityToken: data.token });

        if (!user) {
            throw AuthException.INVALID_TOKEN;
        }

        // Check for token expiration
        if (Utils.secondsBetween(currentDate, user.securityTokenRequestedAt) > AuthService.SECURITY_TOKEN_EXPIRY_SECONDS) {
            throw AuthException.TOKEN_EXPIRED;
        }

        user.securityTokenRequestedAt = null;
        user.securityToken = null;
        user.phoneConfirmed = true

        return this.userRepository.save(user);
    }

    async confirmBvn(publicId: string, data: ConfirmBvnDto) {

        let user = await this.usersService.findOneByPublicId(publicId);

        if (user.bvnConfirmed) {
            throw AppException.OPERATION_NOT_ALLOWED.setMessage('BVN already confirmed');
        }

        // Ensure there is BVN Data by calling paystack BVN API
        if (!user.bvnRawData) {
            const bvnData = await this.paystackService.resolveBvn(data.bvn);
            user.bvnRawData = bvnData;
            user = await this.userRepository.save(user);
        }

        // Save BVN if phones are the same or challenge is presented
        if (PhoneUtils.comparePhone(user.bvnRawData.mobile, user.phone) || (data.challenge && user.bvnRawData.mobile === data.challenge)) {
            user.bvn = data.bvn;
            user.firstName = Utils.toTitleCase(user.bvnRawData.first_name);
            user.lastName = Utils.toTitleCase(user.bvnRawData.last_name);
            user.birthDate = new Date(user.bvnRawData.formatted_dob);
            user.bvnConfirmed = true;

            await this.userRepository.save(user);
            return this.jobService.addJobToQueue(new CRCJob(user), QueueTasks.CRC_GENERATE_REPORT);
        }

        // Throw requires BVN if phone not same
        if (!PhoneUtils.comparePhone(user.bvnRawData.mobile, user.phone)) {
            throw AppException.BVN_REQUIRES_PHONE_CHALLENGE(user.bvnRawData.mobile.slice(-4));
        }

    }

    async sendPhoneConfirmation(publicId: string, phone?: string) {
        const user = await this.usersService.findOneByPublicId(publicId);

        if (!user) {
            throw new NotFoundException('Account Not Found');
        }

        // change phone number if supplied
        if (phone) {
            user.phone = phone;
        }
        user.securityToken = Utils.generateRandomNumber(6).toFixed();
        user.securityTokenRequestedAt = new Date();

        try{
            
        await this.userRepository.save(user);

        // Send confirmation email
        await this.handleConfirmationSMS(user);

        
        }catch(err){

            if (err && err.code === DUPLICATE_UNIQUE_CONSTRAINT_CODE) {
                
                throw new EmailConflictException();
            }
            throw err;
        }
    }

    /**
     * TODO: Remove publicId from revoked token if there
     *
     * @param data
     */
    async signin(data: SigninDto) {
        const user = await this.usersService.findUserByEmail(data.email);

        // authenticate password
        await this.authenticateUserCredentials(user, data.pin);

        // Create  token
        const payload = { sub: user.publicId, email: user.email };

        // lets create the token
        const accessToken = this.jwt.sign(payload);

        return { user, accessToken }

    }

    public async checkUserAvailability(query: UserAvailabilityDto) {

        const conditions = Utils.removeNilValues({ email: query.email, username: query.phone });
        const user = await this.userRepository.findOne(conditions);
        return !user;

    }

    async sendResetPasswordToken(data: ForgotPasswordDto) {
        const user = await this.usersService.findUserByEmail(data.email);
        user.securityToken = Utils.generateRandomID(12);
        user.securityTokenRequestedAt = new Date();

        await this.userRepository.save(user);

        // Send reset email
        await this.handleResetPasswordEmail(user);
    }

    async changePassword(publicId: string, data: ChangePasswordDto) {
        const user = await this.usersService.findOneByPublicId(publicId);

        // Authenticate old password
        await this.authenticateUserCredentials(user, data.oldPin);

        // Change password
        await this.usersService.changePassword(user, data.newPin);
    }

    async resetPasswordByToken(data: ResetPasswordDto, currentDate: Date = new Date()) {

        const user = await this.userRepository.findOne({ securityToken: data.token });

        if (!user) {
            throw AuthException.INVALID_TOKEN;
        }

        // Check for token expiration
        if (Utils.secondsBetween(currentDate, user.securityTokenRequestedAt) > AuthService.SECURITY_TOKEN_EXPIRY_SECONDS) {
            throw AuthException.TOKEN_EXPIRED;
        }

        user.securityTokenRequestedAt = null;
        user.securityToken = null;

        return this.usersService.changePassword(user, data.newPin);
    }


    private async authenticateUserCredentials(user: User, password: string) {

        // lets make sure his account is active
        if (user.status !== AccountStatus.ACTIVE) {
            throw AuthException.ACCOUNT_INACTIVE(user.status);
        }

        const isPinAuthenticitic = await SCryptCryptoFactory.compare(password, user.passwordHash);

        if (!isPinAuthenticitic) {
            throw AuthException.INVALID_PASSWORD;
        }

        return user;

    }

    private async handleWelcomeEmail(user: User): Promise<void> {

        // Send confirmation email
        const emailName = {
            email: user.email,
            name: user.fullName,
        }

        const verifyLink = await this.shortenerService.shorten(`${this.config.USER_SITE_DOMAIN}/confirmation/${user.securityToken}`);

        const content = {
            firstName: user.firstName,
            verifyLink,
        }

        this.mailHandler.handleEmail(emailName, EmailSubjects.USER_WELCOME, EmailTemplates.USER_WELCOME, content);
    }

    private async handleResetPasswordEmail(user: User): Promise<void> {

        // Send confirmation email
        const emailName = {
            email: user.email,
            name: user.fullName,
        }

        const resetLink = await this.shortenerService.shorten(`${this.config.USER_SITE_DOMAIN}/reset/${user.securityToken}`);

        const content = {
            firstName: user.firstName,
            resetLink,
        }

        this.mailHandler.handleEmail(emailName, EmailSubjects.RESET_PASSWORD, EmailTemplates.RESET_PASSWORD, content);
    }

    private async handleConfirmationEmail(user: User): Promise<void> {

        // Send confirmation email
        const emailName = {
            email: user.email,
            name: user.fullName,
        }

        const verifyLink = await this.shortenerService.shorten(`${this.config.USER_SITE_DOMAIN}/confirmation/${user.securityToken}`);

        const content = {
            firstName: user.firstName,
            verifyLink,
        }

        this.mailHandler.handleEmail(emailName, EmailSubjects.CONFIRM_ACCOUNT, EmailTemplates.CONFIRM_ACCOUNT, content);
    }


    private async handleConfirmationSMS(user: User): Promise<void> {

        const content = {
            firstName: user.firstName,
            token: user.securityToken,
        }

        this.mailHandler.handleSMS(user.phone, SMSTemplates.CONFIRM_PHONE, content);
    }



}
