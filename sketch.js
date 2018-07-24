function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    shad = createShader(
            vert(),
            frag(lantern(
                    mult(slides.empty,
                         slides.bar))));

    shader(shad);
    shad.setUniform("ratio", width/height);
    // slide 1 rotation matrix
    shad.setUniform("rot1", rot(0)); // id matrix
    frameRate(30);
}

function draw() {
    shad.setUniform("uTime", millis()/1000.);
    // quad(-1,-1,1,-1,1,1,-1,1);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function frag(colour) {
  return "precision highp float;" +
      "varying vec2 vPos;" +
      "uniform float uTime;" +
      "uniform float ratio;" +
      "mat2 rot1 = mat2(cos(uTime),sin(uTime),-sin(uTime),cos(uTime));" +
      "mat2 rot2 = mat2(cos(-uTime),sin(-uTime),-sin(-uTime),cos(-uTime));" +
      "void main(){" +
      "  vec2 uv = vPos;" +
      "  uv.x *= ratio;" +
      "  vec2 st = vec2(atan(uv.x,uv.y), length(uv));" +
      "  vec3 colour = " + colour +
      "  gl_FragColor = vec4(colour,1.);" +
      "}";
}
function vert(content) {
  return "precision highp float;" +
      "varying vec2 vPos;" +
      "attribute vec3 aPosition;" +
      "void main(){" +
      "  vPos = (gl_Position = vec4(aPosition, 1.0)).xy;" +
      "}";
}

function lantern(slide="vec3(1.)") {
    return "min(" +
        "vec3(smoothstep(1.,0.97,distance(uv,vec2(0,0))))," +
        slide +
        ");"
}

function rot(deg) {
    return [cos(deg), sin(deg), -sin(deg), cos(deg)];
}

function mult(a,b) {
    return a +"*"+ b;
}

const slides = { empty: "vec3(1.)" };
// bar: "vec3(smoothstep(0.36,0.4,abs((rot2 * p).y)))"
slides.bar = "vec3(atan((rot1*uv).x,(rot1*uv).y))";
slides.bar = "("+slides.bar+".x/6.2831+.5)*7.";
slides.bar = "min(fract("+slides.bar+"), fract(1.-"+slides.bar+"))";
slides.bar = "smoothstep(0.,.1, "+slides.bar+"*.3+.2 - length(uv))";
