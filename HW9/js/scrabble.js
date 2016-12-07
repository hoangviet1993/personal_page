$(document).ready(function() {

    var letters_drawn = [];
    var letter_list = [];
    var game_board = [];
    var tile_class_array = [];
    // containing all the tiles put on the board legally(single letter format)
    draw_board();
    draw_tiles(letters_drawn);
    generate_player_hand(letters_drawn, game_board, tile_class_array);
    $(".tile").draggable({
        revert: 'invalid',
        helper: "clone",
        stop: function() {
            // Source : taken from Jason Downing 
            $(this).draggable('option', 'revert', 'invalid');
        },
    });
    // $("li").droppable({
    //     tolerance: "touch",
    //     accept: "li",
    //     hoverClass: "ui-state-active",
    //     drop: function(event, ui) {
    //         var draggable = ui.draggable,
    //             droppable = $(this);
    //         //     dragPos = draggable.position(),
    //         //     dropPos = droppable.position();
    //         // draggable.css({
    //         //     left: dropPos.left + 'px',
    //         //     top: dropPos.top + 'px'
    //         // });
    //         // droppable.css({
    //         //     left: dragPos.left + 'px',
    //         //     top: dragPos.top + 'px'
    //         // });
    //         draggable.swap(droppable);
    //     },
    // });
    var board_piece = {};
    var previous_tile;
    var start_tile_class = "start row-8 col-8 ui-droppable";
    $("td").droppable({
        accept: ".tile",
        drop: function(event, ui) {
            var draggableID = ui.draggable.attr("id"); // a,b,c
            var draggableClass = ui.draggable.attr("class"); // class of a b c tiles
            var droppableID = $(this).attr("id"); // id of the tile (dropped)
            var droppableClass = $(this).attr("class"); // class of the tile (tile tile-a col-n row-n)
            var $this = $(this);
            if (droppableID === undefined) {
                $(this).attr("id", "dropped");
                ui.draggable.detach().appendTo($(this));
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $this,
                    using: function(pos) {
                        $(this).animate(pos, "fast", "linear");
                    }
                });
                if (tile_array.indexOf(draggableID) === -1) {
                    var obj = {};
                    var match;
                    match = draggableClass.match(/.*\stile-(\w).*/);
                    obj.letter = match[1];
                    match = droppableClass.match(/(\w+)\srow-(\d+)\scol-(\d+).*/);
                    obj.row = parseInt(match[2]);
                    obj.col = parseInt(match[3]);
                    obj.letter_value = match[1];
                    obj.value = ScrabbleTiles[obj.letter].value;
                    tile_array.push(draggableID);
                    tile_class_array.push(obj);
                    // console.log(tile_class_array);
                } else {
                    // tile is already in, but dropped to a different location
                    update_location_of_tiles(droppableClass, draggableID, tile_class_array);
                    // console.log(tile_class_array);
                }
                //if tile already exist, update location of tile
                // update_location_of_tiles(tile_array);

                // else if ($("." + start_tile_class).attr("id") === undefined) {
                //     console.log("trying to move tile out of start cell from drop");
                //     ui.draggable.draggable('option', 'revert', true);
                //     return;
                // }  
                // $("#" + draggableID).droppable('disable');
            } else {
                console.log("cell is already full");
                ui.draggable.draggable('option', 'revert', true);
                return;
            }
        },
        out: function(event, ui) {
            // moving a tile from one cell to another
            // should remove previous tile from tile array
            var draggableID = ui.draggable.attr("id");
            $(this).removeAttr('id');
        }
    });
    $("#reset_board").click(function() {
        draw_board();
        generate_player_hand(letters_drawn);
    });

    $("#end_turn").click(function() {
        // process all tiles on board
        //  console.log(check_tile(tile_class_array));
        if (game_started(tile_class_array) && check_tile(tile_class_array) === true) {
            // if start is filled 
            //  need to sort out the obj
            var word = sort_tiles(tile_class_array);
            if (dict[word]) {
                //  calculate score
                // console.log("calculating score");
                calculate_score(tile_class_array);
            }
        } else {
            console.log("the tiles are an invalid locations")

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