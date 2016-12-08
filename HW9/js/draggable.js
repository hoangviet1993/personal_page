 function make_tile_draggable() {
     $(".tile").draggable({
         revert: 'invalid',
         // put the tile back if drag fail
         helper: "clone",
         // only use the clone instead of the actual thing
         stop: function() {
             // Source : taken from Jason Downing 
             $(this).draggable('option', 'revert', 'invalid');
         },
     });
 }