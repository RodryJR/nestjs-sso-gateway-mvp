// Modificado por la IA
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [HttpModule, WebhooksModule],
  controllers: [OperationsController],
  providers: [OperationsService, AuthGuard],
})
export class OperationsModule {}
