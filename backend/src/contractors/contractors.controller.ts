import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContractorsService } from './contractors.service';
import { Contractor } from '../entities/contractor.entity';

@Controller('api/v1/contractors')
@UseGuards(AuthGuard('jwt'))
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20', @Request() req: any) {
    return this.contractorsService.findAll(Number(page), Number(limit), req.user?.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.contractorsService.findOne(id, req.user?.company_id);
  }

  @Post()
  create(@Body() contractorData: Partial<Contractor>, @Request() req: any) {
    return this.contractorsService.create(contractorData, req.user?.company_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() contractorData: Partial<Contractor>, @Request() req: any) {
    return this.contractorsService.update(id, contractorData, req.user?.company_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.contractorsService.remove(id, req.user?.company_id);
  }
}
