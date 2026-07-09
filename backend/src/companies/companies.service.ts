import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async findAll() {
    return this.companiesRepository.find();
  }

  async findOne(id: string) {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findBySubdomain(subdomain: string) {
    const company = await this.companiesRepository.findOne({ where: { subdomain } });
    if (!company) throw new NotFoundException('Company not found for this subdomain');
    return {
      name: company.name,
      subdomain: company.subdomain,
      logo_url: company.logo_url,
      theme_colors: company.theme_colors,
    };
  }

  async create(companyData: Partial<Company>) {
    const company = this.companiesRepository.create(companyData);
    return this.companiesRepository.save(company);
  }

  async update(id: string, updateData: Partial<Company>) {
    await this.findOne(id);
    await this.companiesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.companiesRepository.update(id, { status: 'suspended' });
  }
}
