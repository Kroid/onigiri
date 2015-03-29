var join   = require('./lib/helpers/join');
var init = require('./lib/init');

var config = {
  root: join(__dirname, '.tmp'),
  watching: true,
  src: [
    {
      files: ['index.jade']
    },
    {
      files: '**/*.js'
    },
    {
      files: 'styles/app.scss'
    }
  ]
};

init(config);

// new Source({
//   root: join(__dirname, '.tmp'),
//   globs: ['**/*'],
//   watching: false
// });






// var path = require('path');
// var sass = require('node-sass');
// var Controller = require('./lib/controller');

// var config = {
//   root: path.join(__dirname, '.tmp'),
//   watch: ['**/*'],
//   src: [
//     {
//       files: ['index.jade'],
//       // transform: 'function or list of functions',
//       // beforeTransform: 'function',
//       // afterTransform: 'function',
//       // extension: 'after transform, not required'
//     },
//     {
//       files: '**/*.js'
//     },
//     {
//       files: 'styles/app.scss',
//     }
//   ]
// }


// new Controller(config, 'serve');
