import { Module } from '@nestjs/common'
import { CoreModule } from '@core/core.module';
import { ApiModule } from '@api/api.module';
import { AuthModule } from '@auth/auth.module';
@Module({
  imports: [CoreModule, AuthModule, ApiModule],
  controllers: [],
})
export class AppModule {}
