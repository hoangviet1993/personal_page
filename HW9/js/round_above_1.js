if (number_of_round > 1) {
            console.log("number of round: " + number_of_round);
            console.log("END TURN: tile class array len: " + tile_class_array.length);
            if (tile_class_array.length < 2) { //user only added in one letter
                // check if prev word is vertical or horizontal 
                if (permanent_tile_array.length > 1) {
                    // when permanent_tile is longer than just one tile
                    if (is_vertical(permanent_tile_array) && !is_horizontal(permanent_tile_array)) {
                        // determine if placed tile is in legal position
                        if (tile_class_array[0].col !== permanent_tile_array[0].col) {
                            $("#error_message").html("Please place tiles either horizontally or vertically");
                            console.log("The added tile is a diagonal position")
                            return;
                        } else {

                        }
                    } else if (is_horizontal(permanent_tile_array) && !is_vertical(permanent_tile_array)) {
                        if (tile_class_array[0].row !== permanent_tile_array[0].row) {
                            $("#error_message").html("Please place tiles either horizontally or vertically");
                            console.log("The added tile is a diagonal position")
                            return;
                        }
                    } else {
                        console.log("word is neither horizontal nor vertical or vertical and horizontal(impos)");
                    }

                } else if (permanent_tile_array.length < 2) { // previously only has one letter
                    var temp_array = [];
                    temp_array.push(permanent_tile_array[0]);
                    temp_array.push(tile_class_array[0]);
                    if (check_tile(temp_array)) {
                        tile_class_array = temp_array;
                    } else {
                        console.log("Pleaes place tiles next to each other");
                        return;
                    }
                    tile_class_array = sort_tiles(tile_class_array);
                    console.log("got here");
                    if (game_started(tile_class_array) === true) {
                        // if start is filled and tiles are in legal locations
                        var word = get_word(tile_class_array);
                        // join the letters up into a word
                        if (dict[word]) {
                            display_word_and_add_score(tile_class_array, word, score, letters_drawn);
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
                }
            } else if (tile_class_array.length > 1) {
                // find out if new array has same col or same row
                // if none then the tiles are placed illegally
                is_vertical(tile_class_array);
                is_horizontal(tile_class_array);
                // if vertical word, collect all the letter placed on that col?

                // if horizontal word, collect all letters placed on that row?
            }
        }