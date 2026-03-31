// Modificado por la IA
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, AuthGuard],
  exports: [WebhooksService],
})
export class WebhooksModule {}
