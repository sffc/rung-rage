Rung Rage
=========

This project contains a virtual implementation of Rung Rage, including a simple minimax AI player.  The game was originally conceived by Rohan.

There are two font-ends: a command line front-end (Node.JS) and a web page.  You can preview the web-based version at the following URL.

http://shane.guru/rung-rage/html/

### Command Line

To run the command line front end, do the following:

	$ npm install
	$ node app.js

Then follow the prompts to play against the computer.

### Web Page

A controller for the web UI is available in *lib/controller.js*, with an example usage in *html/index.html*.  In order to run the demo, you first need to compile the JavaScript for browser usage:

	$ npm install
	$ npm install -g grunt
	$ grunt

## Running Simulations

You can run simulations of the computer playing against itself.  Edit the file named *ai_squared.js* to your liking, and then run it as `node ai_squared.js`.  It will print out scores of simulation games in a loop until you stop the script with Ctrl-C.
