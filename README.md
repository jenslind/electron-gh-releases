## [WIP] Electron-gh-releases [![Build Status](https://travis-ci.org/jenslind/electron-gh-releases.svg?branch=master)](https://travis-ci.org/jenslind/electron-gh-releases) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Auto-update for electron apps using Github releases, OS X only.

#### Usage

1. Publish a new release on Github, the tag needs to be a valid semver version.
2. Add your `.zip` file to your release.
3. Next also add a `auto_updater.json` file. This file should contain at least a `url` object pointing to the `.zip` file URL.

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
