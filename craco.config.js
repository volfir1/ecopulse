const path = require('path');

module.exports = {
    webpack: {
      alias: {
        '@assets': 'src/assets',
        '@shared': 'src/shared',
        '@features': 'src/features',
        '@components': 'src/components',
        '@utils': 'src/utils'
      }
    }
  };