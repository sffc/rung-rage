Rung Rage
=========

This project contains a virtual implementation of Rung Rage, including a simple minimax AI player.  The game was originally conceived by Rohan.

There are two font-ends: a command line front-end (Node.JS) and a web page.

## Command Line

To run the command line front end, do the following:

	$ npm install
	$ node app.js

Then follow the prompts to play against the computer.

## Web Page

A controller for the web UI is available in *lib/controller.js*, with an example usage in *html/index.html*.  In order to run the demo, you first need to compile the JavaScript for browser usage:

	$ npm install -g grunt
	$ grunt
