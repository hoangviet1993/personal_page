$(document).ready(function() {

    var letters_drawn = [];
    var letter_list = [];
    var game_board = [];
    var tile_class_array = [];
    // containing all the tiles put on the board legally(single letter format)
    draw_board();
    // draw the board
    draw_tiles(letters_drawn);
    // draw tiles from randomnesss
    generate_player_hand(letters_drawn, game_board, tile_class_array);
    // draw the hands and play the game!
    $("#reset_board").click(function() {
        draw_board();
        generate_player_hand(letters_drawn);
        $("#error_message").html("Scrabble Ready");
        tile_class_array = [];
        // reset the board logic
    });
    $("#end_turn").click(function() {
        // process all tiles on board
        //  console.log(check_tile(tile_class_array));
        if (game_started(tile_class_array) && check_tile(tile_class_array) === true) {
            // if start is filled 
            //  need to sort out the obj
            var word = sort_tiles(tile_class_array);
            if (dict[word]) {
                var score = 0;
                // find word in dict - thankful for Jason to share this
                console.log("found " + word);
                score = calculate_score(tile_class_array);
                // calculate score and update score
                $("#score").html("Score: " + score);
                $("#error_message").html("Found :" + word);
                // update error message 
            } else {
                $("#error_message").html("Cannot find the word :" + word);
            }
            // if (dict[word]) {
            //     //  calculate score
            //     var score = calculate_score(tile_class_array)
            //         //
            //     console.log(score);
            // } else {
            //     console.log("cannot find the word" + word);
            // }
        } else {
            console.log("The tiles are an invalid locations")
            $("#error_message").html("The tiles are in an invalid locations");
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