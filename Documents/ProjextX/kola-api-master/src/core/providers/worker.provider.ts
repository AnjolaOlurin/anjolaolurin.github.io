import {ClientProxyFactory, Transport} from '@nestjs/microservices';
import {ConfigService} from '../services/config.service';
import { WorkerQueue } from '../helpers/enums';

export const WORKER_SERVICE_TOKEN = 'WORKER_SERVICE_TOKEN';


export const WORKER_PROVIDERS = [
    {
        provide: WORKER_SERVICE_TOKEN,
        useFactory: (config: ConfigService) => {
            return ClientProxyFactory.create({
                transport: Transport.RMQ,
                options: {
                  urls: [config.RABBIT_MQ_URL],
                  queue: WorkerQueue.PROCESS_WORK,
                  queueOptions: { durable: true },
                },
            });
        },
    inject: [ConfigService],
  }
]
