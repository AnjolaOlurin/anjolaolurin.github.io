import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { ConfigService } from '@core/services';


const config = new ConfigService();

const migrationsDir = config.DB_MIGRATIONS_DIR
    ? path.join(__dirname, config.DB_MIGRATIONS_DIR)
    : path.join(__dirname, '..', 'migrations');

const migrationsPath = path.join(migrationsDir, '**{.ts,.js}');

const ormConfig: ConnectionOptions = {
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: config.DB_SYNC,
    migrationsRun: false,
    dropSchema: config.DB_DROP_SCHEMA,
    migrations: [migrationsPath],
    cli: {
        migrationsDir: 'src/migrations',
    },
    logging: !config.inProduction ? ['error', 'migration', 'warn'] : false,
};

export = ormConfig;
