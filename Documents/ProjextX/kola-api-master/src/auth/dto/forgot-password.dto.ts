import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'test@kolacredit.io' })
    @IsEmail()
    @Transform(s => s.toLowerCase())
    email: string;
}
