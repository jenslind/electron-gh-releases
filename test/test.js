var GhReleases = require('../')
var assert = require('assert')
var semver = require('semver')

describe('GhReleases', function () {
  this.timeout(5000)

  var updater = null
  var options = {
    repo: 'gitscout/downloadtest',
    currentVersion: '0.1.0'
  }
  // var options = {
  //   repo: 'jenslind/electron-gh-releases-test',
  //   currentVersion: '1.0.0'
  // }
  before(function () {
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
      assert.equal(updater._getCurrentVersion(), options.currentVersion)
    })
  })

  describe('_newVersion()', function () {
    it('should compare latest to current version', function (done) {
      assert(!updater._newVersion(options.currentVersion))
      assert(updater._newVersion('2.0.0'))
      done()
    })
  })

  describe('_getFeedUrl()', function () {
    it('should make sure feed url exists', function (done) {
      updater._getFeedUrl('0.1.2')
        .then(function (feedUrl) {
          done()
        })
    })
  })
})
