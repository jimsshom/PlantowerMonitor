const options = {
    dir: './',
    aftappCopyright: 'jimsshom@gmail.com',
    appVersion: '0.0.1',
    arch: 'x64',
    asar: false,
    icon: './icon.icns',
    name: 'Plantower Client',
    out: '../out',
    platform: 'darwin',
    appBundleId: 'PlantowerClient',
    appCategoryType: 'public.app-category.utilities',
    overwrite: true
}

const packager = require('electron-packager')
const appPaths = packager(options)
console.log(appPaths)