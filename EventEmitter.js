class EventEmitter{



   /**
    * Creates a new EventEmitter
    * @return {EventEmitter} A new EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   constructor(){
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
   static get defaultMaxListeners(){
      // *Returning the maximum:
      return 10;
   }



   /**
    * Registers a new listener for a given event
    * @param  {*} event_name      The name of the event (Will be converted to string)
    * @param  {function} callback The listener to be registered
    * @param  {boolean} append    If set to true, the listener will be added on the end, if set to false, it will be added on the beginning
    * @return {EventEmitter}      This EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   _addListener(event_name, callback, append){
      // *Getting the event name as string:
      event_name = String(event_name);

      // *Checking if the callback is a function, and if it isn't, emitting an error:
      if(typeof(callback) !== 'function') throw new TypeError('\'callback\' argument must be a function');

      // *Emitting the 'newListener' event:
      this.emit('newListener', event_name, callback);

      // *Checking if the events list already has this event:
      if(this._events.has(event_name)){
         // *If it does:

         // *Getting the listeners list of this event:
         let callbacks = this._events.get(event_name);

         // *Checking if the append flag is set to true:
         if(append){
            // *If it is:
            // *Adding the callback on the end of the listeners list:
            callbacks.push(callback);
         } else{
            // *If it's not:
            // *Adding the callback on the beginning of the listeners list:
            callbacks.unshift(callback);
         }

         let callbacks_quantity = callbacks.length;

         // *Checking if the quantity of listeners added for this event is higher than the limit, and if it is, warning the user:
         if((this._max_listeners !== 0 && this._max_listeners !== Infinity) && callbacks_quantity > this._max_listeners)
            setTimeout(() => console.warn('warning: possible EventEmitter memory leak detected. ' + callbacks_quantity + ' ' + event_name + ' listeners added. Use emitter.setMaxListeners() to increase limit.'), 0);
      } else{
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
   on(event_name, callback){
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
   addListener(event_name, callback){
      // *Calling the 'on' method:
      return this.on(event_name, callback);
   }



   /**
    * Registers a new listener for a given event
    * (The listener will be added on the beginning of the list)
    * @param  {*} event_name      The name of the event (Will be converted to string)
    * @param  {function} callback The listener to be registered
    * @return {EventEmitter}      This EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   prependListener(event_name, callback){
      // *Calling the '_addListener' method:
      return this._addListener(event_name, callback, false);
   }



   /**
    * Registers a new listener for a given event
    * (The listener will be called just one time)
    * (The listener will be added on the beginning of the list)
    * @param  {*} event_name      The name of the event (Will be converted to string)
    * @param  {function} callback The listener to be registered
    * @return {EventEmitter}      This EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   prependOnceListener(event_name, callback){
      // *Getting the event name as string:
      event_name = String(event_name);

      // *Checking if the callback is a function, and if it isn't, emitting an error:
      if(typeof(callback) !== 'function') throw new TypeError('\'callback\' argument must be a function');

      // *Creating the 'once' listener:
      let onceCallback = function(...args){
         // *Removing the listener:
         this.off(event_name, onceCallback);
         // *Calling the listener:
         callback.call(this, ...args);
      };

      // *Calling the 'prependListener' method, so the listener will be added on the beginning of the list:
      return this.prependListener(event_name, onceCallback);
   }



   /**
    * Registers a new listener for a given event
    * (The listener will be called just one time)
    * @param  {*} event_name      The name of the event (Will be converted to string)
    * @param  {function} callback The listener to be registered
    * @return {EventEmitter}      This EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   once(event_name, callback){
      // *Getting the event name as string:
      event_name = String(event_name);

      // *Checking if the callback is a function, and if it isn't, emitting an error:
      if(typeof(callback) !== 'function') throw new TypeError('\'callback\' argument must be a function');

      // *Creating the 'once' listener:
      let onceCallback = function(...args){
         // *Removing the listener:
         this.off(event_name, onceCallback);
         // *Calling the listener:
         callback.call(this, ...args);
      };

      // *Calling the 'on' method, so the listener will be added on the end of the list:
      return this.on(event_name, onceCallback);
   }



   /**
    * Removes a single listener of the given event
    * @param  {string}   event_name The name of the event. If not set, all listeners of all events will be removed
    * @param  {Function} callback   The listener to remove
    * @return {EventEmitter}        This EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   removeListener(event_name, callback){
      // *Checking if the callback is a function, and if it isn't, emitting an error:
      if(typeof(callback) !== 'function') throw new TypeError('\'callback\' argument must be a function');

      // *Getting the event name as string:
      event_name = String(event_name);

      // *Checking if the events list has this event:
      if(this._events.has(event_name)){
         // *If it does:
         // *Getting all the event's callbacks:
         let callbacks = this._events.get(event_name);
         // *Getting the given callback's index on the list:
         let index = callbacks.findIndex(c => c === callback);

         // *Checking if the callback exists on the list:
         if(index >= 0){
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
   removeAllListeners(event_name){
      // *Checking if the event name is set:
      if(arguments.length){
         // *If it is:
         // *Getting the event name as string:
         event_name = String(event_name);
         // *Getting the event's callbacks:
         let callbacks = this._events.get(event_name);
         // *Removing the event's name and its callbacks as well:
         this._events.delete(event_name);
         // *Getting each callback registered for this event:
         for(let callback of callbacks){
            // *Emitting the 'removeListener' event:
            this.emit('removeListener', event_name, callback);
         }
      } else{
         // *If it's not:
         // *Getting each event's name and its callbacks:
         for(let [event_name, callbacks] of this._events.entries()){
            // *Getting each callback registered for the current event:
            for(let callback of callbacks){
               // *Emitting the 'removeListener' event:
               this.emit('removeListener', event_name, callback);
            }
         }

         // *Cleaning the events list:
         this._events = new Map();
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
   emit(event_name, ...args){
      // *Getting the event name as string:
      event_name = String(event_name);

      // *Getting a copy of the registered callbacks:
      let callbacks = this.listeners(event_name);

      // *Checking if it's the 'error' event:
      if(event_name === 'error'){
         // *If it is:
         // *Checking if there're listeners for the 'error' event, and if there aren't, throwing an error:
         if(!callbacks.length)
            // *Checking if the first argument on the 'args' array is an Error:
            throw (args[0] instanceof Error) ?
               // *Throwing it if it is, or throwing a generic error if it's not:
               args[0] : new Error('Uncaught, unspecified \"error\" event. (' + args[0] + ')');
      }

      // *Checking if callbacks were set for this event, if it don't, returning false:
      if(!callbacks || !Array.isArray(callbacks) || !callbacks.length) return false;


      // *Getting each registered callback for this event:
      for(let callback of callbacks){
         // *Calling the callback:
         callback.call(this, ...args);
      }

      // *Returning true:
      return true;
   }



   /**
    * Retrieves all the events' name for which this emitter has listeners registered on
    * @return {Array} The names of the events
    * @author Guilherme Reginaldo Ruella
    */
   eventNames(){
      // *Returning the events' names:
      return Array.from(this._events.entries())
         // *Filtering the events that has callbacks registered:
         .filter(e => Array.isArray(e[1]) && e[1].length)
         // *Getting only the event's name:
         .map(e => e[0]);
   }



   /**
    * Retrieves all the registered listeners on a given event
    * @param  {*} event_name The name of the event (Will be converted to string)
    * @return {Array}        A copy of the listeners list, or an empty list if none were set yet:
    * @author Guilherme Reginaldo Ruella
    */
   listeners(event_name){
      // *Getting the event name as string:
      event_name = String(event_name);

      // *Getting all the callbacks of this event:
      let callbacks = this._events.get(event_name);

      // *Returning a copy of the callbacks list, or an empty list if none were set yet:
      return Array.isArray(callbacks) ? callbacks.concat([]) : [];
   }



   /**
    * Retrieves the quantity of listeners registered for a given event
    * @param  {*} event_name The name of the event (Will be converted to string)
    * @return {number}       The quantity of listeners
    * @author Guilherme Reginaldo Ruella
    */
   listenerCount(event_name){
      // *Getting a copy of the callbacks for this event:
      let callbacks = this.listeners(event_name);

      // *Returning the number of callbacks registered, if any:
      return callbacks.length;
   }



   /**
    * Retrieves the maximum listeners flag
    * @return {number} The maximum number of listeners for each event
    * @author Guilherme Reginaldo Ruella
    */
   getMaxListeners(){
      // *Returning the value:
      return this._max_listeners;
   }



   /**
    * Sets the maximum of listeners allowed for each event before it starts to warn on the console (Default is 10)
    * @param {number} n      The maximum of listeners (Infinity or 0 will make this emitter never warn on the console)
    * @return {EventEmitter} This EventEmitter
    * @author Guilherme Reginaldo Ruella
    */
   setMaxListeners(n){
      // *Checking if the number is valid, and if it's not, throwing an error:
      if(isNaN(n) || typeof(n) !== 'number' || n<0) throw new TypeError('\'n\' argument must be a positive number');

      // *Setting the max listeners flag:
      this._max_listeners = Number(n);

      // *Returning this emitter:
      return this;
   }
}
