var exec = require('child_process').exec
const semver = require('semver')
const jf = require('jsonfile')
const path = require('path')
const os = require('os')
const auto_updater = require('auto-updater')

export class Update {

  constructor (gh, cb) {
    this.repo = gh.repo
    this.storage = gh.storage
    this.currentVersion = gh.current

    cb(auto_updater)
  }

  /**
   * Get tags from this.repo
   */
  _getTags (cb) {
    // Clone repo
    exec('git clone ' + this.repo, {cwd: this.storage}, function (err, stdout, stderr) {
      if (err) throw new Error('Failed to clone repo.')

      // Get latest tags
      exec('git tag', {cwd: path.join(this.storage, this.repo.split(':').pop().slice(0, -4).split('/').pop())}, function (err, stdout, stderr) {
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
    // 1. Get latest released version from Github.
    _getTags(function (tags) {
      // Get the latest version
      let current = _getCurrentVersion

      // Get latest tag
      // @TODO: Sort the tags!
      let latest = tags.pop()
      if (!semver.valid(semver.clean(latest))) throw new Error('Could not find a valid release tag.')

      // 2. Compare with current version.
      if (semver.lt(latest, current)) return null

      // There is a new version!

      // 3. Get .zip URL from Github release.
      let repo_name = this.repo.split(':').pop().slice(0, -4)
      let platform = os.platform()
      let arch = os.arch()
      let filename = repo_name.split('/').pop() + '-' + latest + '-' + platform + '-' + arch + '.zip'
      let zipUrl = 'https://github.com/' + repo_name + '/releases/download/' + latest + '/' + filename

      // 4. Create local json file with .zip URL.
      let localFile = path.join(this.storage, 'gh_updates.json')
      let localFileObj = {url: zipUrl}
      jf.writeFile(localFile, localFileObj, function (err) {
        if (err) throw new Error('Unable to save local update file.')
      })

      // 5. Set local url with file:// protocol in auto_updater.
      let localUrl = 'file://' + localFile
      auto_updater.setFeedUrl(localUrl)

      // 6. Check for updates with auto_updater.
      // Lets do this. :o
      auto_updater.checkForUpdates()
    })
  }
}
