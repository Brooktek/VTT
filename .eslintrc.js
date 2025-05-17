module.exports = {

    settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] 
      },

    }
  },
  rules: {

    'import/no-unresolved': ['error', { commonjs: true, amd: true, ignore: ['^@/'] }], 
    'import/extensions': ['error', 'ignorePackages', { 
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
  }
};