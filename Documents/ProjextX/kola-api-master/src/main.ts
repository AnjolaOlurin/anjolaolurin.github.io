import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module'
import { CustomExceptionFilter } from '@core/exceptions/custom-exception.filter';
import { ParamValidationPipe } from '@core/pipes/param-validation.pipe';
import { ResponseTransformInterceptor } from '@core/interceptors/response-transform.interceptor';
import { ConfigService } from '@core/services/config.service';
import { ModelTransformInterceptor } from '@core/interceptors/model.transfrom.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        // logger: MLogger,
    });
    app.setGlobalPrefix('v1');
    app.useGlobalFilters(new CustomExceptionFilter());
    app.use
    app.useGlobalPipes(new ParamValidationPipe());
    app.useGlobalInterceptors(
        new ModelTransformInterceptor(),
        new ResponseTransformInterceptor()
    );
    const config = app.get(ConfigService);

    if (config.ENABLE_SWAGGER) {
        const options = new DocumentBuilder()
            .setTitle('KolaCredit API')
            .setDescription('The KolaCredit API description')
            .setVersion('0.0.1')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('', app, document);
    }

    await app.listen(config.PORT);
}

bootstrap();
