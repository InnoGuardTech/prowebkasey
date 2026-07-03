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
exports.ExpenseCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_category_entity_1 = require("../entities/expense_category.entity");
let ExpenseCategoriesService = class ExpenseCategoriesService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    findAll() {
        return this.categoryRepository.find({ where: { is_active: true }, order: { sort_order: 'ASC' } });
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({ where: { id, is_active: true } });
        if (!category) {
            throw new common_1.NotFoundException(`Expense Category with ID ${id} not found`);
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
};
exports.ExpenseCategoriesService = ExpenseCategoriesService;
exports.ExpenseCategoriesService = ExpenseCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExpenseCategoriesService);
//# sourceMappingURL=expense_categories.service.js.map