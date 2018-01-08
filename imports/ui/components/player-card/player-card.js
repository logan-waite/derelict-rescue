import { Characters } from '/imports/api/characters/characters.js';
import { Meteor } from "meteor/meteor";
import './player-card.html';

Template.playerCard.onCreated(function () {
  Meteor.subscribe('characters');
});

Template.playerCard.helpers({
  character() {
    return Characters.findOne();
  }
})