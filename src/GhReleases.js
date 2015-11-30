const semver = require('semver')
const autoUpdater = require('electron').autoUpdater
const got = require('got')
const events = require('events')

const WIN32 = (process.platform === 'win32')
const DARWIN = (process.platform === 'darwin')
const REGEX_ZIP_URL = /\/v(\d+\.\d+\.\d+)\/.*\.zip/

export default class GhReleases extends events.EventEmitter {

  constructor (gh) {
    super()

    let self = this

    self.repo = gh.repo
    self.repoUrl = 'https://github.com/' + gh.repo
    self.currentVersion = gh.currentVersion
    self.autoUpdater = autoUpdater

    self.autoUpdater.on('update-downloaded', (...args) => self.emit('update-downloaded', args))
  }

  /**
   * Get tags from this.repo
   */
  _getLatestTag () {
    let url = this.repoUrl + '/releases/latest'
    return got.head(url)
      .then(res => {
        let latestTag = res.socket._httpMessage.path.split('/').pop()
        return latestTag
      })
      .catch(err => {
        if (err) throw new Error('Unable to get latest release tag from Github.')
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
  _getFeedUrl (tag) {
    let feedUrl

    // If on Windows
    if (WIN32) {
      return new Promise((resolve, reject) => {
        feedUrl = this.repoUrl + '/releases/download/' + tag
        resolve(feedUrl)
      })
    }

    // On Mac we need to use the `auto_updater.json`
    feedUrl = 'https://raw.githubusercontent.com/' + this.repo + '/master/auto_updater.json'

    // Make sure feedUrl exists
    return got.get(feedUrl)
      .then(res => {
        if (res.statusCode === 404) {
          throw new Error('auto_updater.json does not exist.')
        } else if (res.statusCode !== 200) {
          throw new Error('Unable to fetch auto_updater.json: ' + res.body)
        }

        let zipUrl
        try {
          zipUrl = JSON.parse(res.body).url
        } catch (err) {
          throw new Error('Unable to parse the auto_updater.json: ' + err.message + ', body: ' + res.body)
        }

        const matchReleaseUrl = zipUrl.match(REGEX_ZIP_URL)
        if (!matchReleaseUrl) {
          throw new Error('The zipUrl (' + zipUrl + ') is a invalid release URL')
        }

        const versionInZipUrl = matchReleaseUrl[1]
        const latestVersion = semver.clean(tag)
        if (versionInZipUrl !== latestVersion) {
          throw new Error('The feedUrl does not link to latest tag (zipUrl=' + versionInZipUrl + '; latestVersion=' + latestVersion + ')')
        }

        return feedUrl
      })
  }

  /**
   * Check for updates.
   */
  check (cb) {
    if (!DARWIN && !WIN32) return cb(new Error('This platform is not supported.'), false)

    let self = this

    // Get latest released version from Github.
    this._getLatestTag()
      .then(tag => {
        // Check if tag is valid semver
        if (!tag || !semver.valid(semver.clean(tag))) {
          throw new Error('Could not find a valid release tag.')
        }

        // Compare with current version.
        if (!self._newVersion(tag)) {
          throw new Error('There is no newer version.')
        }

        // There is a new version!
        // Get feed url from gh repo.
        return self._getFeedUrl(tag)
      })
      .then(feedUrl => {
        // Set feedUrl in auto_updater.
        this.autoUpdater.setFeedURL(feedUrl)

        cb(null, true)
      })
      .catch(err => {
        cb(err || null, false)
      })
  }

  /**
   * Download latest release.
   */
  download () {
    // Run auto_updater
    // Lets do this. :o
    this.autoUpdater.checkForUpdates()
  }

  /**
   * Install the downloaded update
   */
  install () {
    // Run autoUpdaters quitAndInstall()
    // This will restart the app and install the new update.
    this.autoUpdater.quitAndInstall()
  }
}
