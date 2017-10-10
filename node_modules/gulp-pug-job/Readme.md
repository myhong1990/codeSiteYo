
# gulp-pug-job

> Wraps Pug compiled templates using `pug-runtime/wrap` from <https://github.com/pugjs/pug-runtime> and binds the template functions to a global variable, such as `window.templates`.


## Install

```bash
npm install gulp-pug-job
```


## Example Usage

This will wrap an already compiled Pug template file to a namespace on an object.

Lets say you have a pug template, something like (e.g. filename is `example.js`):

```pug
p Hello #{foo} welcome to #{baz}
```

And you want to use this on the server-side, but fast using a pre-compiled Pug template... right?

So you will need to first add the following to your `gulpfile.js` script:

```js
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    job = require('gulp-pug-job');

gulp.task('job', function () {
  return gulp.src(['src/templates/*.pug'])
    .pipe(pug({ client: true, externalRuntime: true }))
    .pipe(job({
      // default options:
      parent: 'window',
      namespace: 'templates',
      separator: '-'
    }))
    .pipe(gulp.dest('public/templates'));
```

Then, in your HTML file, require the script using camel casing for the file name of the template (in our case it's simply `example`, but if the file was named `foo-baz.pug` you would use `fooBaz`):

```html
<script src="https://raw.githubusercontent.com/pugjs/pug/1.11.0/runtime.js"></script>
<script src="/templates/example.js"></script>
<script type="text/javascript">
  var html = window.templates.example({ foo: 'bar', baz: 'beep' });
  console.log('html', html);
</script>
```

In the browser console, after running the gulp script and opening your HTML file in the browser, you will see the output:

```js
html, "<p>Hello foo welcome to beep</p>"
```


## Background

Basically it takes your compiled Pug templates such as `my-example.js`:

```js
function template(locals) {
  var buf = [];
  var pug_mixins = {};
  var pug_interp;

  buf.push("<p>Hello world</p>");
  return buf.join("");
}
```

And wraps it using `pug-runtime/wrap` so it appears as:

```js
(function (window) {
  window.templates = window.templates || {};
  window.templates.myExample = function template(locals) {
    var buf = [];
    var pug_mixins = {};
    var pug_interp;

    buf.push("<p>Hello world</p>");
    return buf.join("");
}})(window);
```

Which then, when included on your HTML file, will get loaded in the global window namespace.


## Options

`gulp-pug-job` accepts an options object with the following attributes

> #### parent _(string)_

**default:** _'window'_

The object to bind to.

> #### namespace _(string)_

**default:** _'templates'_

The namespace to bind to

> #### separator _(string)_

**default:** _'-'_

The file name separator. This will be used for converting file names to camel case object references.

i.e with the default settings the template file my-example.js would be accessible with:

```js
window.templates.myExample(locals);
```
