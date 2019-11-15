export default {
  get: (scope, visibility, key) => `${scope + visibility + key}TestValue`,
  loadSecret: (key) => `${key}TestSecret`,
};
