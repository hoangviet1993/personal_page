$(document).ready(function() {

    draw_board();
    // draw the board
    draw_tiles(letters_drawn, 7);
    // draw tiles from randomnesss
    generate_player_hand(letters_drawn, tile_class_array);
    make_return_droppable();
    make_shuffle_droppable();
    $("#new_hand").click(function() {
        var tiles_left = char_list.length;
        for (var i = 0; i < char_list.length; i++) {
            ScrabbleTiles[char_list[i]].number_remaining++;
        }
        letters_drawn = [];
        char_list = [];
        draw_tiles(letters_drawn, tiles_left);
        // only draw out the same nummber of tiles
        generate_player_hand(letters_drawn);
        $("#error_message").html("Exchanged " + tiles_left + " tiles");
    });
    // draw the hands and play the game!
    $("#new_game").click(function() {
        draw_board();
        letters_drawn = [];
        char_list = [];
        tile_class_array = [];
        draw_tiles(letters_drawn, 7);
        generate_player_hand(letters_drawn);
        for (var i = 0; i < ScrabbleTiles.length; i++) {
            ScrabbleTiles[i].number_remaining = ScrabbleTiles[i].original_distribution;
        }
        score = 0;
        $("#error_message").html("Game Restarted");
        $("#score").html("Score : 0");
        // reset the entire game
        // refreshes all array
        // draw new hands as well refreshes the data structure of the bag
    });
    $("#end_turn").click(function() {
        // process all tiles on board
        // if first round
        if (number_of_round === 0) {
            // more than one tiles in the pending tile array
            if (tile_class_array.length > 1) {
                var temp_array = tile_class_array;
                tile_class_array = sort_tiles(tile_class_array);
                // sort it, if it has a diagonal tile in it, function will return empty tile
                if (tile_class_array.length === 0) {
                    $("#error_message").html("Please place tiles either horizontally or vertically");
                    tile_class_array = temp_array;
                    return;
                }
                // console.log("Sort finished");
                // console.log(tile_class_array.length);
                // sort all the tiles, either from top -> down or left -> right
                if (!check_tile(tile_class_array)) {
                    // check for illegally placed tiles
                    console.log("Tiles are placed too far from one another")
                    return;
                }
            }
            if (game_started(tile_class_array) === true) {
                // if start is filled and tiles are in legal locations
                var word = get_word(tile_class_array);
                // join the letters up into a word
                if (dict[word]) {
                    // thankful for Jason for finding and sharing this
                    score = display_word_and_add_score(tile_class_array, word, score, letters_drawn);
                    // console.log("AFTER updating score: ");
                    // console.log(score)
                    tile_class_array = [];
                    // reset pending tile array
                    return;
                } else {
                    $("#error_message").html("Cannot find the word :" + word);
                    return;
                }
            } else {
                console.log("The tiles are not in valid locations, if get here, we missing a case")
                return;
                // $("#error_message").html("The tiles are in an invalid locations");
            }
        } else if (number_of_round > 0) {
            console.log("number of round: " + number_of_round);
            console.log("END TURN: tile class array len: " + tile_class_array.length);
            if (tile_class_array.length > 1) {
                var temp = tile_class_array;
                tile_class_array = sort_tiles(tile_class_array);
                // sort it, if it has a diagonal tile in it, function will return empty tile
                if (tile_class_array.length === 0) {
                    $("#error_message").html("Please place tiles either horizontally or vertically");
                    tile_class_array = temp;
                    return;
                }
                // console.log("Sort finished");
                // console.log(tile_class_array.length);
                // sort all the tiles, either from top -> down or left -> right
                if (!check_tile(tile_class_array)) {
                    // check for illegally placed tiles
                    console.log("Tiles are placed too far from one another")
                    return;
                }
            }
            var word = get_word(tile_class_array);
            // join the letters up into a word
            if (dict[word]) {
                // thankful for Jason for finding and sharing this
                score = display_word_and_add_score(tile_class_array, word, score, letters_drawn);

                tile_class_array = [];
                // reset pending tile array
                return;
            } else {
                $("#error_message").html("Cannot find the word :" + word);
                return;
            }


        }
    });
});

// Do a jQuery Ajax request for the text dictionary
$.get("files/dictionary.txt", function(txt) {
    // Get an array of all the words
    var words = txt.split("\n");
    // And add them as properties to the dictionary lookup
    // This will allow for fast lookups later
    for (var i = 0; i < words.length; i++) {
        dict[words[i]] = true;
    }
});

function make_shuffle_droppable() {
    // shuffling one single dropped tile
    // add back to original bag
    // draw 1 new tile and display it
    $("#shuffle_tile").droppable({
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id"); // a,b,c,c1
            ui.draggable.detach();
            var draggableClass = ui.draggable.attr("class"); // class of a b c tile
            var droppableID = $(this).attr("id"); // dropped 
            var droppableClass = $(this).attr("class"); // col-1 row-2 start 
            // console.log(draggableID);
            var index;
            for (var i = 0; i < tile_class_array.length; i++) {
                if (draggableID == tile_class_array[i].id) {
                    index = i;
                    // remove from tile arrays
                    tile_class_array.splice(i, 1);
                }
            }
            var match = draggableID.match(/(\w)\d*/);
            // console.log("BEFORE");
            // console.log(letters_drawn);
            // console.log("Removed tile from obj array" + tile_class_array);
            if (char_list.indexOf(match[1]) != -1) {
                var idx = char_list.indexOf(match[1]);
                //console.log(char_list[char_list.indexOf(draggableID[0])]);
                //     // if still can find tile to removed on rack
                //     // remove it
                //     console.log(char_list[draggableID]);
                // console.log(char_list[idx]);
                char_list.splice(idx, 1);
                letters_drawn.splice(idx, 1);
                // remove only the dropped element
            }
            // console.log("AFTER");
            // console.log(letters_drawn);
            // console.log("Removed tile from char_list, length is now" + char_list.length);
            // console.log("BEFORE:" + ScrabbleTiles[toString(match[1])].number_remaining);
            ScrabbleTiles[match[1]].number_remaining++;
            // console.log("AFTER" + ScrabbleTiles[match[1]].number_remaining);
            //  console.log(char_list);
            //  add tile back to rack
            draw_tiles(letters_drawn, 1);
            // draw all tiles again
            generate_player_hand(letters_drawn);
            $("#error_message").html("Traded " + match[1] + " for " + char_list[char_list.length - 1]);
        }
    });
}

// box to return back to rack logic
/*Source: http://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of-d */
function make_return_droppable() {
    $("#return_rack").droppable({
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id"); // a,b,c,c1
            var draggableClass = ui.draggable.attr("class"); // class of a b c tile
            var droppableID = $(this).attr("id"); // dropped 
            var droppableClass = $(this).attr("class"); // col-1 row-2 start 
            // var $this = $(this);
            // console.log('Dragged: ' + $(ui.draggable).attr("class"));
            ui.draggable.detach().appendTo("ul");
            // append back to drag
            ui.draggable.css({
                left: 0 + 'px',
                top: 0 + 'px'
            });
            console.log("length of char list BEFORE" + char_list.length);
            char_list.push(draggableID);
            console.log("length of char list AFTER" + char_list.length);
            // removing tile from array store
            // console.log("BEFORE: number of tiles on board: " + tile_class_array.length);
            // console.log("draggableID: " + draggableID);
            for (var i = 0; i < tile_class_array.length; i++) {
                if (tile_class_array[i].letter === draggableID) {
                    // find the right obj, and update info
                    // console.log("found and removing obj" + tile_class_array[i]);
                    // remove the tile from the board
                    tile_class_array.splice(i, 1);
                    break;
                }
            }
            // find the tiles to remove from array of object
            console.log("RETURN: number of tiles on board: " + tile_class_array.length);
            // current_tile.splice(current_tile.indexOf(draggableID), 1);
        }
    });
}



// Source: Jason Downing
// The dictionary lookup object
var dict = {};

// Modified to only pass in one word, which can then be verified.
function findWord(word) {
    // See if it's in the dictionary
    if (dict[word]) {
        // If it is, return that word
        return word;
    }
    // Otherwise, it isn't in the dictionary.
    return "_____";
}

function check_tile(tile_class_array) {
    // console.log(tile_class_array.length);
    // check if the tile is in a valid location
    // should try to sort out the array object first
    if (tile_class_array.length > 1) {
        for (var i = 0; i < (tile_class_array.length - 1); i++) {
            // console.log("checking " + i + " vs " + (i + 1));
            // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
            if (valid_location(tile_class_array[i], tile_class_array[(i + 1)]) == false) {
                console.log("failed check_tile");
                // update error msg
                $("#error_message").html("Tiles need to be next to each other!");
                return false;
                //return state appropriately
            }
        }
        return true;
    }
}

function valid_location(first_tile, second_tile) {
    // console.log(first_tile + " " + second_tile);
    //same row
    if (first_tile.row === second_tile.row) {
        if (Math.abs(first_tile.col - second_tile.col) < 2) {
            // check if valid location ,when diff btw location is <2 valid
            return true;
        }
        return false;
    } else if (first_tile.col === second_tile.col) {
        // or same column
        if (Math.abs(first_tile.row - second_tile.row) < 2) {
            return true;
        }
        return false;
    }
    return false;
}

function game_started(tile_class_array) {
    // check if the start tile has a tile in it
    for (var i = 0; i < tile_class_array.length; i++) {
        if (tile_class_array[i].letter_value === "start") {
            // attempt to find the tag inside the array
            // return immediately if found
            return true;
        }
    }
    console.log("did not detect a start tile");
    //update the error msg if no start tile
    $("#error_message").html("Did not detect a start tile");
    return false;
}

function get_word(tile_class_array) {
    var word_array = [];
    // sort the tiles according to row and col number
    for (var i = 0; i < tile_class_array.length; i++) {
        word_array.push(tile_class_array[i].letter);
    }
    console.log("word:");
    console.log(word_array.join(''));
    return (word_array.join(''));
    // join all letter to get a string- the actual word
}

function sort_tiles(tile_class_array) {
    var location_array = [];
    var vertical_word;
    var horizontal_word;
    var word_array = [];
    var new_tile_class_array = [];
    if (is_vertical(tile_class_array) && !is_horizontal(tile_class_array)) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].row);
            // push all row location
        }
        while (is_sorted(location_array) != true) {
            location_array.sort(function(a, b) { return a - b });
            // sort the array in ascending order
            console.log(location_array);
        }
        var i = 0;
        var j = 0;
        // have an array of row number, sorted
        // want to find the index of which these row number belongs to
        // sort into new array
        while (new_tile_class_array.length != tile_class_array.length) {
            if (tile_class_array[i].row === location_array[j]) {
                new_tile_class_array.push(tile_class_array[i]);
                j++;
            }
            i++;
            if (i === tile_class_array.length) {
                i = 0;
            }
        }
    } else if (is_horizontal(tile_class_array) && !is_vertical(tile_class_array)) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].col);
            // get col location
        }
        while (is_sorted(location_array) != true) {
            location_array.sort(function(a, b) { return a - b });
            // sort the array in ascending order
            console.log(location_array);
        }
        // have an array of col number, sorted
        // want to find the index of which these col number belongs to
        var i = 0;
        var j = 0;
        while (new_tile_class_array.length != tile_class_array.length) {
            if (tile_class_array[i].col === location_array[j]) {
                new_tile_class_array.push(tile_class_array[i]);
                j++;
            }
            i++;
            if (i === tile_class_array.length) {
                i = 0;
            }
        }
    }
    // console.log(location_array);
    // console.log("new sorted array");
    // console.log(new_tile_class_array);
    return new_tile_class_array; // return empty array if not horizontal or vertical
}


function is_sorted(arr) {
    var len = arr.length - 1;
    for (var i = 0; i < len; ++i) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

function is_vertical(tile_class_array) {
    var vertical_word = false;
    for (var i = 0; i < tile_class_array.length - 1; i++) {
        // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
        if (tile_class_array[i].col === tile_class_array[i + 1].col) {
            vertical_word = true;
            // if all same row, its a horizontal_word
        }
    }
    return vertical_word;
}

function is_horizontal(tile_class_array) {
    var horizontal_word = false;
    for (var i = 0; i < tile_class_array.length - 1; i++) {
        // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
        if (tile_class_array[i].row === tile_class_array[i + 1].row) {
            horizontal_word = true;
            // if all same row, its a horizontal_word
        }
    }
    return horizontal_word;
}