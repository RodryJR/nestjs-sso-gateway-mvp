import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
// codigo asistido por ia
@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  async forward(
    targetUrl: string,
    method: string,
    body?: any,
    headers?: Record<string, string>,
  ) {
    const config: AxiosRequestConfig = {
      method,
      url: targetUrl,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...(headers?.authorization && { authorization: headers.authorization }),
      },
    };

    const { data } = await firstValueFrom(this.httpService.request(config));
    return data;
  }
}