import { useState } from 'react';
import { Link } from 'react-router';
import nina3 from '@/assets/avatars/nina3.webp';
import nino1 from '@/assets/avatars/nino1.webp';
import nino2 from '@/assets/avatars/nino2.webp';
import hero from '@/assets/brand/hero.webp';
import iconIa from '@/assets/landing/ia.webp';
import iconQuince from '@/assets/landing/quince-minutos.webp';
import iconSinAyuda from '@/assets/landing/sin-ayuda.webp';
import { ChevronDownIcon } from '@/components/Icons';
import { Logo } from '@/components/Logo';

const pillars = [
  {
    icon: iconSinAyuda,
    title: 'Sin la ayuda de los padres',
    text: 'Lumini cuenta con tutoriales interactivos y ejercicios guiados para introducir conceptos nuevos.',
  },
  {
    icon: iconQuince,
    title: 'Solo 15 minutos al día',
    text: 'Sesiones cortas y con descansos, pensadas para mantener la atención, también en niños con TDAH.',
  },
  {
    icon: iconIa,
    title: 'Inteligencia Artificial',
    text: 'Lumi, un asistente con IA y filtros de seguridad, responde sus preguntas. Tú las revisas todas.',
  },
];

/** Botón amarillo "Prueba gratis 7 dias" del Figma. */
function TrialButton({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <Link
      to="/registro"
      className={`inline-grid place-items-center rounded-full bg-sun text-ink tracking-[0.08em] shadow-[6px_6px_0_rgba(46,42,71,0.22)] transition hover:brightness-105 active:translate-y-0.5 ${
        size === 'lg'
          ? 'h-[97px] w-full max-w-[472px] text-[30px]'
          : 'h-[60px] w-full max-w-[327px] text-lg'
      }`}
    >
      Prueba gratis 7 días
    </Link>
  );
}

/** Página de inicio ("index" e "index action" del Figma). */
export function LandingPage() {
  const [pillar, setPillar] = useState(0);

  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-30 bg-[#9dfde9]">
        <nav className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-2 lg:h-[137px] lg:py-0 lg:pr-[177px] lg:pl-[113px]">
          <Logo className="h-16 w-auto lg:h-[137px]" />
          <ul className="ml-auto flex items-center gap-4 text-base tracking-[0.1em] text-ink sm:gap-8 lg:mr-auto lg:ml-[150px] lg:gap-[100px] lg:text-xl">
            <li className="group relative hidden sm:block">
              <button
                type="button"
                aria-haspopup="true"
                className="flex items-center gap-1 py-2 hover:text-brand-700"
              >
                Programas
                <ChevronDownIcon className="size-5 transition group-focus-within:rotate-180 group-hover:rotate-180" />
              </button>
              {/* "index action": al pasar el mouse se despliegan las materias. */}
              <ul className="invisible absolute top-full left-0 flex w-[175px] flex-col gap-1 bg-[#9dfde9] py-3 text-center text-[17px] opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <li>
                  <a href="#metodo" className="block py-1 hover:text-brand-700">
                    Matemáticas
                  </a>
                </li>
                <li>
                  <a href="#metodo" className="block py-1 hover:text-brand-700">
                    Español
                  </a>
                </li>
              </ul>
            </li>
            <li className="hidden sm:block">
              <a href="#planes" className="py-2 hover:text-brand-700">
                Planes
              </a>
            </li>
            <li className="hidden md:block">
              <a href="#metodo" className="py-2 whitespace-nowrap hover:text-brand-700">
                ¿Por qué elegirnos?
              </a>
            </li>
          </ul>
          <Link
            to="/ingresar"
            aria-label="Ingresar a mi cuenta"
            title="Ingresar"
            className="grid size-14 place-items-center rounded-xl text-ink transition hover:bg-white/50 lg:size-[75px]"
          >
            <AccountBookIcon />
          </Link>
        </nav>
      </header>

      <section
        className="bg-[#a77fe0] bg-cover bg-right"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="mx-auto flex min-h-[420px] max-w-[1440px] items-center px-4 py-12 lg:h-[616px] lg:px-[113px] lg:py-0">
          <div className="max-w-[470px] rounded-3xl bg-brand-900/35 p-6 text-white backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none lg:-mt-[150px] lg:pl-3">
            <h1 className="text-[34px] leading-[1.05] font-bold tracking-tight drop-shadow-sm lg:text-[39px]">
              El método online de aprendizaje para niños de 4 a 14 años
            </h1>
            <p className="mt-8 text-[19px] font-semibold text-white">
              Garantice el éxito académico de sus hijos
            </p>
            <div className="mt-4 -ml-3">
              <TrialButton />
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="h-[139px] bg-landing-band" />

      <section
        id="metodo"
        className="scroll-mt-36 bg-gradient-to-b from-[#e3f6f5] to-[#eaf7f8] px-4 pt-8 pb-14"
      >
        <h2 className="mx-auto max-w-[900px] text-center text-[30px] leading-tight font-bold tracking-tight text-[#3a3a3a] lg:text-[37px]">
          Con el Método Lumini los niños dominarán las áreas clave para su futuro.
        </h2>
        <div
          className="mx-auto mt-14 grid max-w-[1100px] gap-10 md:grid-cols-3"
          role="tablist"
          aria-label="Método Lumini"
        >
          {pillars.map((item, index) => {
            const selected = index === pillar;
            return (
              <div key={item.title} className="flex flex-col items-center text-center">
                <img src={item.icon} alt="" className="h-[150px] object-contain" />
                <button
                  type="button"
                  role="tab"
                  id={`pilar-${index}`}
                  aria-selected={selected}
                  aria-controls={`pilar-texto-${index}`}
                  onClick={() => setPillar(index)}
                  onMouseEnter={() => setPillar(index)}
                  className={`mt-6 min-h-[46px] w-full max-w-[391px] rounded-lg px-4 text-[21px] font-bold transition ${
                    selected ? 'bg-[#1bd1b1] text-[#0f3d36]' : 'text-[#3a3a3a] hover:bg-white/70'
                  }`}
                >
                  {item.title}
                </button>
                <p
                  id={`pilar-texto-${index}`}
                  role="tabpanel"
                  aria-labelledby={`pilar-${index}`}
                  hidden={!selected}
                  className="mt-4 max-w-[380px] text-[21px] leading-snug text-[#4a4a4a]"
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="planes"
        className="scroll-mt-36 bg-gradient-to-b from-[#f3f8fd] to-white px-4 pt-10 pb-16 text-center tracking-tight text-[#767676]"
      >
        <p className="text-[38px] leading-tight lg:text-[46px]">De $15.000 a $20.000 al mes</p>
        <p className="mx-auto mt-2 max-w-[1180px] text-[22px] leading-snug lg:text-[30px]">
          En función del número de niños inscritos y los meses de suscripción.{' '}
          <Link to="/registro" className="text-[#2f7cc4] hover:underline">
            Pruébelo gratis
          </Link>{' '}
          y acceda a sus tarifas desde la Web de Padres.
        </p>
        <div className="mx-auto mt-8 flex max-w-[540px] items-end justify-center gap-2" aria-hidden>
          <img src={nino2} alt="" className="h-[190px] min-w-0 object-contain sm:h-[290px]" />
          <img src={nina3} alt="" className="h-[200px] min-w-0 object-contain sm:h-[300px]" />
          <img src={nino1} alt="" className="h-[190px] min-w-0 object-contain sm:h-[290px]" />
        </div>
        <p className="mt-6 text-[22px] lg:text-[26px]">
          También precios especiales para colegios y centros educativos.
        </p>
        <div className="mt-14">
          <TrialButton size="lg" />
        </div>
      </section>

      <hr className="border-t-2 border-[#d9d9d9]" />
      <div aria-hidden className="h-[92px] bg-white" />

      <footer className="bg-gradient-to-b from-footer-from to-footer-to text-white">
        {/* TODO: reemplazar los datos de contacto y los enlaces por los reales. */}
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-6 md:grid-cols-[minmax(0,1.6fr)_1fr_1fr] lg:px-[108px]">
          <ul className="space-y-0.5 text-lg md:pl-[150px] lg:pl-[207px]">
            <li>Preguntas frecuentes</li>
            <li>Aviso legal</li>
            <li>Condiciones del servicio</li>
            <li>Política de privacidad y cookies</li>
          </ul>
          <address className="text-base not-italic md:pt-5">
            +57 601 5088350
            <br />
            lumini@lumini.com
          </address>
          <div className="md:text-right">
            <p className="text-lg">SÍGANOS:</p>
            <ul className="mt-2 flex flex-wrap gap-2 md:justify-end">
              {['Facebook', 'X', 'YouTube', 'Instagram'].map((network) => (
                <li
                  key={network}
                  className="rounded-full border-2 border-white/80 px-3 py-1 text-sm font-semibold"
                >
                  {network}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/40">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-6 lg:px-[108px]">
            <p>© {new Date().getFullYear()} Lumini. Todos los derechos reservados.</p>
            <span className="flex items-center gap-2 rounded-full border border-white/80 py-1 pr-4 pl-1">
              <span
                aria-hidden
                className="size-10 rounded-full"
                style={{
                  background: 'linear-gradient(#fcd116 0 50%, #003893 50% 75%, #ce1126 75%)',
                }}
              />
              <span className="underline">Colombia</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Ícono de la cabecera del Figma: persona dentro de un libro (acceso a la cuenta). */
function AccountBookIcon() {
  return (
    <svg
      viewBox="0 0 50 62"
      className="h-12 w-auto lg:h-[62px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden
    >
      <rect x="3" y="2" width="44" height="50" rx="4" />
      <path d="M3 52v4a4 4 0 0 0 4 4h40" />
      <circle cx="25" cy="22" r="12" />
      <circle cx="25" cy="18" r="4.5" fill="currentColor" />
      <path d="M16.5 30c2-4.5 5-6.5 8.5-6.5s6.5 2 8.5 6.5" fill="currentColor" />
    </svg>
  );
}
