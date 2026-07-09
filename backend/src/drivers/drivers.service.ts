import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 20, companyId?: string): Promise<{ data: Driver[], total: number, page: number, lastPage: number }> {
    const whereClause: any = {};
    if (companyId) whereClause.company_id = companyId;

    const [data, total] = await this.driversRepository.findAndCount({ where: whereClause, relations: { user: true } , skip: (page - 1) * limit, take: limit });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, companyId?: string): Promise<Driver> {
    const whereClause: any = { id };
    if (companyId) whereClause.company_id = companyId;

    const driver = await this.driversRepository.findOne({ where: whereClause, relations: { user: true } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async create(data: any, companyId?: string): Promise<Driver> {
    const { full_name, email, phone, password, license_number, license_expiry } = data;
    
    // Create User first
    const password_hash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('123456', 10);
    const user = this.usersRepository.create({
      full_name,
      email: email || `driver_${Date.now()}@qiyada.com`, // fallback if no email
      phone,
      password_hash,
      role: 'driver',
      company_id: companyId
    });
    const savedUser = await this.usersRepository.save(user);

    // Create Driver
    const newDriver = this.driversRepository.create({
      id: savedUser.id,
      license_number,
      license_expiry,
      company_id: companyId
    });
    return this.driversRepository.save(newDriver);
  }

  async update(id: string, data: any, companyId?: string): Promise<Driver> {
    const driver = await this.findOne(id, companyId);
    
    // Update user info
    if (data.full_name || data.email || data.phone || data.password || data.is_active !== undefined) {
      const userUpdate: any = {};
      if (data.full_name) userUpdate.full_name = data.full_name;
      if (data.email) userUpdate.email = data.email;
      if (data.phone) userUpdate.phone = data.phone;
      if (data.is_active !== undefined) userUpdate.is_active = data.is_active;
      if (data.password) {
        userUpdate.password_hash = await bcrypt.hash(data.password, 10);
      }
      await this.usersRepository.update(id, userUpdate);
    }

    // Update driver info
    if (data.license_number || data.license_expiry) {
      const driverUpdate: any = {};
      if (data.license_number) driverUpdate.license_number = data.license_number;
      if (data.license_expiry) driverUpdate.license_expiry = data.license_expiry;
      await this.driversRepository.update(id, driverUpdate);
    }

    return this.findOne(id);
  }
}
