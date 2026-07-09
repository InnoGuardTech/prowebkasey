const { DataSource } = require('typeorm');
const { User } = require('./dist/entities/user.entity');
const { Truck } = require('./dist/entities/truck.entity');
const { Driver } = require('./dist/entities/driver.entity');
const { Contractor } = require('./dist/entities/contractor.entity');
const { Invoice } = require('./dist/entities/invoice.entity');
const { Expense } = require('./dist/entities/expense.entity');
const { Setting } = require('./dist/entities/setting.entity');
const { ExpenseCategory } = require('./dist/entities/expense_category.entity');
const { Trip } = require('./dist/entities/trip.entity');
const { AuditLog } = require('./dist/entities/audit_log.entity');

const dataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.kbughhqrcixjpqaqrjxu:kayan123456789a@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false },
  entities: [User, Truck, Driver, Contractor, Invoice, Expense, Setting, ExpenseCategory, Trip, AuditLog],
  synchronize: true,
});

async function run() {
  try {
    console.log("Initializing DB and syncing schemas...");
    await dataSource.initialize();
    console.log("DB synced successfully!");
  } catch (err) {
    console.error("Sync Error:", err);
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}
run();
