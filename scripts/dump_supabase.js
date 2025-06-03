const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const baseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;
if (!baseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

async function dumpTable(table, outputDir) {
  const url = `${baseUrl}/rest/v1/${table}?select=*`;
  const res = await fetch(url, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${table}: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  fs.writeFileSync(`${outputDir}/${table}.json`, JSON.stringify(data, null, 2));
}

async function main() {
  const outputDir = process.argv[2] || 'backups';
  fs.mkdirSync(outputDir, { recursive: true });
  const tables = ['literature', 'constructs', 'benchmarks'];
  for (const table of tables) {
    await dumpTable(table, outputDir);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
