import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { GetRankingResponse } from '../contracts';

export function useRanking(page: number, configHash?: string) {
  return useQuery<GetRankingResponse>({
    queryKey: ['ranking', page, configHash],
    queryFn: async () => {
      const { data } = await apiClient.get<GetRankingResponse>('/ranking', {
        params: { page, limit: 10, config: configHash },
      });
      return data;
    },
  });
}
