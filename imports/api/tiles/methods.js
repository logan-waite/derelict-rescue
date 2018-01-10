import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Tiles, DiscoveredTiles } from './tiles.js';

Meteor.methods({
  'discoveredTiles.insert' (position) {

    check(position, Match.ObjectIncluding({x:Number, y:Number}));

    var tile = discoverTile();



    // var already_discovered = DiscoveredTiles.find().fetch();
    //
    // already_discovered.forEach(function(dtile) {
    //   // console.log(dtile);
    // })

    return DiscoveredTiles.insert({
      position : position,
      tile : tile
    })
  },

  'discoveredTiles.one' ({ _id }) {
    return DiscoveredTiles.findOne({_id:_id})
  }
});

function discoverTile() {
  var tile = getRandomTile()

  return tile;
}

function getRandomTile() {
  var random_tile_id = Math.floor((Math.random() * 5))

  return Tiles.findOne({"tile_id" : random_tile_id});

  // return tile;
}