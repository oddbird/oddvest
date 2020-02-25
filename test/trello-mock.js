export const t = {
  get: (scope, visibility, key) =>
    Promise.resolve(`${scope + visibility + key}TestValue`),
  set: jest.fn().mockResolvedValue(),
  loadSecret: (key) => Promise.resolve(`${key}TestSecret`),
  storeSecret: jest.fn().mockResolvedValue(),
  render: (cb) => cb(),
  authorize: jest.fn().mockResolvedValue('token'),
  popup: jest.fn(),
  closePopup: jest.fn(),
  signUrl: jest.fn().mockReturnValue('signed-url'),
  sizeTo: jest.fn(),
};

export const TrelloPowerUp = {
  initialize: jest.fn(),
  iframe: () => t,
};
