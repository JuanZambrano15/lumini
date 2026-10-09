import { Link, Route, Routes } from 'react-router';
import { GuestOnly, RequireAuth, RequireChild } from '@/auth/guards';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { GamePlayPage } from '@/features/games/GamePlayPage';
import { GamesPage } from '@/features/games/GamesPage';
import { LandingPage } from '@/features/landing/LandingPage';
import { ActivityPage } from '@/features/learning/ActivityPage';
import { StudyPage } from '@/features/learning/StudyPage';
import { TutorialPage } from '@/features/learning/TutorialPage';
import { ParentsPage } from '@/features/parents/ParentsPage';
import { ProfilesPage } from '@/features/profiles/ProfilesPage';
import { WishingWellPage } from '@/features/well/WishingWellPage';
import { AchievementsPage } from '@/features/world/AchievementsPage';
import { ClassroomPage } from '@/features/world/ClassroomPage';
import { ClosetPage } from '@/features/world/ClosetPage';
import { HousePage } from '@/features/world/HousePage';
import { WorldPage } from '@/features/world/WorldPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<GuestOnly />}>
        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/perfiles" element={<ProfilesPage />} />
        <Route path="/padres" element={<ParentsPage />} />

        <Route element={<RequireChild />}>
          <Route path="/mundo" element={<WorldPage />} />
          <Route path="/casa" element={<HousePage />} />
          <Route path="/closet" element={<ClosetPage />} />
          <Route path="/salon" element={<ClassroomPage />} />
          <Route path="/estudio" element={<StudyPage />} />
          <Route path="/temas/:slug" element={<TutorialPage />} />
          <Route path="/actividades/:activityId" element={<ActivityPage />} />
          <Route path="/juegos" element={<GamesPage />} />
          <Route path="/juegos/:slug" element={<GamePlayPage />} />
          <Route path="/pozo" element={<WishingWellPage />} />
          <Route path="/logros" element={<AchievementsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <p className="text-7xl" aria-hidden>
          🧭
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-brand-700">Esta página no existe</h1>
        <Link to="/" className="mt-4 inline-block font-bold text-brand-700 underline">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
