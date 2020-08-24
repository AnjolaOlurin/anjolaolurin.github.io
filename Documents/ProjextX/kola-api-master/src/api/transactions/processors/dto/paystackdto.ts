import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class PaystackCallbackDto {
@ApiProperty()
@IsString()
readonly reference: string
}