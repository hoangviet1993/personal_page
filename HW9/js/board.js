function draw_board() {
    var cell_value = [
        4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4,
        0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0,
        0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0,
        1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1,
        0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0,
        0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0,
        0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        4, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 4,
        0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0,
        0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0,
        1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1,
        0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0,
        0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0,
        4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4
    ];
    // each cell value of the table
    var table = '<table>'; // opening up table tag
    table += '<tr>';
    var row_counter = 0;
    var row_num = 1;
    var col_num = 1;
    for (var i = 0; i < cell_value.length; i++) {
        switch (cell_value[i]) {
            case 5:
                // if meet of these value, will color table differently
                table += "<td class = 'start row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 4:
                table += "<td class = 'triple_word row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 3:
                table += "<td class = 'double_word row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 2:
                table += "<td class = 'triple_letter row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 1:
                table += "<td class = 'double_letter row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
            case 0:
                table += "<td class = 'normal_row row-" + row_num + " col-" + col_num++ + "'> </td>";
                row_counter++;
                break;
        }
        if (row_counter === 15) {
            // 14 td in a row
            // onto next row
            row_counter = 0;
            row_num++;
        }
        if (col_num === 16) {
            // 15 col in the game
            // reset col num to begin
            col_num = 1;
        }
    }
    table += '</tr>'; // close out one row of table
    table += '</table>'; // close out table tag
    document.getElementById('tableout').innerHTML = table; // push table content into element
}