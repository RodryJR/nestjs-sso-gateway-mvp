import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List all bank accounts' })
  @ApiResponse({ status: 200, description: 'List of accounts' })
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }
}