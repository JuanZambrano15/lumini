# Lumini

Lumini es una plataforma educativa online para niños de 4 a 14 años, diseñada para potenciar el aprendizaje a través de actividades, juegos y seguimiento parental. El proyecto está construido con [Next.js](https://nextjs.org/), [React](https://react.dev/), [Firebase](https://firebase.google.com/), y utiliza [Tailwind CSS](https://tailwindcss.com/) para los estilos.

## Características

- Registro e inicio de sesión de usuarios (padres).
- Gestión de perfiles de niños/as (hasta 3 por cuenta).
- Selección de avatar personalizado para cada niño/a.
- Actividades educativas y juegos interactivos.
- Panel de control para padres con acceso protegido por contraseña.
- Integración con Firebase para autenticación y almacenamiento de datos.

## Estructura del Proyecto

```
src/
  app/                # Páginas principales (Next.js App Router)
  components/         # Componentes reutilizables (formularios, menús, etc.)
  hooks/              # Custom React hooks
  lib/                # Lógica de negocio y servicios (Firebase, auth, etc.)
public/               # Imágenes y recursos estáticos
```

## Instalación

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/tu-usuario/lumini.git
   cd lumini
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env.local` en la raíz con tus credenciales de Firebase:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     NEXT_PUBLIC_FIREBASE_APP_ID=...
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
     ```

4. **Inicia el servidor de desarrollo:**
   ```sh
   npm run dev
   # o
   yarn dev
   ```

   Accede a [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts útiles

- `npm run dev` – Inicia el servidor de desarrollo.
- `npm run build` – Compila la aplicación para producción.
- `npm run start` – Inicia la aplicación en modo producción.
- `npm run lint` – Ejecuta el linter.

## Tecnologías principales

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)



---

Desarrollado con ❤️ por el equipo de Lumini.

## Autores
- Nicoll Sofia Arevalo Caballero (192316)
- Juan José Zambrano Manzano (192327)
