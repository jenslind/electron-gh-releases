'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var semver = require('semver');
var autoUpdater = require('electron').autoUpdater;
var got = require('got');
var events = require('events');

var WIN32 = process.platform === 'win32';
var DARWIN = process.platform === 'darwin';
var REGEX_ZIP_URL = /\/v(\d+\.\d+\.\d+)\/.*\.zip/;

var GhReleases = (function (_events$EventEmitter) {
  _inherits(GhReleases, _events$EventEmitter);

  function GhReleases(gh) {
    _classCallCheck(this, GhReleases);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(GhReleases).call(this));

    var self = _this3;

    self.repo = gh.repo;
    self.repoUrl = 'https://github.com/' + gh.repo;
    self.currentVersion = gh.currentVersion;
    self.autoUpdater = autoUpdater;

    self.autoUpdater.on('update-downloaded', function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return self.emit('update-downloaded', args);
    });
    return _this3;
  }

  /**
   * Get tags from this.repo
   */

  _createClass(GhReleases, [{
    key: '_getLatestTag',
    value: function _getLatestTag() {
      var url = this.repoUrl + '/releases/latest';
      return got.head(url).then(function (res) {
        var latestTag = res.socket._httpMessage.path.split('/').pop();
        return latestTag;
      }).catch(function (err) {
        if (err) throw new Error('Unable to get latest release tag from Github.');
      });
    }

    /**
     * Get current version from app.
     */

  }, {
    key: '_getCurrentVersion',
    value: function _getCurrentVersion() {
      return this.currentVersion;
    }

    /**
     * Compare current with the latest version.
     */

  }, {
    key: '_newVersion',
    value: function _newVersion(latest) {
      return semver.lt(this._getCurrentVersion(), latest);
    }

    /**
     * Get the feed URL from this.repo
     */

  }, {
    key: '_getFeedUrl',
    value: function _getFeedUrl(tag) {
      var _this = this;

      var feedUrl = undefined;

      // If on Windows
      if (WIN32) {
        return new Promise(function (resolve, reject) {
          feedUrl = _this.repoUrl + '/releases/download/' + tag;
          resolve(feedUrl);
        });
      }

      // On Mac we need to use the `auto_updater.json`
      feedUrl = 'https://raw.githubusercontent.com/' + this.repo + '/master/auto_updater.json';

      // Make sure feedUrl exists
      return got.get(feedUrl).then(function (res) {
        if (res.statusCode === 404) {
          throw new Error('auto_updater.json does not exist.');
        } else if (res.statusCode !== 200) {
          throw new Error('Unable to fetch auto_updater.json: ' + res.body);
        }

        var zipUrl = undefined;
        try {
          zipUrl = JSON.parse(res.body).url;
        } catch (err) {
          throw new Error('Unable to parse the auto_updater.json: ' + err.message + ', body: ' + res.body);
        }

        var matchReleaseUrl = zipUrl.match(REGEX_ZIP_URL);
        if (!matchReleaseUrl) {
          throw new Error('The zipUrl (' + zipUrl + ') is a invalid release URL');
        }

        var versionInZipUrl = matchReleaseUrl[1];
        var latestVersion = semver.clean(tag);
        if (versionInZipUrl !== latestVersion) {
          throw new Error('The feedUrl does not link to latest tag (zipUrl=' + versionInZipUrl + '; latestVersion=' + latestVersion + ')');
        }

        return feedUrl;
      });
    }

    /**
     * Check for updates.
     */

  }, {
    key: 'check',
    value: function check(cb) {
      var _this2 = this;

      if (!DARWIN && !WIN32) return cb(new Error('This platform is not supported.'), false);

      var self = this;

      // Get latest released version from Github.
      this._getLatestTag().then(function (tag) {
        // Check if tag is valid semver
        if (!tag || !semver.valid(semver.clean(tag))) {
          throw new Error('Could not find a valid release tag.');
        }

        // Compare with current version.
        if (!self._newVersion(tag)) {
          throw new Error('There is no newer version.');
        }

        // There is a new version!
        // Get feed url from gh repo.
        return self._getFeedUrl(tag);
      }).then(function (feedUrl) {
        // Set feedUrl in auto_updater.
        _this2.autoUpdater.setFeedURL(feedUrl);

        cb(null, true);
      }).catch(function (err) {
        cb(err || null, false);
      });
    }

    /**
     * Download latest release.
     */

  }, {
    key: 'download',
    value: function download() {
      // Run auto_updater
      // Lets do this. :o
      this.autoUpdater.checkForUpdates();
    }

    /**
     * Install the downloaded update
     */

  }, {
    key: 'install',
    value: function install() {
      // Run autoUpdaters quitAndInstall()
      // This will restart the app and install the new update.
      this.autoUpdater.quitAndInstall();
    }
  }]);

  return GhReleases;
})(events.EventEmitter);

exports.default = GhReleases;
module.exports = exports['default'];