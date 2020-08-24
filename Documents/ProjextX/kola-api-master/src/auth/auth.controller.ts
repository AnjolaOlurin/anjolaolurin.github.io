import { Controller, Post, Body, HttpStatus, HttpCode, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AppMessages, AppStatus } from '@core/helpers';
import { CurrentUser } from '@common/decorators';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { SendConfirmationDto } from './dto/send-confirmation.dto';
import { SendPhoneConfirmationDto } from './dto/send-phone-confirmation.dto';
import { UserAvailabilityDto } from './dto/user-availability.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '@api/users';
import { ConfirmBvnDto } from './dto/confirm-bvn.dto';


@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    /**
     * Basically route to handle signup
     *
     */
    @ApiOperation({ summary: 'Register a user' })
    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    public async signup(@Body() body: SignupDto) {

        const user = await this.authService.signup(body);

        return {
            code: HttpStatus.CREATED,
            message: 'Successfully registered account',
            data: { user }
        };
    }


    /**
     * Basically route to confirm user account
     *
     */
    @ApiOperation({ summary: 'Confirm User Email' })
    @Post('confirm/email')
    public async confirmAccount(@Body() data: ConfirmAccountDto) {

        await this.authService.confirmEmail(data);

        return AppMessages.EMAIL_CONFIRMED;
    }

    @ApiOperation({ summary: 'Resend email confirmation' })
    @Post('send-confim/email')
    async sendConfirmation(@Body() data: SendConfirmationDto) {
        await this.authService.sendEmailConfirmation(data);
        return AppMessages.CONFIRMATION_EMAIL_SENT;
    }

    /**
     * Basically route to confirm user account
     *
     */
    @ApiOperation({ summary: 'Confirm User Phone' })
    @UseGuards(JwtAuthGuard)
    @Post('confirm/phone')
    public async confirmPhone(@CurrentUser() user: User, @Body() data: ConfirmAccountDto) {

        await this.authService.confirmPhone(user.publicId, data);

        return AppMessages.PHONE_CONFIRMED;
    }

    @ApiOperation({ summary: 'Resend phone confirmation' })
    @UseGuards(JwtAuthGuard)
    @Post('send-confim/phone')
    async sendPhoneConfirmation(@CurrentUser() user: User, @Body() data: SendPhoneConfirmationDto) {
        await this.authService.sendPhoneConfirmation(user.publicId, data.phone);
        return AppMessages.CONFIRMATION_TEXT_SENT;
    }


    /**
     * Basically route to confirm user account
     *
     */
    @ApiOperation({ summary: 'Confirm User Phone' })
    @UseGuards(JwtAuthGuard)
    @Post('confirm/bvn')
    public async confirmBvn(@CurrentUser() user: User, @Body() data: ConfirmBvnDto) {

        await this.authService.confirmBvn(user.publicId, data);

        return AppMessages.BVN_CONFIRMED;
    }

   /**
    * Route to check for availability of a user
    *
    * @param query
    */
    @Get('check-availability')
    public async checkUserAvailability(@Query() query: UserAvailabilityDto) {
        // lets check the account
        const isAvailable = await this.authService.checkUserAvailability(query);

        return {
            code: isAvailable ? HttpStatus.OK : AppStatus.USER_EXIST,
            message: isAvailable ? 'User is Available' : 'User Exist',
        };
    }


    @ApiOperation({ summary: 'Sign in' })
    @Post('signin')
    async signIn(@Body() data: SigninDto) {
        return this.authService.signin(data);
    }


    @Post('password/forgot')
    async sendResetPasswordToken( @Body() forgotPasswordDto: ForgotPasswordDto ) {
        await this.authService.sendResetPasswordToken(forgotPasswordDto);

        return {
            code: HttpStatus.OK,
            message: AppMessages.PASSWORD_RESET_EMAIL_SENT,
        };
    }


    @Post('password/reset')
    async resetPasswordByToken(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.authService.resetPasswordByToken(resetPasswordDto);

        return {
            code: HttpStatus.OK,
            message: AppMessages.PASSWORD_RESET_SUCCESSFUL,
        };
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('password/change')
    async changePassword(@CurrentUser('publicId') publicId: string, @Body() data: ChangePasswordDto) {
        await this.authService.changePassword(publicId, data);

        return {
            code: HttpStatus.OK,
            message: AppMessages.PASSWORD_RESET_SUCCESSFUL,
        };
    }
}
