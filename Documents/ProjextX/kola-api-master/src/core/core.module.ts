import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './services/config.service';
import { EventPublisher } from './events/event.publisher';
import { JobService } from './services/job.service';
import { ShortenerService } from './services/shortener.service';
import { WORKER_PROVIDERS } from './providers/worker.provider';
import { MailHandler } from './services/mail-handler.service';
import *  as ormConfig from '../config/ormConfig';

@Global()
@Module({
    imports: [TypeOrmModule.forRoot(ormConfig)],
    providers: [...WORKER_PROVIDERS, ConfigService, EventPublisher, JobService, ShortenerService, MailHandler],
    exports: [...WORKER_PROVIDERS, ConfigService, EventPublisher, JobService, ShortenerService, MailHandler],
})
export class CoreModule {
}
