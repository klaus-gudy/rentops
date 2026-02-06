export class CreateInvoiceDto {
    leaseId: string;
    tenantId: string;
    unitId: string;
    amount: number;
    dueDate: Date;
}
