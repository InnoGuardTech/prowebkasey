import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Expense } from '../entities/expense.entity';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/v1/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20', @Request() req: any) {
    return this.expensesService.findAll(req.user?.role, req.user?.id, Number(page), Number(limit), req.user?.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.expensesService.findOne(id, req.user?.company_id);
  }

  @Post()
  create(@Body() createExpenseDto: Partial<Expense>, @Request() req: any) {
    return this.expensesService.create(createExpenseDto, req.user.id, req.user?.company_id);
  }

  @Patch(':id')
  @Roles('admin', 'accountant')
  update(@Param('id') id: string, @Body() updateExpenseDto: Partial<Expense>, @Request() req) {
    return this.expensesService.update(id, updateExpenseDto, req.user?.company_id);
  }

  @Post(':id/approve')
  @Roles('admin', 'accountant', 'manager')
  approve(@Param('id') id: string, @Request() req) {
    return this.expensesService.approve(id, req.user.id, req.user?.company_id);
  }

  @Post(':id/reject')
  @Roles('admin', 'accountant', 'manager')
  reject(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    return this.expensesService.reject(id, reason, req.user?.company_id);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string, @Request() req) {
    return this.expensesService.remove(id, req.user?.company_id);
  }
}
