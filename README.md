# Electron-gh-releases [![Build Status](https://travis-ci.org/jenslind/electron-gh-releases.svg?branch=master)](https://travis-ci.org/jenslind/electron-gh-releases) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Auto-update for electron apps using Github releases together with the built-in [auto-updater](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md).

This is OS X only.

## Install

```
npm install electron-gh-releases --save
```

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

## Tests

```
npm test
```

## License
MIT
