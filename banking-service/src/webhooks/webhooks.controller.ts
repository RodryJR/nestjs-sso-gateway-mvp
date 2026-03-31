import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { RegisterWebhookDto } from './dto/register-webhook.dto';
import { AuthGuard } from '../guards/auth.guard';
//codigo asistido por ia
@ApiTags('Webhooks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Register a webhook for real-time notifications' })
  register(@Body() dto: RegisterWebhookDto) {
    return this.webhooksService.register(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered webhooks' })
  findAll() {
    return this.webhooksService.findAll();
  }
}