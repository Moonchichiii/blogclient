import { useInfiniteQuery } from '@tanstack/react-query';
import { postEndpoints } from '../../../api/endpoints';

export const usePosts = (params) => {
  return useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: ({ pageParam = 1 }) => postEndpoints.getPosts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    keepPreviousData: true,
  });
};