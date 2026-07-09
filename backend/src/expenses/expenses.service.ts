import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async findAll(userRole?: string, userId?: string, page: number = 1, limit: number = 20, companyId?: string) {
    const query = this.expensesRepository.createQueryBuilder('expense')
      .leftJoinAndSelect('expense.truck', 'truck')
      .leftJoinAndSelect('truck.driver', 'driver')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.creator', 'creator')
      .leftJoinAndSelect('expense.approver', 'approver')
      .where('expense.is_deleted = false')
      .orderBy('expense.expense_date', 'DESC');

    if (companyId) {
      query.andWhere('expense.company_id = :companyId', { companyId });
    }

    if (userRole === 'driver' && userId) {
      query.andWhere('(creator.id = :userId OR driver.id = :userId)', { userId });
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, companyId?: string): Promise<Expense> {
    const whereClause: any = { id, is_deleted: false };
    if (companyId) whereClause.company_id = companyId;

    const expense = await this.expensesRepository.findOne({
      where: whereClause,
      relations: { truck: true, category: true, creator: true, approver: true }
    });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async create(expenseData: any, userId: string, companyId?: string): Promise<Expense> {
    const { truck_id, category_id, ...rest } = expenseData;
    const newExpense: any = {
      ...rest,
      creator: { id: userId },
      is_approved: false,
      company_id: companyId
    };
    if (truck_id) newExpense.truck = { id: truck_id };
    if (category_id) newExpense.category = { id: category_id };
    return this.expensesRepository.save(newExpense);
  }

  async update(id: string, expenseData: any, companyId?: string): Promise<Expense> {
    await this.findOne(id, companyId);
    const { truck_id, category_id, ...rest } = expenseData;

    const updateData: any = { ...rest };
    if (truck_id !== undefined) {
      updateData.truck = truck_id ? { id: truck_id } : null;
    }
    if (category_id !== undefined) {
      updateData.category = category_id ? { id: category_id } : null;
    }

    await this.expensesRepository.save({ id, ...updateData });
    return this.findOne(id, companyId);
  }

  async approve(id: string, approverId: string, companyId?: string): Promise<Expense> {
    await this.findOne(id, companyId);
    await this.expensesRepository.update(id, {
      is_approved: true,
      approver: { id: approverId } as any,
      approved_at: new Date()
    });
    return this.findOne(id, companyId);
  }

  async reject(id: string, reason: string, companyId?: string): Promise<Expense> {
    await this.findOne(id, companyId);
    await this.expensesRepository.update(id, {
      is_approved: false,
      rejection_reason: reason
    });
    return this.findOne(id, companyId);
  }

  async remove(id: string, companyId?: string): Promise<void> {
    await this.findOne(id, companyId);
    await this.expensesRepository.softDelete(id);
    await this.expensesRepository.update(id, { is_deleted: true });
  }
}
