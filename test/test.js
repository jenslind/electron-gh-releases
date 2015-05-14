var gh_releases = require('../')
var assert = require('assert')
var semver = require('semver')

describe('Update', function () {

  var update = null

  before(function () {
    var options = {
      repo: 'jenslind/electron-gh-releases-test',
      currentVersion: '1.0.0'
    }

    update = new gh_releases(options, function (auto_updater) {})
  })

  describe('_getLatestTag()', function () {
    it('should get the latest release tag from the repo', function (done) {
      update._getLatestTag(function (err, tag) {
        assert.equal(err, null)
        assert(semver.valid(tag))
        done()
      })
    })
  })

  describe('_getCurrentVersion()', function () {
    it('should get the current version', function () {
      assert.equal(update._getCurrentVersion(), '1.0.0')
    })
  })

  describe('_compareVersions()', function () {
    it('should compare latest to current version', function (done) {
      assert(!update._compareVersions(update._getCurrentVersion(), '1.0.0'))
      assert(!update._compareVersions(update._getCurrentVersion(), '1.0.0'))
      assert(update._compareVersions(update._getCurrentVersion(), '2.0.0'))
      done()
    })
  })

  describe('_getFeedURL()', function () {
    it('should make sure feed url exists', function (done) {
      assert(false)
      done()
    })
  })
})
