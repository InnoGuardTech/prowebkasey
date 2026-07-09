import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvoicesService } from './invoices.service';
import { Invoice } from '../entities/invoice.entity';

@Controller('api/v1/invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20', @Request() req) {
    return this.invoicesService.findAll(Number(page), Number(limit), req.user?.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.invoicesService.findOne(id, req.user?.company_id);
  }

  @Post()
  create(@Body() invoiceData: Partial<Invoice>, @Request() req) {
    return this.invoicesService.create(invoiceData, req.user.id, req.user?.company_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() invoiceData: Partial<Invoice>, @Request() req) {
    return this.invoicesService.update(id, invoiceData, req.user?.company_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.invoicesService.softDelete(id, req.user?.company_id);
  }
}
