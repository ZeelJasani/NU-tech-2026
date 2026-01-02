import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwpgmhtcimfvkfcotden.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cGdtaHRjaW1mdmtmY290ZGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNTM2ODgsImV4cCI6MjA4MjkyOTY4OH0.XLGjumGtXrPusUKR4oMmjWLGKqD-nV4vtwCspnvCGEk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
