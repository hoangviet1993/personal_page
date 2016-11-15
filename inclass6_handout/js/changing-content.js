/*
Name: Viet Tran Quoc Hoang
Contact : vtran1@cs.uml.edu
Assignment: In Class Ex 6
GUI Programming I - UMass Lowell
*/
$(function() {
    $('li#one').text('almonds')
    $('li.hot').html(function() {
        return '<em>' + $(this).text() + '</em';
    });
    $('li#two').remove();
});