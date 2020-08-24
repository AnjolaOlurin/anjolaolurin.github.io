import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicReport } from './entities/basic-report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { UsersModule } from '@api/users/users.module';
import { ClassicReport } from './entities/classic-report.entity';
import { Dispute } from './entities/dispute.entity';
import { ReportOverview } from './entities/report-overview.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ReportOverview, BasicReport, ClassicReport, Dispute]), UsersModule],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {
}
