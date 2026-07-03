import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Expense } from '../entities/expense.entity';
import { Truck } from '../entities/truck.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Expense) private expensesRepository: Repository<Expense>,
    @InjectRepository(Truck) private trucksRepository: Repository<Truck>,
  ) {}

  async globalSearch(query: string) {
    const trucks = await this.trucksRepository.find({
      where: [
        { truck_number: Like(`%${query}%`) },
        { notes: Like(`%${query}%`) },
      ],
      take: 5,
    });

    const invoices = await this.invoicesRepository.find({
      where: [{ invoice_number: Like(`%${query}%`) }],
      relations: { truck: true },
      take: 5,
    });

    const expenses = await this.expensesRepository.find({
      where: [{ notes: Like(`%${query}%`) }],
      relations: { truck: true, category: true },
      take: 5,
    });

    return {
      trucks: trucks.map(t => ({ type: 'truck', id: t.id, label: t.truck_number, sub: t.status })),
      invoices: invoices.map(i => ({ type: 'invoice', id: i.id, label: i.invoice_number, sub: `${i.amount} ر.س` })),
      expenses: expenses.map(e => ({ type: 'expense', id: e.id, label: e.notes || 'مصروف', sub: `${e.amount} ر.س` })),
    };
  }
}
