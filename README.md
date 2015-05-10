# [WIP] Electron-gh-releases [![Build Status](https://travis-ci.org/jenslind/electron-gh-releases.svg?branch=master)](https://travis-ci.org/jenslind/electron-gh-releases) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Auto-update for electron apps using Github releases together with the built-in auto-updater.

## Usage

OS X only

1. Publish a new release on Github, the tag needs to be a valid semver version.
2. Add your `.zip` file to your release.
3. Next also add a `auto_updater.json` file. This file should contain at least a `url` key pointing to the `.zip` file URL. Look [here](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#update-json-format) for valid keys.

```javascript
var gh_releases = require('electron-gh-releases')

var update = new gh_releases({repo: 'jenslind/electron-gh-releases'}, app, function (auto_updater) {
  // Auto updater event listener
  auto_updater.on('update-downloaded', function (e, rNotes, rName, rDate, uUrl, quitAndUpdate) {
    // Install the update
    quitAndUpdate()
  })
})

// Check for updates
update.check(function (err, update) {
  if (!err && update) {
    update.download()
  }
})
```

## Docs

### Methods

#### check()

#### download()

## License
MIT
