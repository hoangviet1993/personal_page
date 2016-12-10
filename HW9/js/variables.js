/*
    File: variables.js for Hw9 global variables
    91.461 Assignment 9: 1/3 of Scrabble Game
    Viet Tran Quoc Hoang- student at UMass Lowell in 91.461 GUI Programming I
    Contact: vtran1@cs.uml.edu 
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    May be freely copied or excerpted for educational purposes with credit to the author.
*/
var char_list = []; // list of char on rack
var ScrabbleTiles = []; // the bag that contain all tiles
var word_list = []; // list of completed word :TBD
var tile_array = []; // list of all tiles that has word on the board(n,c,d)
var completed_word = []; // containing all words in it
var tile_class_array = []; // containing all the tile object
var permanent_tile_array = []; // permanently placed tile TBD
var number_of_round = 0; // TBD
var letters_drawn = []; // new div drawn for each tile
var score = 0;