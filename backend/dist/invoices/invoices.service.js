"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvoicesService", {
    enumerable: true,
    get: function() {
        return InvoicesService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _invoiceentity = require("../entities/invoice.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let InvoicesService = class InvoicesService {
    async findAll(page = 1, limit = 20) {
        const [data, total] = await this.invoicesRepository.findAndCount({
            where: {
                is_deleted: false
            },
            relations: {
                truck: true,
                contractor: true,
                creator: true
            },
            order: {
                invoice_date: 'DESC'
            },
            skip: (page - 1) * limit,
            take: limit
        });
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        const invoice = await this.invoicesRepository.findOne({
            where: {
                id,
                is_deleted: false
            },
            relations: {
                truck: true,
                contractor: true,
                creator: true
            }
        });
        if (!invoice) {
            throw new _common.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async create(invoiceData, userId) {
        const { truck_id, contractor_id, ...rest } = invoiceData;
        const newInvoice = {
            ...rest,
            creator: {
                id: userId
            }
        };
        if (truck_id) newInvoice.truck = {
            id: truck_id
        };
        if (contractor_id) newInvoice.contractor = {
            id: contractor_id
        };
        return this.invoicesRepository.save(newInvoice);
    }
    async update(id, invoiceData) {
        await this.findOne(id);
        const { truck_id, contractor_id, ...rest } = invoiceData;
        const updateData = {
            ...rest
        };
        if (truck_id !== undefined) {
            updateData.truck = truck_id ? {
                id: truck_id
            } : null;
        }
        if (contractor_id !== undefined) {
            updateData.contractor = contractor_id ? {
                id: contractor_id
            } : null;
        }
        await this.invoicesRepository.save({
            id,
            ...updateData
        });
        return this.findOne(id);
    }
    async softDelete(id) {
        await this.findOne(id);
        await this.invoicesRepository.update(id, {
            is_deleted: true,
            deleted_at: new Date()
        });
    }
    constructor(invoicesRepository){
        this.invoicesRepository = invoicesRepository;
    }
};
InvoicesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_invoiceentity.Invoice)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], InvoicesService);

//# sourceMappingURL=invoices.service.js.map