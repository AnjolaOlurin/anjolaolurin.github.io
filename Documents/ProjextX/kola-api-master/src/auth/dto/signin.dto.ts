import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SigninDto {
    @ApiProperty({ example: 'admin@kolacredit.com' })
    @IsEmail()
    @Transform(s => s.toLowerCase())
    readonly email: string;

    @ApiProperty({ example: '1234' })
    @IsNumberString()
    @Length(4, 4)
    @Transform(s => s.trim())
    readonly pin: string;
}
