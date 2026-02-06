import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { OrgRoleGuard } from 'src/common/guards/org-role.guard';
import { OrgContextGuard } from 'src/common/guards/org-context.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

@Controller('invoices')
@UseGuards(JwtAuthGuard, OrgContextGuard, OrgRoleGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Req() req: Request & { organizationId: string },@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(req.organizationId, createInvoiceDto);
  }

  @Get()
  async findAll(@Req() req: Request & { organizationId: string }) {
    return this.invoicesService.findAll(req.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }
}
