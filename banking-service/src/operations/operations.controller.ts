import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OperationsService } from './operations.service';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Operations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('operations')
export class OperationsController {
  constructor(private operationsService: OperationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all financial operations (date, operation, amount)' })
  @ApiResponse({ status: 200, description: 'List of operations' })
  findAll() {
    return this.operationsService.findAll();
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get operations by account ID' })
  findByAccount(@Param('accountId') accountId: string) {
    return this.operationsService.findByAccount(accountId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new operation (triggers webhook notification)' })
  create(@Body() dto: any) {
    return this.operationsService.create(dto);
  }
}