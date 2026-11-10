// Config plugin: bundle the JS into debug builds too.
// Without this, a debug APK (what Android Studio's Run button installs) needs
// the Metro dev server on the computer, and on a phone on its own it never
// gets past the splash screen.
const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function withBundledDebugJs(config) {
  return withAppBuildGradle(config, (cfg) => {
    const marker = 'debuggableVariants = []';
    if (!cfg.modResults.contents.includes(marker)) {
      cfg.modResults.contents = cfg.modResults.contents.replace(
        /react \{\n/,
        `react {\n    // Bundle JS in every variant so the app starts without Metro.\n    ${marker}\n`,
      );
    }
    return cfg;
  });
};
