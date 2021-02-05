/** @type {import("snowpack").SnowpackUserConfig } */

const { version } = require('./package.json');
process.env.SNOWPACK_PUBLIC_APP_VERSION = version;

module.exports = {
    mount: {
        public: {url: '/', static: true},
        src: {url: '/dist'},
    },
    plugins: [
        '@snowpack/plugin-svelte',
        '@snowpack/plugin-dotenv',
        '@snowpack/plugin-typescript',
        '@snowpack/plugin-sass'
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {
  
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        baseUrl: './'
    }
    ,
};
