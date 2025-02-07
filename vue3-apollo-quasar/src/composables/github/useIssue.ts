import { useQuery, useResult } from '@vue/apollo-composable';
import { Ref } from 'vue';
import { ISSUES_QUERY } from './queries';
import { Issues } from './types';

interface UseIssue {
  getIssues: (
    owner: string,
    name: string,
  ) => {
    data: Ref<Issues | null>;
    loading: Ref<boolean>;
  };
}

export const useIssue = (): UseIssue => {
  const getIssues = (owner: string, name: string) => {
    const { result, loading } = useQuery(ISSUES_QUERY, {
      owner,
      name,
      first: 10,
    });

    const data = useResult(result, [], ({ repository }) => ({
      ...repository,
    }));

    return { data: data as Ref<Issues | null>, loading };
  };

  return { getIssues };
};
