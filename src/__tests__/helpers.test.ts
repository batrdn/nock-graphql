import { getOperationName } from 'src/helpers';
import gql from 'graphql-tag';

describe('Helpers', () => {
  test('should get operation name', () => {
    const document = gql`
      query Test {
        foo {
          bar
        }
      }
    `;

    const operationName = getOperationName(document);
    expect(operationName).toBe('Test');
  });
});
