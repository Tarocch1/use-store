module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  env: {
    test: {
      presets: ['@babel/preset-react'],
      plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
    },
  },
};
