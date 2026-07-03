const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:kayan123456789a@db.kbughhqrcixjpqaqrjxu.supabase.co:5432/postgres"
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase.");

    const users = await client.query('SELECT id, full_name, role FROM "user"');
    console.log("Users:", users.rows);
    
    const invoices = await client.query('SELECT * FROM "invoice"');
    console.log("Invoices count:", invoices.rows.length);
    
    const trucks = await client.query('SELECT * FROM "truck"');
    console.log("Trucks count:", trucks.rows.length);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}
run();
