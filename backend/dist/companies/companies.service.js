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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../entities/company.entity");
let CompaniesService = class CompaniesService {
    companiesRepository;
    constructor(companiesRepository) {
        this.companiesRepository = companiesRepository;
    }
    async findAll() {
        return this.companiesRepository.find();
    }
    async findOne(id) {
        const company = await this.companiesRepository.findOne({ where: { id } });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async findBySubdomain(subdomain) {
        const company = await this.companiesRepository.findOne({ where: { subdomain } });
        if (!company)
            throw new common_1.NotFoundException('Company not found for this subdomain');
        return {
            name: company.name,
            subdomain: company.subdomain,
            logo_url: company.logo_url,
            theme_colors: company.theme_colors,
        };
    }
    async create(companyData) {
        const company = this.companiesRepository.create(companyData);
        return this.companiesRepository.save(company);
    }
    async update(id, updateData) {
        await this.findOne(id);
        await this.companiesRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.companiesRepository.update(id, { status: 'suspended' });
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map