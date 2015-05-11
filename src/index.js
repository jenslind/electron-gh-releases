const semver = require('semver')
const path = require('path')
const auto_updater = require('auto-updater')
const got = require('got')

export default class Update {

  constructor (gh, app, cb) {
    this.repo = gh.repo
    this.repoUrl = 'https://github.com/' + gh.repo
    this.currentVersion = app.getVersion()

    cb(auto_updater)
  }

  /**
   * Get tags from this.repo
   */
  _getLatestTag (cb) {
    let url = path.join(this.repoUrl, '/releases/latest')
    got.head(url, function (err, data, res) {
      if (err) {
        cb('Unable to get latest release tag from Github.', null)
        return
      }

      let latestTag = res.req.path.split('/').pop()
      cb(err, latestTag)
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
    this._getLatestTag(function (err, tag) {
      if (err) {
        cb(new Error(err), false)
        return
      }

      if (!tag) {
        cb(null, false)
        return
      }

      // Get the latest version
      let current = self._getCurrentVersion()

      // Check if tag is valid semver
      let latest = tag
      if (!latest || !semver.valid(semver.clean(latest))) {
        cb(new Error('Could not find a valid release tag.'), false)
        return
      }

      // 2. Compare with current version.
      if (semver.lte(latest, current)) {
        cb(null, false)
        return
      }

      // There is a new version!

      // 3. Get feed url from gh release.
      let feedUrl = 'https://github.com/' + self.repo + '/releases/download/' + latest + '/auto_updater.json'

      // 4. Make sure feedUrl exists
      got.head(feedUrl, function (err, data, res) {
        if (err || res.statusCode !== 200) {
          cb(new Error('Could not get feed URL.'), false)
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
