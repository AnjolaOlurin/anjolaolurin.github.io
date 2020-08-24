import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitListService } from './wait-list.service';
import { WaitListController } from './wait-list.controller';
import { WaitList } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([WaitList])],
    controllers: [WaitListController],
    providers: [WaitListService],
})
export class WaitListModule {}
