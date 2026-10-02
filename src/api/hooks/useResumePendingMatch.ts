import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { PendingMatch, PostMatchResponse } from '../contracts';

export function useResumePendingMatch() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const resumePending = async () => {
      try {
        const pendingStr = localStorage.getItem('pb_pending_matches');
        if (!pendingStr) return;

        const pending: PendingMatch[] = JSON.parse(pendingStr) as PendingMatch[];
        if (pending.length === 0) return;

        const remaining: PendingMatch[] = [];
        let anySuccess = false;

        for (const match of pending) {
          try {
            await apiClient.post<PostMatchResponse>('/match', match.body);
            anySuccess = true;
          } catch {
            // If it failed again, increment retryCount and keep it if less than max retries
            match.retryCount = (match.retryCount || 0) + 1;
            if (match.retryCount < 5) {
              remaining.push(match);
            }
          }
        }

        if (remaining.length > 0) {
          localStorage.setItem('pb_pending_matches', JSON.stringify(remaining));
        } else {
          localStorage.removeItem('pb_pending_matches');
        }

        if (anySuccess) {
          void queryClient.invalidateQueries({ queryKey: ['ranking'] });
          void queryClient.invalidateQueries({ queryKey: ['history'] });
        }
      } catch (e) {
        console.error('Failed to resume pending matches:', e);
      }
    };

    void resumePending();
  }, [queryClient]);
}
