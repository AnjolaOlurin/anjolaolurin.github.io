import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostPhoneChallengeDto {
    @ApiProperty({ example: '08189681252' })
    @IsString()
    readonly phoneChallenge: string;
}
