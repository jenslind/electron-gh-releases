var exec = require('child_process').exec
const semver = require('semver')
const auto_updater = 'TODO :D' //require('auto-updater')

export class Update {

  constructor (gh) {
    this.repo = gh.repo
  }

  _getTags (cb) {
    // Clone repo
    exec('git clone ' + this.repo, function (err, stdout, stderr) {
      if (err) throw new Error('Failed to clone repo.')

      // Get latest tags
      exec('git tag', {cwd: 'drupal-shoot'}, function (err, stdout, stderr) {
        var tags = stdout.split('\n')
        tags.pop()
        cb(tags)
      })
    })
  }

  _getCurrentVersion () {
    return require('./package.json').version
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
      let zipUrl = ''

      // 4. Create local json file with .zip URL.

      // 5. Set local url with file:// protocol in auto_updater.
      let localUrl = 'file://'
      auto_updater.setFeedUrl(localUrl)

      // 6. Check for updates with auto_updater.
      // Lets do this. :o
      auto_updater.checkForUpdates()
    })
  }
}
