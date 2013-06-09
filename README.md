# decomponentify

A browserify transform to enable the use of [component.js](https://github.com/component/component) components in browserify client javascript projects.

## Installation

Installation is via npm:

```
$ npm install decomponentify
```

## How to use.

Install some components:

```
# creates files in component/component-moment/
$ component install component/moment
```

Build out your component file into a place where you can require it from browserify:

```
# Builds all the components into public/scripts/vendor/component/index.js
$ component build -o public/scripts/vendor/component -n index
```

Require the build file in your browserify code and access the component modules by their fully qualified name (eg. 'component-moment'):

``` js
// File: public/scripts/app.js
var domready = require('domready')
  , component = require('./vendor/component')
  , moment = component('component-moment');

domready(function () {
  console.log(moment.format('dddd')); // prints "Monday"
});
```

Build out your browserify bundle using the decomponentify transform:

```
$ browserify -t decomponentify  public/scripts/app.js -o public/scripts/build/bundle.js
```

Then include your bundle.js in your HTML file and you're done!
