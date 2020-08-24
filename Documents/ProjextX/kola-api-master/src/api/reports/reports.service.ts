import { Injectable, NotFoundException } from '@nestjs/common';
import { Dispute } from './entities/dispute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '@api/users';
import { JobService, MailHandler } from '@core/services';
import { CRCJob } from '@core/jobs/crc.job';
import { QueueTasks, EmailSenders, EmailSubjects, EmailTemplates } from '@core/helpers';
import { ReportStatus, ReportType } from './report.enums';
import { AppException } from '@core/exceptions/app.exception';
import { ClassicReport } from './entities/classic-report.entity';
import { PostDisputeDto } from './dto/post-dispute.dto';
import { CRCBasicCreditSummary } from './crc.interface';
import { ReportOverview } from './entities/report-overview.entity';
import { PostPhoneChallengeDto } from './dto/post-phone-challenge.dto';

@Injectable()
export class ReportsService {

    constructor(
        @InjectRepository(ClassicReport) private readonly classicReportRepository: Repository<ClassicReport>,
        @InjectRepository(Dispute) private readonly disputeRepository: Repository<Dispute>,
        @InjectRepository(ReportOverview) private readonly overviewRepository: Repository<ReportOverview>,
        private readonly userService: UsersService,
        private readonly mailHandler: MailHandler,
        private readonly jobService: JobService) { }


    async getLatestReport(publicId: string) {
        const overview =  await this.getReportOverview(publicId);

        return this.classicReportRepository.findOne(overview.reportId);
    }

    async addGenerateReportToQueue(publicId: string) {
        const user = await this.userService.findOneByPublicId(publicId);

        if (!user.phoneConfirmed) {
            throw AppException.OPERATION_NOT_ALLOWED.setMessage('Phone number not confirmed');
        }

        if (!user.bvnConfirmed) {
            throw AppException.OPERATION_NOT_ALLOWED.setMessage('Bvn not confirmed');
        }

        this.jobService.addJobToQueue(new CRCJob(user), QueueTasks.CRC_GENERATE_REPORT);
    }

    async reportDispute(userPublicId: string, dto: PostDisputeDto) {
        const user = await this.userService.findOneByPublicId(userPublicId);
        const report = await this.findReportByPublicId(dto.reportId);

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        const summary: CRCBasicCreditSummary = report[dto.facilityType.toLowerCase()].summary;

        if (!summary) {
            throw new NotFoundException('Credit summary not found');
        }

        const partial = {
            userId: user.id,
            ...dto,
        };

        await this.disputeRepository.save(partial as any);

        // Send mail to admin
        const addtionalContent = {
            fullName: user.fullName,
            birthDate: user.birthDate,
            gender: user.gender,
            message: dto.message,
            customerEmail: user.email,
            ...summary
        }

        this.mailHandler.handleEmail(EmailSenders.CRC_DISPUTE, EmailSubjects.DISPUTE_REPORT, EmailTemplates.DISPUTE_REPORT, addtionalContent);

    }

    async getDisputes(userPublicId: string) {
        const user = await this.userService.findOneByPublicId(userPublicId);

        return await this.disputeRepository.find({userId: user.id});

    }

    private async getReportOverview(publicId: string) {
        const user = await this.userService.findOneByPublicId(publicId);

        const overview = await this.overviewRepository.findOne({ where: { userId: user.id }});

        if (!overview || overview.status === ReportStatus.Pending) {
            throw AppException.CRC_REPORT_GENERATION_PENDING;
        }

        if (overview.status === ReportStatus.RequirePhoneChallenge) {
            const challenge = this.maskChallenge(overview.phoneChallenge);
            throw AppException.CRC_REPORT_REQUIRES_PHONE_CHALLENGE(challenge);
        }

        if (overview.status === ReportStatus.NotFound) {
            throw AppException.CRC_REPORT_NOT_FOUND;
        }

        if (overview.status === ReportStatus.Failed) {
            throw AppException.CRC_REPORT_GENERATION_FAILED;
        }

        return overview;
    }

    async fulfilReportChallenge(publicId: string, dto: PostPhoneChallengeDto) {

        const user = await this.userService.findOneByPublicId(publicId);

        const overview = await this.overviewRepository.findOne({ userId: user.id });

        if (!overview.phoneChallenge) {
            throw AppException.CRC_REPORT_CHALLENGE_NOT_FOUND;
        }



        if (overview.phoneChallenge.includes(dto.phoneChallenge)) {
            overview.phoneChallengePassed = true;
            overview.phoneChallenge = null;
            overview.status = ReportStatus.Pending;
            return this.overviewRepository.save(overview);
        }

        throw AppException.CRC_REPORT_CHALLENGE_FAILED;

    }


   /**
    * Gets a classic or basic report using its public id
    *
    * @param publicId
    * @param reportType
    */
    private async findReportByPublicId(publicId: string) {

        return this.classicReportRepository
            .createQueryBuilder()
            .where({ publicId })
            .limit(1)
            .getOne();
    }

    private maskChallenge(phoneChallenge: string[]) {
        return phoneChallenge.map(phone => phone.slice(-4));
    }


}
