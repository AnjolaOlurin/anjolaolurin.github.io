import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PatchProfileDto {
    @ApiProperty({ example: 'Jhon', required: false })
    @IsOptional()
    @IsString()
    readonly firstName: string;

    @ApiProperty({ example: 'Doe', required: false })
    @IsOptional()
    @IsString()
    readonly lastName: string;
}
