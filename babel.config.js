// geminie/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'], // Root of your project (geminie/)
          alias: {
            '@': './', // Maps '@/' to the root geminie/ directory
          },
          extensions: [ // Make sure all relevant extensions are here
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
            '.ts',
            '.tsx',
          ],
        },
      ],
      'react-native-reanimated/plugin', // Ensure this is last if you use it
    ],
  };
};