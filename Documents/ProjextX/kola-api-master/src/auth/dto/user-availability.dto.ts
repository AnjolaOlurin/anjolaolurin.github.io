import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';


export class UserAvailabilityDto {

    @ApiProperty({ example: 'test@test.io' })
    @IsEmail()
    @IsOptional()
    @Transform(s => s.trim().toLowerCase())
    readonly email: string;

    @ApiProperty({ example: '+2348189681252' })
    @IsOptional()
    @IsPhoneNumber('ZZ')
    readonly phone: string;

}
