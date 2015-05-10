'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var exec = require('child_process').exec;
var semver = require('semver');
var path = require('path');
var auto_updater = require('auto-updater');
var got = require('got');

var Update = (function () {
  function Update(gh, app, cb) {
    _classCallCheck(this, Update);

    this.repo = gh.repo;
    this.repoUrl = 'git@github.com:' + gh.repo + '.git';
    this.storage = app.getPath('userData');
    this.currentVersion = app.getVersion();

    cb(auto_updater);
  }

  _createClass(Update, [{
    key: '_getTags',

    /**
     * Get tags from this.repo
     */
    value: function _getTags(cb) {
      var self = this;

      // Clone repo
      exec('git clone ' + this.repoUrl, { cwd: this.storage }, function (err, stdout, stderr) {
        if (err) {
          cb(new Error('Failed to clone repo.'), null);
          return;
        }

        // Get latest tags
        exec('git tag', { cwd: path.join(self.storage, self.repo.split('/').pop()) }, function (err, stdout, stderr) {
          if (err) {
            cb(new Error('Unable to get version tags.'), null);
            return;
          }
          var tags = stdout.split('\n');
          tags.pop();
          cb(err, tags);
        });
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
      this._getTags(function (err, tags) {
        if (err) {
          cb(new Error(err), false);
          return;
        }

        if (!tags) {
          cb(null, false);
          return;
        }

        // Get the latest version
        var current = self._getCurrentVersion();

        // Get latest tag
        // @TODO: Sort the tags!
        var latest = tags.pop();
        if (!latest || !semver.valid(semver.clean(latest))) {
          cb(new Error('Could not find a valid release tag.'));
          return;
        }

        // 2. Compare with current version.
        if (semver.lte(latest, current)) {
          cb(null, false);
          return;
        }

        // There is a new version!

        // 3. Get feed url from gh release.
        var feedUrl = 'https://github.com/' + self.repo + '/releases/download/' + latest + '/auto_updater.json';

        // 4. Make sure feedUrl exists
        got.head(feedUrl, function (err, data, res) {
          if (err || res.statusCode !== 200) {
            cb(new Error('Could not get feed URL.'), false);
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