var path = require('path');
var onigiri = require('../index');

onigiri({
  root: path.join(__dirname, 'app'),
  watching: true,
  src: [
    {
      files: ['index.jade', 'app.scss', 'scripts/**/*.js']
    }
  ]
})
