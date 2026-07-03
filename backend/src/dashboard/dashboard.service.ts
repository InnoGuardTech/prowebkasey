import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Expense } from '../entities/expense.entity';
import { Truck } from '../entities/truck.entity';
import { Driver } from '../entities/driver.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Expense) private expensesRepository: Repository<Expense>,
    @InjectRepository(Truck) private trucksRepository: Repository<Truck>,
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
  ) {}

  async getDashboardStats() {
    const trucksCount = await this.trucksRepository.count({ where: { status: 'active', is_deleted: false } });
    
    const invoices = await this.invoicesRepository.find({ where: { is_deleted: false } });
    const allExpenses = await this.expensesRepository.find({ where: { is_deleted: false } });

    const totalIncome = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const approvedExpenses = allExpenses.filter(e => e.is_approved).reduce((sum, exp) => sum + Number(exp.amount), 0);
    const pendingExpenses = allExpenses.filter(e => !e.is_approved).length;
    const netProfit = totalIncome - totalExpenses;

    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentYear = new Date().getFullYear();
    
    const chartData = months.map((name, index) => {
      const monthInvoices = invoices.filter(inv => {
        const d = new Date(inv.invoice_date);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      });
      const monthExpenses = allExpenses.filter(exp => {
        const d = new Date(exp.expense_date);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      });
      
      return {
        name,
        income: monthInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0),
        expense: monthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
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

    const expiringTrucks = await this.trucksRepository.createQueryBuilder('truck')
      .where('truck.registration_expiry <= :date OR truck.insurance_expiry <= :date OR truck.inspection_expiry <= :date', { date: next30Days })
      .getMany();

    const expiringDrivers = await this.driverRepository.createQueryBuilder('driver')
      .leftJoinAndSelect('driver.user', 'user')
      .where('driver.license_expiry <= :date OR driver.iqama_expiry <= :date', { date: next30Days })
      .getMany();

    const alerts: any[] = [];

    for (const truck of expiringTrucks) {
      if (truck.registration_expiry && new Date(truck.registration_expiry) <= next30Days) alerts.push({ type: 'truck', id: truck.id, title: `تجديد استمارة قاطرة ${truck.truck_number}`, date: truck.registration_expiry, critical: new Date(truck.registration_expiry) < new Date() });
      if (truck.insurance_expiry && new Date(truck.insurance_expiry) <= next30Days) alerts.push({ type: 'truck', id: truck.id, title: `تجديد تأمين قاطرة ${truck.truck_number}`, date: truck.insurance_expiry, critical: new Date(truck.insurance_expiry) < new Date() });
      if (truck.inspection_expiry && new Date(truck.inspection_expiry) <= next30Days) alerts.push({ type: 'truck', id: truck.id, title: `فحص دوري قاطرة ${truck.truck_number}`, date: truck.inspection_expiry, critical: new Date(truck.inspection_expiry) < new Date() });
    }

    for (const driver of expiringDrivers) {
      const name = driver.user?.full_name || 'سائق';
      if (driver.license_expiry && new Date(driver.license_expiry) <= next30Days) alerts.push({ type: 'driver', id: driver.id, title: `تجديد رخصة ${name}`, date: driver.license_expiry, critical: new Date(driver.license_expiry) < new Date() });
      if (driver.iqama_expiry && new Date(driver.iqama_expiry) <= next30Days) alerts.push({ type: 'driver', id: driver.id, title: `تجديد إقامة ${name}`, date: driver.iqama_expiry, critical: new Date(driver.iqama_expiry) < new Date() });
    }

    alerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return alerts;
  }
}

