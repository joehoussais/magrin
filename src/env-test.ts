// Test if Vite is reading environment variables
console.log('=== ENVIRONMENT VARIABLES TEST ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
console.log('Using fallback URL:', import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co');
console.log('Using fallback key:', import.meta.env.VITE_SUPABASE_ANON_KEY === 'your-anon-key');
console.log('================================');
