import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Length, IsString, IsOptional } from 'class-validator';

export class ConfirmBvnDto {
    @ApiProperty({ example: '1234' })
    @IsNumberString()
    @Length(11, 11)
    bvn: string;


    @ApiProperty({ example: '08189681252' })
    @IsString()
    @IsOptional()
    challenge: string;
}
