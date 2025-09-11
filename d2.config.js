/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    id: 'd685d128-3b31-4a21-adbf-bd1487c3004c',
    type: 'app',
    name: 'data-administration',
    title: 'Data Administration',
    coreApp: true,
    minDHIS2Version: '2.41',
    entryPoints: {
        app: './src/App.jsx',
    },
    shortcuts: [
        {
            name: 'Data and metadata integrity',
            url: '#/data-integrity',
        },
        {
            name: 'Data and metadata maintenance',
            url: '#/maintenance',
        },
        {
            name: 'Resource tables',
            url: '#/resourceTables',
        },
        {
            name: 'Analytics tables',
            url: '#/analytics',
        },
        {
            name: 'Data statistics',
            url: '#/data-statistics',
        },
        {
            name: 'Lock exception',
            url: '#/lock-exceptions',
        },
        {
            name: 'Min/Max value generation',
            url: '#/min-max-value-generation',
        },
    ],
}

module.exports = config
