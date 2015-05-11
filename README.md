# [WIP] Electron-gh-releases [![Build Status](https://travis-ci.org/jenslind/electron-gh-releases.svg?branch=master)](https://travis-ci.org/jenslind/electron-gh-releases) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Auto-update for electron apps using Github releases together with the built-in auto-updater.

## Usage

OS X only

1. Publish a new release on Github, the tag needs to be a valid semver version.
2. Add your `.zip` file to your release.
3. Next also add a `auto_updater.json` file. This file should contain at least a `url` key pointing to the `.zip` file URL. The URL will be `https://github.com/USERNAME/REPO/releases/download/TAG/FILENAME.zip` Look [here](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#update-json-format) for valid keys.

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

#### options

`repo` - **String** Your github repo in the format: USERNAME/REPO_NAME

`currentVersion` - **Semver version**

### Methods

#### check(callback)
> Checks for new releases on Github.

##### callback
`err` - **String** Contains errors, if any.

`status` - **Boolean** Is true if a new version is available.

#### download()
> Runs Electrons [checkForUpdates()](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#autoupdatercheckforupdates) method. This method should only be called if check() returns true.

## License
MIT
