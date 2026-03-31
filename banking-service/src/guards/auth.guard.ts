import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
// codigo asistido por ia
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${process.env.SSO_SERVICE_URL}/auth/validate`,
          { token },
        ),
      );
      request.user = data;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}