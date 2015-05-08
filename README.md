## Electron-gh-releases
> Auto-update for electron apps using Github releases.

#### Usage
```
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
```
