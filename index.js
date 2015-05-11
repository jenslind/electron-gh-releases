'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var semver = require('semver');
var auto_updater = require('auto-updater');
var got = require('got');

var Update = (function () {
  function Update(gh, cb) {
    _classCallCheck(this, Update);

    this.repo = gh.repo;
    this.repoUrl = 'https://github.com/' + gh.repo;
    this.currentVersion = gh.currentVersion;

    cb(auto_updater);
  }

  _createClass(Update, [{
    key: '_getLatestTag',

    /**
     * Get tags from this.repo
     */
    value: function _getLatestTag(cb) {
      var url = this.repoUrl + '/releases/latest';
      got.head(url, function (err, data, res) {
        if (err) {
          cb('Unable to get latest release tag from Github.', null);
          return;
        }

        var latestTag = res.req.path.split('/').pop();
        cb(err, latestTag);
      });
    }
  }, {
    key: '_getCurrentVersion',

    /**
     * Get current version from app.
     */
    value: function _getCurrentVersion() {
      return this.currentVersion;
    }
  }, {
    key: 'check',

    /**
     * Check for updates.
     */
    value: function check(cb) {
      var self = this;
      // 1. Get latest released version from Github.
      this._getLatestTag(function (err, tag) {
        if (err) {
          cb(new Error(err), false);
          return;
        }

        if (!tag) {
          cb(null, false);
          return;
        }

        // Get the latest version
        var current = self._getCurrentVersion();

        // Check if tag is valid semver
        var latest = tag;
        if (!latest || !semver.valid(semver.clean(latest))) {
          cb(new Error('Could not find a valid release tag.'), false);
          return;
        }

        // 2. Compare with current version.
        if (semver.lte(latest, current)) {
          cb(null, false);
          return;
        }

        // There is a new version!

        // 3. Get feed url from gh repo.
        var feedUrl = 'https://raw.githubusercontent.com/' + self.repo + '/master/auto_updater.json';

        // 4. Make sure feedUrl exists
        got.get(feedUrl, function (err, data, res) {
          if (err || res.statusCode !== 200) {
            cb(new Error('Could not get feed URL.'), false);
            return;
          }

          // Make sure the feedUrl links to latest tag
          var zipUrl = JSON.parse(data).url;
          if (zipUrl.split('/').slice(-2, -1)[0] !== latest) {
            cb(new Error('Url from auto_updater.json does not linking to latest release.'), false);
            return;
          }

          // 5. Set feedUrl in auto_updater.
          auto_updater.setFeedUrl(feedUrl);

          cb(null, true);
        });
      });
    }
  }, {
    key: 'download',

    /**
     * Download latest release.
     */
    value: function download() {
      // Run auto_updater
      // Lets do this. :o
      auto_updater.checkForUpdates();
    }
  }]);

  return Update;
})();

exports['default'] = Update;
module.exports = exports['default'];