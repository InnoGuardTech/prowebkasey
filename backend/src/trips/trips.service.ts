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

  async findAll(userRole: string, userId: string, page: number = 1, limit: number = 20, companyId?: string) {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.truck', 'truck')
      .leftJoinAndSelect('trip.driver', 'driver')
      .where('trip.deleted_at IS NULL')
      .orderBy('trip.created_at', 'DESC');

    if (companyId) {
      query.andWhere('trip.company_id = :companyId', { companyId });
    }

    // Row-level security for drivers
    if (userRole === 'driver') {
      query.andWhere('driver.id = :userId', { userId });
    }

    const total = await query.getCount();
    const data = await query.skip((page - 1) * limit).take(limit).getMany();
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string, userRole: string, userId: string, companyId?: string) {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.truck', 'truck')
      .leftJoinAndSelect('trip.driver', 'driver')
      .where('trip.id = :id', { id })
      .andWhere('trip.is_deleted = false');

    if (companyId) {
      query.andWhere('trip.company_id = :companyId', { companyId });
    }

    if (userRole === 'driver') {
      query.andWhere('driver.id = :userId', { userId });
    }

    const trip = await query.getOne();
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async create(createTripDto: any, companyId?: string) {
    const trip = this.tripRepository.create({ ...createTripDto, company_id: companyId });
    return this.tripRepository.save(trip);
  }

  async update(id: string, updateTripDto: any, companyId?: string) {
    await this.findOne(id, 'admin', '', companyId); // ensure existence and ownership
    await this.tripRepository.update(id, updateTripDto);
    return this.findOne(id, 'admin', '', companyId);
  }

  async remove(id: string, companyId?: string) {
    await this.findOne(id, 'admin', '', companyId); // ensure existence and ownership
    await this.tripRepository.softDelete(id);
    return { success: true };
  }
}
