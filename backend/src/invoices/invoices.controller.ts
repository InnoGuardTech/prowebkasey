import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvoicesService } from './invoices.service';
import { Invoice } from '../entities/invoice.entity';

@Controller('api/v1/invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.invoicesService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Post()
  create(@Body() invoiceData: Partial<Invoice>, @Request() req) {
    return this.invoicesService.create(invoiceData, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() invoiceData: Partial<Invoice>) {
    return this.invoicesService.update(id, invoiceData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.softDelete(id);
  }
}
