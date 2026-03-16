import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rdjfdbaxhwptybbcngop.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GUttO6ZPqFW99h-jUmKI0Q_4WnJBHbU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
