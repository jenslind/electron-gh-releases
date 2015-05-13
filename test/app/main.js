var app = require('app')
var Mocha = require('mocha')

app.on('ready', function() {
  var mocha = new Mocha
  mocha.addFile('test/test.js')

  mocha.run(function (failures) {
    process.on('exit', function () {
      process.exit(failures)
    })

    app.quit()
  })
})
