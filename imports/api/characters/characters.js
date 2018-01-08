// Definition of the Characters collection

import { Mongo } from 'meteor/mongo';

export const Characters = new Mongo.Collection('characters');
export const Skills = new Mongo.Collection('skills');