import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const existing = await this.usersRepository.findOne({
      where: { email: 'admin@qiyada.com' },
    });

    if (!existing) {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash('Admin@123', salt);
      const admin = this.usersRepository.create({
        full_name: 'مدير النظام',
        email: 'admin@qiyada.com',
        password_hash: hashed,
        role: 'manager',
      });
      await this.usersRepository.save(admin);
      this.logger.log('✅ Admin user created: admin@qiyada.com / Admin@123');
    } else {
      this.logger.log('ℹ️  Admin user already exists, skipping seed.');
    }
  }
}
