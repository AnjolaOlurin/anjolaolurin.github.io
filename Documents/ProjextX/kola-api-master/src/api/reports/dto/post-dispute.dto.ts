import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { CRCFacilityType, ReportType } from '../report.enums';

export class PostDisputeDto {

    @ApiProperty({ example: 'Message here' })
    @IsString()
    @MaxLength(300)
    readonly message: string;

    @ApiProperty({ example: 'publicid' })
    @IsString()
    readonly reportId: string;

    @ApiProperty({ example: CRCFacilityType.Commercial })
    @IsEnum(CRCFacilityType)
    readonly facilityType: CRCFacilityType;


    @ApiPropertyOptional({ example: 'RUID here' })
    @IsString()
    @IsOptional()
    readonly facilityId?: number;
}
