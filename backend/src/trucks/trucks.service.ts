import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from '../entities/truck.entity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private trucksRepository: Repository<Truck>,
  ) {}

  async findAll(userRole?: string, userId?: string, page: number = 1, limit: number = 20, companyId?: string) {
    const query = this.trucksRepository.createQueryBuilder('truck')
      .leftJoinAndSelect('truck.driver', 'driver')
      .where('truck.is_deleted = false')
      .orderBy('truck.created_at', 'DESC');

    if (companyId) {
      query.andWhere('truck.company_id = :companyId', { companyId });
    }

    if (userRole === 'driver') {
      query.andWhere('driver.id = :userId', { userId });
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, userRole?: string, userId?: string, companyId?: string) {
    const query = this.trucksRepository.createQueryBuilder('truck')
      .leftJoinAndSelect('truck.driver', 'driver')
      .where('truck.id = :id', { id })
      .andWhere('truck.is_deleted = false');

    if (companyId) {
      query.andWhere('truck.company_id = :companyId', { companyId });
    }

    if (userRole === 'driver') {
      query.andWhere('driver.id = :userId', { userId });
    }

    const truck = await query.getOne();
    if (!truck) throw new NotFoundException('القاطرة غير موجودة');
    return truck;
  }

  create(truckData: Partial<Truck>, companyId?: string): Promise<Truck> {
    const newTruck = this.trucksRepository.create({ ...truckData, company_id: companyId });
    return this.trucksRepository.save(newTruck);
  }

  async update(id: string, truckData: Partial<Truck>, companyId?: string): Promise<Truck> {
    await this.findOne(id, undefined, undefined, companyId); // Ensure it exists and belongs to company
    await this.trucksRepository.update(id, truckData);
    return this.findOne(id, undefined, undefined, companyId);
  }

  async remove(id: string, companyId?: string): Promise<void> {
    await this.findOne(id, undefined, undefined, companyId); // Ensure it exists and belongs to company
    await this.trucksRepository.softDelete(id);
    await this.trucksRepository.update(id, { is_deleted: true });
  }
}
