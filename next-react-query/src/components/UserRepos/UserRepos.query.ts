import { gql } from 'graphql-request';

export const USER_REPOS_QUERY = gql`
  query UserRepos(
    $username: String!
    $afterCursor: String
    $beforeCursor: String
    $orderBy: RepositoryOrder
  ) {
    user(login: $username) {
      repositories(
        first: 100
        after: $afterCursor
        before: $beforeCursor
        orderBy: $orderBy
        affiliations: [OWNER]
        ownerAffiliations: [OWNER]
      ) {
        nodes {
          id
          name
          description
          stargazerCount
          forkCount
          isArchived
          isFork
          primaryLanguage {
            id
            color
            name
          }
          isPrivate
          updatedAt
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;
