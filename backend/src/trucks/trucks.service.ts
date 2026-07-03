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

  async findAll(userRole?: string, userId?: string, page: number = 1, limit: number = 20) {
    const query = this.trucksRepository.createQueryBuilder('truck')
      .leftJoinAndSelect('truck.driver', 'driver')
      .where('truck.is_deleted = false')
      .orderBy('truck.created_at', 'DESC');

    if (userRole === 'driver') {
      query.andWhere('truck.driver = :userId', { userId });
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, userRole?: string, userId?: string) {
    const query = this.trucksRepository.createQueryBuilder('truck')
      .leftJoinAndSelect('truck.driver', 'driver')
      .where('truck.id = :id', { id })
      .andWhere('truck.is_deleted = false');

    if (userRole === 'driver') {
      query.andWhere('truck.driver = :userId', { userId });
    }

    const truck = await query.getOne();
    if (!truck) throw new NotFoundException('القاطرة غير موجودة');
    return truck;
  }

  create(truckData: Partial<Truck>): Promise<Truck> {
    const newTruck = this.trucksRepository.create(truckData);
    return this.trucksRepository.save(newTruck);
  }

  async update(id: string, truckData: Partial<Truck>): Promise<Truck> {
    await this.findOne(id); // Ensure it exists
    await this.trucksRepository.update(id, truckData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensure it exists
    await this.trucksRepository.update(id, { is_deleted: true });
  }
}
