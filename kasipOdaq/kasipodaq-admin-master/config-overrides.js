const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');

module.exports = (config, env) => {
    if (env === 'production') {
        config.plugins = config.plugins.concat([
            new PrerenderSPAPlugin({
                routes: ['/',
                    '/agencies',
                    '/agency',
                    '/posts',
                    '/post',
                    '/buy_property',
                    '/jobs',
                    '/new_buildings',
                    '/property_map',
                    '/property',
                    '/questions',
                    '/search_property',
                    '/about',
                    '/license',
                    '/confirm',
                    '/subscription',
                    '/user_agreement',
                ],
                staticDir: path.join(__dirname, 'build'),
            }),
        ]);
    }

    return config;
};