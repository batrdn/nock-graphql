import NockGraphQL from 'src/nock-graphql';
import { ApolloClient, gql, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { MockConfig } from 'src/index';

type QueryVariables = {
  id: string;
};

type QueryResult = {
  foo: { bar: string };
};

const GetQuery = gql`
  query Test($id: String) {
    foo(id: $id) {
      bar
    }
  }
`;

describe('NockGraphQL', () => {
  const ENDPOINT = 'http://localhost:4000/graphql';
  const nockgql = new NockGraphQL(ENDPOINT);

  let client: ApolloClient<NormalizedCacheObject>;

  beforeEach(() => {
    client = new ApolloClient({
      link: new HttpLink({ uri: ENDPOINT }),
      cache: new InMemoryCache({ addTypename: false }),
    });
  });

  afterEach(() => {
    nockgql.cleanup();
  });

  test('should match the query', async () => {
    const config: MockConfig<QueryVariables, QueryResult> = {
      document: GetQuery,
      variables: { id: '1' },
      data: {
        foo: {
          bar: 'Hello, World',
        },
      },
    };

    const scope = nockgql.mock(config);
    await client.query({ query: GetQuery, variables: { id: '1' } });

    scope.done();
  });

  test('should throw an error', async () => {
    const config: MockConfig<QueryVariables, QueryResult> = {
      document: GetQuery,
      variables: { id: '1' },
      error: new Error('Failed'),
    };

    nockgql.mock(config);
    await client.query({ query: GetQuery, variables: { id: '1' } }).catch((err) => {
      expect(err).not.toBeNull();
    });
  });
});
