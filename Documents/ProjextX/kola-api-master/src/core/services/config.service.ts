/*
 * @license
 * Copyright (c) 2018. The Wevied Company.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import {Injectable, Logger} from '@nestjs/common';
import {AppStatus} from '../helpers/enums';
import {AppException} from '../exceptions/app.exception';

interface EnvConfig {
    [prop: string]: string;
}

const EnvSchema = Joi.object({
    NODE_ENV: Joi.string().valid(['development', 'production', 'staging']).default('development'),
    PORT: Joi.number().default(8000),
    STATIC_CDN_DOMAIN: Joi.string(),
    SITE_DOMAIN: Joi.string(),
    API_DOMAIN: Joi.string(),
    DB_ALLOW_REFRESH: Joi.boolean(),
    RABBIT_MQ_URL: Joi.string(),
    JWT_SECRET: Joi.string(),
    PAYSTACK_SECRET_KEY: Joi.string(),
});

@Injectable()
export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor() {
        const config = ConfigService.getEnvironments();
        this.envConfig = ConfigService.validateInput(config);
    }

    private static getEnvironments() {
        if (process.env.NODE_ENV === 'production') {
            return process.env;
        } else {
            const envFile = process.env.NODE_ENV ? process.env.ENV_FILE_PATH || `env/${process.env.NODE_ENV || ''}.env` : 'env/development.env';
            return dotenv.parse(fs.readFileSync(envFile));
        }
    }

    private static validateInput(envConfig: EnvConfig): EnvConfig {
        const { error, value: validatedEnvConfig } = Joi.validate(envConfig, EnvSchema, { allowUnknown: true });

        if (error) {
            throw new AppException(`Config validation error: ${error.message}`, AppStatus.CONFIGURATION_ERROR);
        }
        return validatedEnvConfig;
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    get PORT(): number {
        return parseInt(this.envConfig.PORT, 10);
    }

    get SITE_DOMAIN(): string {
        return this.envConfig.SITE_DOMAIN;
    }

    get STATIC_CDN_DOMAIN(): string {
        return this.envConfig.STATIC_CDN_DOMAIN;
    }

    get USER_SITE_DOMAIN(): string {
        return this.envConfig.USER_SITE_DOMAIN;
    }

    get API_DOMAIN(): string {
        return this.envConfig.API_DOMAIN;
    }

    get DB_HOST(): string {
        return this.envConfig.DB_HOST;
    }

    get DB_PORT(): number {
        return +this.envConfig.DB_PORT;
    }

    get DB_USERNAME(): string {
        return this.envConfig.DB_USERNAME;
    }

    get DB_PASSWORD(): string {
        return this.envConfig.DB_PASSWORD;
    }

    get DB_NAME(): string {
        return this.envConfig.DB_NAME;
    }

    get DB_SYNC() {
        return /(true|on|1)/gi.test(this.envConfig.DB_SYNC)
    }

    get DB_DROP_SCHEMA() {
        return /(true|on|1)/gi.test(this.envConfig.DROP_SCHEMA)
    }

    get DB_MIGRATIONS_DIR(): string {
        return this.envConfig.DB_MIGRATIONS_DIR;
    }

    get RABBIT_MQ_URL(): string {
        return this.envConfig.RABBIT_MQ_URL;
    }

    get PAYSTACK_SECRET_KEY(): string {
        return this.envConfig.PAYSTACK_SECRET_KEY;
    }

    get JWT_SECRET(): string {
        return this.envConfig.JWT_SECRET;
    }

    get inProduction(): boolean {
        return this.envConfig.NODE_ENV === 'production';
    }

    get ENABLE_SWAGGER() {
        return !this.inProduction || (/(true|on|1)/gi.test(process.env.ENABLE_SWAGGER))
    }
}
