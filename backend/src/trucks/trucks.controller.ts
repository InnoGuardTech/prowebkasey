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
  create(@Body() createTruckDto: any, @Request() req: any) {
    return this.trucksService.create(createTruckDto, req.user?.company_id);
  }

  @Get()
  findAll(@Request() req: any, @Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.trucksService.findAll(req.user?.role, req.user?.id, Number(page), Number(limit), req.user?.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.trucksService.findOne(id, req.user?.role, req.user?.id, req.user?.company_id);
  }

  @Patch(':id')
  @Roles('admin', 'accountant')
  update(@Param('id') id: string, @Body() updateTruckDto: any, @Request() req: any) {
    return this.trucksService.update(id, updateTruckDto, req.user?.company_id);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.trucksService.remove(id, req.user?.company_id);
  }
}
