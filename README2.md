# JobSearch Platform - Guía Contextual

## Visión General del Proyecto

Esta plataforma de búsqueda de empleo permite a los usuarios buscar, guardar y aplicar a trabajos. Incluye características avanzadas como:

- Sistema de recomendaciones personalizadas
- Guardado de trabajos favoritos
- Aplicación a trabajos con CV y carta de presentación
- Almacenamiento de archivos (CV, avatares)
- Tendencias del mercado laboral

## Componentes Principales

### Frontend (React + TypeScript)

- **UI Components**: Utiliza Shadcn/UI (basado en Radix UI)
- **Routing**: React Router
- **Estado Global**: Contextos de React (AuthContext, SavedJobsContext)

### Backend (Supabase)

- **Base de datos**: PostgreSQL
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage
- **API**: REST API generada automáticamente

## Estructura de Datos en Supabase

### Tablas Principales

1. **saved_jobs** - Almacena los trabajos guardados por los usuarios
   ```sql
   - id: UUID (PK)
   - user_id: UUID (FK a auth.users)
   - job_id: INTEGER
   - job_data: JSONB
   - created_at: TIMESTAMP
   ```

2. **job_applications** - Almacena las aplicaciones a trabajos
   ```sql
   - id: UUID (PK)
   - user_id: UUID (FK a auth.users)
   - job_id: INTEGER
   - cover_letter: TEXT
   - resume_url: TEXT
   - status: VARCHAR(50)
   - created_at: TIMESTAMP
   - updated_at: TIMESTAMP
   ```

3. **profiles** - Información de perfil de usuario
   ```sql
   - id: UUID (PK, FK a auth.users)
   - name: TEXT
   - email: TEXT
   - avatar_url: TEXT
   - skills: TEXT[]
   - bio: TEXT
   - location: TEXT
   - created_at: TIMESTAMP
   - updated_at: TIMESTAMP
   ```

### Buckets de Almacenamiento

1. **resumes** - Almacena los CV de los usuarios
2. **avatars** - Almacena las fotos de perfil

## Componentes MCP (Módulos Principales)

### 1. jobInteractions.ts

**Funcionalidad**: Gestiona todas las interacciones con trabajos.

**Métodos principales**:
- `saveJob/unsaveJob`: Guardar/eliminar trabajos en favoritos
- `isJobSaved`: Verificar si un trabajo está guardado
- `applyToJob`: Aplicar a un trabajo
- `hasAppliedToJob`: Verificar si el usuario ya aplicó
- `getSavedJobs/getUserApplications`: Obtener trabajos guardados/aplicaciones
- `uploadResume`: Subir archivo de CV

**Cuándo usar**: Para cualquier acción relacionada con guardar trabajos o aplicar a ellos.

### 2. jobRecommendations.ts

**Funcionalidad**: Sistema de recomendaciones de trabajos.

**Métodos principales**:
- `getPersonalizedJobRecommendations`: Recomendaciones basadas en perfil
- `getTrendingJobs`: Trabajos en tendencia
- `getFeaturedJobsByCategory`: Trabajos destacados por categoría

**Cuándo usar**: Para mostrar trabajos recomendados en la página principal o secciones personalizadas.

### 3. setupSupabaseStorage.ts

**Funcionalidad**: Configura los buckets de almacenamiento en Supabase.

**Cuándo usar**: Al inicializar la aplicación para asegurar que existan los buckets necesarios.

## Componentes de UI Principales

1. **JobListingCard**: Tarjeta de trabajo con opciones para guardar, compartir y aplicar
2. **PersonalizedJobsSection**: Sección de trabajos personalizados para el usuario
3. **TrendingJobsSection**: Muestra trabajos en tendencia
4. **JobCategorySection**: Agrupa trabajos por categorías
5. **SupabaseDiagnostic**: Herramienta para diagnosticar problemas con Supabase

## Solución de Errores Comunes

### Error: "406 (Not Acceptable)" o "404 (Not Found)" en consultas a Supabase

**Causa**: Las tablas `saved_jobs` o `job_applications` no existen en la base de datos.

**Solución**:
1. Visita la página de diagnóstico: `/supabase-diagnostic`
2. Ejecutar el script SQL en `supabase_tables.sql` en la consola SQL de Supabase
3. Alternativa: Usar las herramientas MCP de Supabase:

```javascript
// Para crear la tabla saved_jobs
mcp_supabase_apply_migration({
  project_id: "tu_proyecto_id",
  name: "create_saved_jobs_table",
  query: "-- SQL para crear saved_jobs (ver supabase_tables.sql)"
})

// Para crear la tabla job_applications
mcp_supabase_apply_migration({
  project_id: "tu_proyecto_id",
  name: "create_job_applications_table",
  query: "-- SQL para crear job_applications (ver supabase_tables.sql)"
})
```

### Error: "Bucket does not exist" al cargar archivos

**Causa**: Los buckets de almacenamiento no están configurados.

**Solución**:
1. Verificar con la herramienta de diagnóstico
2. Crear los buckets manualmente en el panel de Supabase (Storage)
3. Alternativa: Usar MCP de Supabase:

```javascript
// Verificar si los buckets existen
mcp_supabase_execute_sql({
  project_id: "tu_proyecto_id",
  query: "SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'resumes');"
})

// Crear bucket si no existe
// (Usar la interfaz de Supabase o el SDK)
```

### Error: "Function components cannot be given refs"

**Causa**: Error de la biblioteca UI relacionado con referencias en componentes funcionales.

**Solución**: Este es un error menor que no afecta la funcionalidad. Si deseas resolverlo, puedes usar React.forwardRef en los componentes señalados o actualizar las dependencias.

### Error: "Missing RLS policy" al guardar trabajos

**Causa**: Las políticas de Row Level Security no están configuradas correctamente.

**Solución**: Verificar y aplicar las políticas RLS en las tablas:

```sql
-- Política para saved_jobs
CREATE POLICY "Users can view their own saved jobs" 
  ON saved_jobs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved jobs" 
  ON saved_jobs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

## Herramientas de Diagnóstico

### SupabaseDiagnostic Component

Ruta: `/supabase-diagnostic`

Esta herramienta realiza las siguientes comprobaciones:
- Conexión a Supabase
- Existencia de tablas requeridas
- Existencia de buckets de almacenamiento
- Permisos de usuario

Utilízala cuando encuentres errores relacionados con Supabase para identificar rápidamente el problema.

## Flujo de Desarrollo

1. **Desarrollo local**:
   - Ejecuta `npm run dev` para iniciar el servidor de desarrollo
   - Los cambios se actualizan automáticamente

2. **Solución de problemas**:
   - Usa la herramienta de diagnóstico si hay errores con Supabase
   - Verifica la consola del navegador para mensajes de error específicos
   - Para errores de almacenamiento, confirma que los buckets existan

3. **Deployment**:
   - Asegúrate que todas las tablas y buckets estén configurados en Supabase
   - Verifica las variables de entorno para las conexiones a Supabase
   - Comprueba que las políticas RLS estén configuradas correctamente

## Mejores Prácticas

1. **Seguridad**: Usa siempre las políticas RLS para proteger los datos
2. **Rendimiento**: Pagina las consultas cuando trabajes con listas largas de trabajos
3. **UX**: Muestra indicadores de carga durante operaciones asíncronas
4. **Almacenamiento**: Valida tipos y tamaños de archivo antes de cargarlos
5. **Recomendaciones**: Personaliza basándote en interacciones reales del usuario

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Shadcn/UI](https://ui.shadcn.com)
- [React Router](https://reactrouter.com/docs/en/v6)
- [TypeScript](https://www.typescriptlang.org/docs/) 