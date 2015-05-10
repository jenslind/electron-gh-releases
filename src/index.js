const exec = require('child_process').exec
const semver = require('semver')
const path = require('path')
const auto_updater = require('auto-updater')
const got = require('got')

export class Update {

  constructor (gh, app, cb) {
    this.repo = gh.repo
    this.repoUrl = 'git@github.com:' + gh.repo + '.git'
    this.storage = app.getPath('userData')
    this.currentVersion = app.getVersion()

    cb(auto_updater)
  }

  /**
   * Get tags from this.repo
   */
  _getTags (cb) {
    var self = this

    // Clone repo
    exec('git clone ' + this.repoUrl, {cwd: this.storage}, function (err, stdout, stderr) {
      if (err) {
        cb(new Error('Failed to clone repo.'), null)
        return
      }

      // Get latest tags
      exec('git tag', {cwd: path.join(self.storage, self.repo.split('/').pop())}, function (err, stdout, stderr) {
        if (err) {
          cb(new Error('Unable to get version tags.'), null)
          return
        }
        var tags = stdout.split('\n')
        tags.pop()
        cb(err, tags)
      })
    })
  }

  /**
   * Get current version from app.
   */
  _getCurrentVersion () {
    return this.currentVersion
  }

  /**
   * Check for updates.
   */
  check (cb) {
    var self = this
    // 1. Get latest released version from Github.
    this._getTags(function (err, tags) {
      if (err) {
        cb(new Error(err), false)
        return
      }

      if (!tags) {
        cb(null, false)
        return
      }

      // Get the latest version
      let current = self._getCurrentVersion()

      // Get latest tag
      // @TODO: Sort the tags!
      let latest = tags.pop()
      if (!latest || !semver.valid(semver.clean(latest))) {
        cb(new Error('Could not find a valid release tag.'))
        return
      }

      // 2. Compare with current version.
      if (semver.lt(latest, current)) {
        cb(null, false)
        return
      }

      // There is a new version!

      // 3. Get feed url from gh release.
      let feedUrl = 'https://github.com/' + self.repo + '/releases/download/' + latest + '/auto_updater.json'

      // 4. Make sure feedUrl exists
      got.head(feedUrl, function (err, data, res) {
        if (err || res.statusCode !== 200) {
          cb(new Error('Could not find feed URL.'), false)
          return
        }

        // 5. Set feedUrl in auto_updater.
        auto_updater.setFeedUrl(feedUrl)

        cb(null, true)
      })
    })
  }

  /**
   * Download latest release.
   */
  download () {
    // Run auto_updater
    // Lets do this. :o
    auto_updater.checkForUpdates()
  }
}
