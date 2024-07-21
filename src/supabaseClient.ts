// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kknsrjmzmlscnaadrqxa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrbnNyam16bWxzY25hYWRycXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1NzA3MjMsImV4cCI6MjAzNzE0NjcyM30.CaLeVEbdPBe2cl3VIT2bZ8H5sf4_F4O6Uw-IH2nF0vw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
