import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
    const [data, total] = await this.usersRepository.findAndCount({
      select: { id: true, full_name: true, email: true, phone: true, role: true, is_active: true, created_at: true }
    , skip: (page - 1) * limit, take: limit });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async create(userData: Partial<User>) {
    const existing = await this.usersRepository.findOne({ where: { email: userData.email } });
    if (existing) {
      throw new BadRequestException('البريد الإلكتروني مسجل مسبقاً');
    }
    const hashedPassword = await bcrypt.hash(userData.password_hash || '123456', 10);
    const user = this.usersRepository.create({
      ...userData,
      password_hash: hashedPassword
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, userData: Partial<User>) {
    if (userData.password_hash) {
      userData.password_hash = await bcrypt.hash(userData.password_hash, 10);
    }
    await this.usersRepository.update(id, userData);
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.usersRepository.update(id, { is_active: false });
    return { success: true };
  }
}
