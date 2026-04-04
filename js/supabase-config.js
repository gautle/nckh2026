(function initSupabaseRuntimeConfig() {
  const PUBLIC_DEFAULTS = {
    SUPABASE_URL: 'https://ojqcwegtxzhoqdkmgzsa.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_a2vFhGf6JVqIMokJ4LnvXw_oVY89uOx'
  };

  const runtimeConfig = (
    (window.__APP_CONFIG__ && typeof window.__APP_CONFIG__ === 'object' && window.__APP_CONFIG__) ||
    (window.APP_CONFIG && typeof window.APP_CONFIG === 'object' && window.APP_CONFIG) ||
    {}
  );

  function normalizeConfigValue(value) {
    return String(value || '').trim();
  }

  window.SUPABASE_URL = normalizeConfigValue(
    runtimeConfig.SUPABASE_URL || window.SUPABASE_URL || PUBLIC_DEFAULTS.SUPABASE_URL
  );
  window.SUPABASE_ANON_KEY = normalizeConfigValue(
    runtimeConfig.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || PUBLIC_DEFAULTS.SUPABASE_ANON_KEY
  );

  let cachedClient = null;

  window.hasSupabaseConfig = function hasSupabaseConfig() {
    return Boolean(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);
  };

  window.getSupabaseConfig = function getSupabaseConfig() {
    return {
      url: window.SUPABASE_URL,
      anonKey: window.SUPABASE_ANON_KEY,
      isConfigured: window.hasSupabaseConfig()
    };
  };

  window.getSupabaseClient = function getSupabaseClient() {
    if (!window.supabase || !window.hasSupabaseConfig()) return null;
    if (cachedClient) return cachedClient;
    cachedClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    return cachedClient;
  };
})();
