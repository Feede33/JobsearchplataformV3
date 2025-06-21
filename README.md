# Plataforma de Búsqueda de Empleo

Plataforma para buscar y aplicar a empleos desarrollada con React, Vite, TypeScript y Supabase.

## Configuración

### Requisitos previos
- Node.js 18 o superior
- Cuenta en Supabase

### Instalación

1. Clonar el repositorio
   ```bash
   git clone https://github.com/tu-usuario/jobsearchplataform.git
   cd jobsearchplataform
   ```

2. Instalar dependencias
   ```bash
   npm install
   ```

3. Configurar variables de entorno
   Crea un archivo `.env` en la raíz del proyecto con:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Iniciar el servidor de desarrollo
   ```bash
   npm run dev
   ```

### Configuración de Supabase

Siga las instrucciones en `SUPABASE_SETUP.md` para configurar la base de datos y la autenticación.

### Configuración de seguridad

**IMPORTANTE**: Recientemente se han detectado algunas advertencias de seguridad. Para corregirlas:

1. Siga las instrucciones detalladas en `SECURITY_SETUP.md` para:
   - Corregir problemas de search_path mutable en funciones
   - Ajustar el tiempo de expiración OTP a menos de una hora
   - Habilitar la protección contra contraseñas filtradas

2. Ejecute las migraciones de seguridad:
   ```bash
   psql -f supabase/migrations/20231021_fix_security_issues.sql
   psql -f supabase/migrations/20231022_security_function.sql
   ```

3. Verifique las correcciones utilizando el componente `SupabaseDiagnostic`

## Estructura del proyecto

- `/src`: Código fuente
  - `/components`: Componentes React
  - `/lib`: Utilidades y configuración
  - `/contexts`: Contextos React
- `/supabase`: Archivos de configuración de Supabase
  - `/migrations`: Scripts SQL para migraciones

## Características principales

- Búsqueda de empleos
- Perfiles de usuario
- Guardado de empleos favoritos
- Aplicación a empleos
- Panel para empresas
- Blog integrado

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo `LICENSE` para más detalles.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# JobSearch Platform

Plataforma de búsqueda de empleo con funcionalidades avanzadas para buscar, guardar y aplicar a trabajos.

## Solución de errores comunes

### Errores 406 (Not Acceptable) y 404 (Not Found) en Supabase

Si ves errores como estos en la consola:

```
GET https://[tu-proyecto].supabase.co/rest/v1/saved_jobs?select=* 406 (Not Acceptable)
GET https://[tu-proyecto].supabase.co/rest/v1/job_applications?select=* 404 (Not Found)
```

Significa que las tablas necesarias no existen en tu base de datos Supabase. Para solucionarlo:

1. Sigue las instrucciones en el archivo `INSTRUCCIONES_SUPABASE.md` para configurar tu proyecto
2. Específicamente, ejecuta el script SQL en `supabase_tables.sql` para crear las tablas necesarias
3. Visita la página de diagnóstico en `/supabase-diagnostic` para verificar la configuración

### Herramienta de diagnóstico

La aplicación incluye una herramienta de diagnóstico que te ayudará a identificar problemas con la configuración de Supabase:

1. Accede a la URL: [http://localhost:5173/supabase-diagnostic](http://localhost:5173/supabase-diagnostic)
2. La herramienta verificará automáticamente:
   - Conexión a Supabase
   - Existencia de tablas necesarias
   - Existencia de buckets de almacenamiento

### Advertencia de React sobre refs

Si ves una advertencia como esta:

```
Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

Este es un problema menor relacionado con la biblioteca UI y no afecta la funcionalidad de la aplicación. Puedes ignorarlo de forma segura.

## Configuración inicial

1. Clona este repositorio
2. Ejecuta `npm install` para instalar las dependencias
3. Configura tu proyecto Supabase siguiendo las instrucciones en `INSTRUCCIONES_SUPABASE.md`
4. Crea un archivo `.env` con tus credenciales de Supabase
5. Ejecuta `npm run dev` para iniciar el servidor de desarrollo

## Características

- Búsqueda de trabajos por palabra clave, ubicación y filtros
- Recomendaciones personalizadas de trabajos
- Guardar trabajos favoritos
- Aplicar a trabajos con CV y carta de presentación
- Compartir ofertas de trabajo en redes sociales
