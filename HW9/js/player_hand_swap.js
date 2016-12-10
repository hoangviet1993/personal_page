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
var word_list = [];
var game_board = []; // containing all the tiles put on the board legally(single letter format)
var current_tile = []; // list of all tiles that has word on the board(start-112, triple_letter-12)
var number_of_round = 0;
var deleted_tile;

function draw_tiles(letters_drawn) {
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
        var newdiv = $('<li id="' + chr + '"class="ui-state-default tile tile-' + chr + '"></li>');
        letters_drawn.push(newdiv);
        char_list.push(chr);
    }
}

function generate_player_hand(letters_drawn) {
    $('ul').empty();
    for (var i = 0; i < letters_drawn.length; i++) {
        $('ul').append(letters_drawn[i]);
    }
    /*Source: http://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of-d */
    $("li").draggable({
        revert: 'invalid',
        helper: "clone",
        stop: function() {
            // Source : taken from Jason Downing 
            $(this).draggable('option', 'revert', 'invalid');
        },
    });

    $("td").droppable({
        accept: "li",
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id");
            var draggableClass = ui.draggable.attr("class");
            var droppableID = $(this).attr("id");
            var droppableClass = $(this).attr("class");
            var $this = $(this);
            ui.draggable.detach().appendTo($(this));
            // console.log("detected a drop draggableID:" + draggableID + " droppableID:" + droppableID);
            // nothing on the board yet
            if (game_board.length === 0) {
                // tile is not on the start cell
                if (droppableID != "start 112") {
                    ui.draggable.draggable('option', 'revert', true);
                    // TBD: message to user
                    // return it to rack
                    // console.log("detected an illegal drop draggableID:" + draggableID + " droppableID:" + droppableID);
                    return;
                }
            }
            //cell already contains a tile
            if (current_tile.length > 0) {
                for (var i = 0; i < current_tile.length; i++) {
                    if (droppableID == current_tile[i]) {
                        ui.draggable.draggable('option', 'revert', true);
                        // TBD: message to user
                        // return it to rack
                        // console.log("detected an illegal drop draggableID:" + draggableID + " droppableID:" + droppableID);
                        console.log('detected illegal drop-from drop');
                        return;
                    }
                }
            }

            if (game_board.length > 0) {
                var has_start = false;
                for (var i = 0; i < current_tile.length; i++) {
                    if (current_tile[i] == "start 112") {
                        has_start = true;
                    }
                }
                if (has_start === false) {
                    ui.draggable.draggable('option', 'revert', true);
                    console.log("did not find tile at start");
                    current_tile.push(deleted_tile);
                    return;
                }
            }
            // this detach from the rack and reattach the element to the board



            // char_list.splice(char_list.indexOf(draggableID), 1);
            // letters_drawn.splice(char_list.indexOf(draggableID), 1);
            // console.log(letters_drawn.length + " " + char_list.length);
            ui.draggable.position({
                my: "center",
                at: "center",
                of: $this,
                using: function(pos) {
                    $(this).animate(pos, "fast", "linear");
                }
            });
            if (game_board.indexOf(draggableID) == -1) {
                game_board.push(draggableID); // letter is now on the board
            }
            current_tile.push(droppableID); // tile is now occupied
            console.log("from drop game board length:" + game_board.length + "current tile length:" + current_tile.length);
        },
        out: function(event, ui) {
            var draggableID = ui.draggable.attr("id");
            var draggableClass = ui.draggable.attr("class");
            var droppableID = $(this).attr("id");
            var droppableClass = $(this).attr("class");
            // if (current_tile.length > 0) {
            //     for (var i = 0; i < current_tile.length; i++) {
            //         if (droppableID == current_tile[i]) {
            //             ui.draggable.draggable('option', 'revert', true);
            //             // TBD: message to user
            //             // return it to rack
            //             console.log("detected an illegal drop from out: " + droppableID + "" + current_tile[i]);
            //             return;
            //         }
            //     }
            // }
            if (current_tile.indexOf(droppableID) !== -1) {
                console.log("from out: found droppableID" + droppableID + "at " + current_tile.indexOf(droppableID));
                current_tile.splice(current_tile.indexOf(droppableID));
                deleted_tile = droppableID;
            }
            // if (game_board.length > 0) {
            // }
            // if (game_board.indexOf(draggableID) != -1) {
            //     game_board.splice(game_board.indexOf(draggableID));
            // }

            // game_board.splice(game_board.indexOf(draggableID), 1);
            // current_tile.splice(current_tile.indexOf(draggableID), 1);
            console.log("from out game board length:" + game_board.length + "current tile length:" + current_tile.length);
            // console.log("draggableID from out:" + draggableID + "droppableID from out: " + droppableID);
            return;
        }
    });
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
            current_tile.splice(current_tile.indexOf(draggableID), 1);
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