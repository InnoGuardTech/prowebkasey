import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DriversService } from './drivers.service';
import { Driver } from '../entities/driver.entity';

@Controller('api/v1/drivers')
@UseGuards(AuthGuard('jwt'))
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.driversService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Post()
  create(@Body() driverData: Partial<Driver>) {
    return this.driversService.create(driverData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() driverData: Partial<Driver>) {
    return this.driversService.update(id, driverData);
  }
}
