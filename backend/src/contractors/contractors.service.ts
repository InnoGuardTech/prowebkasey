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

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Contractor[], total: number, page: number, lastPage: number }> {
    const [data, total] = await this.contractorsRepository.findAndCount({ where: { is_active: true } , skip: (page - 1) * limit, take: limit });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Contractor> {
    const contractor = await this.contractorsRepository.findOne({ where: { id, is_active: true } });
    if (!contractor) {
      throw new NotFoundException(`Contractor with ID ${id} not found`);
    }
    return contractor;
  }

  create(contractorData: Partial<Contractor>): Promise<Contractor> {
    const newContractor = this.contractorsRepository.create(contractorData);
    return this.contractorsRepository.save(newContractor);
  }

  async update(id: string, contractorData: Partial<Contractor>): Promise<Contractor> {
    await this.findOne(id);
    await this.contractorsRepository.update(id, contractorData);
    return this.findOne(id);
  }
}
