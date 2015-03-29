# onigiri
Automatization tool for frontend works: compile, build, serve.

Library is under active development, not for production now.


### Usage
`npm install --save-dev onigiri`

```javascript
var path    = require('path');
var onigiri = require('onigiri');

onigiri({
  root: path.join(__dirname, 'my-app-folder'),
  src: [
    {
      files: ['index.jade', 'styles/app.scss']
    },
    {
      files: ['scripts/**/*.js', 'partials/**/*.html']
    }
  ],
  watching: true
});
```
Open browser on http://localhost:1337
