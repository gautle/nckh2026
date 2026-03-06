// TODO: paste your Supabase project values
window.SUPABASE_URL = 'https://ojqcwegtxzhoqdkmgzsa.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_a2vFhGf6JVqIMokJ4LnvXw_oVY89uOx';

window.getSupabaseClient = function getSupabaseClient() {
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return null;
  return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
};
