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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../entities/invoice.entity");
const expense_entity_1 = require("../entities/expense.entity");
const truck_entity_1 = require("../entities/truck.entity");
let SearchService = class SearchService {
    invoicesRepository;
    expensesRepository;
    trucksRepository;
    constructor(invoicesRepository, expensesRepository, trucksRepository) {
        this.invoicesRepository = invoicesRepository;
        this.expensesRepository = expensesRepository;
        this.trucksRepository = trucksRepository;
    }
    async globalSearch(query) {
        const trucks = await this.trucksRepository.find({
            where: [
                { truck_number: (0, typeorm_2.Like)(`%${query}%`) },
                { notes: (0, typeorm_2.Like)(`%${query}%`) },
            ],
            take: 5,
        });
        const invoices = await this.invoicesRepository.find({
            where: [{ invoice_number: (0, typeorm_2.Like)(`%${query}%`) }],
            relations: { truck: true },
            take: 5,
        });
        const expenses = await this.expensesRepository.find({
            where: [{ notes: (0, typeorm_2.Like)(`%${query}%`) }],
            relations: { truck: true, category: true },
            take: 5,
        });
        return {
            trucks: trucks.map(t => ({ type: 'truck', id: t.id, label: t.truck_number, sub: t.status })),
            invoices: invoices.map(i => ({ type: 'invoice', id: i.id, label: i.invoice_number, sub: `${i.amount} ر.س` })),
            expenses: expenses.map(e => ({ type: 'expense', id: e.id, label: e.notes || 'مصروف', sub: `${e.amount} ر.س` })),
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __param(2, (0, typeorm_1.InjectRepository)(truck_entity_1.Truck)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map