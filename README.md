# EventEmitter
This is an implementation of the `EventEmitter` class that can be used on web projects as a dependency, based on the [Node.js EventEmitter documentation](https://nodejs.org/api/events.html).

<br>

## Table of contents
- [Installing](#installing)
- [Importing](#importing)
- [Using](#using)
- [Testing](#testing)
- [License](#license)

<br>

## Installing
To install this project via NPM (make sure you have [Node.js](https://nodejs.org) installed):
```sh
$ npm install web-event-emitter --save
```

<br>

## Importing
In order to use it in your web project, add as a script:
```html
<script src="./node_modules/web-event-emitter/src/EventEmitter.js"></script>
```
Now, the **EventEmitter** class will be visible in the global scope.

These builds are available at the moment:
- `src/EventEmitter.js`: Original **ES6** code (not minified)
- `dist/eventemitter.es5.js`: Transpiled **ES5** code (not minified)
- `dist/eventemitter.es5.min.js`: Transpiled **ES5** code (minified)

<br>

## Using
### Creating a new instance
```js
let ee = new EventEmitter();
```
This will create a new event emitter, so you can use it to register or emit events.

<br>

### Registering a listener
Registering a new listener for the *'my-event'* event:
```js
ee.on('my-event', function(arg1, arg2){
   console.log('\'My event\' has been emitted:');
   console.log(arg1);
   console.log(arg2);
});
```
You can have as many arguments in your listener as you want.

<br>

### Emitting an event
Now, if you emit the event:
```js
ee.emit('my-event', 'Hello', 'World');
```

The output will be:
```
'My event' has been emitted:
Hello
World
```

<br>

## Testing
If you want to run the tests *(on Windows)*:
```sh
$ npm test
```
This will open the HTML test page located in `./test/test.html`. You can also open it manually if you want.

<br>

## License
[MIT](https://github.com/Potentii/EventEmitter/blob/master/LICENSE.txt)
