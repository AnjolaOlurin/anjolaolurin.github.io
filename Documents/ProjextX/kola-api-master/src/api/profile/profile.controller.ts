import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { User, UsersService } from '@api/users';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';

@ApiBearerAuth()
@ApiTags('me')
@Controller('me')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(
        private readonly userService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Get profile details' })
    get(@CurrentUser() user: User) {
        return this.userService.findOneByPublicId(user.publicId);
    }

}
