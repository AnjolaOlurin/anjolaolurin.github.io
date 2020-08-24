import { IsNotEmpty, IsEmail, IsPhoneNumber, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SendConfirmationDto {
    @ApiProperty({ example: 'test@test.io' })
    @IsEmail()
    @ValidateIf(o => !o.phone )
    @Transform(s => s.trim().toLowerCase())
    readonly email: string;

    @ApiProperty({ example: '+2348189681252' })
    @IsPhoneNumber('ZZ')
    @ValidateIf(o => !o.email )
    readonly phone: string;
}
