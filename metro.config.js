const { getDefaultConfig } = require('expo/metro-config');
const blacklist = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  config.resolver.assetExts = ['bin', 'txt', 'jpg', 'png', 'ttf', 'jpeg'];
  config.resolver.sourceExts = ['js', 'json', 'ts', 'tsx', 'jsx'];
  config.resolver.blacklistRE = blacklist([/platform_node/]);
  return config;
})();
