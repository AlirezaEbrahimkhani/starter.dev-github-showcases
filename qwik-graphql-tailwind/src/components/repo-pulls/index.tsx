import { isBrowser } from '@builder.io/qwik/build';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { $, component$, useClientEffect$, useTask$, useContext } from '@builder.io/qwik';

import { parseQuery } from './parseQuery';
import PullRequestData from './repo-pulls-data';
import { PullRequestOrderField, OrderDirection, ParsedPullRequestQuery, Label } from './types';

import { Pagination } from '../pagination/pagination';
import { PullRequestIssueTab } from '../pull-request-issue-tab/pull-request-issue-tab';
import { ClearFilterAndSortBtn } from '../clear-filter-and-sort-button';

import { useQuery } from '~/utils';
import { PULL_REQUEST_QUERY } from '~/utils/queries/pull-request';
import PullRequestContext, { PullRequestContextProps } from '~/context/pull-request-store';
import { AUTH_TOKEN, GITHUB_GRAPHQL, DEFAULT_PAGE_SIZE } from '~/utils/constants';
import DropdownContext from '~/context/issue-tab-header-dropdown';
import { sortOptions } from './data';

export interface PullRequestsProps {
  owner: string;
  name: string;
}

interface PullRequestsQueryParams {
  owner: string;
  name: string;
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  labels?: string[];
  orderBy: string;
  direction: string;
}

export default component$(({ owner, name }: PullRequestsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pullRequestStore = useContext(PullRequestContext);
  const dropdownStore = useContext(DropdownContext);

  const afterCursor = typeof location.query.after === 'string' ? location.query.after : undefined;
  const beforeCursor = typeof location.query.before === 'string' ? location.query.before : undefined;

  const hasActiveFilter = dropdownStore.selectedLabel || dropdownStore.selectedSort !== sortOptions[0].value;

  const resetFilters$ = $(() => {
    dropdownStore.selectedLabel = undefined;
    dropdownStore.selectedSort = sortOptions[0].value;
    navigate.path = `${location.pathname}?tab=${pullRequestStore.activeTab}`;
  });

  useClientEffect$(async () => {
    pullRequestStore.loading = true;
    const abortController = new AbortController();
    const response = await fetchRepoPullRequests(
      {
        owner,
        name,
        first: afterCursor || !beforeCursor ? DEFAULT_PAGE_SIZE : undefined,
        last: beforeCursor ? DEFAULT_PAGE_SIZE : undefined,
        labels: dropdownStore.selectedLabel ? [dropdownStore.selectedLabel] : undefined,
        orderBy: PullRequestOrderField.CreatedAt,
        direction: OrderDirection.Desc,
        after: afterCursor,
        before: beforeCursor,
      },
      abortController
    );

    updatePullRequestState(pullRequestStore, parseQuery(response));
  });

  useTask$(async ({ track }) => {
    const abortController = new AbortController();
    const after = track(() => location.query.after);
    const before = track(() => location.query.before);
    track(() => pullRequestStore.activeTab);
    track(() => dropdownStore.selectedSort);
    track(() => dropdownStore.selectedLabel);

    // fetchRepoPullRequests needs auth token.
    // Because we store auth token in sessionStorage we need to be sure that the storage is defined.
    // We ask to the useTask to do the following operation only in browser,
    // where we are sure that sessionStorage is not undefined.
    if (isBrowser) {
      const response = await fetchRepoPullRequests(
        {
          owner,
          name,
          after,
          before,
          first: location.query.after || !location.query.before ? DEFAULT_PAGE_SIZE : undefined,
          last: location.query.before ? DEFAULT_PAGE_SIZE : undefined,
          labels: dropdownStore.selectedLabel ? [dropdownStore.selectedLabel] : undefined,
          orderBy: dropdownStore.selectedSort.split('^')[0],
          direction: dropdownStore.selectedSort.split('^')[1],
        },
        abortController
      );
      updatePullRequestState(pullRequestStore, parseQuery(response));
    }
  });

  return (
    <>
      {hasActiveFilter && (
        <div class="mb-2 pl-2">
          <ClearFilterAndSortBtn clearFn={resetFilters$} />
        </div>
      )}
      <div class="border border-gray-300 rounded-lg">
        <PullRequestIssueTab
          tabType="pr"
          sortOption={sortOptions}
          labelOption={pullRequestStore.pullRequestLabels}
          openCount={pullRequestStore.openPullRequestCount}
          closedCount={pullRequestStore.closedPullRequestCount}
        />
        {pullRequestStore.loading ? (
          <div class="animate-pulse p-3 flex flex-col gap-2">
            <div class="w-full h-4 rounded-md bg-gray-200"></div>
            <div class="w-full h-4 rounded-md bg-gray-200"></div>
            <div class="w-full h-4 rounded-md bg-gray-200"></div>
          </div>
        ) : (
          <PullRequestData
            loading={pullRequestStore.loading}
            pull_request={
              pullRequestStore.activeTab === 'open'
                ? pullRequestStore.openPullRequest
                : pullRequestStore.closedPullRequest
            }
          />
        )}
      </div>
      {(pullRequestStore.openPageInfo?.hasNextPage ||
        pullRequestStore.openPageInfo?.hasPreviousPage ||
        pullRequestStore.closedPageInfo?.hasNextPage ||
        pullRequestStore.closedPageInfo?.hasPreviousPage) && (
        <Pagination
          tab={pullRequestStore.activeTab}
          pageInfo={
            pullRequestStore.activeTab === 'open' ? pullRequestStore.openPageInfo : pullRequestStore.closedPageInfo
          }
          owner={`${owner}/${name}/pulls`}
        />
      )}
    </>
  );
});

export function updatePullRequestState(store: PullRequestContextProps, response: ParsedPullRequestQuery) {
  const { closedPullRequests, openPullRequests, labels } = response;
  store.closedPullRequest = closedPullRequests.pullRequests;
  store.openPullRequest = openPullRequests.pullRequests;
  store.closedPullRequestCount = closedPullRequests.totalCount;
  store.openPullRequestCount = openPullRequests.totalCount;
  store.pullRequestLabels = labels.map((lab: Label) => ({ label: lab.name, value: lab.name }));
  store.openPageInfo = openPullRequests.pageInfo;
  store.closedPageInfo = closedPullRequests.pageInfo;
  store.loading = false;
}

export async function fetchRepoPullRequests(
  { owner, name, first, last, after, before, labels, orderBy, direction }: PullRequestsQueryParams,
  abortController?: AbortController
): Promise<any> {
  const { executeQuery$ } = useQuery(PULL_REQUEST_QUERY);
  const resp = await executeQuery$({
    signal: abortController?.signal,
    url: GITHUB_GRAPHQL,
    variables: {
      owner,
      name,
      first,
      last,
      labels,
      orderBy,
      direction,
      after,
      before,
    },
    headersOpt: {
      Accept: 'application/vnd.github+json',
      authorization: `Bearer ${sessionStorage.getItem(AUTH_TOKEN)}`,
    },
  });

  return await resp.json();
}
