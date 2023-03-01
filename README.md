# haha
# nock-graphql

A nock-based GraphQL testing library that provides a functionality to mock queries and mutations.
In contrast to Apollo's MockedProvider, nock allows a realistic testing with the actual `http` calls being made from your client code.

## Installing

You\'ll need `nock`, `node-fetch` as peer dependencies in order to use this library.

```
yarn add -D nock-graphql nock node-fetch
```

or

```
npm install -D nock-graphql nock node-fetch
```

Additionally, you need to set up global `fetch` implementation incorporated in your `jest` environment:

```
global.fetch = require('node-fetch')
```

This could be in your `jest.globals.ts` file.

## Usage

I. Create `nock-graphql` instance

A. You could create it globally:

```typescript
// Create the instance in a separate file and export it.
import { NockGraphQL } from 'nock-graphql';

export const nockgql = new NockGraphQL('http://localhost:4000/graphql');
```

B. Create directly in the test files:

```typescript
import { NockGraphQL } from 'nock-graphql';

let nockgql: NockGraphQL;

beforeAll(() => {
  nockgql = new NockGraphQL('http://localhost:4000/graphql');
});
```

II. Mocking queries

```typescript
import { gql } from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { MockConfig } from 'nock-graphql';

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

beforeEach(() => {
  client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
    cache: new InMemoryCache({ addTypename: false }),
  });
});

afterEach(() => {
  nockgql.cleanup();
});

test('should match  the query', async () => {
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
```
