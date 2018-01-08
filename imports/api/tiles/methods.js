import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Tiles, DiscoveredTiles } from './tiles.js';

Meteor.methods({
  'discoveredTiles.insert' ({ position, tile }) {
    console.log("***");
    console.log(tile);
    console.log("***")

    check(position, Object);

    var sized = Match.ObjectIncluding({x:Number, y:Number})
    console.log(sized);
    console.log("***")

    check(tile, {
      _id: String,
      name: String,
      size: sized,
      background_image: Match.Any,
      doors: Number
    });

    return DiscoveredTiles.insert({
      position : position,
      tile : tile
    })
  },
  'discoveredTiles.one' ({ _id }) {
    return DiscoveredTiles.findOne({_id:_id})
  }
});