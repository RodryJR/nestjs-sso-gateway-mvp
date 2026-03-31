import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ProxyModule } from './proxy/proxy.module';
//codigo asistido por ia
@Module({
  imports: [
    // 🛡️ Protección DDoS: máx 60 requests por minuto por IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    HttpModule,
    ProxyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Aplicado globalmente
    },
  ],
})
export class AppModule {}
