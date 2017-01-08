const { expect } = chai;



describe('Listeners', function(){

   describe('Persistent listeners', function(){

      it('should convert the event\'s name to string', function(done){
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


      it('should execute every time the event is emitted', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Starting a control flag:
         let times_executed = 0;

         // Registering a listener to an event:
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

   });


   describe('Once listeners', function(){

      it('should convert the event\'s name to string', function(done){
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


      it('should execute only once', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Starting a control flag:
         let times_executed = 0;

         // Registering a once listener to an event:
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

         // Registering a once listener to an event:
         ee.once('my-event', () => {
            // *Testing if the listener has already been removed:
            expect(ee.listenerCount('my-event')).to.equal(0);

            // *Exiting this unit:
            done();
         });

         // *Emitting the event:
         ee.emit('my-event');
      });
   });
});



describe('Events', function(){

   describe('Emitting events', function(){

      it('should execute listeners in the same order they were registered', function(done){
         // *Creating a new EventEmitter:
         let ee = new EventEmitter();

         // *Starting a control flag:
         let times_executed = 0;

         // Registering a once listener to an event:
         ee.once('my-event', () => {
            // *Testing if this is the first listener being executed:
            expect(++times_executed).to.equal(1);
         });

         // Registering a once listener to an event:
         ee.once('my-event', () => {
            // *Testing if this is the second listener being executed:
            expect(++times_executed).to.equal(2);
         });

         // Registering a once listener to an event:
         ee.once('my-event', () => {
            // *Testing if this is the third listener being executed:
            expect(++times_executed).to.equal(3);
         });

         // *Emitting the event:
         ee.emit('my-event');

         // *Exiting this unit:
         done();
      });

   });


   describe('Special events', function(){

      describe('\'newListener\' event', function(){

         it.skip('should emit before a new listener is registered', function(done){
            // *Exiting this unit:
            done();
         });

      });


      describe('\'removeListener\' event', function(){

         it.skip('should after a listener is removed', function(done){
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



describe('#eventNames()', function(){

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


   it('should retrieve the events\' name as string, in the definition order', function(done){
      // *Creating a new EventEmitter:
      let ee = new EventEmitter();

      // *Adding listeners to some events:
      ee.on('my-event', () => {});
      ee.on('other-event', () => {});
      ee.on({}, () => {});

      // *Retrieving all the events' name:
      let event_names = ee.eventNames();

      // *Testing if the names follows the event's definition order:
      expect(event_names[0]).to.be.equal(String('my-event'));
      expect(event_names[1]).to.be.equal(String('other-event'));
      expect(event_names[2]).to.be.equal(String({}));

      // *Exiting this unit:
      done();
   });

});
