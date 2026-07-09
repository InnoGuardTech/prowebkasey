import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CompaniesService } from './companies.service';
import { Company } from '../entities/company.entity';

@Controller('api/v1/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // PUBLIC ROUTE for Frontend White-Labeling Engine
  @Get('theme/:subdomain')
  getThemeBySubdomain(@Param('subdomain') subdomain: string) {
    return this.companiesService.findBySubdomain(subdomain);
  }

  // SUPER ADMIN ROUTES
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin') // Only super admin can manage companies
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Post()
  create(@Body() companyData: Partial<Company>) {
    return this.companiesService.create(companyData);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Company>) {
    return this.companiesService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super_admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
