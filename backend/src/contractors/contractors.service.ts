import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contractor } from '../entities/contractor.entity';

@Injectable()
export class ContractorsService {
  constructor(
    @InjectRepository(Contractor)
    private contractorsRepository: Repository<Contractor>,
  ) {}

  async findAll(page: number = 1, limit: number = 20, companyId?: string): Promise<{ data: Contractor[], total: number, page: number, lastPage: number }> {
    const whereClause: any = { is_active: true };
    if (companyId) whereClause.company_id = companyId;

    const [data, total] = await this.contractorsRepository.findAndCount({ where: whereClause , skip: (page - 1) * limit, take: limit });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, companyId?: string): Promise<Contractor> {
    const whereClause: any = { id, is_active: true };
    if (companyId) whereClause.company_id = companyId;

    const contractor = await this.contractorsRepository.findOne({ where: whereClause });
    if (!contractor) {
      throw new NotFoundException(`Contractor with ID ${id} not found`);
    }
    return contractor;
  }

  create(contractorData: Partial<Contractor>, companyId?: string): Promise<Contractor> {
    const newContractor = this.contractorsRepository.create({ ...contractorData, company_id: companyId });
    return this.contractorsRepository.save(newContractor);
  }

  async update(id: string, contractorData: Partial<Contractor>, companyId?: string): Promise<Contractor> {
    await this.findOne(id, companyId);
    await this.contractorsRepository.update(id, contractorData);
    return this.findOne(id, companyId);
  }

  async remove(id: string, companyId?: string): Promise<void> {
    await this.findOne(id, companyId);
    await this.contractorsRepository.softDelete(id);
    await this.contractorsRepository.update(id, { is_active: false });
  }
}
