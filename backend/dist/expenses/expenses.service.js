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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("../entities/expense.entity");
let ExpensesService = class ExpensesService {
    expensesRepository;
    constructor(expensesRepository) {
        this.expensesRepository = expensesRepository;
    }
    async findAll(userRole, userId, page = 1, limit = 20) {
        const query = this.expensesRepository.createQueryBuilder('expense')
            .leftJoinAndSelect('expense.truck', 'truck')
            .leftJoinAndSelect('truck.driver', 'driver')
            .leftJoinAndSelect('expense.category', 'category')
            .leftJoinAndSelect('expense.creator', 'creator')
            .leftJoinAndSelect('expense.approver', 'approver')
            .where('expense.is_deleted = false')
            .orderBy('expense.expense_date', 'DESC');
        if (userRole === 'driver') {
            query.andWhere('(expense.created_by = :userId OR truck.driver_id = :userId)', { userId });
        }
        const total = await query.getCount();
        const data = await query.skip((page - 1) * limit).take(limit).getMany();
        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const expense = await this.expensesRepository.findOne({
            where: { id, is_deleted: false },
            relations: { truck: true, category: true, creator: true, approver: true }
        });
        if (!expense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        return expense;
    }
    async create(expenseData, userId) {
        const { truck_id, category_id, ...rest } = expenseData;
        const newExpense = {
            ...rest,
            creator: { id: userId },
            is_approved: false,
        };
        if (truck_id)
            newExpense.truck = { id: truck_id };
        if (category_id)
            newExpense.category = { id: category_id };
        return this.expensesRepository.save(newExpense);
    }
    async update(id, expenseData) {
        await this.findOne(id);
        const { truck_id, category_id, ...rest } = expenseData;
        const updateData = { ...rest };
        if (truck_id !== undefined) {
            updateData.truck = truck_id ? { id: truck_id } : null;
        }
        if (category_id !== undefined) {
            updateData.category = category_id ? { id: category_id } : null;
        }
        await this.expensesRepository.save({ id, ...updateData });
        return this.findOne(id);
    }
    async approve(id, approverId) {
        await this.findOne(id);
        await this.expensesRepository.update(id, {
            is_approved: true,
            approver: { id: approverId },
            approved_at: new Date()
        });
        return this.findOne(id);
    }
    async reject(id, reason) {
        await this.findOne(id);
        await this.expensesRepository.update(id, {
            is_approved: false,
            rejection_reason: reason
        });
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.expensesRepository.update(id, { is_deleted: true, deleted_at: new Date() });
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map