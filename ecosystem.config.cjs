module.exports = {
    apps: [
        {
            name: 'Faser',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            port: 3100,
        },
    ],
}
