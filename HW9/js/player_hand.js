jQuery.fn.swap = function(b) {
    // method from: http://blog.pengoworks.com/index.cfm/2008/9/24/A-quick-and-dirty-swap-method-for-jQuery
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};

function draw_tiles(letters_drawn) {
    var counter = 0;
    for (var i = 0; i < 7; i++) {
        var rand_int = getRandomInt(0, 26);
        do {
            if (rand_int == 26) {
                // special case : empty tile
                chr = "_";
            } else {
                // convert from ascii code( int to string)
                chr = String.fromCharCode(97 + rand_int);
            }
            // rand int now wraps around to get a new char if max letter reached
            rand_int = (++rand_int) % 27;
        } while (ScrabbleTiles[chr].number_remaining === 0);
        ScrabbleTiles[chr].number_remaining--;
        // reduce the no of remaining letter
        if (char_list.indexOf(chr) == -1) {
            // console.log("new chr found");
            // if all unique char
            // add id to li
            var newdiv = $('<li id="' + chr + '"class="ui-state-default tile tile-' + chr + '"></div>');
        } else {
            // if char already in list, add number to id
            console.log('found repeated chr');
            var newdiv = $('<li id="' + chr + ++counter + '"class="ui-state-default tile tile-' + chr + '"></div>');
        }
        letters_drawn.push(newdiv);
        // push newdiv to array to store
        char_list.push(chr);
        // store letter in an array
    }
    // console.log(char_list);
}

function generate_player_hand(letters_drawn, game_board, tile_class_array) {
    $('ul').empty();
    // empty rack 
    for (var i = 0; i < letters_drawn.length; i++) {
        $('ul').append(letters_drawn[i]);
        // draw rack
    }
    $(".tile").draggable({
        revert: 'invalid',
        // put the tile back if drag fail
        helper: "clone",
        // only use the clone instead of the actual thing
        stop: function() {
            // Source : taken from Jason Downing 
            $(this).draggable('option', 'revert', 'invalid');
        },
    });
    var start_tile_class = "start row-8 col-8 ui-droppable";
    // droppable logic for each cell
    $("td").droppable({
        accept: ".tile",
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id"); // a,b,c
            var draggableClass = ui.draggable.attr("class"); // class of a b c tiles
            var droppableID = $(this).attr("id"); // id of the tile (dropped)
            var droppableClass = $(this).attr("class"); // class of the tile (tile tile-a col-n row-n)
            var $this = $(this);
            if (droppableID === undefined) {
                // still can put stuff if, no dropped id yet
                $(this).attr("id", "dropped");
                // add dropped to td
                ui.draggable.detach().appendTo($(this));
                // detech element and add to board
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $this,
                    using: function(pos) {
                        $(this).animate(pos, "fast", "linear");
                    }
                }); // animate it!
                if (tile_array.indexOf(draggableID) === -1) {
                    // only accept unique tiles
                    var obj = {};
                    // using regex to get relevant data from id and class
                    var match;
                    match = draggableClass.match(/.*\stile-(\w).*/);
                    obj.letter = match[1];
                    match = droppableClass.match(/(\w+)\srow-(\d+)\scol-(\d+).*/);
                    obj.row = parseInt(match[2]); // field 2
                    obj.col = parseInt(match[3]); // field 3
                    obj.letter_value = match[1]; // field 1
                    obj.value = parseInt(ScrabbleTiles[obj.letter].value);
                    tile_array.push(draggableID); // get id of tile(a,b,c)
                    tile_class_array.push(obj); // put the obj into array to store 
                    // console.log(tile_class_array);
                } else {
                    // tile is already in, but dropped to a different location
                    update_location_of_tiles(droppableClass, draggableID, tile_class_array);
                    // console.log(tile_class_array);
                }
                // $("#" + draggableID).droppable('disable');
            } else {
                console.log("cell is already full");
                // already has a tile in it
                ui.draggable.draggable('option', 'revert', true);
                return;
                // return tile back to where it came from
            }
        },
        out: function(event, ui) {
            // moving a tile from one cell to another
            // should remove previous tile from tile array
            var draggableID = ui.draggable.attr("id");
            $(this).removeAttr('id');
            // strip the dropped id tag to make it avaialble to accept new tile again
        }
    });

    // box to return back to rack logic
    /*Source: http://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of-d */
    $("#return_rack").droppable({
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id");
            var draggableClass = ui.draggable.attr("class");
            var droppableID = $(this).attr("id");
            var droppableClass = $(this).attr("class");
            // var $this = $(this);
            // console.log('Dragged: ' + $(ui.draggable).attr("class"));
            ui.draggable.detach().appendTo("ul");
            // append back to drag
            ui.draggable.css({
                left: 0 + 'px',
                top: 0 + 'px'
            });
            tile_array.splice(tile_array.indexOf(draggableID));
            // removing tile from array store
            for (var i = 0; i < tile_class_array.length; i++) {
                if (tile_class_array[i].letter == draggableID) {
                    // find the right obj, and update info
                    tile_class_array.splice(i);
                    console.log("removing obj" + tile_class_array[i]);
                    breal;
                }
            }
            // TBD: find the tiles to remove from array of object
            console.log("number of tiles on board: " + tile_array_aray.length);
            // current_tile.splice(current_tile.indexOf(draggableID), 1);
        }
    });
}

function getRandomInt(min, max) {
    // getting random int
    return Math.floor(Math.random() * (max - min + 1)) + min;
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


// if tile already on board, update new location
function update_location_of_tiles(droppableClass, draggableID, tile_class_array) {
    var index;
    // get relevant data using regex
    var match = droppableClass.match(/(\w+)\srow-(\d+)\scol-(\d+).*/);
    for (var i = 0; i < tile_class_array.length; i++) {
        if (tile_class_array[i].letter == draggableID) {
            // find the right obj, and update info
            tile_class_array[i].row = parseInt(match[2]);
            tile_class_array[i].col = parseInt(match[3]);
            tile_class_array[i].letter_value = match[1];
        }
    }
}

function check_tile(tile_class_array) {
    // console.log(tile_class_array.length);
    // check if the tile is in a valid location
    if (tile_class_array.length > 1) {
        for (var i = 0; i < (tile_class_array.length); i++) {
            if (i + 1 === tile_class_array.length) {
                break;
                // stop when reach the end of array, not to go out of bound
            }
            // console.log("checking " + i + " vs " + (i + 1));
            // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
            if (valid_location(tile_class_array[i], tile_class_array[(i + 1)]) == false) {
                //  console.log("failed check_tile");
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
        if (tile_class_array[i].letter_value == "start") {
            // attempt to find the tag inside the array
            // return immediately if found
            return true;
        }
    }
    console.log("did not detect a start tile");
    //update the error msg if no start tile
    $("#error_message").html("Did not detect a start tiler");
    return false;
}

function sort_tiles(tile_class_array) {
    var location_array = [];
    var word_array = [];
    var vertical_word;
    var horizontal_word;
    // sort the tiles according to row and col number
    for (var i = 0; i < tile_class_array.length; i++) {
        if ((i + 1) < tile_class_array.length) {
            // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
            if (tile_class_array[i].row === tile_class_array[i + 1].row) {
                horizontal_word = true;
                // if all same row, its a horizontal_word
                break;
            } else if (tile_class_array[i].col === tile_class_array[i + 1].col) {
                vertical_word = true;
                // if all same col, its a vertical word
                break;
            }
        }
    }
    if (vertical_word) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].row);
            // push all row location
        }
        location_array.sort();
        // sort it
        while (word_array.length != location_array.length) {
            for (var i = 0; i < location_array.length; i++) {
                if (tile_class_array[i].row == location_array[i]) {
                    word_array.push(tile_class_array[i].letter);
                    // push all letter in sorted order
                }
            }
        }
    } else if (horizontal_word) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].col);
            // get col location
        }
        location_array.sort();
        // sort it
        while (word_array.length != location_array.length) {
            for (var i = 0; i < location_array.length; i++) {
                if (tile_class_array[i].col == location_array[i]) {
                    word_array.push(tile_class_array[i].letter);
                    // push all letter in sorted order
                }
            }
        }

    }
    return (word_array.join(''));
    // join all letter to get a string- the actual word
}