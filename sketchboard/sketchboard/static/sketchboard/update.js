var new_canvas;
var current_canvas_id;
var cosketcher = "<li>" +  
      "<img src=\"../../static/assets/icon-user-gray.png\"  class=\"list__img my-2\">" +
      "</li>" ;


function setup() {
	// new_canvas = createCanvas(windowWidth, windowHeight);
 // 	new_canvas.position(30,70);
 // 	new_canvas.style('z-index', '-1');
 // 	$("canvas").attr("class", "col-10");
 	$(".tools").attr("data-active", false);
}

function create_new_canvas() {
  var itemTextElement = $("#post");
  var itemTextValue   = itemTextElement.val();
  itemTextElement.val('');

  $.ajax({
    url: "/sketchboard/create_new_canvas",
    type: "POST",
    data: { title : itemTextValue,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    success: function(data) {
      document.location.href = "/sketchboard/board?id=" + data['id'];
    }
  });
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

function defaultSelect() {	
	$(".tools").attr("data-active", false);
	$("#defaultSelect").attr("data-active", true);
	$(".toolBoxWrapper").css("background-color", "#fff");
	$("#selectWrapper").css("background-color", "#9EA7FC");
	$("#defaultCanvas0").css("z-index", "-1");	
  $(".main").css("cursor", "move");
  $(".palette").css("display", "none");
  $(".bg-palette").css("display", "none");
  $(".fr-toolbar.fr-inline.fr-above").css("visibility", "hidden");

}


function scribble() {	
	$(".tools").attr("data-active", false);
	$("#scribble").attr("data-active", true);
	$(".toolBoxWrapper").css("background-color", "#fff");
	$("#scribbleWrapper").css("background-color", "#9EA7FC");
	$("#defaultCanvas0").css("z-index", "0");	
  $(".editor").css("z-index", "-1"); 
  $(".main").css("cursor", "crosshair");
	$('#froala-editor').froalaEditor('edit.off');
	$("#postit-editor").froalaEditor('edit.off');
  $(".palette").css("display", "block");
  $(".bg-palette").css("display", "none");
  $(".fr-toolbar.fr-inline.fr-above").css("visibility", "hidden");
}



// function textbox(){
   
//     $(".tools").attr("data-active", false);
//     $("#textbox").attr("data-active", true);
//     $(".toolBoxWrapper").css("background-color", "#fff");
//     $("#textboxWrapper").css("background-color", "#9EA7FC");
//     $("#defaultCanvas0").css("z-index", "-1"); 
//     $(".editor").css("z-index", "0");  
//     $("#froala-editor").css("border", "1px solid #b2bec3"); 
//     $("#froala-editor").css("border-radius", "3px");
//     $("#froala-editor").css("padding", "5px"); 
//     $('#froala-editor').froalaEditor('edit.on');
//     $("#postit-editor").froalaEditor('edit.off');
//     $(".main").css("cursor", "text");
//     $(".palette").css("display", "none");


//     // Inline init 
//     $(function() {

//       $.FroalaEditor.DefineIcon('sticky', {NAME: 'info'});
//       $.FroalaEditor.RegisterCommand('sticky', {
//       title: 'Sticky Note',
//       focus: true,
//       undo: true,
//       refreshAfterCallback: true,
//       callback: function () {
//         //this.html.insert('My New HTML');
//       }
//     });


//     $('div#froala-editor').froalaEditor({
//       toolbarInline: true,
//       charCounterCount: false,
//       toolbarButtons: ['bold', 'sticky','color', 'italic', 'underline', 'strikeThrough', '-', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', '-', 'undo', 'redo'],//'insertImage', 'insertLink', 'insertFile', 'insertVideo', 
//       toolbarVisibleWithoutSelection: true,
//       placeholderText: 'I\'m your text box :-)',
//       height: 100,
//       width: 200,

//       quickInsertTags:['']
//       //border: '5px solid blue'
//     })
//   });

//     dragElement(document.getElementById(("froala-editor")));

// }

// function postit() {	
// 	$(".tools").attr("data-active", false);
// 	$("#postit").attr("data-active", true);
// 	$(".toolBoxWrapper").css("background-color", "#fff");
// 	$("#postitWrapper").css("background-color", "#9EA7FC");	
// 	$("#defaultCanvas0").css("z-index", "-1");	
// 	$("#postit-editor").css("border-radius", "5px"); 
// 	$("#postit-editor").css("padding", "5px"); 
// 	$("#postit-editor").froalaEditor('edit.on');
// 	$('#froala-editor').froalaEditor('edit.off');
//   $(".main").css("cursor", "text");
//   $(".palette").css("display", "none");
  



// 	$(function() {

//       $.FroalaEditor.DefineIcon('postit', {NAME: 'info'});
//       $.FroalaEditor.RegisterCommand('postit', {
//       title: 'Sticky Note',
//       focus: true,
//       undo: true,
//       refreshAfterCallback: true,
      
//     });


//     $('div#postit-editor').froalaEditor({
//       toolbarInline: true,
//       charCounterCount: false,
//       toolbarButtons: ['bold', 'sticky','color', 'italic', 'underline', 'strikeThrough', '-', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', '-', 'undo', 'redo'],//'insertImage', 'insertLink', 'insertFile', 'insertVideo', 
//       toolbarVisibleWithoutSelection: true,
//       placeholderText: 'I\'m your sticky-note :-)',
//       height: 100,
//       width: 200,

//       quickInsertTags:['']
//       //border: '5px solid blue'
//     })
//   });

//     dragElement(document.getElementById(("postit-editor")));
// }


function dragElement(elmnt) {
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
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function invite() {
  var itemTextElement = $("#email");
  var itemTextValue   = itemTextElement.val();
  itemTextElement.val('');

  $.ajax({
    url: "/sketchboard/invite",
    type: "POST",
    data: { email : itemTextValue,
            id    : canvas_id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    // success: function(data) {
    //   document.location.href = "/sketchboard/board?id=" + data['id'];
    // }
  });
}

// Get the modal


// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
function modalOpen() {
  var modal = document.getElementById('create-modal');
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function closeBtnCreate() {
  var modal = document.getElementById('create-modal');
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var modal = document.getElementById('create-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function modalOpenShare() {
  get_coworkers_list();
  var modal = document.getElementById('share-modal');
  modal.style.display = "block";
}

function modalOpenShareHome(id) {
  get_coworkers_list_home(id);
  var modal = document.getElementById('share-modal');
  modal.style.display = "block";
}

function modalOpenRemove(id) {
  $.ajax({
    url: "/sketchboard/modalOpenRemove",
    type: "POST",
    data: { id    : id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    success: function(data) {
      location.reload();
    }
  });

}


// When the user clicks on <span> (x), close the modal
function closeBtnShare() {
  var modal = document.getElementById('share-modal');
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var modal = document.getElementById('share-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function get_coworkers_list() {
    $.ajax({
    url: "/sketchboard/get_coworkers_list",
    type: "POST",
    data: { id    : canvas_id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    success: function(data) {
      update_coworkers_list(data);
    }
  });
}

function get_coworkers_list_home(id) {
    $.ajax({
    url: "/sketchboard/get_coworkers_list",
    type: "POST",
    data: { id    : id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    success: function(data) {
      update_coworkers_list(data);
    }
  });
}

function update_coworkers_list(data) {
  var list1 = document.getElementById("d-flex.cosketcher-list");
   while (list1.hasChildNodes()) {
     list1.removeChild(list1.firstChild);
  }

  var list2 = document.getElementById("coworkerList");
  if (list2) {
    while (list2.hasChildNodes()) {
      list2.removeChild(list2.firstChild);
    }    
  }
  
  var coworkers_emails = data['coworkers_emails'];
  var coworkers_names = data['coworkers_names'];
  for (var i = 0; i < coworkers_emails.length; i++) {
    $(".d-flex.cosketcher-list").append(
      "<li class=\"d-flex flex-wrap my-3\">" + 
      "<div class=\"profile-picture d-block mx-5\"></div>" + 
      "<div><p class=\"mx-2 sketcher-email\">" + 
      coworkers_emails[i] + 
      "</p></div>" + 
      "<div><p class=\"mx-2 sketcher-firstname\">" + 
      coworkers_names[i] + 
      "</p></div>" + 
      "<div><p class=\"mx-2 sketcher-owner\"></p></div></li>"
    );
    $(".coworkerList").append(
      "<p class = \" side-list mx-5 \">" + 
      coworkers_names[i] + 
      "</p>"
    );
  }
}

function profileModalOpen(){
  var modal = document.getElementById('profile-modal');
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function profileCloseBtn() {
  var modal = document.getElementById('profile-modal');
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var modal = document.getElementById('profile-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function photoModalOpen() {
  var modal = document.getElementById('photo-modal');
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function closeBtn() {
  var modal = document.getElementById('photo-modal');
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  var modal = document.getElementById('photo-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



/* ################################################################### */
/* ############################## Zihao ############################## */
function home() {
  $.ajax({
      url: "/sketchboard/get_canvas_list",
      dataType : "json",
      success: function(data) {
        update_canvas_list(data);
      }
  });
}

function get_canvas_list() {
  $.ajax({
      url: "/sketchboard/get_canvas_list",
      dataType : "json",
      success: function(data) {
        update_canvas_list(data);
      }
  });
}

function get_canvas_id(data) {
  current_canvas_id = data;
  document.location.href = "/sketchboard/board?id=" + current_canvas_id;
}


/**
 * update and diaplay the canvases
 * depending on the canvas is liked by this user or not
 */
function update_canvas_list(data) {
  var list = document.getElementById("home-canvas-list");
  if (list) {
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }    
  }

    var ids    = data['ids'];
    var titles = data['titles'];
    var times  = data['times'];
    var likes  = data['likes'];
  
    for (var i = 0; i < ids.length; ++i) {
      if (likes.includes(ids[i])) {
      $("#home-canvas-list").prepend(
      "<li class=\"d-flex flex-wrap my-3 col-md-4 col-xs-6 board-list\">" + 
      "<div class=\"each-list\">" + 
      "<button class=\"btn__list\">" + 
      "<div class=\"board-info\">" + 
      "<div class=\"d-flex flex-row\">" + 
      "<div class=\"like\" onclick=\"unlike(" + 
      ids[i] + 
      ")\">"  + "</div>" +
      "<div class=\"dropdown\">" + 
      "<a class=\"btn settingIcon\" href=\"#\" role=\"button\" id=\"dropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"false\" aria-expanded=\"false\">" +        
        "</a>" + 
        "<div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuLink\" style=\"background-color:#dfe6e9\">" +
            "<a class=\"dropdown-item\" href=\"#\">" + 
            "<p class=\"btn__nav my-lg-2 px-2\" style=\"color:#2d3436\" onclick=\"modalOpenShareHome("+ ids[i] + ")\">" + "Add Co-Sketcher" + "</p>"  + "</a>" +
            "<a class=\"dropdown-item\" href=\"#\">" + 
            "<p class=\"btn__nav my-lg-2 px-2\" style=\"color:#2d3436\" onclick=\"modalOpenRemove("+ ids[i] + ")\">" + "Remove" + "</p>"  + "</a>" +
          "</div>" +
        "</div>" +
      "</div>"+
      "<h4 class=\"board-title\">" + 
      sanitize(titles[i]) + "</h4>" + 
      "<p class=\"board-date\">" + 
      "Apr 28, 2018"+ "</p>" + 
      "</div>" + 
      "<div class=\"sketcher-info\" onclick=\"get_canvas_id(" + 
      ids[i] + ")\">" + 
       // "<ul>" + cosketcher + "</ul>" +
      "<p class=\"sketcher-list my-2\">" + "Start SketchBoard :-)" + "</p>" + 
      "</div>" +
      "</button>" + "</div>" + "</li>"
      )
    } else {
      $("#home-canvas-list").prepend(
      "<li class=\"d-flex flex-wrap my-3 col-md-4 col-xs-6 board-list\">" + 
      "<div class=\"each-list\">" + 
      "<button class=\"btn__list\">" + 
      "<div class=\"board-info\">" + 
      "<div class=\"d-flex flex-row\">" + 
      "<div class=\"unlike\" onclick=\"like(" + 
      ids[i] + 
      ")\">"  + "</div>" +
      "<div class=\"dropdown\">" + 
      "<a class=\"btn settingIcon\" href=\"#\" role=\"button\" id=\"dropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"false\" aria-expanded=\"false\">" +        
        "</a>" + 
        "<div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuLink\" style=\"background-color:#dfe6e9\">" +
            "<a class=\"dropdown-item\" href=\"#\">" + 
            "<p class=\"btn__nav my-lg-2 px-2\" style=\"color:#2d3436\" onclick=\"modalOpenShareHome("+ ids[i] + ")\">" + "Add Co-Sketcher" + "</p>"  + "</a>" +
            "<a class=\"dropdown-item\" href=\"#\">" + 
            "<p class=\"btn__nav my-lg-2 px-2\" style=\"color:#2d3436\" onclick=\"modalOpenRemove("+ ids[i] + ")\">" + "Remove" + "</p>"  + "</a>" +
          "</div>" +
        "</div>" +
      "</div>"+
      "<h4 class=\"board-title\">" + 
      sanitize(titles[i]) + "</h4>" + 
      "<p class=\"board-date\">" + 
      "Apr 28, 2018" + "</p>" + 
      "</div>" + 
      "<div class=\"sketcher-info\" onclick=\"get_canvas_id(" + 
      ids[i] + ")\">" + 
      "<p class=\"sketcher-list my-2\">" + "Start SketchBoard :-)" + "</p>" + 
      "</div>" +
      "</button>" + "</div>" + "</li>"
      )
    }
  }
}

function get_favorites_list() {
  $.ajax({
      url: "/sketchboard/get_favorites_list",
      dataType : "json",
      success: function(data) {
        update_favorites_list(data);
      }
  });
}

/**
 * update and diaplay the favorite canvases
 */
function update_favorites_list(data) {
  var list = document.getElementById("favorite-canvas-list");
  if (list) {
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }    
  }

    var ids    = data['ids'];
    var titles = data['titles'];
    // var times  = data['times'];
  
    for (var i = 0; i < ids.length; ++i) {
    $("#favorite-canvas-list").prepend(
    "<li class=\"d-flex flex-wrap my-3 col-md-4 col-xs-6 board-list\">" + 
    "<div class=\"each-list\">" + 
    "<button class=\"btn__list\">" + 
    "<div class=\"board-info\">" + 
    "<div class=\"d-flex flex-row\">" + 
    "<div class=\"like\" onclick=\"unlike(" + 
     ids[i]  + 
    ")\">"  + "</div>" +
    "<div class=\"dropdown\">" + 
    "<a class=\"btn settingIcon\" href=\"#\" role=\"button\" id=\"dropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"false\" aria-expanded=\"false\">" +        
      "</a>" + 
      "<div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuLink\" style=\"background-color:#dfe6e9\">" +
          "<a class=\"dropdown-item\" href=\"#\">" + 
          "<p class=\"btn__nav my-lg-2 px-2\" style=\"color:#2d3436\" onclick=\"modalOpenShareHome("+ ids[i] + ")\">" + "Add Co-Sketcher" + "</p>"  + "</a>" +
          "<a class=\"dropdown-item\" href=\"#\">" + 
          "<p class=\"btn__nav my-lg-2 px-2\" style=\"color:#2d3436\" onclick=\"modalOpenRemove("+ ids[i] + ")\">" + "Remove" + "</p>"  + "</a>" +
        "</div>" +
      "</div>" +
      "</div>"+
    "<h4 class=\"board-title\">" + 
    sanitize(titles[i]) + "</h4>" + 
    "<p class=\"board-date\">" + 
      "Apr 28, 2018"+ "</p>" + 
    "</div>" + 
    "<div class=\"sketcher-info\" onclick=\"get_canvas_id(" + 
    ids[i] + ")\">" + 
    "<p class=\"sketcher-list m-2\">" + "Start SketchBoard :-)" + "</p>" + 
    "</div>" +
    "</button>" + "</div>" + "</li>"
    )
  }
}

function like(id) {
    $.ajax({
    url: "/sketchboard/like",
    type: "POST",
    data: { id    : id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    success: function(data) {
      location.reload();
    }
  });
}

function unlike(id) {
    $.ajax({
    url: "/sketchboard/unlike",
    type: "POST",
    data: { id    : id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    success: function(data) {
      location.reload();
    }
  });
}

function sanitize(s) {
    // Be sure to replace ampersand first
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}
