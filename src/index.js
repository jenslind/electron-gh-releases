const exec = require('child_process').exec
const semver = require('semver')
const jf = require('jsonfile')
const path = require('path')
const os = require('os')
const auto_updater = require('auto-updater')

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
      if (err) throw new Error('Failed to clone repo.')

      // Get latest tags
      exec('git tag', {cwd: path.join(self.storage, self.repo.split('/').pop())}, function (err, stdout, stderr) {
        if (err) throw new Error('Unable to get version tags.')
        var tags = stdout.split('\n')
        tags.pop()
        cb(tags)
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
  check () {
    var self = this
    // 1. Get latest released version from Github.
    this._getTags(function (tags) {
      // Get the latest version
      let current = self._getCurrentVersion

      // Get latest tag
      // @TODO: Sort the tags!
      let latest = tags.pop()
      if (!latest || !semver.valid(semver.clean(latest))) throw new Error('Could not find a valid release tag.')

      // 2. Compare with current version.
      if (semver.lt(latest, current)) return null

      // There is a new version!

      // 3. Get .zip URL from Github release.
      let platform = os.platform()
      let arch = os.arch()
      let filename = self.repo.split('/').pop() + '-' + latest + '-' + platform + '-' + arch + '.zip'
      let zipUrl = 'https://github.com/' + self.repo + '/releases/download/' + latest + '/' + filename

      // 4. Create local json file with .zip URL.
      let localFile = path.join(self.storage, 'gh_updates.json')
      let localFileObj = {url: zipUrl}
      jf.writeFile(localFile, localFileObj, function (err) {
        if (err) throw new Error('Unable to save local update file.')

        // 5. Set local url with file:// protocol in auto_updater.
        let localUrl = 'file://' + localFile
        auto_updater.setFeedUrl(localUrl)

        // 6. Check for updates with auto_updater.
        // Lets do this. :o
        auto_updater.checkForUpdates()
      })
    })
  }
}
