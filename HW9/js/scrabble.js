/*
    File: scrabble.js for Hw9 handle the main game logic
    91.461 Assignment 9: 1/3 of Scrabble Game
    Viet Tran Quoc Hoang- student at UMass Lowell in 91.461 GUI Programming I
    Contact: vtran1@cs.uml.edu 
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    May be freely copied or excerpted for educational purposes with credit to the author.
*/
$(document).ready(function() {
    make_bags();
    draw_board();
    // draw the board
    draw_tiles(letters_drawn, 7);
    // draw tiles from randomnesss
    generate_player_hand(letters_drawn, tile_class_array);
    make_return_droppable();
    make_shuffle_droppable();
    $("#recall_tiles").attr('disabled', 'disabled');
    $("#end_turn").attr('disabled', 'disabled');
    $("#recall_tiles").click(function() {
        // re-draw board
        draw_board();
        console.log("RECALL TILES: ");
        // moving tiles from board back to rack
        if (char_list.length < 8 && letters_drawn.length < 8) {
            // need to deduce whether if there is space , if there is enough space
            // iterate through all tiles on board
            $("#error_message").html("Putting " + tile_class_array.length + " tiles back.");
            for (var i = 0; i < tile_class_array.length; i++) {
                if (char_list.indexOf(tile_class_array[i].id) == -1) {
                    // only put back when unique
                    char_list.push(tile_class_array[i].id);
                    // put id back
                    var new_div = $('<li id="' + tile_class_array[i].id + '"class="ui-state-default tile tile-' + tile_class_array[i].letter + '"></div>');
                    if (letters_drawn.indexOf(new_div) == -1) {
                        // only put back when unique
                        letters_drawn.push(new_div);
                    }
                    // put li div back
                    // remove tiles from board array
                }
            }
            if (char_list.length == 7) {
                // only when the rack is full
                // reset the board array
                tile_class_array = [];
                tile_array = [];
            } else {
                console.log('there are tiles on the board still');
            }
        }
        console.log(tile_array);
        console.log(tile_class_array);
        console.log(char_list);
        generate_player_hand(letters_drawn);
        $("#recall_tiles").attr('disabled', 'disabled');
        $("#end_turn").attr('disabled', 'disabled');
        // draw hands again
    });
    $("#new_hand").click(function() {
        var current_no_of_tiles = char_list.length; // only exchange the current number of tiles on hand
        console.log("NEW HAND");
        for (var i = 0; i < current_no_of_tiles; i++) {
            var match = char_list[i].match(/(\w)\d*/);
            // console.log(char_list[i]);
            // console.log("Putting back: " + match[1]);
            ScrabbleTiles[match[1]].number_remaining++;
            // put the tiles back to the bag
        }
        calculate_total_remaining();
        letters_drawn = []; // empty out all arrays that contains relevant data abt player hand
        char_list = [];
        draw_tiles(letters_drawn, current_no_of_tiles); // only draw the no of tiles on hand
        generate_player_hand(letters_drawn); // redraw rack
        $("#error_message").html("Exchanged " + current_no_of_tiles + " tiles");
        $("#tile_removed").html("");
    });
    // draw the hands and play the game!
    $("#new_game").click(function() {
        // this funciton resets everything back to starting state
        make_bags();
        draw_board(); // drawing board again
        letters_drawn = []; // reset rack arrays 
        tile_class_array = []; // reset tile obj array
        char_list = [];
        draw_tiles(letters_drawn, 7); // draw brand new 7 tiles
        generate_player_hand(letters_drawn); // render tiles drawn
        score = 0;
        $("#error_message").html("Game Restarted");
        $("#tile_removed").html("");
        $("#score").html("Score: 0");
        $("#recall_tiles").attr('disabled', 'disabled');
        $("#end_turn").attr('disabled', 'disabled');
        // reset the entire game
        // refreshes all array
        // draw new hands as well refreshes the data structure of the bag
    });
    $("#end_turn").click(function() {
        // process all tiles on board
        // if first round
        // more than one tiles in the pending tile array
        $("#tile_removed").html("");
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
        // if (game_started(tile_class_array) === true) {
        // if start is filled and tiles are in legal locations
        var word = join_word(tile_class_array, "");
        // join the letters up into a word
        // Thankful for Jason for sharing this
        if (dict[word]) {
            // thankful for Jason for finding and sharing this
            score = display_word_and_add_score(tile_class_array, score);
            replenish_player_hands(letters_drawn, tile_class_array);
            draw_board();
            // reset board if found valid word
            // all tiles on board are removed permanently from the board
            // console.log("AFTER updating score: ");
            // console.log(score)
            tile_class_array = [];
            tile_array = [];
            // reset pending tile array
            if (tile_class_array.length == 0 && tile_array == 0) {
                $("#recall_tiles").attr('disabled', 'disabled');
            }
            return;
        } else {
            $("#error_message").html("Cannot find the word: " + word);
            console.log(tile_class_array);
            return;
        }
        // I decided to follow the specs and just reset the board once a word has been matched
        // with one from the dictionary 
        // might come back to this once I have more time
        // } else {
        //     console.log("The tiles are not in valid locations, if get here, we missing a case")
        //     return;
        //     // $("#error_message").html("The tiles are in an invalid locations");
        // }

        // else if (number_of_round > 0) {
        //     console.log("number of round: " + number_of_round);
        //     console.log("END TURN: tile class array len: " + tile_class_array.length);
        //     if (tile_class_array.length > 1) {
        //         var temp_array = tile_class_array;
        //         tile_class_array = sort_tiles(tile_class_array);
        //         // sort it, if it has a diagonal tile in it, function will return empty tile
        //         if (tile_class_array.length === 0) {
        //             $("#error_message").html("Please place tiles either horizontally or vertically");
        //             tile_class_array = temp_array;
        //             return;
        //         }
        //         // console.log("Sort finished");
        //         // console.log(tile_class_array.length);
        //         // sort all the tiles, either from top -> down or left -> right
        //         if (!check_tile(tile_class_array)) {
        //             // check for illegally placed tiles
        //             console.log("Tiles are placed too far from one another")
        //             return;
        //         }
        //     }
        //     var word = get_word(tile_class_array);
        //     // join the letters up into a word
        //     if (dict[word]) {
        //         // thankful for Jason for finding and sharing this
        //         score = display_word_and_add_score(tile_class_array, word, score, letters_drawn);

        //         tile_class_array = [];
        //         // reset pending tile array
        //         return;
        //     } else {
        //         $("#error_message").html("Cannot find the word :" + word);
        //         return;
        //     }
        // }
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
            $("#tile_removed").html("");
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
            console.log("EXCHANGE: ");
            console.log(tile_class_array);
            // console.log("BEFORE");
            // console.log(letters_drawn);
            // console.log("Removed tile from obj array" + tile_class_array);
            if (char_list.indexOf(draggableID) != -1) {
                var idx = char_list.indexOf(draggableID);
                // console.log(char_list[char_list.indexOf(draggableID[0])]);
                // if still can find tile to removed on rack
                // remove it
                // console.log(char_list[draggableID]);
                // console.log(char_list[idx]);
                char_list.splice(idx, 1);
                letters_drawn.splice(idx, 1);
                // remove only the dropped element
            }
            // console.log("AFTER");
            // console.log(letters_drawn);
            // console.log("Removed tile from char_list, length is now" + char_list.length);
            // console.log("BEFORE:" + ScrabbleTiles[toString(match[1])].number_remaining);
            var match = draggableID.match(/(\w)\d*/);
            ScrabbleTiles[match[1]].number_remaining++;
            calculate_total_remaining();
            // using regex just to grab the letter from tile id( w1 -> w)
            // and put it back to the "bag"
            // console.log("AFTER" + ScrabbleTiles[match[1]].number_remaining);
            // console.log(char_list);
            // add tile back to rack
            draw_tiles(letters_drawn, parseInt(1));
            // draw all tiles again
            generate_player_hand(letters_drawn);
            new_tile_match = char_list[char_list.length - 1].match(/(\w)\d*/);
            $("#error_message").html("Traded " + match[1] + " for " + new_tile_match[1]);
            if (tile_class_array.length == 0) {
                $("#recall_tiles").attr('disabled', 'disabled');
            }
        }
    });
}

// box to return back to rack logic
/*Source: http://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of-d */
function make_return_droppable() {
    $("#return_rack").droppable({
        accept: ".tile",
        tolerance: 'pointer',
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id"); // a,b,c,c1
            var draggableClass = ui.draggable.attr("class"); // class of a b c tile
            var droppableID = $(this).attr("id"); // dropped 
            var droppableClass = $(this).attr("class"); // col-1 row-2 start 
            ui.draggable.detach(); // remove from board
            var match = draggableID.match(/(\w)\d*/); // using regex just to the tile letter
            if (char_list.indexOf(draggableID) == -1) {
                // if the char list doesnt have the tile , return it back to rack
                char_list.push(draggableID);
                var new_div = $('<li id="' + draggableID + '"class="ui-state-default tile tile-' + match[1] + '"></div>');
                if (letters_drawn.indexOf(new_div) == -1) {
                    letters_drawn.push(new_div);
                }
                // supposed to put back the div too
                $("#error_message").html("Returning " + match[1] + " back");
            }
            generate_player_hand(letters_drawn); // draw the hand once again
            for (var i = 0; i < tile_class_array.length; i++) {
                if (tile_class_array[i].id === draggableID) {
                    // find the right obj, and update info
                    // console.log("found and removing obj" + tile_class_array[i]);
                    // remove the tile from the board
                    tile_class_array.splice(i, 1);
                    tile_array.splice(i, 1);
                    // also remove from tile_array to check if tile already exist on board
                    break;
                }
            }
            // find the tiles to remove from array of object
            console.log("RETURN: ");
            //console.log(letters_drawn.length);
            // console.log(draggableID);
            // console.log("match[1] :" + match[1]);
            console.log(tile_class_array);
            console.log(tile_array);
            console.log(char_list);
            if (tile_class_array.length == 0) {
                $("#recall_tiles").attr('disabled', 'disabled');
            }
        }
    });
}

// Source: Jason Downing
// The dictionary hash table
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

function join_word(tile_class_array, separator) {
    var word_array = [];
    // sort the tiles according to row and col number
    for (var i = 0; i < tile_class_array.length; i++) {
        word_array.push(tile_class_array[i].letter);
    }
    // console.log("word:");
    // console.log(word_array.join(separator));
    return (word_array.join(separator));
    // join all letter to get a string- the actual word
}

function sort_tiles(tile_class_array) {
    // this function sort all of the tiles the user put on the board based on row or col
    //( vertical or horizontal word)
    // put resulting sorted array out to check for word after
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
            // console.log(location_array);
        }
        // have an array of row number, sorted
        // want to find the index of which these row number belongs to
        var i = 0;
        var j = 0;
        while (new_tile_class_array.length != tile_class_array.length) {
            if (tile_class_array[i].row === location_array[j]) {
                // if the row number matches , push the element at tat id into new array
                new_tile_class_array.push(tile_class_array[i]);
                j++;
            }
            i++;
            if (i === tile_class_array.length) {
                i = 0; // reset index number
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
            // console.log(location_array);
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
    console.log("SORTED: ");
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