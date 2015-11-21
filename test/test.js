var GhReleases = require('../')
var assert = require('assert')
var semver = require('semver')

describe('GhReleases', function () {
  this.timeout(5000)

  var updater = null

  before(function () {
    var options = {
      repo: 'jenslind/electron-gh-releases-test',
      currentVersion: '1.0.0'
    }

    updater = new GhReleases(options)
  })

  describe('_getLatestTag()', function () {
    it('should get the latest release tag from the repo', function (done) {
      updater._getLatestTag(function (err, tag) {
        assert.equal(err, null)
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
      updater._getFeedUrl('0.4.0', function (err, feedUrl) {
        assert(!err)
        done()
      })
    })
  })
})
