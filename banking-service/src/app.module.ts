import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { OperationsModule } from './operations/operations.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [AccountsModule, OperationsModule, WebhooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
