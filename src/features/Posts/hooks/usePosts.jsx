import { useQuery } from '@tanstack/react-query';
import { postEndpoints } from '../api/endpoints';

export const usePosts = (params) => {
  return useQuery(['posts', params], () => postEndpoints.getPosts(params), {
    keepPreviousData: true,
  });
};