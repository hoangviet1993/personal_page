/*
Name: Viet Tran Quoc Hoang
Contact : vtran1@cs.uml.edu
Assignment: In Class Ex 6
GUI Programming I - UMass Lowell
*/
$(function() {
    var backgroundColor = $("li#one").css("background-color");
    $("ul").append("<p>Color was " + backgroundColor + "</p>");
    $("li").css("background-color", "#c5a996");
    $("li").css("border-width", "1px");
    $("li").css("border-color", "white");
    $("li").css("color", "black");
    $("li").css("text-shadow", "none");
    $("li").css("font-family", "Georgia");
    $("li").css("font-color", "black");
});