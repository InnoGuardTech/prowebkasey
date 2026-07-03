import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseCategoriesService } from './expense_categories.service';
import { ExpenseCategory } from '../entities/expense_category.entity';

@Controller('api/v1/expenses/categories')
@UseGuards(AuthGuard('jwt'))
export class ExpenseCategoriesController {
  constructor(private readonly categoriesService: ExpenseCategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() categoryData: Partial<ExpenseCategory>) {
    return this.categoriesService.create(categoryData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() categoryData: Partial<ExpenseCategory>) {
    return this.categoriesService.update(id, categoryData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.update(id, { is_active: false });
  }
}
