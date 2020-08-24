import { IsPhoneNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPhoneConfirmationDto {
    @ApiProperty({ example: '+2348189681252' })
    @IsPhoneNumber('ZZ')
    @IsOptional()
    readonly phone: string;
}
