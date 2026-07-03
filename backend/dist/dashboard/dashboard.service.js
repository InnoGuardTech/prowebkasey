"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardService", {
    enumerable: true,
    get: function() {
        return DashboardService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _invoiceentity = require("../entities/invoice.entity");
const _expenseentity = require("../entities/expense.entity");
const _truckentity = require("../entities/truck.entity");
const _driverentity = require("../entities/driver.entity");
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
let DashboardService = class DashboardService {
    async getDashboardStats() {
        const trucksCount = await this.trucksRepository.count({
            where: {
                status: 'active',
                is_deleted: false
            }
        });
        const invoices = await this.invoicesRepository.find({
            where: {
                is_deleted: false
            }
        });
        const allExpenses = await this.expensesRepository.find({
            where: {
                is_deleted: false
            }
        });
        const totalIncome = invoices.reduce((sum, inv)=>sum + Number(inv.amount), 0);
        const totalExpenses = allExpenses.reduce((sum, exp)=>sum + Number(exp.amount), 0);
        const approvedExpenses = allExpenses.filter((e)=>e.is_approved).reduce((sum, exp)=>sum + Number(exp.amount), 0);
        const pendingExpenses = allExpenses.filter((e)=>!e.is_approved).length;
        const netProfit = totalIncome - totalExpenses;
        const months = [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر'
        ];
        const currentYear = new Date().getFullYear();
        const chartData = months.map((name, index)=>{
            const monthInvoices = invoices.filter((inv)=>{
                const d = new Date(inv.invoice_date);
                return d.getMonth() === index && d.getFullYear() === currentYear;
            });
            const monthExpenses = allExpenses.filter((exp)=>{
                const d = new Date(exp.expense_date);
                return d.getMonth() === index && d.getFullYear() === currentYear;
            });
            return {
                name,
                income: monthInvoices.reduce((sum, inv)=>sum + Number(inv.amount), 0),
                expense: monthExpenses.reduce((sum, exp)=>sum + Number(exp.amount), 0)
            };
        });
        return {
            activeTrucks: trucksCount,
            totalIncome,
            totalExpenses,
            approvedExpenses,
            pendingExpenses,
            netProfit,
            chartData
        };
    }
    async getAlerts() {
        const next30Days = new Date();
        next30Days.setDate(next30Days.getDate() + 30);
        const expiringTrucks = await this.trucksRepository.createQueryBuilder('truck').where('truck.registration_expiry <= :date OR truck.insurance_expiry <= :date OR truck.inspection_expiry <= :date', {
            date: next30Days
        }).getMany();
        const expiringDrivers = await this.driverRepository.createQueryBuilder('driver').leftJoinAndSelect('driver.user', 'user').where('driver.license_expiry <= :date OR driver.iqama_expiry <= :date', {
            date: next30Days
        }).getMany();
        const alerts = [];
        for (const truck of expiringTrucks){
            if (truck.registration_expiry && new Date(truck.registration_expiry) <= next30Days) alerts.push({
                type: 'truck',
                id: truck.id,
                title: `تجديد استمارة قاطرة ${truck.truck_number}`,
                date: truck.registration_expiry,
                critical: new Date(truck.registration_expiry) < new Date()
            });
            if (truck.insurance_expiry && new Date(truck.insurance_expiry) <= next30Days) alerts.push({
                type: 'truck',
                id: truck.id,
                title: `تجديد تأمين قاطرة ${truck.truck_number}`,
                date: truck.insurance_expiry,
                critical: new Date(truck.insurance_expiry) < new Date()
            });
            if (truck.inspection_expiry && new Date(truck.inspection_expiry) <= next30Days) alerts.push({
                type: 'truck',
                id: truck.id,
                title: `فحص دوري قاطرة ${truck.truck_number}`,
                date: truck.inspection_expiry,
                critical: new Date(truck.inspection_expiry) < new Date()
            });
        }
        for (const driver of expiringDrivers){
            const name = driver.user?.full_name || 'سائق';
            if (driver.license_expiry && new Date(driver.license_expiry) <= next30Days) alerts.push({
                type: 'driver',
                id: driver.id,
                title: `تجديد رخصة ${name}`,
                date: driver.license_expiry,
                critical: new Date(driver.license_expiry) < new Date()
            });
            if (driver.iqama_expiry && new Date(driver.iqama_expiry) <= next30Days) alerts.push({
                type: 'driver',
                id: driver.id,
                title: `تجديد إقامة ${name}`,
                date: driver.iqama_expiry,
                critical: new Date(driver.iqama_expiry) < new Date()
            });
        }
        alerts.sort((a, b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
        return alerts;
    }
    constructor(invoicesRepository, expensesRepository, trucksRepository, driverRepository){
        this.invoicesRepository = invoicesRepository;
        this.expensesRepository = expensesRepository;
        this.trucksRepository = trucksRepository;
        this.driverRepository = driverRepository;
    }
};
DashboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_invoiceentity.Invoice)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_expenseentity.Expense)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_truckentity.Truck)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_driverentity.Driver)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], DashboardService);

//# sourceMappingURL=dashboard.service.js.map