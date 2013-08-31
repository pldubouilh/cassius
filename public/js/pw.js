
var $window = $( window );


// Load Precedent Notes
$(window).load(function() {

               
               });



// Moar notes !
$(document).on("click", "#moar", function(){
        
               
               // Empty
               if(!notesIds){
               var nb=0;
               notesIds=new Array();
               }
               
               // Not Empty
               else var nb = notesIds.length;
               
               // Create new row with a random ID
               notesIds[nb] = randomizedId;
               
               // Display
               console.log(notesIds);
               
               // Save timestamp
               var timestamp = Math.round(new Date().getTime() / 1000);
               var d = new Date(0);
               
               d.setUTCSeconds(timestamp);
               
               // Format a human-readable date
               var m = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"]
               var date = m[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear() + ", " + d.getHours() + ':' + d.getMinutes();
               
               var noteTime = notesIds[nb] + "time";
               $.jStorage.set(noteTime,date);
               
               // Add rand ID to the string
               var stringWithRandID='<li id=' + randomizedId + '><div class="todo-icon fui-arrow-right"> </div> <div class="todo-content"> <h4 class="todo-name">New Note </h4><div class="under">'+ date +'</div></div> </li>';
               
               
               // Save Icon
               var noteIcon = notesIds[nb] + "icon";
               $.jStorage.set(noteIcon,'fui-arrow-right');
               
               // Add string to source
               $(".todo").append(stringWithRandID);
               
               // Save list of notes IDs
               $.jStorage.set("notesIds",notesIds);
               
               });
