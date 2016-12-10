/*
    File: hand.js for hw9 , handle drawing tiles from bag and display them
    91.461 Assignment 9: 1/3 of Scrabble Game
    Viet Tran Quoc Hoang- student at UMass Lowell in 91.461 GUI Programming I
    Contact: vtran1@cs.uml.edu 
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    May be freely copied or excerpted for educational purposes with credit to the author.
*/
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

function draw_tiles(letters_drawn, num) {
    var counter = 0;
    var new_div;
    for (var i = 0; i < num; i++) {
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
            new_div = $('<li id="' + chr + '"class="ui-state-default tile tile-' + chr + '"></div>');
            char_list.push(chr);
        } else {
            // if char already in list, add number to id
            // console.log('found repeated chr');
            new_div = $('<li id="' + chr + ++counter + '"class="ui-state-default tile tile-' + chr + '"></div>');
            char_list.push(chr + counter);
        }
        letters_drawn.push(new_div);
        // push new_div to array to store 
        // store letter in an array
    }
    console.log(char_list);
    calculate_total_remaining();
    // update total
    // console.log(letters_drawn);
}

function getRandomInt(min, max) {
    // getting random int within a range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate_player_hand(letters_drawn) {
    $('ul').empty();
    // empty rack 
    for (var i = 0; i < letters_drawn.length; i++) {
        $('ul').append(letters_drawn[i]);
        // draw rack
    }
    make_tile_draggable();
}

function make_tile_draggable() {
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
}

function replenish_player_hands(letters_drawn, tile_class_array) {
    // remove placed tiles from letter drawn list
    // console.log(char_list);
    while (char_list.length > 7 - tile_class_array.length) {
        for (var i = 0; i < tile_class_array.length; i++) {
            var index = char_list.indexOf(tile_class_array[i].letter);
            letters_drawn.splice(index, 1);
            char_list.splice(index, 1);
        }
    }
    // console.log("removing letters from letters drawn,and adding tiles");
    // draw up to 7 tiles again
    draw_tiles(letters_drawn, 7 - letters_drawn.length);
    // console.log(letters_drawn.length);
    // display it on the board
    generate_player_hand(letters_drawn, tile_class_array);
}