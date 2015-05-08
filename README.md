## Electron-gh-releases
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
var auto_updater = null

var update = new gh_releases({repo: 'jenslind/electron-gh-releases'}, app, function (updater) {
  auto_updater = updater
})

// Install the update
auto_updater.on('update-downloaded', function (e, rNotes, rName, rDate, uUrl, quitAndUpdate) {
  quitAndUpdate()
})

// Check for updates
update.check()
```
