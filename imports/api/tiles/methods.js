import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Tiles, DiscoveredTiles } from './tiles.js';

Meteor.methods({
  'discoveredTiles.insert' (position, prev_tile_id) {

    check(position, Match.ObjectIncluding({x:Number, y:Number}));
    check(prev_tile_id, String);

    var prev_tile_pos = getTilePosition(prev_tile_id);

    var tile = discoverTile(prev_tile_pos, position);

    return DiscoveredTiles.insert(tile);
  },

  'discoveredTiles.one' ({ _id }) {
    return DiscoveredTiles.findOne({_id:_id})
  }
});

function getTilePosition(tile_id) {
  var tile = DiscoveredTiles.findOne({_id:tile_id});
  return tile.position;
}

function discoverTile(prev_tile_pos, position) {
  // var tile = getRandomTile()
  var tile = Tiles.findOne({"tile_id" : 3});

  // Set doors for this tile
  var doors = generateDoors(tile, prev_tile_pos, position);

  return {tile : tile, doors : doors, position : position};
}

function getRandomTile() {
  var random_tile_id = Math.floor((Math.random() * 5))

  return Tiles.findOne({"tile_id" : random_tile_id});

  return tile;
}

function setDoorToDiscovered() {

}

function setDoorPosition(side_array, size) {
  // Get a random number between 0 and the size
  var position = randomNumber(0, size);
  if (side_array.includes(position)) {
    position = setDoorPosition(side_array, size);
  } else {
    side_array.push(position);
  }
  return position;
}

function generateDoors(tile, prev_tile_pos, new_pos) {
  var door_number = {u:0, d:0, l:0, r:0};
  var doors = [];
  var door_positions = {u:[], d:[], l:[], r:[]};
  // get the various possible door positions

  // Determine where the door we passed through is.
  var door_side;
  if(new_pos.x != prev_tile_pos.x) {
    if (new_pos.x < prev_tile_pos.x) {
      door_number.r++
      doors.push({x : 1, d : true})
    } else {
      door_number.l++
      doors.push({x : -1, d : true})
    }
  } else if (new_pos.y != prev_tile_pos.y) {
    if (new_pos.y < prev_tile_pos.y) {
      door_number.u++;
      doors.push({y : 1, d : true})
    } else {
      door_number.d++;
      doors.push({y : -1, d : true})
    }
  }


  // Get the rest of the doors
  var position;
  for (var i = 0; i < (tile.doors - 1); i++) {
    var num = randomNumberNotZero(-50, 50);
    // Odd numbers are x, even are y
    if (num % 2 == 0) {
      var side = Math.sign(num);
      if (side < 0) {
        if (door_number.d < tile.size.y) {
          door_number.d++
          position = setDoorPosition(door_positions.d, tile.size.y)
          doors.push({x : side, d : false, b : position});
        } else {
          i--;
        }
      } else {
        if (door_number.u < tile.size.y) {
          door_number.u++
          position = setDoorPosition(door_positions.u, tile.size.y)
          doors.push({x : side, d : false, b : position});
        } else {
          i--;
        }
      }
    } else {
      var side = Math.sign(num);
      if (side < 0) {
        if (door_number.l < tile.size.x) {
          door_number.l++
          position = setDoorPosition(door_positions.l, tile.size.x)
          doors.push({y : side, d : false, b : position});
        } else {
          i--;
        }
      } else {
        if (door_number.r < tile.size.x) {
          door_number.r++
          position = setDoorPosition(door_positions.r, tile.size.x)
          doors.push({y : side, d : false, b : position});
        } else {
          i--;
        }
      }
    }
  }

  return doors;

}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomNumberNotZero(min, max) {
  var num = Math.floor(Math.random() * (max - min) + min);
  if (num == 0) {
    num = randomNumberNotZero(min, max)
  }
  return num;
}