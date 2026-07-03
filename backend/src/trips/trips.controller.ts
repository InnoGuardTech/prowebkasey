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
  create(@Body() createTripDto: any) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  findAll(@Request() req, @Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.tripsService.findAll(req.user.role, req.user.id, Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tripsService.findOne(id, req.user.role, req.user.id);
  }

  @Patch(':id')
  @Roles('admin', 'accountant')
  update(@Param('id') id: string, @Body() updateTripDto: any) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @Roles('admin') // Only admin can delete
  remove(@Param('id') id: string) {
    return this.tripsService.remove(id);
  }
}
