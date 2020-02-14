import auth from '../src/auth';

describe('auth', () => {
  let t, btn;

  beforeAll(() => {
    t = {
      authorize: jest.fn(),
      closePopup: jest.fn(),
      get: jest.fn(),
      render: jest.fn().mockImplementation((cb) => {
        cb();
      }),
      set: jest.fn(),
      signUrl: jest.fn(),
      sizeTo: jest.fn(),
      storeSecret: jest.fn(),
    };

    window.TrelloPowerUp = {
      iframe: jest.fn().mockImplementation(() => t),
    };

    btn = document.createElement('button');
    btn.id = 'authorize';
    document.body.appendChild(btn);
  });

  afterAll(() => {
    delete window.TrelloPowerUp;
  });

  test('calls window.opener.authorize with token', async () => {
    auth();

    await btn.click();

    expect(t.closePopup).toHaveBeenCalled();
  });
});
