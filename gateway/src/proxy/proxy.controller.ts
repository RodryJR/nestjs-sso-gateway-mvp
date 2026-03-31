import {
  Controller, All, Req, Res, Param, HttpException, HttpStatus
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Gateway Proxy')
@Controller()
export class ProxyController {
  private readonly SSO_URL = process.env.SSO_SERVICE_URL || 'http://sso-service:3001';
  private readonly BANKING_URL = process.env.BANKING_SERVICE_URL || 'http://banking-service:3002';

  constructor(private proxyService: ProxyService) {}

  // Rutas públicas SSO
  @All('auth/*path')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Más estricto en auth
  @ApiOperation({ summary: 'Proxy to SSO Service' })
  async proxySSO(@Req() req: Request) {
    const path = req.url;
    const targetUrl = `${this.SSO_URL}${path}`;
    try {
      return await this.proxyService.forward(
        targetUrl, req.method, req.body, req.headers as any
      );
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'SSO Service error',
        err.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Rutas protegidas Banking
  @All('accounts/*path')
  @All('accounts')
  @ApiOperation({ summary: 'Proxy to Banking Service - Accounts' })
  async proxyAccounts(@Req() req: Request) {
    const targetUrl = `${this.BANKING_URL}${req.url}`;
    try {
      return await this.proxyService.forward(
        targetUrl, req.method, req.body, req.headers as any
      );
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Banking Service error',
        err.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @All('operations/*path')
  @All('operations')
  @ApiOperation({ summary: 'Proxy to Banking Service - Operations' })
  async proxyOperations(@Req() req: Request) {
    const targetUrl = `${this.BANKING_URL}${req.url}`;
    try {
      return await this.proxyService.forward(
        targetUrl, req.method, req.body, req.headers as any
      );
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Banking Service error',
        err.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @All('webhooks/*path')
  @All('webhooks')
  @ApiOperation({ summary: 'Proxy to Banking Service - Webhooks' })
  async proxyWebhooks(@Req() req: Request) {
    const targetUrl = `${this.BANKING_URL}${req.url}`;
    try {
      return await this.proxyService.forward(
        targetUrl, req.method, req.body, req.headers as any
      );
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Banking Service error',
        err.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }
}