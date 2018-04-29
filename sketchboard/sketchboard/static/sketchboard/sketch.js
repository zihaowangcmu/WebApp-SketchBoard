// don't use color as var name since color is conflict with p5.js built-in function
var using_color;
var using_diameter;
var bg_color;
var r, g, b;
var erasing;
var redVal, greenVal, blueVal;
var id = "";
var slider = document.getElementById("diamRange");

// We don't need r/g/b/d list since it maintains same before release themouse
var readyForNote = 0;
var x_list,  y_list;

function setup() {
  pixelDensity(1);

  // Default values for drawing
  bg_color = color('hsba(0, 100%, 50%, 0)');
  using_color = color(0, 0, 0);
  using_diameter = 7;
  erasing = false;
  canvas = createCanvas(1180,580);
  canvas.position(40, 90);
  canvas.style('z-index', '-1');
  textSize(15);
  background(bg_color);
  x_list = [];
  y_list = [];

  get_this_canvas_by_id(canvas_id);

  $("canvas").attr("class", "");
  $(".tools").attr("data-active", false);
}

function get_this_canvas_by_id(canvas_id) {
  $.ajax({
    url: "/sketchboard/get_this_canvas_by_id",
    type: "POST",
    traditional: true,
    data: { id : canvas_id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
    success: function(data) {
      load_previous_pixels(data);
      var boxes = JSON.parse(data['boxes'])
      if (Array.isArray(boxes)) {
      init(boxes);
      }
    }
  });
}

function load_previous_pixels(data) {
  /**
   * data is an object. It's like a dictionary.
   * data:{'pixels' : [255, 255, 255, ...]}
   * So use < data['pixels'] > instead of < data >!
   */
  var prev_pixels = data['pixels'];
  loadPixels();
  for (var i = 0; i < prev_pixels.length; i++) {
    pixels[i] = prev_pixels[i];
  }
  updatePixels();
}

function receive_and_draw(data) {
  var x_list  = data['x'];
  var y_list  = data['y'];
  stroke(color(data.r, data.g, data.b));
  strokeWeight(data.d);
  if (x_list.length >= 2) {
    for (var i = 1; i < x_list.length; ++i) {
      line(x_list[i-1], y_list[i-1], x_list[i], y_list[i])
    }    
  }
}

$('div.each-color').click(function() { 
    id = $(this).attr('id');
}); 

function draw() {

  if(id != "" && !erasing){ 
    switch(id) {
      case "mint": 
        redVal = 0;
        greenVal = 184;
        blueVal = 148;
        break;


      case "skyblue": //rgb(0, 206, 201)
        redVal = 0;
        greenVal = 206;
        blueVal = 201;
        break;

      case "blue": //rgb(9, 132, 227)
        redVal = 9;
        greenVal = 132;
        blueVal = 227;
        break;

      case "purple": //rgb(108, 92, 231)
        redVal = 108;
        greenVal = 92;
        blueVal = 231;
        break;

      case "yellow": //rgb(253, 203, 110)
        redVal = 253;
        greenVal = 203;
        blueVal = 110;
        break;

      case "orange": //rgb(225, 112, 85)
        redVal = 225;
        greenVal = 112;
        blueVal = 85;
        break;

      case "pink": //rgb(232, 67, 147) 
        redVal = 232;
        greenVal = 67;
        blueVal = 147;
        break;

        case "gray": //rgb(45, 52, 54)
          redVal = 45;
          greenVal = 52;
          blueVal = 54;
          break;

      default:
        redVal = 45;
        greenVal = 52;
        blueVal = 54;

    }
    using_color = color(redVal, greenVal, blueVal);
    id = ""; 
    
  }

  if (mouseIsPressed && $(".tools#scribble").attr("data-active") == 'true') {
    draw_line_and_save();
    /* 
     * In case ValueError("Too much data")
     * This is a error caused by pusher
     * set a valve to control the data size
     */
    if (x_list.length >= 100) {
      // loadPixels();
      // var strPixels = pixels.toString();
      $.ajax({
        url: "/sketchboard/send_mouse_pusher",
        type: "POST",
        traditional: true,
        data: { id : canvas_id,
                x  : x_list,
                y  : y_list,
                r  : using_color.levels[0],
                g  : using_color.levels[1],
                b  : using_color.levels[2],
                d  : using_diameter,
                // ps : pixels,
                // ps : strPixels,
                csrfmiddlewaretoken: getCSRFToken() },
        dataType : "json",
      });
      // clear the lists after updating once
      x_list = [];
      y_list = [];
    }
  } else {
    if (x_list.length > 0) {
      $.ajax({
        url: "/sketchboard/send_mouse_pusher",
        type: "POST",
        traditional: true,
        data: { id : canvas_id,
                x  : x_list,
                y  : y_list,
                r  : using_color.levels[0],
                g  : using_color.levels[1],
                b  : using_color.levels[2],
                d  : using_diameter,
                csrfmiddlewaretoken: getCSRFToken() },
        dataType : "json",
      });
      x_list = [];
      y_list = [];
    }
  }
}

function draw_line_and_save() {
  stroke(using_color);
  strokeWeight(using_diameter);
  line(pmouseX, pmouseY, mouseX, mouseY);
  x_list.push(mouseX);
  y_list.push(mouseY);
}

function save_scribble() {
  loadPixels();
  var strPixels = pixels.toString();
  $.ajax({
    url: "/sketchboard/save_scribble",
    type: "POST",
    traditional: true,
    data: { id : canvas_id,
            ps : strPixels,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
  });
}


slider.oninput= function() {  
  using_diameter = slider.value;
}


// function thinner() {
//   if (using_diameter - 5 >= 2) {
//     using_diameter = using_diameter - 5;
//   }
// }


function clear_canvas() {
  clear();
  // clear all the clients' canvases
  $.ajax({
    url: "/sketchboard/send_clear_flag",
    type: "POST",
    traditional: true,
    data: { id : canvas_id,
            csrfmiddlewaretoken: getCSRFToken() },
    dataType : "json",
  });
}

function erase() {
  
  erasing = !erasing;
  r = 255;
  g = 255;
  b = 255;
  using_color = color(r, g, b);

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

$(function(){
  window.setInterval(save_scribble, 5000);  
})
