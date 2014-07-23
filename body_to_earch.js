// ref: [DeviceOrientation Event Specification](http://w3c.github.io/deviceorientation/spec-source-orientation.html)

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

// get rotation matrix ZXY from device body frame to earch frame. v_earch = ZXY * v_body.
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


// convert vector (vx,vy,vz) in device body frame to representation in earch frame
function body_to_earch( alpha, beta, gamma, vx, vy, vz ) {

  ZXY = getRotationMatrix( alpha, beta, gamma );
  x = ZXY[0]*vx + ZXY[1]*vy + ZXY[2]*vz;
  y = ZXY[3]*vx + ZXY[4]*vy + ZXY[5]*vz;
  z = ZXY[6]*vx + ZXY[7]*vy + ZXY[8]*vz;
  return {x: x, y: y, z: z};

}

// decompose vector (vx,vy) to components xt tangential to heading and yt normal to heading
// in earch fram (East, North, Up), heading is in range [0,360) clockwise from north 
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

// speed and heading infomation could be get by Geolocation API.
// ref [Geolocation API Specification](http://dev.w3.org/geo/api/spec-source.html)


