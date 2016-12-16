/*
Name: Viet Tran Quoc Hoang
Contact : vtran1@cs.uml.edu
Assignment: HW8 - Dynamic Mult Table with JQuery Slider and Tab
GUI Programming I - UMass Lowell
For this assignment, I am supposed to create a multiplication table dynamically given user input 
for width and length and handle error using jquery slider and tab
Copyright [2016] by Viet Tran. All rights reserved. 
May be freely copied or excerpted for educational purposes with credit to the author.
File Description: hw8.js file for hw8
These functions are necessary to draw a table given the width and length.4 main checks were done:
required(empty input),integer check,range check and number check
*/
// learnt a lot from
// https://www.sitepoint.com/basic-jquery-form-validation-tutorial/
$(function() {
    /*Assignment 8 */
    slider();
    //slider function - responsible to create 4 slider,update values as user drag and check valid form
    //before draw table
    $("#tabs").tabs();
    //enable JQUERY UI interface
    create_tabs();
    //create tabs if user hit save button
    
    /*Assignment 7 */
    // got rid of a few validator method since logic improved
    //customized method for detecting float number
    $.validator.addMethod("isInt", function(value, element) {
        // calling function to check for float
        return (isInt(Number(value))); //return true if is int and false if not
    }, "Float detected. Please only use integers.");

    //customized method for detecting oversized table, mainly to prevent browser freezing
    $.validator.addMethod("tooBig", function(value, element, param) {
        var $max = $(param);
        if (this.settings.onfocusout) {
            //once focus is on different element,execute validation
            $max.off(".validate-tooBig").on("blur.validate-tooBig", function() {
                $(element).valid();
                //switch back to valid color if return valid
            });
        }
        return isNaN(parseInt(value)) || isNaN(parseInt($max.val())) || (Math.abs(parseInt($max.val())) - Math.abs((parseInt(value)) > 100));
    });

    // Initialize form validation on the input form.
    // It has the name attribute "input_form"
    $("form[name='input_form']").validate({
        // Specify validation rules
        rules: {
            row_start: {
                required: true, // required input
                number: true, // has to be number
                min: -10,
                max: 10,
                isInt: true, // has to be integer   
            },
            col_start: {
                required: true,
                number: true, // has to be number
                min: -10,
                max: 10,
                isInt: true,
            },
            row_end: {
                required: true,
                number: true, // has to be number
                min: -10,
                max: 10,
                isInt: true,
            },
            col_end: {
                required: true,
                number: true, // has to be number
                min: -10,
                max: 10,
                isInt: true,
            }
        },
        // Specify validation error messages
        messages: {
            row_start: {
                required: "This field is required.", //if no input,show this
                number: "Characters not allowed. Integers only.", //if detect char input, show this
                min: "Please enter an integer bigger than -10",
                max: "Please enter an integer smaller than 10"
            },
            row_end: {
                required: "This field is required.",
                number: "Characters not allowed. Please enter an integer.",
                min: "Please enter an integer bigger than -10",
                max: "Please enter an integer smaller than 10"
            },
            col_start: {
                required: "This field is required.",
                number: "Characters not allowed. Please enter an integer.",
                min: "Please enter an integer bigger than -10",
                max: "Please enter an integer smaller than 10"
            },
            col_end: {
                required: "This field is required.",
                number: "Characters not allowed. Please enter an integer.",
                min: "Please enter an integer bigger than -10",
                max: "Please enter an integer smaller than 10"
            },
        },
        // Once the form is valid, take action i.e draw table
        submitHandler: function(form) {
            generateTable();
        },
    });

});

/*
 * Function description: Check valid form,if valid,draw table
 * @param None
 * @return None
 * @throws None
 */
function check_valid_form() {
    //only when form is valid, a table is drawn
    if ($("form#input_form").valid() == true) {
        $("form#input_form").submit();
    }
}

/*
 * Function description: Create slider and its settings
 * @param None
 * @return None
 * @throws None
 */
/*
https://jqueryui.com/slider/#hotelrooms
*/
function slider() {
    // slider ui for min row
    //min = -10, max  =10, error if anything else
    $("#slider_row_start").slider({
        min: -10,
        max: 10,
        slide: function(event, ui) {
            $("#row_start").val(ui.value); //update value with input box
            check_valid_form(); //check if valid to draw table
        }
    }); //if user enter value manually
    $("#row_start").on("keyup", function() {
        check_valid_form(); //check if valid value
        $("#slider_row_start").slider("value", this.value); //update value if valid value
    });

    $("#slider_row_end").slider({ //same goes for the rest
        min: -10,
        max: 10,
        slide: function(event, ui) {
            $("#row_end").val(ui.value);
            check_valid_form();
        }
    });
    $("#row_end").on("keyup", function() {
        check_valid_form();
        $("#slider_row_end").slider("value", this.value);
    });

    $("#slider_col_start").slider({
        min: -10,
        max: 10,
        slide: function(event, ui) {
            $("#col_start").val(ui.value);
            check_valid_form();
        }
    });
    $("#col_start").on("keyup", function() {
        check_valid_form();
        $("#slider_col_start").slider("value", this.value);
    });

    $("#slider_col_end").slider({
        min: -10,
        max: 10,
        slide: function(event, ui) {
            $("#col_end").val(ui.value);
            check_valid_form();
        }
    });
    $("#col_end").on("keyup", function() {
        check_valid_form();
        $("#slider_col_end").slider("value", this.value);
    });
}

/*
 * Function description: Create new tabs when detect click event
 * @param None
 * @return None
 * @throws None
 */
/*Learnt from https://jsfiddle.net/EKBqy/ */
function create_tabs() {
    /*http://jqueryui.com/tabs/#manipulation */
    $("#deleteTabs").click(function() {
        //delete all tab button,including the input form, all current drawn table and input
        var tabCount = $("#tabs li").length;
        //console.log("tabCount is " + tabCount);
        do {
            $("#child_tab").remove();
        } while ($("#tabs li").length > 1);
    });
    $("#addTab").click(function() {
        // only if valid form, then create a new tab
        if ($("form#input_form").valid() == true) {
            var row_start = Number(document.getElementById('row_start').value);
            var row_finish = Number(document.getElementById('row_end').value);
            var col_start = Number(document.getElementById('col_start').value);
            var col_finish = Number(document.getElementById('col_end').value);
            //get all variables to make tab header
            var num_tabs = $('div#tabs ul li.tab').length + 1;
            //appending list item with title name
            $('ul').append(
                '<li id ="child_tab" class="tab"><a href="#tab-' + num_tabs + '">[' + row_start + ',' + row_finish + ']' + '[' + col_start + ',' + col_finish + ']' + '</a>' + "<span class='ui-icon ui-icon-close' role='presentation'></span>" + '</li>');
            //appending the actual tab and the table
            $('#tabs').append(
                '<div>' + $("#tableout").html() + '</div>');
            $('#tabs').tabs("refresh");
            // Close icon: removing the tab on click
            $('#tabs').on("click", "span.ui-icon-close", function() {
                var panelId = $(this).closest("li").remove().attr("aria-controls");
                //console.log(this);
                $("#" + panelId).remove();
                $("#tabs").tabs("refresh");
            });
        }
    });
}

/*
 * Function description: Check if param is integer or not
 * @param Integer to be tested on
 * @return True if n is int and false if n is not
 * @throws None
 */
function isInt(n) {
    // http://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
    return n % 1 === 0;
}

/**
 * Function description: Draw a table and load it into table element
 * @param  None
 * @return None
 * @throws None
 */
function generateTable() {
    var row_start = Number(document.getElementById('row_start').value);
    var row_finish = Number(document.getElementById('row_end').value);
    var col_start = Number(document.getElementById('col_start').value);
    var col_finish = Number(document.getElementById('col_end').value);
    // console.log(row_start + " " + row_finish + " " + col_start + " " + col_finish);
    var table = '<table>';
    // table variable to display
    var col_header_value = col_start; //storing data for header value
    var row_header_value = row_start;
    if (row_start <= row_finish && col_start <= col_finish) {
        // case 1: min row < max row and min col < max col
        for (var i = col_start; i <= col_finish + 1; i++) {
            table += '<tr>'; //opening up one row of table
            for (var j = row_start; j <= row_finish + 1; j++) {
                if (i == col_start && j == row_start) {
                    //corner element is empty
                    table += '<td>' + '' + '</td>'; //each of these is a cell
                } else if (i == col_start) {
                    //horizontal row header value
                    table += "<td class ='header'>" + row_header_value++ + '</td>';
                } else if (j == row_start) {
                    // vertical column header value
                    table += '<td >' + col_header_value++ + '</td>';
                } else {
                    // console.log("i ="+ i+"  j ="+j+"\n");
                    // contents of the rest of the table
                    //as name suggests, both i j is even or odd
                    if (i % 2 === 0 && j % 2 === 0 || (i % 2 !== 0 && j % 2 !== 0)) {
                        table += "<td class = 'both_even_or_odd'>" + ((i - 1) * (j - 1)) + '</td>';
                    } else {
                        //as name suggest, either is odd or even
                        table += "<td class = 'either_even_or_odd'>" + ((i - 1) * (j - 1)) + '</td>';
                    }
                }
            }
            table += '</tr>'; // close out one row of table
        }
    } else if (row_start >= row_finish && col_start >= col_finish) {
        //case 2: min row > max row and min col > max col
        for (var i = col_start; i >= col_finish - 1; i--) {
            table += '<tr>'; //opening up one row of table
            for (var j = row_start; j >= row_finish - 1; j--) {
                if (i == col_start && j == row_start) {
                    //corner element is empty
                    table += '<td>' + '' + '</td>'; //each of these is a cell
                } else if (i == col_start) {
                    //horizontal row header value
                    table += "<td class ='header'>" + row_header_value-- + '</td>';
                } else if (j == row_start) {
                    // vertical column header value
                    table += '<td >' + col_header_value-- + '</td>';
                } else {
                    if (i % 2 === 0 && j % 2 === 0 || (i % 2 !== 0 && j % 2 !== 0)) {
                        table += "<td class = 'both_even_or_odd'>" + ((i + 1) * (j + 1)) + '</td>';
                    } else {
                        table += "<td class = 'either_even_or_odd'>" + ((i + 1) * (j + 1)) + '</td>';
                    }
                }
            }
            table += '</tr>'; // close out one row of table
        }
    } else if (row_start >= row_finish && col_start <= col_finish) {
        // case 3: min row > max row but min col < max col
        for (var i = col_start; i <= col_finish + 1; i++) {
            table += '<tr>'; //opening up one row of table
            for (var j = row_start; j >= row_finish - 1; j--) {
                if (i == col_start && j == row_start) {
                    //corner element is empty
                    table += '<td>' + '' + '</td>'; //each of these is a cell
                } else if (i == col_start) {
                    //horizontal row header value
                    table += "<td class ='header'>" + row_header_value-- + '</td>';
                } else if (j == row_start) {
                    // vertical column header value
                    table += '<td >' + col_header_value++ + '</td>';
                } else {
                    if (i % 2 === 0 && j % 2 === 0 || (i % 2 !== 0 && j % 2 !== 0)) {
                        table += "<td class = 'both_even_or_odd'>" + ((i - 1) * (j + 1)) + '</td>'; //i ++ j--
                    } else {
                        table += "<td class = 'either_even_or_odd'>" + ((i - 1) * (j + 1)) + '</td>'; // i++ j--
                    }
                }
            }
            table += '</tr>'; // close out one row of table
        }
    } else if (row_start <= row_finish && col_start >= col_finish) {
        //case 4: min row < max row but min col > max col
        for (var i = col_start; i >= col_finish - 1; i--) {
            table += '<tr>'; //opening up one row of table
            for (var j = row_start; j <= row_finish + 1; j++) {
                if (i == col_start && j == row_start) {
                    //corner element is empty
                    table += '<td>' + '' + '</td>'; //each of these is a cell
                } else if (i == col_start) {
                    //horizontal row header value
                    table += "<td class ='header'>" + row_header_value++ + '</td>';
                } else if (j == row_start) {
                    // vertical column header value
                    table += '<td >' + col_header_value-- + '</td>';
                } else {
                    if (i % 2 === 0 && j % 2 === 0 || (i % 2 !== 0 && j % 2 !== 0)) {
                        table += "<td class = 'both_even_or_odd'>" + ((i + 1) * (j - 1)) + '</td>'; // i-- j++
                    } else {
                        table += "<td class = 'either_even_or_odd'>" + ((i + 1) * (j - 1)) + '</td>'; // i-- j++
                    }
                }
            }
            table += '</tr>'; // close out one row of table
        }
    }
    table += '</table>'; // close out table tag
    // console.log(table);
    document.getElementById('tableout').innerHTML = table; // push table content into element
}