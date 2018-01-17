import { Tiles, DiscoveredTiles } from '/imports/api/tiles/tiles.js';
import { Meteor } from "meteor/meteor";
import './game-board.html';

var scale = 1;

Template.gameBoard.onCreated(function() {
  // Subscribe to publications
  Meteor.subscribe("discoveredTiles.all");
  Meteor.subscribe("tiles");
})

Template.gameBoard.onRendered(function() {
  $('#board').draggable();

})


Template.gameBoard.helpers({
  players() {
    var tile = DiscoveredTiles.findOne();
    $('#board #'+tile._id+'.board-tile').append($("<div class='player'></div>"))
    $('.player').draggable({
      snap: ".board-tile",
      snapMode: "inner",
      revert: "invalid"
    });
  },
  currentTiles() {
    $('.board-tile').remove();
    var tiles = DiscoveredTiles.find().fetch();
    tiles.forEach(function(tile) {
      var btile = tile.tile;
      // create board-tile template
      var bt_object = $("<div class='board-tile' id="+tile._id+"></div>");
      // Add any specific things to the tile before appending it
      bt_object.html(btile.name);
      // Now append the object to the game board.
      $('#board').append(bt_object);
      // Make the board-tile droppable for players
      bt_object.droppable({
        accept: ".player",
        drop : function(event, ui) {
          var target = $(event.target);
          $(ui.draggable).css({"position": "initial"}).appendTo(target);
        }
      });
      // Add the doors and put them where they belong.
      tile.doors.forEach(function(position) {
        // Figure out the side the door should be on.
        var door = $("<div class='door'></div>");
        // Start with which side the door will be on (rooms will be squre for now.)
        if (position.x !== undefined) // horizontal
        {
          door.addClass("horizontal")
          if (position.x < 0) {
            door.css("left", "-2px");
          } else {
            door.css("right", "-2px")
          }

          var block = 0;
          // check if we've been told where to put the door
          if (position.b !== undefined) { // basically, this means the room is bigger than 1 block.
            block = position.b;
          }
          // Doors should be in the middle of the tile, which means a space of 25px for a single tile.
          // Bigger rooms are squares of bigger tiles, so we add 100 for each block we need to move.
          door.css("top", ((block * 100) + 25) + "px")
        }
        else if (position.y !== undefined) // vertical
        {
          door.addClass("vertical")
          if (position.y > 0) {
            door.css("top", "-2px")
          } else {
            door.css("bottom", "-2px")
          }

          var block = 0;
          // check if we've been told where to put the door
          if (position.b !== undefined) { // basically, this means the room is bigger than 1 block.
            block = position.b;
          }
          // Doors should be in the middle of the tile, which means a space of 25px for a single tile.
          // Bigger rooms are squares of bigger tiles, so we add 100 for each block we need to move.
          door.css("left", ((block * 100) + 25) + "px")
        }
        bt_object.append(door);
      })
      // Then move it to where it needs to go using the position
      // We set the positions multiplied by 99 so the borders match
      // To move it up, set the bottom position to (y * 99).
      // To move it right or left, add (x * 99) to -50 (the default margin-left) (x could be a negative number)
      var up = (tile.position.y * 100);
      var sideways = (tile.position.x * 100) + -50;
      bt_object.css({"bottom": up, "margin-left": sideways});
    })
  }
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
  'dropover .board-tile'(event, ui) {
    event.preventDefault();
    hidePossibleTiles($(event.target).attr("id"))

      // console.log("dropover!");
      // console.log(ui);
      // console.log(event.target);
      targetTile = $(event.target).attr("id");
    // Start off by getting the position of the tile we're hovering over
    var htile = $(event.target);
    var tile_id = htile.attr("id");
    var tile = DiscoveredTiles.findOne({_id:tile_id})
    // var position = tile.position;
    // We're going to want to create a possible tile for each door
    showPossibleTiles(tile);
  },
  'dragstart .player' (event, ui) {
    $(event.target).css({"position": "relative"});
  },
  'dragstop .player' (event, ui) {
    hidePossibleTiles()
  }
})

function showPossibleTiles(tile) {
  tile.doors.forEach(function(door_position) {
    // first we need to check if the door has already been "discovered"
    if (!door_position.d) {
      pt_object = $("<div class='possible-tile t_" + tile._id + "'></div>");
      var bottom, left;

      if (door_position.x !== undefined) { // On one of the sides
        bottom = tile.position.y * 100 // This will be affected by the "b" parameter
        left = ((tile.position.x + door_position.x) * 100) + -50;
      }
      else if (door_position.y !== undefined) { // On top or bottom
        bottom = ((tile.position.y + door_position.y) * 100);
        left = (tile.position.x * 100) + -50; // This will be affected by the "b" parameter
      }
      $('#board').append(pt_object);

      // bind all the possible-tile events now because they weren't around earlier to bind.
      pt_object.droppable({
        accept: ".player",
        drop : function(event, ui) {
          // When the player drops on this, we need to find its position and save a new discovered tile.
          var target = $(event.target);
          var tile_classes = target.attr("class");
          var id_pattern = /t_([A-Za-z0-9]+)/g;
          var dtile_id = id_pattern.exec(tile_classes)[1]
          var y_pos = parseInt(target.css("bottom")) / 100;
          var x_pos = (parseInt(target.css("margin-left")) + 50) / 100;
          newDiscoveredTile({x:x_pos, y:y_pos}, dtile_id);
        }
      })
      // Then we do the same thing as if adding a tile, just add 1 to the positions before multiplying them.
      pt_object.css({"bottom": bottom, "margin-left": left}).show();
    }
  });
}

function hidePossibleTiles(tile_id) {
  if(tile_id !== undefined) {
    $(".possible-tile:not(.t_"+tile_id+")").hide().remove();
  } else {
    // $('.possible-tile').hide().remove();
  }
}

function newDiscoveredTile(position, tile_id) {
  Meteor.call("discoveredTiles.insert", position, tile_id);
}

