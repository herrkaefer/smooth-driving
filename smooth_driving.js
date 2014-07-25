// ref: [DeviceOrientation Event Specification](http://w3c.github.io/deviceorientation/spec-source-orientation.html)

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

// get rotation matrix ZXY from device body frame to earth frame. v_earth = ZXY * v_body.
// from http://w3c.github.io/deviceorientation/spec-source-orientation.html
function getRotationMatrix( alpha, beta, gamma ) {

  var _x = beta  ? beta  * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos( _x );
  var cY = Math.cos( _y );
  var cZ = Math.cos( _z );
  var sX = Math.sin( _x );
  var sY = Math.sin( _y );
  var sZ = Math.sin( _z );

  //
  // ZXY rotation matrix construction.
  //

  var m11 = cZ * cY - sZ * sX * sY;
  var m12 = - cX * sZ;
  var m13 = cY * sZ * sX + cZ * sY;

  var m21 = cY * sZ + cZ * sX * sY;
  var m22 = cZ * cX;
  var m23 = sZ * sY - cZ * cY * sX;

  var m31 = - cX * sY;
  var m32 = sX;
  var m33 = cX * cY;

  return [
  m11,    m12,    m13,
  m21,    m22,    m23,
  m31,    m32,    m33
  ];

};


// convert vector (vx,vy,vz) in device body frame to representation in earth frame
function body_to_earth( alpha, beta, gamma, vx, vy, vz ) {

  ZXY = getRotationMatrix( alpha, beta, gamma );
  x = ZXY[0]*vx + ZXY[1]*vy + ZXY[2]*vz;
  y = ZXY[3]*vx + ZXY[4]*vy + ZXY[5]*vz;
  z = ZXY[6]*vx + ZXY[7]*vy + ZXY[8]*vz;
  return {x: x, y: y, z: z};

}

// decompose vector (vx,vy) to components xt tangential to heading and yt normal to heading
// in earth fram (East, North, Up), heading is in range [0,360) clockwise from north 
function tangential_and_normal_decomposition(vx, vy, heading) {

  var rad_heading = heading  ? heading  * degtorad : 0;

  var xt = -Math.sin(rad_heading);
  var yt = Math.cos(rad_heading);

  var xn = Math.cos(rad_heading);
  var yn = Math.sin(rad_heading);

  vt = vx * xt + vy * yt;
  vn = vx * xn + vy * yn;

  return {xt: vt, xn: vn};
  
}


////////////////////////////////////////////////////
// Event handlers
////////////////////////////////////////////////////


$(function () {
  $(document).ready(function() {
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });
    
    var chart;
    $('#container').highcharts({
      chart: {
        type: 'spline',
                //animation: Highcharts.svg, // don't animate in old IE
                animation: false,
                marginRight: 10,
                events: {
                  load: function() {
                        // set up the updating of the chart each second
                        var series_a = this.series[0];
                        var series_a1 = this.series[1];
                        setInterval(function() {
                            var x = (new Date()).getTime(); // current time
                                // a = Math.random();
                                // a1 = a + Math.random();
                                //get_acceleration();
                                var a = get_absolute_acceleration();

                                series_a.addPoint([x, a], true, true);
                                series_a1.addPoint([x, a], true, true);
                              }, 500);
                      }
                    }
                  },
                  title: {
                    text: 'Live Acceleration Data'
                  },
                  xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                  },
                  yAxis: {
                    title: {
                      text: 'Value'
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                  },
                  tooltip: {
                    enabled: false,
                    formatter: function() {
                      return '<b>'+ this.series.name +'</b><br/>'+
                      Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                      Highcharts.numberFormat(this.y, 2);
                    }
                  },
                  legend: {
                    enabled: true
                  },
                  exporting: {
                    enabled: false
                  },
                  series: [{
                    name: 'Acceleration',
                    data: (function() {
                    // generate an array of random data
                    var data = [],
                    time = (new Date()).getTime(),
                    i;

                    for (i = -19; i <= 0; i++) {
                      data.push({
                        x: time + i * 1000,
                            y: 0//Math.random()
                          });
                    }
                    return data;
                  })()
                },
                {
                  name: 'Derivative of acceleration',
                  data: (function() {
                    // generate an array of random data
                    var data = [],
                    time = (new Date()).getTime(),
                    i;

                    for (i = -19; i <= 0; i++) {
                      data.push({
                        x: time + i * 1000,
                            y: 0//Math.random()
                          });
                    }
                    return data;
                  })()
                }]
              });
});

});


var alpha, beta, gamma;
var ax, ay, az;
var a_earth, a_tn;
var heading, speed;
var latitude, longitude;


function deviceOrientationListener(event) {
  alpha = event.alpha;
  beta = event.beta;
  gamma = event.gamma;

  document.getElementById("alpha").innerHTML = Math.round(alpha);
  document.getElementById("beta").innerHTML = Math.round(beta);
  document.getElementById("gamma").innerHTML = Math.round(gamma);
}

function deviceMotionListener(event) {
  ax = event.acceleration.x;
  ay = event.acceleration.y;
  az = event.acceleration.z;

  document.getElementById("ax").innerHTML = Math.round(ax);
  document.getElementById("ay").innerHTML = Math.round(ay);
  document.getElementById("az").innerHTML = Math.round(az);
}



function get_decomposed_acceleration() {
  a_earth = body_to_earth(alpha, beta, gamma, ax, ay, az);
  get_location();
  a_tn = tangential_and_normal_decomposition(a_earth.x, a_earth.y, heading)

  document.getElementById("a_earth_x").innerHTML = Math.round(a_earth.x);
  document.getElementById("a_earth_y").innerHTML = Math.round(a_earth.y);
  document.getElementById("a_earth_z").innerHTML = Math.round(a_earth.z);
}


function get_absolute_acceleration() {
  return Math.sqrt(ax*ax+ay*ay+az*az);
}

if (window.DeviceOrientationEvent && window.DeviceMotionEvent && navigator.geolocation) {

  window.addEventListener("deviceorientation", deviceOrientationListener);
  window.addEventListener('devicemotion', deviceMotionListener);
  navigator.geolocation.watchPosition(function(position){
    heading = position.coords.heading;
    speed = position.coords.speed;
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    document.getElementById("latitude").innerHTML = latitude;
    document.getElementById("longitude").innerHTML = longitude;
    document.getElementById("heading").innerHTML = Math.round(heading);
    document.getElementById("speed").innerHTML = Math.round(speed);

  })

  document.getElementById("support").innerHTML = "support";
    // console.log("suppport.");
  } 

  else {
    alert("Sorry, your browser doesn't support Device Orientation or Motion or geolocation.");
    console.log("do not suppport.");
  }

