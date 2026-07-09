"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const driver_entity_1 = require("../entities/driver.entity");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
let DriversService = class DriversService {
    driversRepository;
    usersRepository;
    constructor(driversRepository, usersRepository) {
        this.driversRepository = driversRepository;
        this.usersRepository = usersRepository;
    }
    async findAll(page = 1, limit = 20, companyId) {
        const whereClause = {};
        if (companyId)
            whereClause.company_id = companyId;
        const [data, total] = await this.driversRepository.findAndCount({ where: whereClause, relations: { user: true }, skip: (page - 1) * limit, take: limit });
        return { data, total, page, lastPage: Math.ceil(total / limit) };
    }
    async findOne(id, companyId) {
        const whereClause = { id };
        if (companyId)
            whereClause.company_id = companyId;
        const driver = await this.driversRepository.findOne({ where: whereClause, relations: { user: true } });
        if (!driver) {
            throw new common_1.NotFoundException(`Driver with ID ${id} not found`);
        }
        return driver;
    }
    async create(data, companyId) {
        const { full_name, email, phone, password, license_number, license_expiry } = data;
        const password_hash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('123456', 10);
        const user = this.usersRepository.create({
            full_name,
            email: email || `driver_${Date.now()}@qiyada.com`,
            phone,
            password_hash,
            role: 'driver',
            company_id: companyId
        });
        const savedUser = await this.usersRepository.save(user);
        const newDriver = this.driversRepository.create({
            id: savedUser.id,
            license_number,
            license_expiry,
            company_id: companyId
        });
        return this.driversRepository.save(newDriver);
    }
    async update(id, data, companyId) {
        const driver = await this.findOne(id, companyId);
        if (data.full_name || data.email || data.phone || data.password || data.is_active !== undefined) {
            const userUpdate = {};
            if (data.full_name)
                userUpdate.full_name = data.full_name;
            if (data.email)
                userUpdate.email = data.email;
            if (data.phone)
                userUpdate.phone = data.phone;
            if (data.is_active !== undefined)
                userUpdate.is_active = data.is_active;
            if (data.password) {
                userUpdate.password_hash = await bcrypt.hash(data.password, 10);
            }
            await this.usersRepository.update(id, userUpdate);
        }
        if (data.license_number || data.license_expiry) {
            const driverUpdate = {};
            if (data.license_number)
                driverUpdate.license_number = data.license_number;
            if (data.license_expiry)
                driverUpdate.license_expiry = data.license_expiry;
            await this.driversRepository.update(id, driverUpdate);
        }
        return this.findOne(id);
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DriversService);
//# sourceMappingURL=drivers.service.js.map