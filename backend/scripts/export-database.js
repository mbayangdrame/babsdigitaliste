// Script obsolète (MySQL) — désactivé depuis la migration vers PostgreSQL/Supabase
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('⛔ Script désactivé: export-database.js était conçu pour MySQL.');
console.log('➡ Pour PostgreSQL/Supabase, utilisez pg_dump, par exemple:');
console.log('   pg_dump --dbname="$SUPABASE_DB_URL" --format=c --file=backup.dump');