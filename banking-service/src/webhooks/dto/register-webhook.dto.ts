import { IsUrl, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterWebhookDto {
  @ApiProperty({ example: 'https://wells-fargo.example.com/webhook' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'operation.created', enum: ['operation.created'] })
  @IsString()
  @IsIn(['operation.created'])
  event: string;
}