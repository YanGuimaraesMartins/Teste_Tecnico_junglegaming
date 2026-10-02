import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { PostMatchBody, PostMatchResponse, PendingMatch } from '../contracts';

export function useSubmitMatch() {
  const queryClient = useQueryClient();

  return useMutation<PostMatchResponse, Error, PostMatchBody>({
    mutationFn: async (body) => {
      const { data } = await apiClient.post<PostMatchResponse>('/match', body);
      return data;
    },
    onSuccess: () => {
      // Invalidate ranking and history to refetch
      void queryClient.invalidateQueries({ queryKey: ['ranking'] });
      void queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (_error, variables) => {
      // Save to localStorage for pending retry
      try {
        const pendingStr = localStorage.getItem('pb_pending_matches');
        const pending: PendingMatch[] = pendingStr ? (JSON.parse(pendingStr) as PendingMatch[]) : [];
        
        // Deduplication by matchId
        if (!pending.some((p) => p.body.matchId === variables.matchId)) {
          pending.push({
            body: variables,
            createdAt: new Date().toISOString(),
            retryCount: 0,
          });
          localStorage.setItem('pb_pending_matches', JSON.stringify(pending));
        }
      } catch (e) {
        console.error('Failed to save pending match:', e);
      }
    },
  });
}
