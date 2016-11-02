 /*       
   Name: Viet Tran Quoc Hoang
  Contact: viet_tran1@student.uml.edu 
  Major:Computer Science School : UMass Lowell Class: GUI Prog 1 
  Date created: Nov 11,2016
  Inclass ex A5: Javascript DOM functions
  Description: Added several javascript functions
  Copyright [2016] by Viet Tran. All rights reserved. May be freely copied or excerpted for educational purposes with credit to the author.
  */
 // ADD NEW ITEM TO END OF LIST
 var ul = document.getElementsByTagName("UL"); //grab an array of all ul element
 var cream = document.createElement("li"); //create cream entry
 cream.appendChild(document.createTextNode("cream")); //append a text node to cream
 cream.setAttribute("id", "five"); //set atrribute of cream entry
 ul[0].appendChild(cream); //append cream entry to first element of ul array


 // ADD NEW ITEM START OF LIST
 var kale = document.createElement("li"); //create entry
 kale.appendChild(document.createTextNode("kale")); //append text node
 kale.setAttribute("id", "zero"); //set attribute
 ul[0].insertBefore(kale, ul[0].childNodes[0]); //insert head to ul element at index 0


 // ADD A CLASS OF COOL TO ALL LIST ITEMS
 var li = document.getElementsByTagName("LI"); //get an array of all li elements
 for (var i = 0; i < li.length; i++) {
     li[i].className = "cool"; //add class name to each array element inside array
     //console.log("i=" + i);
 }

 // ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
 var total = parseInt(li.length); //store total and convert to int
 var header2 = document.getElementsByTagName("h2"); //grab h2 
 var span = document.createElement("span"); //create a span(rounded circle)
 span.appendChild(document.createTextNode(total)); //append a text node
 header2[0].appendChild(span); //append to header2