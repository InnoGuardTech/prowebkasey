const { DataSource } = require('typeorm');

const dataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.kbughhqrcixjpqaqrjxu:kayan1223456789a@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false },
  entities: [__dirname + '/src/**/*.entity.{js,ts}'],
  synchronize: true
});

async function run() {
  try {
    await dataSource.initialize();
    console.log("Connected to Supabase via TypeORM.");
    const users = await dataSource.query('SELECT * FROM "user"');
    console.log("Users in DB:", users);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}
run();
