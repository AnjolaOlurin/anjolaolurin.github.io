import { Controller, Get, HttpStatus, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CurrentUser } from '@common/decorators';
import { User } from '@api/users';
import { JwtAuthGuard } from '@auth/guards';
import { PostDisputeDto } from './dto/post-dispute.dto';
import { PostPhoneChallengeDto } from './dto/post-phone-challenge.dto';
import { ReportType } from './report.enums';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private reportsService: ReportsService) {}


    /**
     * Basically route to handle generation classic report
     */
    @ApiOperation({ summary: 'Generate Report' })
    @Post('/generate')
    public async generateReport(@CurrentUser() user: User) {

        await this.reportsService.addGenerateReportToQueue(user.publicId);

        return {
            code: HttpStatus.ACCEPTED,
            message: 'Request Accepted',
        };

    }


    /**
     * Basically route to handle  basic report
     */
    @ApiOperation({ summary: 'Get Basic Report' })
    @Post('/challenge')
    public async fulfilReportChallenge(@CurrentUser() user: User, @Body() dto:  PostPhoneChallengeDto) {
        await this.reportsService.fulfilReportChallenge(user.publicId, dto);

        await this.reportsService.addGenerateReportToQueue(user.publicId);

        return {
            code: HttpStatus.OK,
            message: 'Request Successful'
        };

    }

    /**
     * Basically route to get latest report
     */
    @ApiOperation({ summary: 'Get Latest Report' })
    @Get('/latest')
    public async getLatestReport(@CurrentUser() user: User) {

        const report = await this.reportsService.getLatestReport(user.publicId);

        return {
            code: HttpStatus.OK,
            message: 'Request Successful',
            data: report
        };
    }

    /**
     * Basically route to report a dispute
     */
    @ApiOperation({ summary: 'Report a dispute' })
    @Post('/dispute')
    public async reportDispute(@CurrentUser() user: User, @Body() dto: PostDisputeDto) {

        await this.reportsService.reportDispute(user.publicId, dto);


        return {
            code: HttpStatus.ACCEPTED,
            message: 'Request Accepted',
        };

    }


    /**
     * Basically route to get reported dispute
     */
    @ApiOperation({ summary: 'Report a dispute' })
    @Get('/dispute')
    public async getDisputes(@CurrentUser() user: User) {

        const disputes = await this.reportsService.getDisputes(user.publicId);

        return disputes;

    }

}
