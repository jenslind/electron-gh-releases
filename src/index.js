const semver = require('semver')
const auto_updater = require('auto-updater')
const got = require('got')

export default class Update {

  constructor (gh, cb) {
    this.repo = gh.repo
    this.repoUrl = 'https://github.com/' + gh.repo
    this.currentVersion = gh.currentVersion

    cb(auto_updater)
  }

  /**
   * Get tags from this.repo
   */
  _getLatestTag (cb) {
    let url = this.repoUrl + '/releases/latest'
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
   * Compare current with the latest version.
   */
  _newVersion (latest) {
    return semver.lt(this._getCurrentVersion(), latest)
  }

  /**
   * Get the feed URL from this.repo
   */
  _getFeedUrl (latest, cb) {
    let feedUrl = 'https://raw.githubusercontent.com/' + this.repo + '/master/auto_updater.json'

    // Make sure feedUrl exists
    got.get(feedUrl, function (err, data, res) {
      if (err || res.statusCode !== 200) return cb('Could not get feed URL.', null)

      // Make sure the feedUrl links to latest tag
      let zipUrl = JSON.parse(data).url
      if (semver.clean(zipUrl.split('/').slice(-2, -1)[0]) !== semver.clean(latest)) {
        return cb('Url from auto_updater.json does not linking to latest release.', null)
      }

      cb(err, feedUrl)
    })
  }

  /**
   * Check for updates.
   */
  check (cb) {
    var self = this
    // Get latest released version from Github.
    this._getLatestTag(function (err, tag) {
      if (err) {
        cb(new Error(err), false)
        return
      }

      if (!tag) {
        cb(null, false)
        return
      }

      // Check if tag is valid semver
      let latest = tag
      if (!latest || !semver.valid(semver.clean(latest))) {
        cb(new Error('Could not find a valid release tag.'), false)
        return
      }

      // Compare with current version.
      if (!self._newVersion(latest)) return cb(null, false)

      // There is a new version!
      // Get feed url from gh repo.
      self._getFeedUrl(latest, function (err, feedUrl) {
        if (err) return cb(new Error(err), false)

        // Set feedUrl in auto_updater.
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
