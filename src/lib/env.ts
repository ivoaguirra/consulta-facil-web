const requireEnv = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  }
  return value;
};

const removeTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const supabaseUrl = removeTrailingSlash(requireEnv(import.meta.env.VITE_SUPABASE_URL, 'VITE_SUPABASE_URL'));
const supabaseAnonKey = requireEnv(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, 'VITE_SUPABASE_PUBLISHABLE_KEY');

const supabaseFunctionsBase = removeTrailingSlash(
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || `${supabaseUrl}/functions/v1`
);

const resolveJitsiBaseUrl = () => {
  const value = import.meta.env.VITE_JITSI_BASE_URL || 'https://meet.jit.si';

  try {
    const url = new URL(value);
    return removeTrailingSlash(url.origin + url.pathname);
  } catch (error) {
    console.warn(
      `[env] VITE_JITSI_BASE_URL inválida ("${value}"). Usando URL padrão https://meet.jit.si.`,
      error
    );
    return 'https://meet.jit.si';
  }
};

const jitsiBaseUrl = resolveJitsiBaseUrl();

const resolveJitsiDomain = (value: string) => {
  try {
    return new URL(`${value}/`).host;
  } catch {
    return 'meet.jit.si';
  }
};

export const ENV = {
  SUPABASE_URL: supabaseUrl,
  SUPABASE_ANON_KEY: supabaseAnonKey,
  SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID || '',
  SUPABASE_FUNCTIONS_URL: supabaseFunctionsBase,
  JITSI_BASE_URL: jitsiBaseUrl,
  JITSI_DOMAIN: resolveJitsiDomain(jitsiBaseUrl),
  JITSI_EXTERNAL_API_URL: `${jitsiBaseUrl}/external_api.js`,
};
