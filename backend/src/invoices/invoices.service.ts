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

  async findAll(page: number = 1, limit: number = 20, companyId?: string): Promise<{ data: Invoice[], total: number, page: number, lastPage: number }> {
    const whereClause: any = { is_deleted: false };
    if (companyId) whereClause.company_id = companyId;

    const [data, total] = await this.invoicesRepository.findAndCount({
      where: whereClause,
      relations: { truck: true, contractor: true, creator: true },
      order: { invoice_date: 'DESC' }
    , skip: (page - 1) * limit, take: limit });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, companyId?: string): Promise<Invoice> {
    const whereClause: any = { id, is_deleted: false };
    if (companyId) whereClause.company_id = companyId;

    const invoice = await this.invoicesRepository.findOne({
      where: whereClause,
      relations: { truck: true, contractor: true, creator: true }
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async create(invoiceData: any, userId: string, companyId?: string): Promise<Invoice> {
    const { truck_id, contractor_id, ...rest } = invoiceData;
    const newInvoice: any = {
      ...rest,
      creator: { id: userId },
      company_id: companyId,
    };
    if (truck_id) newInvoice.truck = { id: truck_id };
    if (contractor_id) newInvoice.contractor = { id: contractor_id };
    return this.invoicesRepository.save(newInvoice);
  }

  async update(id: string, invoiceData: any, companyId?: string): Promise<Invoice> {
    await this.findOne(id, companyId);
    const { truck_id, contractor_id, ...rest } = invoiceData;

    const updateData: any = { ...rest };
    if (truck_id !== undefined) {
      updateData.truck = truck_id ? { id: truck_id } : null;
    }
    if (contractor_id !== undefined) {
      updateData.contractor = contractor_id ? { id: contractor_id } : null;
    }

    await this.invoicesRepository.save({ id, ...updateData });
    return this.findOne(id, companyId);
  }

  async softDelete(id: string, companyId?: string): Promise<void> {
    await this.findOne(id, companyId);
    await this.invoicesRepository.softDelete(id); // Using TypeORM's built-in softDelete
    await this.invoicesRepository.update(id, { is_deleted: true }); // Keep backward compatibility for now
  }
}
