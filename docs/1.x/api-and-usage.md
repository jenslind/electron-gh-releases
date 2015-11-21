# v1.x API and usage

Please note that 1.x does not support Windows, only OS X apps is supported.

## Usage

#### auto_updater.json

A file named `auto_updater.json` needs to be placed in the root of your repo.

This file should contain at least a `url` key, pointing to the `.zip` file URL in your latest release.
Look [here](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#update-json-format) for valid keys.

#### When publishing a new release on Github

1. The tag needs to be a valid semver version.
2. Your `.app` must be [signed](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#auto-updater) and `zip` compressed.

#### Checking and installing updates

```javascript
var gh_releases = require('electron-gh-releases')

var options = {
  repo: 'jenslind/electron-gh-releases',
  currentVersion: app.getVersion()
}

var update = new gh_releases(options, function (auto_updater) {
  // Auto updater event listener
  auto_updater.on('update-downloaded', function (e, rNotes, rName, rDate, uUrl, quitAndUpdate) {
    // Install the update
    quitAndUpdate()
  })
})

// Check for updates
update.check(function (err, status) {
  if (!err && status) {
    update.download()
  }
})
```

## Docs

### Constructor

#### new gh_releases([options], [callback])

##### options

`repo` - **String** Your github repo in the format: USERNAME/REPO_NAME

`currentVersion` - **Semver version**

##### callback(auto_updater)

Returns the auto_updater instance.

### Methods

#### .check([callback])
> Checks for new releases on Github.

##### callback(err, status)
`err` - **String** Contains errors, if any.

`status` - **Boolean** Is true if a new version is available.

#### .download()
> Runs Electrons [checkForUpdates()](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#autoupdatercheckforupdates) method. This method should only be called if check() returns true.
