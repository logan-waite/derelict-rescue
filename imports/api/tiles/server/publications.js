import { Meteor } from 'meteor/meteor';
import { Rooms, DiscoveredRooms } from '../tiles.js';

Meteor.publish('rooms', function () {
  return Rooms.find();
});

Meteor.publish('discoveredRooms.all', function() {
  return DiscoveredRooms.find();
})
