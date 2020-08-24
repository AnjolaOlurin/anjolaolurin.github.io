import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumberString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangePasswordDto {
    @ApiProperty({ example: '1234' })
    @IsNumberString()
    @Length(4, 4)
    @Transform(s => s.trim())
    oldPin: string;

    @ApiProperty({ example: '1234' })
    @IsNumberString()
    @Length(4, 4)
    @Transform(s => s.trim())
    newPin: string;
}
