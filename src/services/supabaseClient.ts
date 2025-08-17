import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://klvrhlxerqhofvjgkcma.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdnJobHhlcnFob2Z2amdrY21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTk1NzgsImV4cCI6MjA3MDY3NTU3OH0.i688mpqxD6LdS-nBW-XdBQX99vMa5sRmijVUhE7kweI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);