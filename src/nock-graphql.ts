import nock, { Scope } from 'nock';
import { MockConfig } from 'src/types';
import { getRequest } from 'src/helpers';

export default class NockGraphQL {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  mock(config: MockConfig): Scope {
    const { document, variables, data, error } = config;

    const request = getRequest(document, variables);

    if (error) {
      return nock(this.url).post('', request).replyWithError(error);
    }

    if (data) {
      return nock(this.url).post('', request).reply(200, { data });
    }

    return nock(this.url).post('', request).reply(200);
  }

  mockAll(configs: MockConfig[]): Scope {
    const scope = nock(this.url);

    configs.forEach((config) => {
      const { document, variables, data, error } = config;
      const request = getRequest(document, variables);

      if (error) {
        scope.post('', request).replyWithError(error);
      }

      if (data) {
        scope.post('', request).reply(200, { data });
        return;
      }

      scope.post('', request).reply(200);
    });

    return scope;
  }

  /**
   * Cleanup method. Preferable to call it afterEach or afterAll.
   */
  cleanup(): void {
    // Clean all the mocks
    nock.cleanAll();
    // Enable real HTTP requests (in case it was disabled via nock.disableNetConnect())
    nock.enableNetConnect();
    // restore the HTTP interceptor to the normal unmocked behaviour.
    nock.restore();
  }
}
