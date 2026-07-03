import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Invoice[], total: number, page: number, lastPage: number }> {
    const [data, total] = await this.invoicesRepository.findAndCount({
      where: { is_deleted: false },
      relations: { truck: true, contractor: true, creator: true },
      order: { invoice_date: 'DESC' }
    , skip: (page - 1) * limit, take: limit });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id, is_deleted: false },
      relations: { truck: true, contractor: true, creator: true }
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async create(invoiceData: any, userId: string): Promise<Invoice> {
    const { truck_id, contractor_id, ...rest } = invoiceData;
    const newInvoice: any = {
      ...rest,
      creator: { id: userId },
    };
    if (truck_id) newInvoice.truck = { id: truck_id };
    if (contractor_id) newInvoice.contractor = { id: contractor_id };
    return this.invoicesRepository.save(newInvoice);
  }

  async update(id: string, invoiceData: any): Promise<Invoice> {
    await this.findOne(id);
    const { truck_id, contractor_id, ...rest } = invoiceData;

    const updateData: any = { ...rest };
    if (truck_id !== undefined) {
      updateData.truck = truck_id ? { id: truck_id } : null;
    }
    if (contractor_id !== undefined) {
      updateData.contractor = contractor_id ? { id: contractor_id } : null;
    }

    await this.invoicesRepository.save({ id, ...updateData });
    return this.findOne(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);
    await this.invoicesRepository.update(id, { is_deleted: true, deleted_at: new Date() });
  }
}
