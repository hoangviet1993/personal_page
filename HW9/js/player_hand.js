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
                chr = String.fromCharCode(97 + rand_int);
            }
            // rand int now wraps around to get a new char if max letter reached
            rand_int = (++rand_int) % 27;
        } while (ScrabbleTiles[chr].number_remaining === 0);
        ScrabbleTiles[chr].number_remaining--;
        if (char_list.indexOf(chr) == -1) {
            // console.log("new chr found");
            var newdiv = $('<li id="' + chr + '"class="ui-state-default tile tile-' + chr + '"></div>');
        } else {
            console.log('found repeated chr');
            var newdiv = $('<li id="' + chr + ++counter + '"class="ui-state-default tile tile-' + chr + '"></div>');
        }
        letters_drawn.push(newdiv);
        char_list.push(chr);
    }
    // console.log(char_list);
}

function generate_player_hand(letters_drawn, game_board, tile_class_array) {
    $('ul').empty();
    for (var i = 0; i < letters_drawn.length; i++) {
        $('ul').append(letters_drawn[i]);
    }
    /*Source: http://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of-d */
    $("#return_rack").droppable({
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id");
            var draggableClass = ui.draggable.attr("class");
            var droppableID = $(this).attr("id");
            var droppableClass = $(this).attr("class");
            //  generate_player_hand(letters_drawn);
            // var $this = $(this);
            // console.log('Dragged: ' + $(ui.draggable).attr("class"));
            ui.draggable.detach().appendTo("ul");
            ui.draggable.css({
                left: 0 + 'px',
                top: 0 + 'px'
            });
            tile_array.splice(tile_array.indexOf(draggableID));
            tile_class_array.splice(tile_class_array.indexOf(draggableClass));
            console.log("number of tiles on board: " + tile_array.length);
            // current_tile.splice(current_tile.indexOf(draggableID), 1);
            // console.log(ui.draggable);
            // var draggable = ui.draggable,
            //     droppable = $(this),
            //     dragPos = draggable.position(),
            //     dropPos = droppable.position();
            // draggable.css({
            //     left: dropPos.left + 'px',
            //     top: dropPos.top + 'px'
            // });
            // droppable.css({
            //     left: dragPos.left + 'px',
            //     top: dragPos.top + 'px'
            // });
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function legal_move(droppableClass, previous) {
    console.log(previous);
    var match = previous.match(/(\d+).*-(\d+).*/);
    var start_row = parseInt(match[1]);
    var start_col = parseInt(match[2]);

    match = droppableClass.match(/(\d+).*-(\d+).*/);
    var new_row = parseInt(match[1]);
    var new_col = parseInt(match[2]);

    if (start_row === new_row) {
        if (Math.abs(start_col - new_col) < 2) {
            console.log(start_col + " " + new_col);
            return true;
        }

    } else if (start_col === new_col) {
        if (Math.abs(start_row - new_row) < 2) {
            return true;
        }
    }
    return false;
}

function update_location_of_tiles(droppableClass, draggableID, tile_class_array) {
    var index;
    var match = droppableClass.match(/(\w+)\srow-(\d+)\scol-(\d+).*/);
    for (var i = 0; i < tile_class_array.length; i++) {
        if (tile_class_array[i].letter == draggableID) {
            tile_class_array[i].row = parseInt(match[2]);
            tile_class_array[i].col = parseInt(match[3]);
            tile_class_array[i].letter_value = match[1];
        }
    }
}

function check_tile(tile_class_array) {
    console.log(tile_class_array.length);
    if (tile_class_array.length > 1) {
        for (var i = 0; i < (tile_class_array.length); i++) {
            if (i + 1 === tile_class_array.length) {
                break;
            }
            // console.log("checking " + i + " vs " + (i + 1));
            // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
            if (valid_location(tile_class_array[i], tile_class_array[(i + 1)]) == false) {
                console.log("failed check_tile");
                return false;
            }
        }
        return true;
    }
}

function valid_location(first_tile, second_tile) {
    // console.log(first_tile + " " + second_tile);
    if (first_tile.row === second_tile.row) {
        if (Math.abs(first_tile.col - second_tile.col) < 2) {
            return true;
        }
        return false;
    } else if (first_tile.col === second_tile.col) {
        if (Math.abs(first_tile.row - second_tile.row) < 2) {
            return true;
        }
        return false;
    }
    return false;
}

function game_started(tile_class_array) {
    for (var i = 0; i < tile_class_array.length; i++) {
        if (tile_class_array[i].letter_value == "start") {
            return true;
        }
    }
    console.log("did not detect a start tile");
    return false;
}

function sort_tiles(tile_class_array) {
    var location_array = [];
    var word_array = [];
    var vertical_word;
    var horizontal_word;
    for (var i = 0; i < tile_class_array.length; i++) {
        if ((i + 1) < tile_class_array.length) {
            // console.log(tile_class_array[i] + " " + tile_class_array[i + 1]);
            if (tile_class_array[i].row === tile_class_array[i + 1].row) {
                horizontal_word = true;
                break;
            } else if (tile_class_array[i].col === tile_class_array[i + 1].col) {
                vertical_word = true;
                break;
            }
        }
    }
    if (vertical_word) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].row);
        }
        location_array.sort();
        while (word_array.length != location_array.length) {
            for (var i = 0; i < location_array.length; i++) {
                if (tile_class_array[i].row == location_array[i]) {
                    word_array.push(tile_class_array[i].letter);
                }
            }
        }
    } else if (horizontal_word) {
        for (var i = 0; i < tile_class_array.length; i++) {
            location_array.push(tile_class_array[i].col);
        }
        location_array.sort();
        while (word_array.length != location_array.length) {
            for (var i = 0; i < location_array.length; i++) {
                if (tile_class_array[i].col == location_array[i]) {
                    word_array.push(tile_class_array[i].letter);
                }
            }
        }

    }
    return (word_array.join(''));
}