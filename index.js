'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var exec = require('child_process').exec;
var semver = require('semver');
var jf = require('jsonfile');
var path = require('path');
var os = require('os');
var auto_updater = require('auto-updater');

var Update = (function () {
  function Update(gh, cb) {
    _classCallCheck(this, Update);

    this.repo = gh.repo;
    this.storage = gh.storage;
    this.currentVersion = gh.current;

    cb(auto_updater);
  }

  _createClass(Update, [{
    key: '_getTags',

    /**
     * Get tags from this.repo
     */
    value: function _getTags(cb) {
      // Clone repo
      exec('git clone ' + this.repo, { cwd: this.storage }, function (err, stdout, stderr) {
        if (err) throw new Error('Failed to clone repo.');

        // Get latest tags
        exec('git tag', { cwd: path.join(this.storage, this.repo.split(':').pop().slice(0, -4).split('/').pop()) }, function (err, stdout, stderr) {
          var tags = stdout.split('\n');
          tags.pop();
          cb(tags);
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
    value: function check() {
      // 1. Get latest released version from Github.
      _getTags(function (tags) {
        // Get the latest version
        var current = _getCurrentVersion;

        // Get latest tag
        // @TODO: Sort the tags!
        var latest = tags.pop();
        if (!semver.valid(semver.clean(latest))) throw new Error('Could not find a valid release tag.');

        // 2. Compare with current version.
        if (semver.lt(latest, current)) return null;

        // There is a new version!

        // 3. Get .zip URL from Github release.
        var repo_name = this.repo.split(':').pop().slice(0, -4);
        var platform = os.platform();
        var arch = os.arch();
        var filename = repo_name.split('/').pop() + '-' + latest + '-' + platform + '-' + arch + '.zip';
        var zipUrl = 'https://github.com/' + repo_name + '/releases/download/' + latest + '/' + filename;

        // 4. Create local json file with .zip URL.
        var localFile = path.join(this.storage, 'gh_updates.json');
        var localFileObj = { url: zipUrl };
        jf.writeFile(localFile, localFileObj, function (err) {
          if (err) throw new Error('Unable to save local update file.');
        });

        // 5. Set local url with file:// protocol in auto_updater.
        var localUrl = 'file://' + localFile;
        auto_updater.setFeedUrl(localUrl);

        // 6. Check for updates with auto_updater.
        // Lets do this. :o
        auto_updater.checkForUpdates();
      });
    }
  }]);

  return Update;
})();

exports.Update = Update;