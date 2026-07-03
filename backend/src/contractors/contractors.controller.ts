import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContractorsService } from './contractors.service';
import { Contractor } from '../entities/contractor.entity';

@Controller('api/v1/contractors')
@UseGuards(AuthGuard('jwt'))
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.contractorsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractorsService.findOne(id);
  }

  @Post()
  create(@Body() contractorData: Partial<Contractor>) {
    return this.contractorsService.create(contractorData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() contractorData: Partial<Contractor>) {
    return this.contractorsService.update(id, contractorData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractorsService.update(id, { is_active: false });
  }
}
