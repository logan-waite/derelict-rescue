import { Mongo } from 'meteor/mongo';

export const Rooms = new Mongo.Collection("rooms");
export const DiscoveredRooms = new Mongo.Collection("discoveredRooms");