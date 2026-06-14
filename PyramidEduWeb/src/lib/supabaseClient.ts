import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uzgxmiczekxastikuddq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Z3htaWN6ZWt4YXN0aWt1ZGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODMyODUsImV4cCI6MjA5Njk1OTI4NX0.YUkedT-NhQIPOceHP7qio6RZ626Mr1tCRrZZY7rxMQs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
