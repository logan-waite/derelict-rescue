
import { Rooms, DiscoveredRooms } from '/imports/api/tiles/tiles.js';
import { Meteor } from "meteor/meteor";
import './game-board.html';

var scale = 1;

Template.gameBoard.onCreated(function() {
  // Subscribe to publications
  Meteor.subscribe("discoveredRooms.all");
  Meteor.subscribe("rooms");
})

Template.gameBoard.onRendered(function() {
  $('#board').draggable();

})


Template.gameBoard.helpers({
  players() {
    var tile = DiscoveredRooms.findOne();
    $('#board #'+tile._id+'.room .tile').first().append($("<div class='player'></div>"))
    $('.player').draggable({
      // snap: ".tile",
      // snapMode: "inner",
      revert: "invalid"
    });
  },
  currentRooms() {
    $('.room').remove();
    var d_rooms = DiscoveredRooms.find().fetch();
    d_rooms.forEach(function(d_room) {
      var room = d_room.room;

      // create room template
      var room_obj = $('<div class="room" id="'+d_room._id+'"></div>');

      // Set the size of the room
      room_obj.css('width', (room.size.x * 100) + "px").css('height', (room.size.y * 100) + "px");

      // Set the look of the room
      room_obj.html("<span>" + room.name + "</span>");

      // Append the object to the game board
      $('#board').append(room_obj);

      // Fill the room with tiles for players to move on
      var room_area = room.size.x * room.size.y;

      for (var i = 0; i < d_room.tiles.length; i++) {
        var tile = d_room.tiles[i]
        var tile_obj = $("<div class='tile'>");
        tile_obj.attr("id", "t_"+d_room._id+"_" + tile.tile_id).attr("door", tile.door);
        tile_obj.css("left", (tile.position.x * 100)).css("top", (tile.position.y * 100));
        // Each tile should accept the player character
        tile_obj.droppable({
          accept: ".player",
          drop : function(event, ui) {
            var target = $(event.target);
            $(ui.draggable).css({"position": "initial"}).appendTo(target);
          }
        })
        room_obj.append(tile_obj);
      }
      placeDoors(room_obj, d_room.doors);

      var up = (d_room.position.y * 100);
      var sideways = (d_room.position.x * 100) + -50;
      room_obj.css({"bottom": up, "margin-left": sideways});
    })
  }
  // The currentTiles here will be rewritten to include subtiles that we can actually move in.
  // This is so rooms bigger than 1 square can require multiple moves to cross
  // and it will probably help solve some of the problems I've run into, like
  // randomly aligning the room with the room you just exited, and
  // aligning possible tiles correctly.
  // currentTiles() {
  //   $('.board-tile').remove();
  //   var tiles = DiscoveredTiles.find().fetch();
  //   tiles.forEach(function(tile) {
  //     var btile = tile.tile;
  //
  //     // create board-tile template
  //     var bt_object = $("<div class='board-tile' id="+tile._id+"></div>");
  //
  //     var btile_size = btile.size;
  //     if (btile_size.x > 1) {
  //       var width = btile_size.x * 100;
  //       bt_object.css("width", width + "px");
  //     }
  //     if (btile_size.y > 1) {
  //       var height = btile_size.y * 100;
  //       bt_object.css("height", height + "px");
  //     }
  //     // Add any specific things to the tile before appending it
  //     bt_object.html(btile.name);
  //     // Now append the object to the game board.
  //     $('#board').append(bt_object);
  //     // Make the board-tile droppable for players
  //     bt_object.droppable({
  //       accept: ".player",
  //       drop : function(event, ui) {
  //         var target = $(event.target);
  //         $(ui.draggable).css({"position": "initial"}).appendTo(target);
  //       }
  //     });
  //     // Add the doors and put them where they belong.
  //     tile.doors.forEach(function(position) {
  //       // Figure out the side the door should be on.
  //       var door = $("<div class='door'></div>");
  //       // Start with which side the door will be on (rooms will be squre for now.)
  //       if (position.x !== undefined) // horizontal
  //       {
  //         door.addClass("horizontal")
  //         if (position.x < 0) {
  //           door.css("left", "-2px");
  //         } else {
  //           door.css("right", "-2px")
  //         }
  //
  //         var block = 0;
  //         // check if we've been told where to put the door
  //         if (position.b !== undefined) { // basically, this means the room is bigger than 1 block.
  //           block = position.b;
  //         }
  //         // Doors should be in the middle of the tile, which means a space of 25px for a single tile.
  //         // Bigger rooms are squares of bigger tiles, so we add 100 for each block we need to move.
  //         door.css("top", ((block * 100) + 25) + "px")
  //       }
  //       else if (position.y !== undefined) // vertical
  //       {
  //         door.addClass("vertical")
  //         if (position.y > 0) {
  //           door.css("top", "-2px")
  //         } else {
  //           door.css("bottom", "-2px")
  //         }
  //
  //         var block = 0;
  //         // check if we've been told where to put the door
  //         if (position.b !== undefined) { // basically, this means the room is bigger than 1 block.
  //           block = position.b;
  //         }
  //         // Doors should be in the middle of the tile, which means a space of 25px for a single tile.
  //         // Bigger rooms are squares of bigger tiles, so we add 100 for each block we need to move.
  //         door.css("left", ((block * 100) + 25) + "px")
  //       }
  //       bt_object.append(door);
  //     })
  //     // Then move it to where it needs to go using the position
  //     // We set the positions multiplied by 99 so the borders match
  //     // To move it up, set the bottom position to (y * 99).
  //     // To move it right or left, add (x * 99) to -50 (the default margin-left) (x could be a negative number)
  //     var up = (tile.position.y * 100);
  //     var sideways = (tile.position.x * 100) + -50;
  //     bt_object.css({"bottom": up, "margin-left": sideways});
  //   })
  // }
})

Template.gameBoard.events({
  // Zoom events
  'click #in'(event) {
    event.preventDefault();
    $('#board').css('transform', 'scale(' + (scale *= 1.1) + ')')
  },
  'click #out'(event) {
    event.preventDefault();
    $('#board').css('transform', 'scale(' + (scale /= 1.1) + ')')
  },
  'click'(event) {
    // console.log(event.target)
  },
  // Hovering events (mostly for showing potential routes from this tile)
  'dropover .tile'(event, ui) {
    event.preventDefault();
    hidePossibleRooms($(event.target).attr("id"))
    // Start off by getting the position of the tile we're hovering over
    var h_room = $(event.target);
    var id_pattern = /t_([A-Za-z0-9]+)_\d/g;
    var room_id = id_pattern.exec(h_room.attr("id"));
    var room = DiscoveredRooms.findOne({_id:room_id[1]})
    console.log(room_id);
    // var position = tile.position;
    // We're going to want to create a possible tile for each door
    showPossibleRooms(room);
  },
  'dragstart .player' (event, ui) {
    $(event.target).css({"position": "relative"});
  },
  'dragstop .player' (event, ui) {
    hidePossibleRooms()
  }
})

//////////////////
// Other Functions
//////////////////

function placeDoors(room_obj, doors) {
  doors.forEach(function(position) {
    var door = $('<div class="door"></div>');
    // Figure out which side the door should be on.
    if (position.x !== undefined) {
      door.addClass("horizontal");
      if (position.x < 0) {
        door.css("left", "-2px");
      } else {
        door.css("right", "-2px");
      }

      var block = 0;
      // check if we've been told where to put the door
      if (position.b !== undefined) {
        block = position.b;
      }

      door.css("top", ((block * 100) + 25) + "px");
    } else if (position.y !== undefined) {
      door.addClass("vertical");
      if (position.y > 0) {
        door.css("top", "-2px");
      } else {
        door.css("bottom", "-2px");
      }

      var block = 0;
      // check if we've been told where to put the door
      if (position.b !== undefined) {
        block = position.b;
      }

      door.css("left", ((block * 100) + 25) + "px")
    }
    room_obj.append(door)
  })
}

function showPossibleRooms(room) {
  console.log(room)
  room.doors.forEach(function(door_position) {
    // first we need to check if the door has already been "discovered"
    if (!door_position.d) {
      pr_obj = $("<div class='possible-room r_" + room._id + "'></div>");
      var bottom, left;

      if (door_position.x !== undefined) { // On one of the sides
        bottom = (tile.position.y + door_position.b) * 100 // This will be affected by the "b" parameter
        left = ((tile.position.x + door_position.x) * 100) + -50;
      }
      else if (door_position.y !== undefined) { // On top or bottom
        bottom = ((tile.position.y + door_position.y) * 100);
        left = ((tile.position.x + door_position.b) * 100) + -50; // This will be affected by the "b" parameter
      }
      $('#board').append(pr_object);

      // bind all the possible-tile events now because they weren't around earlier to bind.
      pt_object.droppable({
        accept: ".player",
        drop : function(event, ui) {
          // When the player drops on this, we need to find its position and save a new discovered tile.
          var target = $(event.target);
          var room_classes = target.attr("class");
          var id_pattern = /r_([A-Za-z0-9]+)/g;
          var d_room_id = id_pattern.exec(room_classes)[1]
          var y_pos = parseInt(target.css("bottom")) / 100;
          var x_pos = (parseInt(target.css("margin-left")) + 50) / 100;
          var new_room_id = newDiscoveredTile({x:x_pos, y:y_pos}, d_room_id);
          $(ui.draggable).css({"position": "initial"}).appendTo("#" + new_room_id);
        }
      })
      // Then we do the same thing as if adding a tile, just add 1 to the positions before multiplying them.
      pr_object.css({"bottom": bottom, "margin-left": left}).show();
    }
  });
}

function hidePossibleRooms(room_id) {
  if(room_id !== undefined) {
    $(".possible-room:not(.r_"+room_id+")").hide().remove();
  } else {
    // $('.possible-room').hide().remove();
  }
}

function newDiscoveredTile(position, tile_id) {
  Meteor.call("discoveredTiles.insert", position, tile_id, (error, result) => {
    if (error) {
      console.log(error);
    }
    else {
      return result
    }
  });
}

