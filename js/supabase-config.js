/*
 * Conexión a Supabase (Project Settings → API).
 * La clave "anon" / "publishable" es pública por diseño: la seguridad la dan las
 * políticas de supabase/schema.sql. NUNCA pongas aquí la clave "service_role" / "secret".
 * Mientras url esté vacío, el sitio muestra los blogs de data/blogs.json.
 */
window.MARU_SUPABASE = {
  url: 'https://lfpvtfjcsogyxnszvjbw.supabase.co',
  anonKey: 'sb_publishable_U-ayLbmXjvgMRgg5vWnOOw_8jJPaSxW'
};
