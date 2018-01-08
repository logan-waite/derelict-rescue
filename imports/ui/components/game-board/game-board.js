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
  currentTiles() {

    var tiles = DiscoveredTiles.find().fetch();

    tiles.forEach(function(tile) {
      var btile = tile.tile;
      // create board-tile template
      var bt_object = $("<div class='board-tile' id="+tile._id+"></div>");
      // Add any specific things to the tile before appending it
      bt_object.html(btile.name);
      // Now append the object to the game board.
      $('#board').append(bt_object);
      // Then move it to where it needs to go using the position
      // We set the positions multiplied by 99 so the borders match
      // To move it up, set the bottom position to (y * 99).
      // To move it right or left, add (x * 99) to -50 (the default margin-left) (x could be a negative number)
      var up = (tile.position.y * 99);
      var sideways = (tile.position.x * 99) + -50;
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
  // Hovering events (mostly for showing potential routes from this tile)
  'mouseenter .board-tile'(event) {
    event.preventDefault();
    console.log("hover");
    // Start off by getting the position of the tile we're hovering over
    var htile = $(event.target);
    var tile_id = htile.attr("id");
    var tile = DiscoveredTiles.findOne({_id:tile_id})
    var position = tile.position;
    // We're going to want to create a possible tile for each door
    pt_object = $("<div class='possible-tile t_" + tile._id + "'></div>");
    $('#board').append(pt_object);
    // Then we do the same thing as if adding a tile, just add 1 to the positions before multiplying them.
    pt_object.css({"bottom": ((tile.position.y) * 100), "margin-left": ((tile.position.x + 1) * 100) + -50}).show();
  },
  'mouseleave .board-tile'(event) {
    event.preventDefault();
    console.log("exiting");
    var htile = $(event.target);
    var tile_id = htile.attr("id");
    console.log(tile_id);
    $(".t_"+tile_id).hide().remove();
  }
})

