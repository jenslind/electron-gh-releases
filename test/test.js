var GhReleases = require('../')
var assert = require('assert')
var semver = require('semver')

describe('GhReleases', function () {
  this.timeout(7000)

  var updater = null
  var options = {}

  before(function () {
    options = {
      repo: 'jenslind/electron-gh-releases-test',
      currentVersion: '1.0.0'
    }

    updater = new GhReleases(options)
  })

  describe('_getLatestTag()', function () {
    it('should get the latest release tag from the repo', function (done) {
      updater._getLatestTag()
        .then(function (tag) {
          assert(semver.valid(tag))
          done()
        })
    })
  })

  describe('_getCurrentVersion()', function () {
    it('should get the current version', function () {
      assert.equal(updater._getCurrentVersion(), '1.0.0')
    })
  })

  describe('_newVersion()', function () {
    it('should compare latest to current version', function (done) {
      assert(!updater._newVersion('1.0.0'))
      assert(updater._newVersion('2.0.0'))
      done()
    })
  })

  describe('_getFeedUrl()', function () {
    it('should make sure feed url exists', function (done) {
      updater._getFeedUrl('0.4.0')
        .then(function (feedUrl) {
          assert.equal(feedUrl, 'https://raw.githubusercontent.com/jenslind/electron-gh-releases-test/master/auto_updater.json')
          done()
        })
    })
  })

  // describe('_getFeedUrl() with an autoUpdaterPath', function () {
  //   before(function() {
  //     updater = new GhReleases(
  //       Object.assign(options, { autoUpdaterPath: 'osx' })
  //     )
  //   })
  //   it('should make sure feed url exists', function (done) {
  //     updater._getFeedUrl('0.4.0')
  //       .then(function (feedUrl) {
  //         assert.equal(feedUrl, 'https://raw.githubusercontent.com/jenslind/electron-gh-releases-test/master/osx/auto_updater.json')
  //         done()
  //       }).catch(err => console.log(err))
  //   })
  // })
})
