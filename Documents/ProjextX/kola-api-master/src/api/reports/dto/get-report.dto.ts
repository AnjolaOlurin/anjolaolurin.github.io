import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from '../report.enums';

export class GetReportDto {
    @ApiProperty({ example: ReportType.Basic })
    @IsEnum(ReportType)
    readonly reportType: ReportType;
}
