"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../entities/invoice.entity");
let InvoicesService = class InvoicesService {
    invoicesRepository;
    constructor(invoicesRepository) {
        this.invoicesRepository = invoicesRepository;
    }
    async findAll(page = 1, limit = 20) {
        const [data, total] = await this.invoicesRepository.findAndCount({
            where: { is_deleted: false },
            relations: { truck: true, contractor: true, creator: true },
            order: { invoice_date: 'DESC' },
            skip: (page - 1) * limit, take: limit
        });
        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const invoice = await this.invoicesRepository.findOne({
            where: { id, is_deleted: false },
            relations: { truck: true, contractor: true, creator: true }
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async create(invoiceData, userId) {
        const { truck_id, contractor_id, ...rest } = invoiceData;
        const newInvoice = {
            ...rest,
            creator: { id: userId },
        };
        if (truck_id)
            newInvoice.truck = { id: truck_id };
        if (contractor_id)
            newInvoice.contractor = { id: contractor_id };
        return this.invoicesRepository.save(newInvoice);
    }
    async update(id, invoiceData) {
        await this.findOne(id);
        const { truck_id, contractor_id, ...rest } = invoiceData;
        const updateData = { ...rest };
        if (truck_id !== undefined) {
            updateData.truck = truck_id ? { id: truck_id } : null;
        }
        if (contractor_id !== undefined) {
            updateData.contractor = contractor_id ? { id: contractor_id } : null;
        }
        await this.invoicesRepository.save({ id, ...updateData });
        return this.findOne(id);
    }
    async softDelete(id) {
        await this.findOne(id);
        await this.invoicesRepository.update(id, { is_deleted: true, deleted_at: new Date() });
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map