describe('auth_success', () => {
  const { location } = window;

  beforeAll(() => {
    window.opener = {
      authorize: jest.fn(),
    };
    window.close = jest.fn();
    delete window.location;
    window.location = {
      search: '?access_token=test_token',
    };
  });

  afterAll(() => {
    window.location = location;
  });

  test('calls window.opener.authorize with token', () => {
    require('../src/auth_success');

    expect(window.opener.authorize).toHaveBeenCalledWith('test_token');
  });
});
