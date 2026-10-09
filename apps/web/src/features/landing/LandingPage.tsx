import { Link } from 'react-router';
import hero from '@/assets/brand/hero.webp';
import metodo from '@/assets/brand/metodo.webp';
import { Logo } from '@/components/Logo';

const pillars = [
  {
    emoji: '🧩',
    title: 'Razonamiento',
    text: 'Retos y juegos de lógica para pensar paso a paso.',
    color: 'bg-lime',
  },
  {
    emoji: '🧠',
    title: 'Memoria',
    text: 'Cartas, secuencias y parejas que entrenan la memoria.',
    color: 'bg-sun',
  },
  {
    emoji: '🎯',
    title: 'Atención',
    text: 'Ejercicios cortos pensados también para niños con TDAH.',
    color: 'bg-bubblegum',
  },
];

const steps = [
  { emoji: '📚', title: 'Aprende', text: 'Tutoriales y actividades por tema, a su ritmo.' },
  { emoji: '🎮', title: 'Juega', text: 'Juegos de razonamiento, memoria y atención.' },
  {
    emoji: '⭐',
    title: 'Gana estrellas',
    text: 'Cada logro suma estrellas que se guardan en su perfil.',
  },
  {
    emoji: '🪣',
    title: 'Pide un deseo',
    text: 'En el pozo de los deseos canjea estrellas por premios que tú defines.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-30 bg-mint/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <Logo className="w-16" />
          <div className="hidden gap-6 font-bold md:flex">
            <a href="#metodo" className="hover:text-brand-700">
              Método
            </a>
            <a href="#como-funciona" className="hover:text-brand-700">
              Cómo funciona
            </a>
            <a href="#padres" className="hover:text-brand-700">
              Para padres
            </a>
          </div>
          <div className="flex gap-2">
            <Link to="/ingresar" className="rounded-full px-4 py-2 font-bold hover:bg-white/60">
              Ingresar
            </Link>
            <Link
              to="/registro"
              className="rounded-full bg-brand-600 px-4 py-2 font-bold text-white hover:bg-brand-700"
            >
              Crear cuenta
            </Link>
          </div>
        </nav>
      </header>

      <section
        className="bg-[#a77fe0] bg-cover bg-right"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="mx-auto flex min-h-[70dvh] max-w-6xl items-center px-4 py-16">
          <div className="max-w-xl rounded-3xl bg-brand-900/30 p-6 text-white backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none">
            <h1 className="text-4xl leading-tight font-extrabold md:text-6xl">
              El método online de aprendizaje para niños de 4 a 14 años
            </h1>
            <p className="mt-4 text-lg md:text-xl">
              Actividades, juegos y un pozo de los deseos que motiva a aprender cada día.
            </p>
            <Link
              to="/registro"
              className="mt-6 inline-block rounded-full bg-sun px-8 py-3 text-lg font-extrabold text-ink shadow-[0_4px_0_#c9a800] hover:brightness-105"
            >
              Empieza gratis
            </Link>
          </div>
        </div>
      </section>

      <section id="metodo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold text-brand-700 md:text-4xl">
          El método Lumini
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className={`rounded-3xl p-6 shadow ${pillar.color}`}>
              <span className="text-4xl" aria-hidden>
                {pillar.emoji}
              </span>
              <h3 className="mt-2 text-2xl font-extrabold">{pillar.title}</h3>
              <p className="mt-1">{pillar.text}</p>
            </article>
          ))}
        </div>
        <img
          src={metodo}
          alt="Ilustración del método Lumini"
          className="mt-10 w-full rounded-3xl"
          loading="lazy"
        />
      </section>

      <section id="como-funciona" className="scroll-mt-20 bg-brand-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-extrabold text-brand-700 md:text-4xl">
            ¿Cómo funciona?
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-3xl bg-white p-6 shadow">
                <span className="text-sm font-extrabold text-brand-500">Paso {index + 1}</span>
                <p className="mt-1 text-3xl" aria-hidden>
                  {step.emoji}
                </p>
                <h3 className="text-xl font-extrabold">{step.title}</h3>
                <p className="mt-1 text-ink/80">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="padres" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-brand-700 md:text-4xl">
          Pensado para las familias
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg">
          Hasta 3 perfiles por cuenta, una zona de padres protegida con PIN para ver el progreso y
          crear los deseos, y los datos de tus hijos protegidos en nuestro servidor.
        </p>
      </section>

      <footer className="bg-brand-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} Lumini. Proyecto académico.</p>
          <p>Hecho en Colombia 🇨🇴</p>
        </div>
      </footer>
    </div>
  );
}
