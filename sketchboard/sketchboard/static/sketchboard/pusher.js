// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;




/* ########### For drawing functions ########### */
var pusher = new Pusher('620c2d185b04ef2c539f', {
  cluster: 'us2',
  encrypted: true
});

var channel_drawing = pusher.subscribe('drawing-channel');
channel_drawing.bind('drawing-event', function(data) {
  if (canvas_id == data['id']) {
    receive_and_draw(data);
  }
});

channel_drawing.bind('clear-event', function(data) {
  if (canvas_id == data['id']) {
    clear();
  }
});



////////////////////////////////////////
channel_drawing.bind('delete_box', function(data) {
  var fullName = "div#" + data.id;
  $( fullName ).remove();
});

/* ########### For Text box functions ########### */

//Assign id
var socketId = null;
pusher.connection.bind('connected', function() {
    socketId = pusher.connection.socket_id;
});

// Add new box, init
channel_drawing.bind('add_box', function(data) {
    var canvasId = data.canvasId;
    if (canvas_id == canvasId) {
          console.log("some one add a box color: "+data.color);
    var fullName = "div#" + data.id;
    var id = data.id;//backgroundColor = "red"
    $("#mainboard").append("<div class='editor' id='"+data.id+"' style='top:50px;left:50px'></div>");
    //////

    // Init
    $(fullName).css("background-color", data.color);
    ///////////
    //$( fullName).append( "<button class='deletebox' id='box"+data.id+"'> testdelete </button>" );
    //////////////
    $(function() {

    $(fullName).froalaEditor({
      key: 'FE3G3E2E1uB5A2A1C3A5F1D4E1H4A11hD9B6E2E4E3F2H3B7C10D5B4F3E2==',
      toolbarInline: true,
      charCounterCount: false,//toolbarButtons
      toolbarButtons: ['alert','delete', 'bold','color', 'italic', 'underline', 'strikeThrough', '-', 'paragraphFormat', 'align', 'indent', 'outdent', 'insertImage','insertVideo', '-', 'undo', 'redo'],//'insertImage', 'insertLink', 'insertFile','insertVideo' , 'insertImage',
      // imageEditButtons: ['imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],
      toolbarVisibleWithoutSelection: true,
      placeholderText: 'I\'m your textbox :-)',
      height: 100,
      width: 200,
      quickInsertTags:[''],
    })
    });
    //if (document.getElementById((id)).style.top >20 && document.getElementById((id)).style.top < 500 &&
    //   document.getElementById((id)).style.left >20  && document.getElementById((id)).style.left <500) {
      dragElement(document.getElementById((id)));
   // }
    

    /* Attach event! */
    ///////focus////////
    $(fullName).on('froalaEditor.focus', function (e, editor) {
      ////////////test add delete button///////////
      //$( fullName).append( "<button class='deletebox' id='box"+this.id+"'> delete </button>" );
      $(".deletebox").click(function(){
  console.log("delete clicked");
  var currBoxId = this.id.slice(3);
  console.log("delete box clicked, box id"+currBoxId);
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

        console.log("focus! ");
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
    });
    $(fullName).on('froalaEditor.blur', function (e, editor) {
       //$( fullName ).remove( ".deletebox#"+ this.pk);
       //$( ".deletebox#"+ this.pk ).remove();
/*               var boxName = "#box"+ this.id;
        console.log("lose focus try to remove button: "+boxName);
        
        $("#box"+ this.id ).remove();*/
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
        console.log("send change! ");
    });
    }

});

// Disable
channel_drawing.bind('disable', function(data) {
  var fullName = "div#" + data.id;
  $(fullName).froalaEditor('edit.off');
});

//Update content
channel_drawing.bind('contentUpdate', function(data) {
    var fullName = "div#" + data.id;
    $(fullName).froalaEditor('html.set', data.content);
    $(fullName).froalaEditor('edit.on');
});

// Position update
channel_drawing.bind('moveUpdate', function(data) {
  var curr = document.getElementById(data.id);
  if (curr) {
    curr.style.top = data.top;
    curr.style.left = data.left;
  }
});
///////////////////////////////////////////////
///////////////// delete box /////////////////////
///////////////// delete box /////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
$("div.deletebox").click(function(){
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


//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////Draggable///////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function dragElement(elmnt) {
  
  //if (elmnt.style.top>0 && elmnt.style.top < 500 && elmnt.style.left >0 && elmnt.style.left < 500) {
  
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    var newTop = (elmnt.offsetTop - pos2);
    var newLeft = (elmnt.offsetLeft - pos1);
  if (newTop>30 && newTop < 530 && newLeft >30 && newLeft < 1030) {
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    $.ajax({
        url: "/sketchboard/send_move_position",
        type: "POST",
        traditional: true,
        data: { id : elmnt.id,
                top:elmnt.style.top,
                left:elmnt.style.left,
                socket_id: socketId,
                csrfmiddlewaretoken: getCSRFToken(),
                 },
        dataType : "json",
    });
    document.onmouseup = null;
    document.onmousemove = null;
   }
//}
}











function getCSRFToken() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].startsWith("csrftoken=")) {
          return cookies[i].substring("csrftoken=".length, cookies[i].length);
      }
  }
  return "unknown";
}