import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RegisterWebhookDto } from './dto/register-webhook.dto';

export interface WebhookSubscription {
  id: string;
  url: string;
  event: string;
  createdAt: Date;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  // En memoria para el MVP (en producción usaría DB)
  private subscriptions: WebhookSubscription[] = [];

  constructor(private httpService: HttpService) {}

  register(dto: RegisterWebhookDto): WebhookSubscription {
    const subscription: WebhookSubscription = {
      id: crypto.randomUUID(),
      url: dto.url,
      event: dto.event,
      createdAt: new Date(),
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  findAll(): WebhookSubscription[] {
    return this.subscriptions;
  }

  async notify(payload: { event: string; data: any }) {
    const targets = this.subscriptions.filter(s => s.event === payload.event);

    for (const sub of targets) {
      try {
        await this.httpService.post(sub.url, {
          event: payload.event,
          timestamp: new Date().toISOString(),
          data: payload.data,
        }).toPromise();
        this.logger.log(`Webhook sent to ${sub.url}`);
      } catch (err) {
        this.logger.error(`Webhook failed for ${sub.url}: ${err.message}`);
      }
    }
  }
}