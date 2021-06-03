import { DocumentNode, OperationDefinitionNode, print } from 'graphql';
import { GraphQLRequest } from 'src/types';

export const getRequest = (doc: DocumentNode, variables: Record<string, any>): GraphQLRequest => {
  const operationName = getOperationName(doc);
  return {
    operationName,
    variables,
    query: print(doc),
  };
};

export const getOperationName = (doc: DocumentNode): string => {
  const definition = doc.definitions.find(({ kind }) => kind === 'OperationDefinition');

  let operationName;

  if (definition) {
    operationName = (definition as OperationDefinitionNode).name?.value;
  }

  if (!operationName) {
    throw new Error('Failed to find query name');
  }

  return operationName;
};
