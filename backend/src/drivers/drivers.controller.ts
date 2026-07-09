import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DriversService } from './drivers.service';
import { Driver } from '../entities/driver.entity';

@Controller('api/v1/drivers')
@UseGuards(AuthGuard('jwt'))
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20', @Request() req: any) {
    return this.driversService.findAll(Number(page), Number(limit), req.user?.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.driversService.findOne(id, req.user?.company_id);
  }

  @Post()
  create(@Body() driverData: Partial<Driver>, @Request() req: any) {
    return this.driversService.create(driverData, req.user?.company_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() driverData: Partial<Driver>, @Request() req: any) {
    return this.driversService.update(id, driverData, req.user?.company_id);
  }
}
