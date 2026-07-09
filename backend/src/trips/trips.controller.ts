import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/v1/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles('admin', 'accountant')
  create(@Body() createTripDto: any, @Request() req: any) {
    return this.tripsService.create(createTripDto, req.user?.company_id);
  }

  @Get()
  findAll(@Request() req: any, @Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.tripsService.findAll(req.user?.role, req.user?.id, Number(page), Number(limit), req.user?.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.tripsService.findOne(id, req.user?.role, req.user?.id, req.user?.company_id);
  }

  @Patch(':id')
  @Roles('admin', 'accountant')
  update(@Param('id') id: string, @Body() updateTripDto: any, @Request() req: any) {
    return this.tripsService.update(id, updateTripDto, req.user?.company_id);
  }

  @Delete(':id')
  @Roles('admin') // Only admin can delete
  remove(@Param('id') id: string, @Request() req: any) {
    return this.tripsService.remove(id, req.user?.company_id);
  }
}
