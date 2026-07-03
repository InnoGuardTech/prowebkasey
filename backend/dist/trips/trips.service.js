"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TripsService", {
    enumerable: true,
    get: function() {
        return TripsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _tripentity = require("../entities/trip.entity");
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
let TripsService = class TripsService {
    async findAll(userRole, userId, page = 1, limit = 20) {
        const query = this.tripRepository.createQueryBuilder('trip').leftJoinAndSelect('trip.truck', 'truck').leftJoinAndSelect('trip.driver', 'driver').orderBy('trip.created_at', 'DESC');
        // Row-level security for drivers
        if (userRole === 'driver') {
            query.where('trip.driver_id = :userId', {
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
    async findOne(id, userRole, userId) {
        const query = this.tripRepository.createQueryBuilder('trip').leftJoinAndSelect('trip.truck', 'truck').leftJoinAndSelect('trip.driver', 'driver').where('trip.id = :id', {
            id
        });
        if (userRole === 'driver') {
            query.andWhere('trip.driver_id = :userId', {
                userId
            });
        }
        const trip = await query.getOne();
        if (!trip) throw new _common.NotFoundException('Trip not found');
        return trip;
    }
    async create(createTripDto) {
        const trip = this.tripRepository.create(createTripDto);
        return this.tripRepository.save(trip);
    }
    async update(id, updateTripDto) {
        await this.tripRepository.update(id, updateTripDto);
        return this.findOne(id, 'admin', ''); // bypass RLS for admin after update
    }
    async remove(id) {
        await this.tripRepository.delete(id);
        return {
            success: true
        };
    }
    constructor(tripRepository){
        this.tripRepository = tripRepository;
    }
};
TripsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_tripentity.Trip)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], TripsService);

//# sourceMappingURL=trips.service.js.map