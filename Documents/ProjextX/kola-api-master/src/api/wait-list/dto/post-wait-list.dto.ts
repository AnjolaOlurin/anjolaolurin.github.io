import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PostWaitListDto {
    @ApiProperty({ example: 'hello@example.com' })
    @IsEmail()
    readonly email: string;
}
