import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type {
  Activity,
  ActivityProgress,
  AttemptResult,
  Avatar,
  Child,
  ChildInput,
  ChildSummary,
  Game,
  StarTransaction,
  LumiQuestion,
  LumiStatus,
  OwnedItem,
  ShopItem,
  Topic,
  TopicDetail,
} from './types';

// Claves de caché centralizadas para invalidar de forma consistente.
export const queryKeys = {
  me: ['me'] as const,
  avatars: ['avatars'] as const,
  children: ['children'] as const,
  child: (id: string) => ['children', id] as const,
  stars: (id: string) => ['children', id, 'stars'] as const,
  progress: (id: string) => ['children', id, 'progress'] as const,
  items: (id: string) => ['children', id, 'items'] as const,
  lumi: (id: string) => ['children', id, 'lumi'] as const,
  lumiQuestions: (id: string) => ['children', id, 'lumi', 'questions'] as const,
  summary: (id: string) => ['children', id, 'summary'] as const,
  topics: ['topics'] as const,
  topic: (slug: string) => ['topics', slug] as const,
  activity: (id: number) => ['activities', id] as const,
  games: ['games'] as const,
  shopItems: ['shop-items'] as const,
};

// ─── Catálogos (cambian poco: se cachean más tiempo) ─────────────────────────

const CATALOG_STALE_TIME = 10 * 60 * 1000;

export const useAvatars = () =>
  useQuery({
    queryKey: queryKeys.avatars,
    queryFn: () => api<Avatar[]>('/avatars'),
    staleTime: CATALOG_STALE_TIME,
  });

export const useTopics = () =>
  useQuery({
    queryKey: queryKeys.topics,
    queryFn: () => api<Topic[]>('/topics'),
    staleTime: CATALOG_STALE_TIME,
  });

export const useTopic = (slug: string) =>
  useQuery({
    queryKey: queryKeys.topic(slug),
    queryFn: () => api<TopicDetail>(`/topics/${encodeURIComponent(slug)}`),
    staleTime: CATALOG_STALE_TIME,
  });

export const useActivity = (id: number) =>
  useQuery({
    queryKey: queryKeys.activity(id),
    queryFn: () => api<Activity>(`/activities/${id}`),
    staleTime: CATALOG_STALE_TIME,
  });

export const useGames = () =>
  useQuery({
    queryKey: queryKeys.games,
    queryFn: () => api<Game[]>('/games'),
    staleTime: CATALOG_STALE_TIME,
  });

// ─── Perfiles ────────────────────────────────────────────────────────────────

export const useChildren = () =>
  useQuery({ queryKey: queryKeys.children, queryFn: () => api<Child[]>('/children') });

export const useChild = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.child(id ?? ''),
    queryFn: () => api<Child>(`/children/${id}`),
    enabled: id !== null,
  });

export function useCreateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChildInput) => api<Child>('/children', { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.children }),
  });
}

export function useUpdateChild(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<ChildInput>) =>
      api<Child>(`/children/${id}`, { method: 'PATCH', body: input }),
    onSuccess: (child) => {
      queryClient.setQueryData(queryKeys.child(id), child);
      return queryClient.invalidateQueries({ queryKey: queryKeys.children, exact: true });
    },
  });
}

export function useDeleteChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(`/children/${id}`, { method: 'DELETE', parent: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.children }),
  });
}

export const useStars = (childId: string) =>
  useQuery({
    queryKey: queryKeys.stars(childId),
    queryFn: () =>
      api<{ balance: number; history: StarTransaction[] }>(`/children/${childId}/stars`),
  });

export const useChildSummary = (childId: string, enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.summary(childId),
    queryFn: () => api<ChildSummary>(`/children/${childId}/summary`, { parent: true }),
    enabled,
  });

// ─── Aprendizaje y juegos ────────────────────────────────────────────────────

export const useProgress = (childId: string) =>
  useQuery({
    queryKey: queryKeys.progress(childId),
    queryFn: () => api<ActivityProgress[]>(`/children/${childId}/progress`),
  });

/** Tras ganar o gastar estrellas, todo lo que depende del perfil queda desactualizado. */
function useInvalidateChild(childId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.child(childId) });
}

export function useSubmitAttempt(childId: string, activityId: number) {
  const invalidate = useInvalidateChild(childId);
  return useMutation({
    mutationFn: (answers: number[]) =>
      api<AttemptResult>(`/children/${childId}/activities/${activityId}/attempts`, {
        method: 'POST',
        body: { answers },
      }),
    onSuccess: invalidate,
  });
}

export function useRecordGameSession(childId: string, slug: string) {
  const invalidate = useInvalidateChild(childId);
  return useMutation({
    mutationFn: (input: { score: number; durationSec: number }) =>
      api<{ sessionId: string; starsEarned: number }>(
        `/children/${childId}/games/${slug}/sessions`,
        { method: 'POST', body: input },
      ),
    onSuccess: invalidate,
  });
}

// ─── Pozo de los deseos: tienda ──────────────────────────────────────────────

export const useShopItems = () =>
  useQuery({
    queryKey: queryKeys.shopItems,
    queryFn: () => api<ShopItem[]>('/shop/items'),
    staleTime: CATALOG_STALE_TIME,
  });

export const useOwnedItems = (childId: string) =>
  useQuery({
    queryKey: queryKeys.items(childId),
    queryFn: () => api<OwnedItem[]>(`/children/${childId}/items`),
  });

export function usePurchaseItem(childId: string) {
  const invalidate = useInvalidateChild(childId);
  return useMutation({
    mutationFn: (itemId: number) =>
      api<OwnedItem>(`/children/${childId}/items/${itemId}/purchase`, { method: 'POST' }),
    onSuccess: invalidate,
  });
}

export function useEquipItem(childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, equipped }: OwnedItem) =>
      api<OwnedItem>(`/children/${childId}/items/${itemId}`, {
        method: 'PATCH',
        body: { equipped },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.items(childId) }),
  });
}

// ─── Pozo de los deseos: preguntas a Lumi ────────────────────────────────────

export const useLumiStatus = (childId: string) =>
  useQuery({
    queryKey: queryKeys.lumi(childId),
    queryFn: () => api<LumiStatus>(`/children/${childId}/lumi`),
  });

export const useLumiQuestions = (childId: string) =>
  useQuery({
    queryKey: queryKeys.lumiQuestions(childId),
    queryFn: () => api<LumiQuestion[]>(`/children/${childId}/lumi/questions`),
  });

export function useAskLumi(childId: string) {
  const invalidate = useInvalidateChild(childId);
  return useMutation({
    mutationFn: (question: string) =>
      api<LumiQuestion>(`/children/${childId}/lumi/questions`, {
        method: 'POST',
        body: { question },
      }),
    // Invalida estrellas, estado (preguntas restantes) e historial a la vez.
    onSettled: invalidate,
  });
}

export function useChildSettings(childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: { aiEnabled: boolean }) =>
      api<Child>(`/children/${childId}/settings`, {
        method: 'PATCH',
        body: settings,
        parent: true,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.children }),
  });
}
