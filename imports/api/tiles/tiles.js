import { Mongo } from 'meteor/mongo';

export const Tiles = new Mongo.Collection("tiles");
export const DiscoveredTiles = new Mongo.Collection("discoveredTiles");