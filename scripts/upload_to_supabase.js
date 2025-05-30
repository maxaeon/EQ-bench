const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const baseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;
if (!baseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

async function upload(file, type) {
  let items = [];
  try {
    items = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Failed to read', file);
    return;
  }
  for (const item of items) {
    const payload = { submission_type: type, data: item };
    const res = await fetch(`${baseUrl}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.error('Error uploading', type, await res.text());
    }
  }
}

(async () => {
  await upload('data/construct_submissions.json', 'construct');
  await upload('data/literature.json', 'literature');
})();
