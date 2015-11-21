## Usage example

```javascript
const GhReleases = require('electron-gh-releases')

let options = {
  repo: 'jenslind/electron-gh-releases',
  currentVersion: app.getVersion()
}

const updater = new GhReleases(options)

// Check for updates
// `status` returns true if there is a new update available
updater.check((err, status) => {
  if (!err && status) {
    // Download the update
    updater.download()
  }
})

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
  // Restart the app and install the update
  updater.install()
})

// Access electrons autoUpdater
updater.autoUpdater
```

## Docs

### GhRealeases([options])

#### `options`

`repo` - **String** Your github repo in the format: USERNAME/REPO_NAME

`currentVersion` - **Semver version** The current version of the running app.

### Methods

#### `.check([callback])`
> Checks if there is a new release on GitHub.

##### callback(err, status)
`err` - **String** Contains errors, if any.

`status` - **Boolean** Is true if a new version is available.

#### `.download()`
> Runs Electrons [checkForUpdates()](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#autoupdatercheckforupdates) method. This method should only be called if check() returns true.

#### `.install()`
> Runs Electrons [quitAndInstall()](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#autoupdaterquitandinstall) method. This method should only be called when you know a new version has been downloaded.

### Events

#### `update-downloaded`
> Will emit when a new update has ben downloaded.
