import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsNumberString, Length, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { UserGender } from '@api/users';

export class SignupDto {
    @ApiProperty({ example: 'test@test.io' })
    @IsEmail()
    @Transform(s => s.trim().toLowerCase())
    readonly email: string;

    @ApiProperty({ example: '+2348189681252' })
    @IsPhoneNumber('ZZ')
    readonly phone: string;

    @ApiProperty({ example: '1234' })
    @IsNumberString()
    @Length(4, 4)
    @Transform(s => s.trim())
    readonly pin: string;

    @ApiProperty({ example: 'Adekunle Ciroma' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: '890U89ND' })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    referalCode: string;
}
