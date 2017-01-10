'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {

   /**
    * Creates a new EventEmitter
    * @return {EventEmitter} A new EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      // *Defining the events Map:
      this._events = new Map();
      // *Setting the max listeners flag as its default value:
      this._max_listeners = EventEmitter.defaultMaxListeners;
   }

   /**
    * Defines the default maximum of listener for each event
    * @return {number} The default value
    * @author Guilherme Reginaldo Ruella
    */


   _createClass(EventEmitter, [{
      key: '_addListener',


      /**
       * Registers a new listener for a given event
       * @param  {*} event_name      The name of the event (Will be converted to string)
       * @param  {function} callback The listener to be registered
       * @param  {boolean} append    If set to true, the listener will be added on the end, if set to false, it will be added on the beginning
       * @return {EventEmitter}      This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */
      value: function _addListener(event_name, callback, append) {
         var _this = this;

         // *Checking if the callback is a function, and if it isn't, emitting an error:
         if (typeof callback !== 'function') throw new TypeError('\'callback\' argument must be a function');

         // *Getting the event name as string:
         event_name = String(event_name);

         // *Emitting the 'newListener' event:
         this.emit('newListener', event_name, callback);

         // *Checking if the events list already has this event:
         if (this._events.has(event_name)) {
            (function () {
               // *If it does:

               // *Getting the listeners list of this event:
               var callbacks = _this._events.get(event_name);

               // *Checking if the append flag is set to true:
               if (append) {
                  // *If it is:
                  // *Adding the callback on the end of the listeners list:
                  callbacks.push(callback);
               } else {
                  // *If it's not:
                  // *Adding the callback on the beginning of the listeners list:
                  callbacks.unshift(callback);
               }

               var callbacks_quantity = callbacks.length;

               // *Checking if the quantity of listeners added for this event is higher than the limit, and if it is, warning the user:
               if (_this._max_listeners !== 0 && _this._max_listeners !== Infinity && callbacks_quantity > _this._max_listeners) setTimeout(function () {
                  return console.warn('warning: possible EventEmitter memory leak detected. ' + callbacks_quantity + ' ' + event_name + ' listeners added. Use emitter.setMaxListeners() to increase limit.');
               }, 0);
            })();
         } else {
            // *If it doesn't:
            // *Creating the listeners list:
            this._events.set(event_name, [callback]);
         }

         // *Returning this event emitter:
         return this;
      }

      /**
       * Registers a new listener for a given event
       * @param  {*} event_name      The name of the event (Will be converted to string)
       * @param  {function} callback The listener to be registered
       * @return {EventEmitter}      This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'on',
      value: function on(event_name, callback) {
         // *Calling the '_addListener' method:
         return this._addListener(event_name, callback, true);
      }

      /**
       * Registers a new listener for a given event
       * (Alias for 'EventEmitter.prototype.on')
       * @param  {*} event_name      The name of the event (Will be converted to string)
       * @param  {function} callback The listener to be registered
       * @return {EventEmitter}      This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'addListener',
      value: function addListener(event_name, callback) {
         // *Calling the '_addListener' method:
         return this._addListener(event_name, callback, true);
      }

      /**
       * Registers a new listener for a given event
       * (The listener will be added at the beginning of the list)
       * @param  {*} event_name      The name of the event (Will be converted to string)
       * @param  {function} callback The listener to be registered
       * @return {EventEmitter}      This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'prependListener',
      value: function prependListener(event_name, callback) {
         // *Calling the '_addListener' method:
         return this._addListener(event_name, callback, false);
      }

      /**
       * Wraps a callback to be executed only once
       * @param  {event_name} event_name The name of the event
       * @param  {function} callback     The listener to be wrapped
       * @return {function}              The wrapped stateful callback
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: '_wrapOnceCallback',
      value: function _wrapOnceCallback(event_name, callback) {
         // *Starting the wrapper:
         var wrapper = {
            scope: this,
            fired: false,
            wrapped_callback: undefined,
            callback: callback
         };

         // *Creating the 'once' listener:
         var wrapped_callback = function () {
            // *Removing the listener:
            this.scope.removeListener(event_name, wrapped_callback);

            // *Checking if this callback was once fired:
            if (!this.fired) {
               // *If it was:
               // *Setting the fired flag as true:
               this.fired = true;
               // *Calling the listener:

               for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
               }

               callback.call.apply(callback, [this.scope].concat(args));
            }
         }.bind(wrapper);

         // *Assigning the original callback:
         wrapped_callback.callback = callback;
         // *Assigning the wrapped callback of the wrapper:
         wrapper.wrapped_callback = wrapped_callback;

         // *Returning the wrapped callback function:
         return wrapped_callback;
      }

      /**
       * Registers a new listener for a given event
       * (The listener will be called just one time)
       * (The listener will be added at the beginning of the list)
       * @param  {*} event_name      The name of the event (Will be converted to string)
       * @param  {function} callback The listener to be registered
       * @return {EventEmitter}      This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'prependOnceListener',
      value: function prependOnceListener(event_name, callback) {
         // *Checking if the callback is a function, and if it isn't, emitting an error:
         if (typeof callback !== 'function') throw new TypeError('\'callback\' argument must be a function');

         // *Getting the event name as string:
         event_name = String(event_name);

         // *Calling the '_addListener' method:
         return this._addListener(event_name, this._wrapOnceCallback(event_name, callback), false);
      }

      /**
       * Registers a new listener for a given event
       * (The listener will be called just one time)
       * @param  {*} event_name      The name of the event (Will be converted to string)
       * @param  {function} callback The listener to be registered
       * @return {EventEmitter}      This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'once',
      value: function once(event_name, callback) {
         // *Checking if the callback is a function, and if it isn't, emitting an error:
         if (typeof callback !== 'function') throw new TypeError('\'callback\' argument must be a function');

         // *Getting the event name as string:
         event_name = String(event_name);

         // *Calling the '_addListener' method:
         return this._addListener(event_name, this._wrapOnceCallback(event_name, callback), true);
      }

      /**
       * Removes a single listener of the given event
       * @param  {string}   event_name The name of the event
       * @param  {Function} callback   The listener to remove
       * @return {EventEmitter}        This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'removeListener',
      value: function removeListener(event_name, callback) {
         // *Checking if the callback is a function, and if it isn't, emitting an error:
         if (typeof callback !== 'function') throw new TypeError('\'callback\' argument must be a function');

         // *Getting the event name as string:
         event_name = String(event_name);

         // *Checking if the events list has this event:
         if (this._events.has(event_name)) {
            // *If it does:
            // *Getting all the event's callbacks:
            var callbacks = this._events.get(event_name);
            // *Getting the given callback's index on the list:
            var index = callbacks.findIndex(function (c) {
               return c === callback;
            });

            // *Checking if the callback exists on the list:
            if (index >= 0) {
               // *If it does:
               // *Removing it from the list:
               callbacks.splice(index, 1);
               // *Emitting the 'removeListener' event:
               this.emit('removeListener', event_name, callback);
            }
         }

         // *Returning this event emitter:
         return this;
      }

      /**
       * Removes all listeners of the given event
       * @param  {string}   event_name The name of the event. If not set, all listeners of all events will be removed
       * @return {EventEmitter}        This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'removeAllListeners',
      value: function removeAllListeners(event_name) {
         // *Checking if the event name is set:
         if (arguments.length) {
            // *If it is:
            // *Getting the event name as string:
            event_name = String(event_name);
            // *Getting the event's callbacks:
            var callbacks = this._events.get(event_name);
            // *Removing the event's name and its callbacks as well:
            this._events.delete(event_name);
            // *Getting each callback registered for this event:
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
               for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var callback = _step.value;

                  // *Emitting the 'removeListener' event:
                  this.emit('removeListener', event_name, callback);
               }
            } catch (err) {
               _didIteratorError = true;
               _iteratorError = err;
            } finally {
               try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                     _iterator.return();
                  }
               } finally {
                  if (_didIteratorError) {
                     throw _iteratorError;
                  }
               }
            }
         } else {
            // *If it's not:
            // *Copying the events list:
            var events = new Map(this._events);
            // *Cleaning the events list:
            this._events = new Map();
            // *Getting each event name and its callbacks:
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
               for (var _iterator2 = events.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _step2$value = _slicedToArray(_step2.value, 2),
                      _event_name = _step2$value[0],
                      _callbacks = _step2$value[1];

                  // *Getting each callback registered for the current event:
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                     for (var _iterator3 = _callbacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _callback = _step3.value;

                        // *Emitting the 'removeListener' event:
                        this.emit('removeListener', _event_name, _callback);
                     }
                  } catch (err) {
                     _didIteratorError3 = true;
                     _iteratorError3 = err;
                  } finally {
                     try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                           _iterator3.return();
                        }
                     } finally {
                        if (_didIteratorError3) {
                           throw _iteratorError3;
                        }
                     }
                  }
               }
            } catch (err) {
               _didIteratorError2 = true;
               _iteratorError2 = err;
            } finally {
               try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                     _iterator2.return();
                  }
               } finally {
                  if (_didIteratorError2) {
                     throw _iteratorError2;
                  }
               }
            }
         }

         // *Returning this EventEmitter:
         return this;
      }

      /**
       * Calls all the listeners of a given event
       * @param  {*} event_name The name of the event (Will be converted to string)
       * @param  {...*} args    The arguments to be passed to each callback
       * @return {boolean}      True if the event had listeners registered on it, false otherwise
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'emit',
      value: function emit(event_name) {
         // *Getting the event name as string:
         event_name = String(event_name);

         // *Getting the registered callbacks:
         var callbacks = this._events.get(event_name);
         // *Getting a copy of the callbacks list, or an empty one if none were set:
         callbacks = Array.isArray(callbacks) ? callbacks.concat([]) : [];

         // *Checking if it's the 'error' event:

         for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
         }

         if (event_name === 'error') {
            // *If it is:
            // *Checking if there're listeners for the 'error' event, and if there aren't, throwing an error:
            if (!callbacks.length)
               // *Checking if the first argument on the 'args' array is an Error:
               throw args[0] instanceof Error ?
               // *Throwing it if it is, or throwing a generic error if it's not:
               args[0] : new Error('Uncaught, unspecified \'error\' event. (' + args[0] + ')');
         }

         // *Checking if callbacks were set for this event, and if it don't, returning false:
         if (!callbacks.length) return false;

         // *Getting each registered callback for this event:
         var _iteratorNormalCompletion4 = true;
         var _didIteratorError4 = false;
         var _iteratorError4 = undefined;

         try {
            for (var _iterator4 = callbacks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
               var _callback2;

               var callback = _step4.value;

               // *Getting the wrapped callback if it have one:
               callback = callback.wrapped_callback || callback;

               // *Calling the callback:
               (_callback2 = callback).call.apply(_callback2, [this].concat(args));
            }

            // *Returning true:
         } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
               }
            } finally {
               if (_didIteratorError4) {
                  throw _iteratorError4;
               }
            }
         }

         return true;
      }

      /**
       * Retrieves all the events' name for which this emitter has listeners registered on
       * @return {Array} The names of the events
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'eventNames',
      value: function eventNames() {
         // *Returning the events' names:
         return Array.from(this._events.entries())
         // *Filtering the events that has callbacks registered:
         .filter(function (e) {
            return Array.isArray(e[1]) && e[1].length;
         })
         // *Getting only the event's name:
         .map(function (e) {
            return e[0];
         });
      }

      /**
       * Retrieves all the registered listeners on a given event
       * @param  {*} event_name The name of the event (Will be converted to string)
       * @return {Array}        A copy of the listeners list, or an empty list if none were set yet:
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'listeners',
      value: function listeners(event_name) {
         // *Getting the event name as string:
         event_name = String(event_name);

         // *Getting all the callbacks of this event:
         var callbacks = this._events.get(event_name);

         // *Getting a copy of the callbacks list, or an empty list if none were set yet:
         callbacks = Array.isArray(callbacks) ? callbacks.concat([]) : [];

         // *Unwrapping the callbacks if needed:
         callbacks = callbacks.map(function (c) {
            return c.callback || c;
         });

         // *Returning the callbacks list:
         return callbacks;
      }

      /**
       * Retrieves the quantity of listeners registered for a given event
       * @param  {*} event_name The name of the event (Will be converted to string)
       * @return {number}       The quantity of listeners
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'listenerCount',
      value: function listenerCount(event_name) {
         // *Getting the event name as string:
         event_name = String(event_name);

         // *Getting the callbacks list of this event:
         var callbacks = this._events.get(event_name);

         // *Returning the number of callbacks registered, if any:
         return Array.isArray(callbacks) ? callbacks.length : 0;
      }

      /**
       * Retrieves the maximum listeners flag
       * @return {number} The maximum number of listeners for each event
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'getMaxListeners',
      value: function getMaxListeners() {
         // *Returning the value:
         return this._max_listeners;
      }

      /**
       * Sets the maximum of listeners allowed for each event before it starts to warn on the console (Default is 10)
       * @param {number} n      The maximum of listeners (Infinity or 0 will make this emitter never warn on the console)
       * @return {EventEmitter} This EventEmitter
       * @author Guilherme Reginaldo Ruella
       */

   }, {
      key: 'setMaxListeners',
      value: function setMaxListeners(n) {
         // *Checking if the number is valid, and if it's not, throwing an error:
         if (isNaN(n) || typeof n !== 'number' || n < 0) throw new TypeError('\'n\' argument must be a positive number');

         // *Setting the max listeners flag:
         this._max_listeners = Number(n);

         // *Returning this emitter:
         return this;
      }
   }], [{
      key: 'defaultMaxListeners',
      get: function get() {
         // *Returning the maximum:
         return 10;
      }
   }]);

   return EventEmitter;
}();