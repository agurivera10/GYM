# Elite Training App (Next.js + Supabase)

Esta aplicación es una PWA moderna construida con Next.js 14+ (App Router), Tailwind CSS y Supabase.

## Configuración Inicial

1. **Supabase**:
   Crea un proyecto en [Supabase](https://supabase.com).
   Ve a la sección **SQL Editor** y ejecuta el script que generamos en el plan de implementación.

2. **Variables de Entorno**:
   Crea un archivo `.env.local` en la raíz de este proyecto con tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```

3. **Iniciar el proyecto**:
   Ejecuta:
   ```bash
   npm install
   npm run dev
   ```

## Notas
- Para manejar la autenticación, se asume el uso del panel de Auth de Supabase (por ejemplo, Magic Link). La lógica requeriría crear una página `/login` en el futuro.
- Los logs se guardan asíncronamente en la tabla `exercise_logs` y están protegidos por **Row Level Security (RLS)**.
