"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExpenseCategoriesService", {
    enumerable: true,
    get: function() {
        return ExpenseCategoriesService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _expense_categoryentity = require("../entities/expense_category.entity");
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
let ExpenseCategoriesService = class ExpenseCategoriesService {
    findAll() {
        return this.categoryRepository.find({
            where: {
                is_active: true
            },
            order: {
                sort_order: 'ASC'
            }
        });
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({
            where: {
                id,
                is_active: true
            }
        });
        if (!category) {
            throw new _common.NotFoundException(`Expense Category with ID ${id} not found`);
        }
        return category;
    }
    create(categoryData) {
        const newCategory = this.categoryRepository.create(categoryData);
        return this.categoryRepository.save(newCategory);
    }
    async update(id, categoryData) {
        await this.findOne(id);
        await this.categoryRepository.update(id, categoryData);
        return this.findOne(id);
    }
    constructor(categoryRepository){
        this.categoryRepository = categoryRepository;
    }
};
ExpenseCategoriesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_expense_categoryentity.ExpenseCategory)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ExpenseCategoriesService);

//# sourceMappingURL=expense_categories.service.js.map