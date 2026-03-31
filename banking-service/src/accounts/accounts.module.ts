// Modificado por la IA
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [AccountsController],
  providers: [AccountsService, AuthGuard],
})
export class AccountsModule {}
