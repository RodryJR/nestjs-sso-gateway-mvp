import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
// codigo asistido por ia
@Injectable()
export class AccountsService {
    private baseUrl = process.env.MOCKAPI_BASE_URL;

  constructor(private httpService: HttpService) {}

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/accounts`),
    );
    return data;
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/accounts/${id}`),
    );
    return data;
  }
}
