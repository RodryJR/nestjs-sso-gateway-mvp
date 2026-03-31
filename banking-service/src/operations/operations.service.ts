import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WebhooksService } from '../webhooks/webhooks.service';
//codigo asistido por ia
@Injectable()
export class OperationsService {
  private baseUrl = process.env.MOCKAPI_BASE_URL;

  constructor(
    private httpService: HttpService,
    private webhooksService: WebhooksService,
  ) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/operations`),
    );
    // Retorna solo los campos requeridos por el cliente
    return data.map((op: any) => ({
      id: op.id,
      accountId: op.accountId,
      date: op.date,
      operation: op.operation,
      amount: op.amount,
    }));
  }

  async findByAccount(accountId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/operations?accountId=${accountId}`),
    );
    return data.map((op: any) => ({
      id: op.id,
      accountId: op.accountId,
      date: op.date,
      operation: op.operation,
      amount: op.amount,
    }));
  }

  async create(createOperationDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/operations`, createOperationDto),
    );

    // 🔔 Notificar webhooks registrados en tiempo real
    await this.webhooksService.notify({
      event: 'operation.created',
      data: {
        id: data.id,
        accountId: data.accountId,
        date: data.date,
        operation: data.operation,
        amount: data.amount,
      },
    });

    return data;
  }
}