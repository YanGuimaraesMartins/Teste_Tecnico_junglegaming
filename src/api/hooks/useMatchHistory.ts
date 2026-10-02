import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { GetHistoryResponse } from '../contracts';

export function useMatchHistory(playerId: string, page: number) {
  return useQuery<GetHistoryResponse>({
    queryKey: ['history', playerId, page],
    queryFn: async () => {
      const { data } = await apiClient.get<GetHistoryResponse>('/history', {
        params: { playerId, page, limit: 10 },
      });
      return data;
    },
    enabled: Boolean(playerId), // Only fetch if playerId is provided
  });
}
