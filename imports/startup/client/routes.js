import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
// Layouts
import '../../ui/layouts/BaseLayout/BaseLayout.js';
// Pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/game/game.js';
import '../../ui/pages/not-found/not-found.js';


// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('BaseLayout', { main: 'home' });
  },
});

FlowRouter.route("/game", {
  name: 'App.game',
  action() {
    BlazeLayout.render('game');
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('BaseLayout', { main: 'notFound' });
  },
};
