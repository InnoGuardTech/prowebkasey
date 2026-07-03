import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseCategory } from '../entities/expense_category.entity';

@Injectable()
export class ExpenseCategoriesService {
  constructor(
    @InjectRepository(ExpenseCategory)
    private categoryRepository: Repository<ExpenseCategory>,
  ) {}

  findAll(): Promise<ExpenseCategory[]> {
    return this.categoryRepository.find({ where: { is_active: true }, order: { sort_order: 'ASC' } });
  }

  async findOne(id: string): Promise<ExpenseCategory> {
    const category = await this.categoryRepository.findOne({ where: { id, is_active: true } });
    if (!category) {
      throw new NotFoundException(`Expense Category with ID ${id} not found`);
    }
    return category;
  }

  create(categoryData: Partial<ExpenseCategory>): Promise<ExpenseCategory> {
    const newCategory = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(newCategory);
  }

  async update(id: string, categoryData: Partial<ExpenseCategory>): Promise<ExpenseCategory> {
    await this.findOne(id);
    await this.categoryRepository.update(id, categoryData);
    return this.findOne(id);
  }
}
