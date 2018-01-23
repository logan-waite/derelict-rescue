import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Rooms, DiscoveredRooms } from './tiles.js';

Meteor.methods({
  'discoveredRooms.insert' (position, prev_room_id, tile_id) {
    check(position, Match.ObjectIncluding({x:Number, y:Number}));
    check(prev_room_id, String);

    var prev_tile_pos = getTilePosition(prev_room_id, tile_id);

    var room = discoverRoom(prev_tile_pos, position);

    return DiscoveredRooms.insert(room);
  },

  'discoveredRooms.one' ({ _id }) {
    return DiscoveredRooms.findOne({_id:_id})
  }
});

function getTilePosition(room_id, tile_id) {
  var room = DiscoveredRooms.findOne({_id:room_id});
  var x_size = room.room.size.x;
  var y_size = room.room.size.y;
  var room_area = x_size * y_size;
  var y = 1;
  var x = 1;
  var i = 0;

  while (i < room_area) {
    if (i == tile_id) {
      break;
    }
    if (i % (x_size-1) == 0 ) {
      if (y < y_size) {
        y++;
        x = 1;
      } else {
        break;
      }
    }
    x++;
    i++
  }

  return {tile_pos: {x:x, y:y}, d_room: room};
}

function discoverRoom(prev_tile_pos, position) {
  var room = getRandomRoom()
  // var room = Rooms.findOne({"tile_id" : 3});

  // Decide which part of the room

  // Set doors for this tile
  var doors = generateDoors(room, prev_tile_pos, position);

  // Set the tiles
  var tiles = generateTiles(room);

  return {room : room, position : position, doors : doors, tiles : tiles};
}

function getRandomRoom() {
  var room_count = Rooms.find().count();
  var random_room_id = Math.floor((Math.random() * room_count))
  // return Rooms.findOne({"room_id" : random_room_id});
  return Rooms.findOne({"room_id" : 3})
}

function setDoorToDiscovered() {

}

function generateTiles(room) {
  var tiles = [];
  var room_area = room.size.x * room.size.y;

  var y = 1;
  var x = 1;
  for (var i = 0; i < room_area; i++) {
    var tile = {};
    tile.tile_id = i;
    tile.door = false;

    console.log((i / room.size.x) % 1)
    console.log((i / room.size.x) % 1 === 0)
    if ((i / room.size.x) % 1 === 0 && i != 0) {
      if (y < room.size.y) {
        y++;
        x = 1;
      }
    }
    tile.position = {x:(x-1), y:(y-1)}
    console.log(x + "," + y)
    tiles.push(tile);

    x++;
  }
  return tiles
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

function generateDoors(room, prev_tile_pos, new_pos) {
  var door_number = {u:0, d:0, l:0, r:0};
  var doors = [];
  var door_positions = {u:[], d:[], l:[], r:[]};
  // get the various possible door positions
  // console.log(prev_tile_pos)
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
  // console.log(door_number);


  // Get the rest of the doors
  var position;
  for (var i = 0; i < (room.doors - 1); i++) {
    var num = randomNumberNotZero(-50, 50);
    // Odd numbers are x, even are y
    if (num % 2 == 0) {
      var side = Math.sign(num);
      if (side < 0) {
        if (door_number.d < room.size.y) {
          door_number.d++
          position = setDoorPosition(door_positions.d, room.size.y)
          doors.push({x : side, d : false, b : position});
        } else {
          i--;
        }
      } else {
        if (door_number.u < room.size.y) {
          door_number.u++
          position = setDoorPosition(door_positions.u, room.size.y)
          doors.push({x : side, d : false, b : position});
        } else {
          i--;
        }
      }
    } else {
      var side = Math.sign(num);
      if (side < 0) {
        if (door_number.l < room.size.x) {
          door_number.l++
          position = setDoorPosition(door_positions.l, room.size.x)
          doors.push({y : side, d : false, b : position});
        } else {
          i--;
        }
      } else {
        if (door_number.r < room.size.x) {
          door_number.r++
          position = setDoorPosition(door_positions.r, room.size.x)
          doors.push({y : side, d : false, b : position});
        } else {
          i--;
        }
      }
    }
    // console.log(door_number);

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