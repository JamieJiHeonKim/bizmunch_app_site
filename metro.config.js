const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  config.resolver.assetExts.push('png', 'jpg', 'jpeg');
  config.resolver.sourceExts.push('ts', 'tsx', 'js', 'jsx', 'json');
  config.resolver.blacklistRE = exclusionList([/platform_node/]);
  return config;
})();