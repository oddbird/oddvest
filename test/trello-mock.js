export default {
  get: (scope, visibility, key) => `${scope + visibility + key}TestValue`,
  loadSecret: (key) => `${key}TestSecret`,
  set: jest.fn(),
  storeSecret: jest.fn(),
};
