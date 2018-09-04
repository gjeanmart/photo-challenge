var replace = require('rollup-plugin-replace');
var isProd  = (process.env.IONIC_ENV === 'prod');
plugins: [
    replace({
      exclude: 'node_modules/**',
      // use the /config/environment-dev as the default import(!), no stub needed.
      // note we only replace the "last" part of the import statement so relative paths are maintained
      '/config/environment-dev' : ( isProd ? '/config/environment-prod' : '/config/environment-dev'),
    })
   ...
]
