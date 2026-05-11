/**
 * @jest-environment jsdom
 * @jest-environment-options { "url": "https://example.com/?access_token=test_token" }
 */
import authSuccess from '../src/auth_success';

describe('auth_success', () => {
  beforeAll(() => {
    window.opener = {
      authorize: jest.fn(),
    };
    window.close = jest.fn();
  });

  test('calls window.opener.authorize with token', () => {
    authSuccess();

    expect(window.opener.authorize).toHaveBeenCalledWith('test_token');
  });
});
