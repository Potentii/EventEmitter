"use strict";

const { expect } = chai;



describe('Listeners', function(){

   describe('Persistent listeners', function(){

      it('should execute every time the event is emitted', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Starting a control flag:
         let times_executed = 0;

         // *Registering a listener to an event:
         ee.on('my-event', () => {
            // *Increasing the control flag:
            times_executed++;
         });

         // *Emitting the event multiple times:
         ee.emit('my-event');
         ee.emit('my-event');
         ee.emit('my-event');

         // *Testing if the code was executed every time:
         expect(times_executed).to.equal(3);

         // *Exiting this unit:
         done();
      });


      it('should make the listener scope reference the current EventEmitter instance', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();
         // *Creating another EventEmitter:
         let ee2 = new EventEmitter();
         // *Referencing the outter scope:
         let outter_scope = this;

         // *Registering a listener to an event:
         ee.on('my-event', function(){
            // *Checking if the scope is the current EventEmitter:
            expect(this).to.equal(ee);
            // *Checking if the scope is different from the other EventEmitter:
            expect(this).to.not.equal(ee2);
            // *Checking if the scope is different from the outter scope:
            expect(this).to.not.equal(outter_scope);

            // *Exiting this unit:
            done();
         });

         // *Emitting the event:
         ee.emit('my-event');
      });


      describe('Adding', function(){

         it('should convert the event name to string', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();
            // *Declaring the event name as an object:
            let event_name = {};
            // *Adding a listener to this event:
            ee.on(event_name, () => {});

            // *Testing if the event name got converted to string:
            expect(ee.eventNames()[0]).to.equal(String(event_name));

            // *Exiting this unit:
            done();
         });


         it('should not allow to add a non-function listener', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Preparing tests that adds non-function listeners to an event:
            // *Adding a non-function listener(undefined) to 'my-event' event:
            let add_test1 = () => ee.on('my-event');
            // *Adding a non-function listener(string) to 'my-event' event:
            let add_test2 = () => ee.on('my-event', 'not a function');
            // *Adding a non-function listener(undefined) to 'undefined' event:
            let add_test3 = () => ee.on();

            // *Testing if all registrations throws errors:
            expect(add_test1).to.throw(TypeError);
            expect(add_test2).to.throw(TypeError);
            expect(add_test3).to.throw(TypeError);

            // *Testing if none of the listener was added:
            expect(ee.listenerCount('my-event')).to.be.equal(0);
            expect(ee.listenerCount()).to.be.equal(0);

            // *Exiting this unit:
            done();
         });


         it('should allow to add a function listener to an event', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Preparing tests that adds functional listeners to an event:
            let add_test1 = () => ee.on('my-event', () => {});
            let add_test2 = () => ee.on('my-event', () => { console.log('event emitted') });
            let add_test3 = () => ee.on('my-event', function(){ return -1 });

            // *Testing if any registration throws an error:
            expect(add_test1).to.not.throw(TypeError);
            expect(add_test2).to.not.throw(TypeError);
            expect(add_test3).to.not.throw(TypeError);

            // *Testing if all the listener was added:
            expect(ee.listenerCount('my-event')).to.be.equal(3);

            // *Exiting this unit:
            done();
         });


         describe('Appending', function(){

            it('should insert the listener at the end of the list', function(done){
               // *Creating a new EventEmitter:
               let ee = new EventEmitter();

               // *Defining different listeners:
               let listener1 = () => {};
               let listener2 = () => {};

               // *Registering a listener to an event:
               ee.on('my-event', listener1);
               // *Registering another listener:
               ee.on('my-event', listener2);

               // *Retrieving the listeners list of this event:
               let listeners = ee.listeners('my-event');

               // *Testing if the listeners are in the registration order:
               expect(listeners[0]).to.equal(listener1);
               expect(listeners[1]).to.equal(listener2);

               // *Exiting this unit:
               done();
            });

         });


         describe('Prepending', function(){

            it('should insert the listener at the begining of the list', function(done){
               // *Creating a new EventEmitter:
               let ee = new EventEmitter();

               // *Defining different listeners:
               let listener1 = () => {};
               let listener2 = () => {};

               // *Registering a listener to an event:
               ee.on('my-event', listener1);
               // *Registering a listener at the begining:
               ee.prependListener('my-event', listener2);

               // *Retrieving the listeners list of this event:
               let listeners = ee.listeners('my-event');

               // *Testing if the prepended listener is at the begining, and the first registered listener is at the end now:
               expect(listeners[0]).to.equal(listener2);
               expect(listeners[1]).to.equal(listener1);

               // *Exiting this unit:
               done();
            });

         });

      });

   });


   describe('Once listeners', function(){

      it('should execute only once', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Starting a control flag:
         let times_executed = 0;

         // *Registering a once listener to an event:
         ee.once('my-event', () => {
            // *Increasing the control flag:
            times_executed++;
         });

         // *Emitting the event multiple times:
         ee.emit('my-event');
         ee.emit('my-event');
         ee.emit('my-event');

         // *Testing if the code was executed only once:
         expect(times_executed).to.equal(1);

         // *Exiting this unit:
         done();
      });


      it('should be removed right before it executes', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Registering a once listener to an event:
         ee.once('my-event', () => {
            // *Testing if the listener has already been removed:
            expect(ee.listenerCount('my-event')).to.equal(0);

            // *Exiting this unit:
            done();
         });

         // *Emitting the event:
         ee.emit('my-event');
      });


      it('should make the listener scope reference the current EventEmitter instance', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();
         // *Creating another EventEmitter:
         let ee2 = new EventEmitter();
         // *Referencing the outter scope:
         let outter_scope = this;

         // *Registering a once listener to an event:
         ee.once('my-event', function(){
            // *Checking if the scope is the current EventEmitter:
            expect(this).to.equal(ee);
            // *Checking if the scope is different from the other EventEmitter:
            expect(this).to.not.equal(ee2);
            // *Checking if the scope is different from the outter scope:
            expect(this).to.not.equal(outter_scope);

            // *Exiting this unit:
            done();
         });

         // *Emitting the event:
         ee.emit('my-event');
      });


      describe('Adding', function(){

         it('should convert the event name to string', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();
            // *Declaring the event name as an object:
            let event_name = {};
            // *Adding a listener to this event:
            ee.once(event_name, () => {});

            // *Testing if the event name got converted to string:
            expect(ee.eventNames()[0]).to.equal(String(event_name));

            // *Exiting this unit:
            done();
         });


         it('should not allow to add a non-function listener', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Preparing tests that adds non-function listeners to an event:
            // *Adding a non-function listener(undefined) to 'my-event' event:
            let add_test1 = () => ee.once('my-event');
            // *Adding a non-function listener(string) to 'my-event' event:
            let add_test2 = () => ee.once('my-event', 'not a function');
            // *Adding a non-function listener(undefined) to 'undefined' event:
            let add_test3 = () => ee.once();

            // *Testing if all registrations throws errors:
            expect(add_test1).to.throw(TypeError);
            expect(add_test2).to.throw(TypeError);
            expect(add_test3).to.throw(TypeError);

            // *Testing if none of the listener was added:
            expect(ee.listenerCount('my-event')).to.be.equal(0);
            expect(ee.listenerCount()).to.be.equal(0);

            // *Exiting this unit:
            done();
         });


         it('should allow to add a function listener to an event', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Preparing tests that adds functional listeners to an event:
            let add_test1 = () => ee.once('my-event', () => {});
            let add_test2 = () => ee.once('my-event', () => { console.log('event emitted') });
            let add_test3 = () => ee.once('my-event', function(){ return -1 });

            // *Testing if any registration throws an error:
            expect(add_test1).to.not.throw(TypeError);
            expect(add_test2).to.not.throw(TypeError);
            expect(add_test3).to.not.throw(TypeError);

            // *Testing if all the listener was added:
            expect(ee.listenerCount('my-event')).to.be.equal(3);

            // *Exiting this unit:
            done();
         });


         describe('Appending', function(){

            it('should insert the listener at the end of the list', function(done){
               // *Creating a new EventEmitter:
               let ee = new EventEmitter();

               // *Defining different listeners:
               let listener1 = () => {};
               let listener2 = () => {};

               // *Registering a once listener to an event:
               ee.once('my-event', listener1);
               // *Registering another once listener:
               ee.once('my-event', listener2);

               // *Retrieving the listeners list of this event:
               let listeners = ee.listeners('my-event');

               // *Testing if the listeners are in the registration order:
               expect(listeners[0]).to.equal(listener1);
               expect(listeners[1]).to.equal(listener2);

               // *Exiting this unit:
               done();
            });

         });


         describe('Prepending', function(){

            it('should insert the listener at the begining of the list', function(done){
               // *Creating a new EventEmitter:
               let ee = new EventEmitter();

               // *Defining different listeners:
               let listener1 = () => {};
               let listener2 = () => {};

               // *Registering a once listener to an event:
               ee.once('my-event', listener1);
               // *Registering a once listener at the begining:
               ee.prependOnceListener('my-event', listener2);

               // *Retrieving the listeners list of this event:
               let listeners = ee.listeners('my-event');

               // *Testing if the prepended listener is at the begining, and the first registered listener is at the end now:
               expect(listeners[0]).to.equal(listener2);
               expect(listeners[1]).to.equal(listener1);

               // *Exiting this unit:
               done();
            });

         });

      });

   });


   describe('Removing', function(){

      it('should remove a specific listener out of a specific event', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();
         let listener = () => {};

         // *Registering a listener on an event:
         ee.on('my-event', listener);

         // *Removing the listener:
         ee.removeListener('my-event', listener);

         // *Testing if the listener has been removed:
         expect(ee.listenerCount('my-event')).to.equal(0);

         // *Exiting this unit:
         done();
      });


      it('should not allow to remove a non-function listener out of a specific event', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Preparing a test that removes a non-function listener:
         let remove_test = () => ee.removeListener('my-event', 'non-function-listener');

         // *Testing if it will throw an exception:
         expect(remove_test).to.throw(TypeError);

         // *Exiting this unit:
         done();
      });


      it('should remove all listeners out of a specific event', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Registering some listeners on an event:
         ee.on('my-event', () => {});
         ee.on('my-event', () => {});
         ee.on('my-event', () => {});

         // *Removing all the listeners:
         ee.removeAllListeners('my-event');

         // *Testing if the listener has been removed:
         expect(ee.listenerCount('my-event')).to.equal(0);

         // *Exiting this unit:
         done();
      });


      it('should remove all listeners from all events', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Registering some listeners on some event:
         ee.on('my-event-1', () => {});
         ee.on('my-event-1', () => {});

         ee.on('my-event-2', () => {});
         ee.on('my-event-2', () => {});

         // *Removing all the listeners:
         ee.removeAllListeners();

         // *Testing if the listeners has been removed:
         expect(ee.listenerCount('my-event-1')).to.equal(0);
         expect(ee.listenerCount('my-event-2')).to.equal(0);

         // *Exiting this unit:
         done();
      });

   });


   describe('Listing', function(){

      it('should retrieve all listeners registered for an event', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         let listeners = [() => {}, () => {}, () => {}, () => {}];

         // *Registering some listeners on an event:
         ee.on('my-event', listeners[0]);
         ee.once('my-event', listeners[1]);
         ee.once('my-event', listeners[2]);
         ee.on('my-event', listeners[3]);

         // *Testing if the listeners added matches:
         ee.listeners('my-event')
            .forEach((l, i) => expect(l).to.equal(listeners[i]));

         // *Exiting this unit:
         done();
      });

   });


   describe('Counting', function(){

      it('should retrieve the number of listeners registered for an event', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Registering some listeners on an event:
         ee.on('my-event', () => {});
         ee.once('my-event', () => {});
         ee.once('my-event', () => {});
         ee.on('my-event', () => {});

         // *Testing if the counting is correct:
         expect(ee.listenerCount('my-event')).to.equal(4);
         expect(ee.listenerCount('event-that-does-not-exists')).to.equal(0);

         // *Exiting this unit:
         done();
      });

   });

});



describe('Events', function(){

   describe('Emitting events', function(){

      it('should execute listeners synchronously', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Starting a control flag:
         let flag = 0;

         // *Registering a listener to the first event:
         ee.on('my-event-1', () => {
            // *Checking if the flag is 0, and if it is, adding 1 to it:
            if(flag===0) flag++;
         });

         // *Registering a listener to the second event:
         ee.on('my-event-2', () => {
            // *Checking if the flag is 1, and if it is, adding 1 to it:
            if(flag===1) flag++;
         });


         // *Emitting the first event:
         ee.emit('my-event-1');
         // *Emitting the second event:
         ee.emit('my-event-2');

         // *Testing if the flag is 2:
         expect(flag).to.equal(2);

         // *Exiting this unit:
         done();
      });


      it('should execute listeners in the same order they were registered', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Starting a control flag:
         let times_executed = 0;

         // *Registering a listener to an event:
         ee.on('my-event', () => {
            // *Testing if this is the first listener being executed:
            expect(++times_executed).to.equal(1);
         });

         // *Registering a once listener to an event:
         ee.once('my-event', () => {
            // *Testing if this is the second listener being executed:
            expect(++times_executed).to.equal(2);
         });

         // *Registering a listener to an event:
         ee.on('my-event', () => {
            // *Testing if this is the third listener being executed:
            expect(++times_executed).to.equal(3);
         });

         // *Emitting the event:
         ee.emit('my-event');

         // *Exiting this unit:
         done();
      });

   });


   describe('Listing', function(){

      it('should retrieve only the events that has listeners', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Adding listeners to some events:
         ee.on('my-event-1', () => {});
         ee.on('my-event-2', () => {});

         // *Removing the listeners of the first event:
         ee.removeAllListeners('my-event-1');

         // *Testing if the first event is not on the list:
         expect(ee.eventNames().indexOf('my-event-1')).to.be.equal(-1);
         // *Testing if the second event is on the list:
         expect(ee.eventNames().indexOf('my-event-2')).to.not.be.equal(-1);
         // *Testing if a never added event is not on the list:
         expect(ee.eventNames().indexOf('my-event-3')).to.be.equal(-1);

         // *Exiting this unit:
         done();
      });


      it('should retrieve the events names as string, in the definition order', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Adding listeners to some events:
         ee.on('my-event', () => {});
         ee.on('other-event', () => {});
         ee.on({}, () => {});

         // *Retrieving all the events names:
         let event_names = ee.eventNames();

         // *Testing if the names follows the event definition order:
         expect(event_names[0]).to.be.equal(String('my-event'));
         expect(event_names[1]).to.be.equal(String('other-event'));
         expect(event_names[2]).to.be.equal(String({}));

         // *Exiting this unit:
         done();
      });

   });


   describe('Special events', function(){

      describe('\'newListener\' event', function(){

         it('should be emitted before a new listener is registered', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();
            // *Starting a control flag:
            let adding_listener = false;

            // *Registering a listener to the 'newListener' event:
            ee.on('newListener', () => {
               // *Testing if a new listener is being registered:
               expect(adding_listener).to.true;
               // *Testing if this event is being called just before a listener was added:
               expect(ee.listenerCount('my-event')).to.equal(0);

               // *Exiting this unit:
               done();
            });

            // *Changing the flag value:
            adding_listener = true;
            // *Registering a listener to an event:
            ee.on('my-event', () => {});
         });

      });


      describe('\'removeListener\' event', function(){

         it('should be emitted after a listener is removed (Removing specific listener of specific event)', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Registering a listener to the 'newListener' event:
            ee.on('removeListener', () => {
               // *Testing if this event is being called after a listener was removed:
               expect(ee.listenerCount('my-event')).to.equal(0);
            });

            // *Defining a listener:
            let listener = () => {};
            // *Registering a listener to an event:
            ee.on('my-event', listener);
            // *Removing a specific listener of a specific event:
            ee.removeListener('my-event', listener);

            // *Exiting this unit:
            done();
         });


         it('should be emitted after a listener is removed (Removing all listeners of specific event)', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Registering a listener to the 'newListener' event:
            ee.on('removeListener', () => {
               // *Testing if this event is being called after a listener was removed:
               expect(ee.listenerCount('my-event')).to.equal(0);
            });

            // *Registering a listener to an event:
            ee.on('my-event', () => {});
            // *Removing all listeners of a specific event:
            ee.removeAllListeners('my-event');

            // *Exiting this unit:
            done();
         });


         it('should be emitted after a listener is removed (Removing all listeners of all events)', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Registering a listener to the 'newListener' event:
            ee.on('removeListener', () => {
               // *Testing if this event is being called after a listener was removed:
               expect(ee.listenerCount('my-event')).to.equal(0);
            });

            // *Registering a listener to an event:
            ee.on('my-event', () => {});
            // *Removing all listeners of all events, including 'removeListener':
            ee.removeAllListeners();

            // *Exiting this unit:
            done();
         });

      });


      describe('\'error\' event', function(){

         it('should throw an error if there is no listeners registered', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Defining the emit test with an Error object:
            let emit_error_test1 = () => {
               // *Emitting the 'error' event:
               ee.emit('error', new Error('my error'));
            };

            // *Defining the emit test with a non-Error object:
            let emit_error_test2 = () => {
               // *Emitting the 'error' event:
               ee.emit('error', 'my error');
            };

            // *Testing if it will throw the expected errors:
            // *Testing if the emitted Error is being thrown:
            expect(emit_error_test1).to.throw(Error, 'my error');
            // *Testing if a unspecified Error is being thrown:
            expect(emit_error_test2).to.throw(Error, 'Uncaught, unspecified \'error\' event. (my error)');

            // *Exiting this unit:
            done();
         });


         it('should execute its listeners if there is at least one registered', function(done){
            // *Creating a new EventEmitter:
            let ee = new EventEmitter();

            // *Defining a listener for the 'error' event:
            ee.on('error', err => {
               // *Exiting this unit:
               done();
            });

            // *Emitting the 'error' event:
            ee.emit('error');
         });

      });

   });

});
