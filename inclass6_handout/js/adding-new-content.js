/*
Name: Viet Tran Quoc Hoang
Contact : vtran1@cs.uml.edu
Assignment: In Class Ex 6
GUI Programming I - UMass Lowell
*/
$(function() {
    $("ul").before("<p>Just updated</p>");
    $("li").prepend("+");
    $("li:last").after("<li><em>gluten free</em> soy sauce</li>");
});