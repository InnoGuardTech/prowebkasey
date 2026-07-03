"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContractorsService", {
    enumerable: true,
    get: function() {
        return ContractorsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _contractorentity = require("../entities/contractor.entity");
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
let ContractorsService = class ContractorsService {
    async findAll(page = 1, limit = 20) {
        const [data, total] = await this.contractorsRepository.findAndCount({
            where: {
                is_active: true
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
        const contractor = await this.contractorsRepository.findOne({
            where: {
                id,
                is_active: true
            }
        });
        if (!contractor) {
            throw new _common.NotFoundException(`Contractor with ID ${id} not found`);
        }
        return contractor;
    }
    create(contractorData) {
        const newContractor = this.contractorsRepository.create(contractorData);
        return this.contractorsRepository.save(newContractor);
    }
    async update(id, contractorData) {
        await this.findOne(id);
        await this.contractorsRepository.update(id, contractorData);
        return this.findOne(id);
    }
    constructor(contractorsRepository){
        this.contractorsRepository = contractorsRepository;
    }
};
ContractorsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_contractorentity.Contractor)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ContractorsService);

//# sourceMappingURL=contractors.service.js.map