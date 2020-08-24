import { NestFactory } from '@nestjs/core';
import { Connection } from 'typeorm';
import { AppModule } from './app.module';

// Just run the migration
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const connection = await app.resolve(Connection);
    const migrations = await connection.runMigrations();
    console.log(`Run ${migrations.length} migrations`); // tslint:disable-line
    app.close();
}
bootstrap().then(() => {
    console.log('Done !'); // tslint:disable-line
    process.exit(0);
});
