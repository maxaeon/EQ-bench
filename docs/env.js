// Build-time script to generate Supabase client config without storing secrets.

const url = process.env.SUPABASE_URL || '';
const anon = process.env.SUPABASE_ANON_KEY || '';

const output = `window.SUPABASE_URL = '${url}';\nwindow.SUPABASE_ANON_KEY = '${anon}';\n`;

if (require.main === module) {
  process.stdout.write(output);
}

module.exports = output;
