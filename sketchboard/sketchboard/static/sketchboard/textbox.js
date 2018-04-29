// function init(boxes) {
//   $(boxes).each(function() {
//     console.log("pk of this: "+this.pk);
//     $("#total").append("<div class='editor' id='"+this.pk+"' style='border: 3px solid black'></div>");
//     var fullName = "div#"+this.pk;
//     $(fullName).froalaEditor({
//       toolbarInline: true,
//       charCounterCount: false,
//       toolbarButtons: ['bold','insertVideo','color', 'italic', 'underline', 'strikeThrough', '-','insertImage', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', '-', 'undo', 'redo'],//'insertImage', 'insertLink', 'insertFile', , 
//       imageEditButtons: ['imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],
//       toolbarVisibleWithoutSelection: true,
//       placeholderText: 'Start typing something.!!.',
//       height: 100,
//       width: 100,
//       quickInsertTags:['']
//     });
//     console.log("created! id: "+document.getElementById((this.pk)));
//     dragElement(document.getElementById((this.pk)));
//     $(fullName).on('froalaEditor.focus', function (e, editor) {
//       console.log("focus! ");
//       $.ajax({
//         url: "/sketchboard/send_disable",
//         type: "POST",
//         traditional: true,
//         data: { id : $(fullName).attr('id'),
//         socket_id: socketId,
//         csrfmiddlewaretoken: getCSRFToken() },
//         dataType : "json",
//       });
//     });

//     $(fullName).on('froalaEditor.blur', function (e, editor) {
//       var contents=editor.html.get();
//       $.ajax({
//         url: "/sketchboard/send_content",
//         type: "POST",
//         traditional: true,
//         data: { id: $(fullName).attr('id'),
//         //id : this.id,
//               content: contents,
//               socket_id: socketId,
//               csrfmiddlewaretoken: getCSRFToken(),
              
//                },
//         dataType : "json",
//       });
//       console.log("send change! ");
//     });
//     /* ############## Change attribute! ############## */
//     console.log("pk of this: "+this.pk);
//     $(fullName).css({'top':this.fields.top});
//     $(fullName).css({'left':this.fields.left});
//     $(fullName).froalaEditor('html.set', this.fields.content);
//     });
// }

// /* ############## Create new box ############## */
// document.addEventListener("DOMContentLoaded", function() {
//   // $("button#invite").click(function(){
//   //   // console.log("send canvas invite: "+canvas_id);
//   //   console.log("???????");
//   //   $.ajax({
//   //     url: "/sketchboard/invite",
//   //     type: "POST",
//   //     traditional: true,
//   //     data: { 
//   //       canvasId :canvas_id,
//   //     userEmail: "seonwoo1@andrew.cmu.edu",
//   //     csrfmiddlewaretoken: getCSRFToken() },
//   //     dataType : "json",
//   //   });
//   // });

//   $("div#addbox").click(function(){
//   console.log("add box clicked, canvas id"+canvas_id);
//     $("#defaultCanvas0").css("z-index", "-1");  
//     $.ajax({
//       url: "/sketchboard/add_box",
//       type: "POST",
//       traditional: true,
//       data: { 
//         canvasId :canvas_id,
//       socket_id: socketId,
//       csrfmiddlewaretoken: getCSRFToken() },
//       dataType : "json",
//     });
//   });

// /* ##################### Drag ##################### */
//   function dragElement(elmnt) {
//     var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//     if (document.getElementById(elmnt.id + "header")) {
//       /* if present, the header is where you move the DIV from:*/
//       document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//     } else {
//       /* otherwise, move the DIV from anywhere inside the DIV:*/
//       elmnt.onmousedown = dragMouseDown;
//     }

//     function dragMouseDown(e) {
//       e = e || window.event;
//       // get the mouse cursor position at startup:
//       pos3 = e.clientX;
//       pos4 = e.clientY;
//       document.onmouseup = closeDragElement;
//       console.log("Drag id: " + this.id);
//       // call a function whenever the cursor moves:
//       document.onmousemove = elementDrag;
//     }

//     function elementDrag(e) {
//       e = e || window.event;
//       // calculate the new cursor position:
//       pos1 = pos3 - e.clientX;
//       pos2 = pos4 - e.clientY;
//       pos3 = e.clientX;
//       pos4 = e.clientY;
//       // set the element's new position:
//       elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//       elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     }

//     function closeDragElement() {
//       $.ajax({
//         url: "/sketchboard/send_move_position",
//         type: "POST",
//         traditional: true,
//         data: { id : elmnt.id,
//                 top:elmnt.style.top,
//                 left:elmnt.style.left,
//                 socket_id: socketId,
//                 wholeHTML : document.getElementById("total").innerHTML,
//                 csrfmiddlewaretoken: getCSRFToken(),
//                  },
//         dataType : "json",
//       });
//       document.onmouseup = null;
//       document.onmousemove = null;
//     }
//   }
// });






////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//////////////////TEXT BOX/////////////////////////////
//////////////////TEXT BOX/////////////////////////////
////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
  function init(boxes) {
    $(boxes).each(function() {
      console.log("color of this: "+this.fields.color);
      $("#mainboard").append("<div class='editor' id='"+this.pk+"'></div>");
      var fullName = "div#"+this.pk;
      ////////////////////////////////////////////////////////

      $(fullName).css("background-color", this.fields.color);
       //$( fullName).append( "<button class='deletebox' id='box"+this.pk+"'> testdelete </button>" );
      $(fullName).froalaEditor({
        key: 'FE3G3E2E1uB5A2A1C3A5F1D4E1H4A11hD9B6E2E4E3F2H3B7C10D5B4F3E2==',
        toolbarInline: true,
        charCounterCount: false,
        toolbarButtons: ['alert','delete', 'bold','color', 'italic', 'underline', 'strikeThrough', '-', 'paragraphFormat', 'align', 'indent', 'outdent', 'insertImage','insertVideo','-', 'undo', 'redo'],//'insertImage', 'insertLink', 'insertFile','insertVideo' , 'insertImage',
        // imageEditButtons: ['imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],
        toolbarVisibleWithoutSelection: true,
        placeholderText: 'I\'m your textbox :-)',
        height: 100,
        width: 200,
        quickInsertTags:['']
      });
      console.log("created! id: "+this.pk);
      
      //if (document.getElementById((this.pk)).style.top >20 && document.getElementById((this.pk)).style.top < 500 &&
      // document.getElementById((this.pk)).style.left >20  && document.getElementById((this.pk)).style.left <500) {
      dragElement(document.getElementById((this.pk)));
   // }
    

      $(fullName).on('froalaEditor.focus', function (e, editor) {
        $(".tools").attr("data-active", false);
        $("#textbox").attr("data-active", true);
        $("#defaultCanvas0").css("z-index", "-1");  
        $.ajax({
          url: "/sketchboard/send_disable",
          type: "POST",
          traditional: true,
          data: { id : $(fullName).attr('id'),
          socket_id: socketId,
          csrfmiddlewaretoken: getCSRFToken() },
          dataType : "json",
        });
      
      //$( fullName).append( "<button class='deletebox' id='box"+this.id+"'> delete </button>" );
      $(".deletebox").click(function(){
  var currBoxId = this.id.slice(3);
  $("#defaultCanvas0").css("z-index", "-1");  
  $.ajax({
    url: "/sketchboard/delete_box",
    type: "POST",
    traditional: true,
    data: { 
      boxId :currBoxId,
      canvasId :canvas_id,
    socket_id: socketId,
    csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
  });
});

      });

      $(fullName).on('froalaEditor.blur', function (e, editor) {
        var contents=editor.html.get();
        $.ajax({
          url: "/sketchboard/send_content",
          type: "POST",
          traditional: true,
          data: { id: $(fullName).attr('id'),
          //id : this.id,
                content: contents,
                socket_id: socketId,
                csrfmiddlewaretoken: getCSRFToken(),
                
                 },
          dataType : "json",
        });
      });
            //// Change attribute!//////
      $(fullName).css({'top':this.fields.top});
      $(fullName).css({'left':this.fields.left});
      $(fullName).froalaEditor('html.set', this.fields.content);
      });
  }





///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////// delete box /////////////////////
///////////////// delete box /////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
$(".deletebox").click(function(){
  var currBoxId = this.id.slice(3);
  $("#defaultCanvas0").css("z-index", "-1");  
  $.ajax({
    url: "/sketchboard/delete_box",
    type: "POST",
    traditional: true,
    data: { 
      boxId :currBoxId,
      canvasId :canvas_id,
    socket_id: socketId,
    csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
  });
});

  ///////////////////////////////////////////
  //////////////invite still use ???/////////////////
  document.addEventListener("DOMContentLoaded", function() {

    $("button#invite").click(function(){
    $.ajax({
      url: "/sketchboard/invite",
      type: "POST",
      traditional: true,
      data: { 
      canvasId :canvas_id,
      userEmail: "yczheng95@gmail.com",
      csrfmiddlewaretoken: getCSRFToken() },
      dataType : "json",
    });
    });


///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////// add box /////////////////////
///////////////// add box /////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
  $("div#addbox").click(function(){
    readyForNote = 0;
    $(".tools").attr("data-active", false);
    $("#textbox").attr("data-active", true);
    $(".toolBoxWrapper").css("background-color", "#fff");
    $("#textboxWrapper").css("background-color", "#9EA7FC");
    $("#defaultCanvas0").css("z-index", "-1"); 
    $(".editor").css("z-index", "0");
    $(".main").css("cursor", "text");
    $(".palette").css("display", "none");
    $(".bg-palette").css("display", "none");
    $.ajax({
      url: "/sketchboard/add_box",
      type: "POST",
      traditional: true,
      data: { 
        type:'box',
        canvasId :canvas_id,
      socket_id: socketId,
      csrfmiddlewaretoken: getCSRFToken() },
      dataType : "json",
    });
  });

    

  $("div#addnote").click(function(){
  $(".tools").attr("data-active", false);
  $("#postit").attr("data-active", true);
  $(".toolBoxWrapper").css("background-color", "#fff");
  $("#postitWrapper").css("background-color", "#9EA7FC");
  $("#defaultCanvas0").css("z-index", "-1"); 
  $(".editor").css("z-index", "0");
  $(".main").css("cursor", "text");
  $(".palette").css("display", "none");
  $(".bg-palette").css("display", "block");
  readyForNote = 1;

});


$("div.each-color.p-2").click(function(){
  if (readyForNote == 1) {

  
  var colorName = "#"+this.id;
  var colorHex = $(colorName).css("background-color");

    $.ajax({
    url: "/sketchboard/add_box",
    type: "POST",
    traditional: true,
    data: { 
      color:colorHex,
      type:'note',
      canvasId :canvas_id,
    socket_id: socketId,
    csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
  });

    }
    readyForNote = 0;
});
////////////////////////////////// Drag
// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById(elmnt.id + "header")) {
//     /* if present, the header is where you move the DIV from:*/
//     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//   } else {
//     /* otherwise, move the DIV from anywhere inside the DIV:*/
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     //console.log("Drag id: " + this.id);
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    
//   }

//   function closeDragElement() {

//     $.ajax({
//     url: "/sketchboard/send_move_position",
//     type: "POST",
//     traditional: true,
//     data: { id : elmnt.id,
//             top:elmnt.style.top,
//             left:elmnt.style.left,
//             socket_id: socketId,
//             csrfmiddlewaretoken: getCSRFToken(),
//              },
//     dataType : "json",
//   });
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }


function getCSRFToken() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].startsWith("csrftoken=")) {
          return cookies[i].substring("csrftoken=".length, cookies[i].length);
      }
  }
  return "unknown";
}

});