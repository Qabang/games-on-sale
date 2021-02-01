module.exports = {
  pwa: {
    manifestOptions: {
      background_color: '#04151f',
    },
    name: 'Games on sale',
    themeColor: '#183a37',
    workboxOptions: {
      runtimeCaching: [
        {
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 5,
          },
          urlPattern: 'https://www.cheapshark.com/api/1.0/deals',
        },
      ],
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
  },
}
