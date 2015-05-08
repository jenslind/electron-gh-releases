var exec = require('child_process').exec
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
      // @TODO: Would be nice to sort the tags here.
      let latest = tags.pop()
    })
    // 2. Compare with current version.
    // 3. Get .zip URL from Github release.
    // 4. Create local json file with .zip URL.
    // 5. Set local url with file:// protocol in auto_updater.
    // 6. Check for updates with auto_updater.
  }

  /**
   * Relaunch and install new update.
   */
  install () {
    // Run exit and instsall with auto_updater
  }
}
