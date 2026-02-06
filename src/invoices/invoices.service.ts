import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { OrganizationMember } from 'src/organization/entities/organization-member.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
  ) { }

  async create(orgId: string, dto: CreateInvoiceDto) {
    const invoice = this.invoiceRepo.create({
      ...dto,
      status: InvoiceStatus.PENDING,
      organizationId: orgId,
    });
    return await this.invoiceRepo.save(invoice);
  }

  async findAll(orgId: string) {
    return this.invoiceRepo.find({
      where: { organizationId: orgId },
      relations: ['lease', 'unit', 'tenant'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
