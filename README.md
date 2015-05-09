## [WIP] Electron-gh-releases [![Build Status](https://travis-ci.org/jenslind/electron-gh-releases.svg?branch=master)](https://travis-ci.org/jenslind/electron-gh-releases) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Auto-update for electron apps using Github releases.

#### Zip file naming
The zip file uploaded on Github must be named in a special way
```
REPO_NAME-VERSION_TAG-PLATFORM-ARCH.zip
```
example:
```
electron-gh-releases-v1.0.0-darwin-x64.zip
```

#### Usage
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
