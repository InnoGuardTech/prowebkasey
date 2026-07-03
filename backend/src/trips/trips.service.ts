import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async findAll(userRole: string, userId: string, page: number = 1, limit: number = 20) {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.truck', 'truck')
      .leftJoinAndSelect('trip.driver', 'driver')
      .orderBy('trip.created_at', 'DESC');

    // Row-level security for drivers
    if (userRole === 'driver') {
      query.where('trip.driver_id = :userId', { userId });
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, userRole: string, userId: string) {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.truck', 'truck')
      .leftJoinAndSelect('trip.driver', 'driver')
      .where('trip.id = :id', { id });

    if (userRole === 'driver') {
      query.andWhere('trip.driver_id = :userId', { userId });
    }

    const trip = await query.getOne();
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async create(createTripDto: any) {
    const trip = this.tripRepository.create(createTripDto);
    return this.tripRepository.save(trip);
  }

  async update(id: string, updateTripDto: any) {
    await this.tripRepository.update(id, updateTripDto);
    return this.findOne(id, 'admin', ''); // bypass RLS for admin after update
  }

  async remove(id: string) {
    await this.tripRepository.delete(id);
    return { success: true };
  }
}
