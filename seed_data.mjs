// seed_data.mjs - Seed sample data into the system
const BASE = 'http://localhost:3000';
let TOKEN = '';

async function post(url, body) {
  const res = await fetch(BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

async function main() {
  // 1. Login
  console.log('🔐 Logging in...');
  const login = await post('/api/v1/auth/login', { email: 'admin@prokasey.com', password: 'Admin@123' });
  TOKEN = login.data.access_token;
  console.log('✅ Login OK');

  // 2. Create Trucks
  console.log('\n🚛 Creating trucks...');
  const trucks = [
    { truck_number: 'TRK-1001', status: 'active', notes: 'قاطرة مرسيدس أكتروس 2024' },
    { truck_number: 'TRK-1002', status: 'active', notes: 'قاطرة فولفو FH16 2023' },
    { truck_number: 'TRK-1003', status: 'maintenance', notes: 'قاطرة سكانيا R500 - صيانة دورية' },
    { truck_number: 'TRK-1004', status: 'active', notes: 'قاطرة مان TGX 2024' },
    { truck_number: 'TRK-1005', status: 'inactive', notes: 'قاطرة داف XF - متوقفة مؤقتاً' },
  ];
  const isProd = true; 
const PROD_DB_URL = "postgresql://postgres.kbughhqrcixjpqaqrjxu:kayan1223456789a@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
const DB_HOST = "aws-0-ap-northeast-1.pooler.supabase.com";
const DB_PORT = 6543;
const DB_USER = "postgres.kbughhqrcixjpqaqrjxu";
const DB_PASS = "kayan1223456789a";
const DB_NAME = "postgres";
  const truckIds = [];
  for (const t of trucks) {
    const r = await post('/api/v1/trucks', t);
    console.log(`  ${t.truck_number}: ${r.status}`);
    if (r.data.id) truckIds.push(r.data.id);
  }

  // 3. Create Contractors
  console.log('\n🏢 Creating contractors...');
  const contractors = [
    { name: 'شركة الخليج للبناء', phone: '+966512345678', company_name: 'مجموعة الخليج', notes: 'عميل رئيسي' },
    { name: 'مؤسسة النور للمقاولات', phone: '+966598765432', company_name: 'النور', notes: 'مشاريع حكومية' },
    { name: 'شركة الأفق للتطوير', phone: '+966551234567', company_name: 'الأفق', notes: 'مشاريع سكنية' },
  ];
  const contractorIds = [];
  for (const c of contractors) {
    const r = await post('/api/v1/contractors', c);
    console.log(`  ${c.name}: ${r.status}`);
    if (r.data.id) contractorIds.push(r.data.id);
  }

  // 4. Create Expense Categories
  console.log('\n🏷️ Creating expense categories...');
  const categories = [
    { name: 'وقود (ديزل)', description: 'مصروفات الوقود والديزل', color: '#EF4444', sort_order: 1 },
    { name: 'صيانة ميكانيكية', description: 'صيانة المحرك والقير', color: '#F59E0B', sort_order: 2 },
    { name: 'إطارات', description: 'شراء واستبدال الإطارات', color: '#6B7280', sort_order: 3 },
    { name: 'تأمين', description: 'تأمين المركبات والسائقين', color: '#3B82F6', sort_order: 4 },
    { name: 'رواتب', description: 'رواتب السائقين والعمال', color: '#8B5CF6', sort_order: 5 },
    { name: 'رسوم حكومية', description: 'رسوم الطرق والفحص الدوري', color: '#10B981', sort_order: 6 },
  ];
  const catIds = [];
  for (const c of categories) {
    const r = await post('/api/v1/expenses/categories', c);
    console.log(`  ${c.name}: ${r.status}`);
    if (r.data.id) catIds.push(r.data.id);
  }

  // 5. Create Invoices
  console.log('\n💰 Creating invoices...');
  const invoices = [
    { invoice_number: 'INV-2024-001', amount: 15000, invoice_date: '2024-10-15', description: 'نقل بضائع من الرياض إلى جدة', status: 'paid', vat_amount: 2250, truck: truckIds[0], contractor: contractorIds[0] },
    { invoice_number: 'INV-2024-002', amount: 22000, invoice_date: '2024-10-20', description: 'نقل مواد بناء للمشروع الشمالي', status: 'paid', vat_amount: 3300, truck: truckIds[1], contractor: contractorIds[1] },
    { invoice_number: 'INV-2024-003', amount: 8500, invoice_date: '2024-11-01', description: 'نقل معدات ثقيلة', status: 'pending', vat_amount: 1275, truck: truckIds[0], contractor: contractorIds[2] },
    { invoice_number: 'INV-2024-004', amount: 18000, invoice_date: '2024-11-10', description: 'رحلة نقل حاويات - ميناء جدة', status: 'paid', vat_amount: 2700, truck: truckIds[3], contractor: contractorIds[0] },
    { invoice_number: 'INV-2024-005', amount: 12000, invoice_date: '2024-11-15', description: 'نقل مواد من الدمام للرياض', status: 'overdue', vat_amount: 1800, truck: truckIds[1], contractor: contractorIds[1] },
  ];
  for (const inv of invoices) {
    const r = await post('/api/v1/invoices', inv);
    console.log(`  ${inv.invoice_number}: ${r.status}`);
  }

  // 6. Create Expenses
  console.log('\n💸 Creating expenses...');
  const expenses = [
    { amount: 1500, expense_date: '2024-10-10', notes: 'تعبئة ديزل - محطة أرامكو', truck: truckIds[0], category: catIds[0] },
    { amount: 3500, expense_date: '2024-10-12', notes: 'تغيير زيت وفلاتر', truck: truckIds[0], category: catIds[1] },
    { amount: 4200, expense_date: '2024-10-18', notes: 'استبدال 4 إطارات أمامية', truck: truckIds[1], category: catIds[2] },
    { amount: 8000, expense_date: '2024-10-20', notes: 'تأمين شامل - قسط ربع سنوي', truck: truckIds[3], category: catIds[3] },
    { amount: 5500, expense_date: '2024-11-01', notes: 'راتب سائق - شهر أكتوبر', truck: truckIds[0], category: catIds[4] },
    { amount: 1200, expense_date: '2024-11-05', notes: 'رسوم فحص دوري + ملصق', truck: truckIds[2], category: catIds[5] },
    { amount: 2800, expense_date: '2024-11-10', notes: 'تعبئة ديزل - رحلة الدمام', truck: truckIds[1], category: catIds[0] },
    { amount: 12000, expense_date: '2024-11-12', notes: 'إصلاح علبة القير', truck: truckIds[2], category: catIds[1] },
  ];
  for (const exp of expenses) {
    const r = await post('/api/v1/expenses', exp);
    console.log(`  ${exp.notes.substring(0, 30)}: ${r.status}`);
  }

  console.log('\n🎉 === SEED COMPLETE ===');
  console.log(`Created: ${trucks.length} trucks, ${contractors.length} contractors, ${categories.length} categories, ${invoices.length} invoices, ${expenses.length} expenses`);
}

main().catch(e => console.error('Fatal:', e.message));
