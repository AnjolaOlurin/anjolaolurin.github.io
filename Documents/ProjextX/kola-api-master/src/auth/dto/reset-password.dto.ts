import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumberString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: '1234' })
    @IsNumberString()
    @Length(4, 4)
    @Transform(s => s.trim())
    newPin: string;
}
