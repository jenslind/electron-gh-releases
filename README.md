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

var update = new gh_releases({
  repo: 'git@github.com:jenslind/electron-gh-releases.git',
  storage: app.getPath('userData'),
  current: app.getVersion()
}, function (auto_updater) {
  auto_updater.on('update-downloaded', function (e, rNotes, rName, rDate, uUrl, quitAndUpdate) {
    quitAndUpdate()
  })
})

update.check()
```
