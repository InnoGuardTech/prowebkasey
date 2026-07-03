"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpensesService", {
    enumerable: true,
    get: function() {
        return ExpensesService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _expenseentity = require("../entities/expense.entity");
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
let ExpensesService = class ExpensesService {
    async findAll(userRole, userId, page = 1, limit = 20) {
        const query = this.expensesRepository.createQueryBuilder('expense').leftJoinAndSelect('expense.truck', 'truck').leftJoinAndSelect('truck.driver', 'driver').leftJoinAndSelect('expense.category', 'category').leftJoinAndSelect('expense.creator', 'creator').leftJoinAndSelect('expense.approver', 'approver').where('expense.is_deleted = false').orderBy('expense.expense_date', 'DESC');
        if (userRole === 'driver') {
            // Driver only sees expenses they created OR expenses for their truck
            query.andWhere('(expense.creator_id = :userId OR truck.driver_id = :userId)', {
                userId
            });
        }
        const total = await query.getCount();
        const data = await query.skip((page - 1) * limit).take(limit).getMany();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        const expense = await this.expensesRepository.findOne({
            where: {
                id,
                is_deleted: false
            },
            relations: {
                truck: true,
                category: true,
                creator: true,
                approver: true
            }
        });
        if (!expense) {
            throw new _common.NotFoundException(`Expense with ID ${id} not found`);
        }
        return expense;
    }
    async create(expenseData, userId) {
        const { truck_id, category_id, ...rest } = expenseData;
        const newExpense = {
            ...rest,
            creator: {
                id: userId
            },
            is_approved: false
        };
        if (truck_id) newExpense.truck = {
            id: truck_id
        };
        if (category_id) newExpense.category = {
            id: category_id
        };
        return this.expensesRepository.save(newExpense);
    }
    async update(id, expenseData) {
        await this.findOne(id);
        const { truck_id, category_id, ...rest } = expenseData;
        const updateData = {
            ...rest
        };
        if (truck_id !== undefined) {
            updateData.truck = truck_id ? {
                id: truck_id
            } : null;
        }
        if (category_id !== undefined) {
            updateData.category = category_id ? {
                id: category_id
            } : null;
        }
        await this.expensesRepository.save({
            id,
            ...updateData
        });
        return this.findOne(id);
    }
    async approve(id, approverId) {
        await this.findOne(id);
        await this.expensesRepository.update(id, {
            is_approved: true,
            approver: {
                id: approverId
            },
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
        await this.expensesRepository.update(id, {
            is_deleted: true,
            deleted_at: new Date()
        });
    }
    constructor(expensesRepository){
        this.expensesRepository = expensesRepository;
    }
};
ExpensesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_expenseentity.Expense)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ExpensesService);

//# sourceMappingURL=expenses.service.js.map