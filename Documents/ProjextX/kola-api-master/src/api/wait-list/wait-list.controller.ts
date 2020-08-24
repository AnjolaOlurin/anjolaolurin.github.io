import { Body, Controller,Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation,ApiTags } from '@nestjs/swagger';
import { WaitListService } from './wait-list.service';
import { PostWaitListDto } from './dto/post-wait-list.dto';

@ApiTags('wait-list')
@Controller('wait-list')
export class WaitListController {
    constructor(private service: WaitListService) {
    }


    @ApiOperation({ summary: 'Add email to wait-list' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: PostWaitListDto) {
        await this.service.addToWaitList(body);

        return {
            code: HttpStatus.CREATED,
            message: 'Successfully added to waiting list',
        };
    }


    @ApiOperation({ summary: 'Get email entries in wait list' })
    @Get()
    @HttpCode(HttpStatus.CREATED)
    fetch() {
        return this.service.getWaitList();
    }

}
