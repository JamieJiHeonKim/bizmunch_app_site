const { getDefaultConfig } = require('expo/metro-config');
const blacklist = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'ttf'],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    blacklistRE: blacklist([/platform_node/]),
  },
};

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  config.resolver.assetExts.push('png', 'jpg', 'jpeg');
  return config;
})();
