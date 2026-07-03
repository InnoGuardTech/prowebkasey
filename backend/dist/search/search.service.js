"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchService", {
    enumerable: true,
    get: function() {
        return SearchService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _invoiceentity = require("../entities/invoice.entity");
const _expenseentity = require("../entities/expense.entity");
const _truckentity = require("../entities/truck.entity");
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
let SearchService = class SearchService {
    async globalSearch(query) {
        const trucks = await this.trucksRepository.find({
            where: [
                {
                    truck_number: (0, _typeorm1.Like)(`%${query}%`)
                },
                {
                    notes: (0, _typeorm1.Like)(`%${query}%`)
                }
            ],
            take: 5
        });
        const invoices = await this.invoicesRepository.find({
            where: [
                {
                    invoice_number: (0, _typeorm1.Like)(`%${query}%`)
                }
            ],
            relations: {
                truck: true
            },
            take: 5
        });
        const expenses = await this.expensesRepository.find({
            where: [
                {
                    notes: (0, _typeorm1.Like)(`%${query}%`)
                }
            ],
            relations: {
                truck: true,
                category: true
            },
            take: 5
        });
        return {
            trucks: trucks.map((t)=>({
                    type: 'truck',
                    id: t.id,
                    label: t.truck_number,
                    sub: t.status
                })),
            invoices: invoices.map((i)=>({
                    type: 'invoice',
                    id: i.id,
                    label: i.invoice_number,
                    sub: `${i.amount} ر.س`
                })),
            expenses: expenses.map((e)=>({
                    type: 'expense',
                    id: e.id,
                    label: e.notes || 'مصروف',
                    sub: `${e.amount} ر.س`
                }))
        };
    }
    constructor(invoicesRepository, expensesRepository, trucksRepository){
        this.invoicesRepository = invoicesRepository;
        this.expensesRepository = expensesRepository;
        this.trucksRepository = trucksRepository;
    }
};
SearchService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_invoiceentity.Invoice)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_expenseentity.Expense)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_truckentity.Truck)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], SearchService);

//# sourceMappingURL=search.service.js.map