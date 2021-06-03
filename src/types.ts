import { DocumentNode } from 'graphql';

/**
 * Example usage:
 *
 *  interface GetQueryVariable {}
 *  interface GetQueryResult {}
 *
 *  const mock: MockConfig<GetQueryVariable, GetQueryResult> = {}
 */
export type MockConfig<TVariables = Record<string, any>, TData = Record<string, any>> = {
  /**
   * DocumentNode object to mock.
   *
   * DocumentNode object is the standard Graphql AST parsed from query string via gql template literal tag.
   * For example:
   *  const query = gql`
   *    query Test {
   *      foo {
   *        bar
   *      }
   *    }
   *  `
   */
  document: DocumentNode;

  /**
   * The variables to match from the provided type
   */
  variables: TVariables;

  /**
   * The response data to return from the mock.
   */
  data?: TData;

  /**
   * Optional flag indicating whether to persist this mock.
   * If set to true, then this mock will always be called.
   *
   * @default: false
   */
  persist?: boolean;

  /**
   * Error to return
   */
  error?: Error;
};

export type GraphQLRequest = {
  operationName: string;
  variables: Record<string, any>;
  query: string;
};
