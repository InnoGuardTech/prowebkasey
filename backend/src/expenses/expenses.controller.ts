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
  findAll(@Request() req: any, @Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.expensesService.findAll(req.user?.role, req.user?.id, Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Post()
  create(@Body() createExpenseDto: Partial<Expense>, @Request() req: any) {
    return this.expensesService.create(createExpenseDto, req.user?.id);
  }

  @Patch(':id')
  @Roles('admin', 'accountant')
  update(@Param('id') id: string, @Body() updateExpenseDto: Partial<Expense>) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Post(':id/approve')
  @Roles('admin', 'accountant', 'manager')
  approve(@Param('id') id: string, @Request() req) {
    return this.expensesService.approve(id, req.user.id);
  }

  @Post(':id/reject')
  @Roles('admin', 'accountant', 'manager')
  reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.expensesService.reject(id, reason);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
