import { Meteor } from 'meteor/meteor';
import { Tiles, DiscoveredTiles } from '../tiles.js';

Meteor.publish('tiles', function () {
  return Tiles.find();
});

Meteor.publish('discoveredTiles.all', function() {
  return DiscoveredTiles.find();
})
