// All character related publications

import { Meteor } from 'meteor/meteor';
import { Characters } from '../characters.js';

Meteor.publish('characters', function () {
  return Characters.find();
});