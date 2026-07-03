import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api/v1/trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  @Roles('admin', 'accountant')
  create(@Body() createTruckDto: any) {
    return this.trucksService.create(createTruckDto);
  }

  @Get()
  findAll(@Request() req, @Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.trucksService.findAll(req.user?.role, req.user?.userId, Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.trucksService.findOne(id, req.user?.role, req.user?.userId);
  }

  @Patch(':id')
  @Roles('admin', 'accountant')
  update(@Param('id') id: string, @Body() updateTruckDto: any) {
    return this.trucksService.update(id, updateTruckDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.trucksService.remove(id);
  }
}
