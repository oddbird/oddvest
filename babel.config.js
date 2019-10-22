module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        corejs: '3',
        useBuiltIns: 'usage',
      },
    ],
  ],
  exclude: ['node_modules/**'],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: 'current' },
            corejs: '3',
            useBuiltIns: 'usage',
          },
        ],
        '@babel/preset-typescript',
      ],
    },
  },
};
