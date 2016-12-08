var char_list = []; // list of char on board
var word_list = []; // list of completed word :TBD
var tile_array = []; // list of all tiles that has word on the board(n,c,d)
var deleted_tile;
var completed_word = []; // containing all words in it
var tile_class_array = []; // containing all the tiles put on the board legally(single letter format)
var permanent_tile_array = [];
var number_of_round = 0;
var letters_drawn = []; // new div drawn for each tile
var letter_list = []; // list of letter drawn(7 at a time) a,b,c
var score = 0;