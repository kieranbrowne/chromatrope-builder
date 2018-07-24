function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    shad = createShader(
            vert(),
            frag(lantern()));
    shader(shad);
    shad.setUniform("ratio", width/height);
}

function draw() {
    shad.setUniform("uTime", frameCount/20.);
    // quad(-1,-1,1,-1,1,1,-1,1);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

function frag(colour) {
  return "precision highp float;" +
      "varying vec2 vPos;" +
      "uniform float uTime;" +
      "uniform float ratio;" +
      "void main(){" +
      "  vec2 p = vPos;" +
      "  p.x *= ratio;" +
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
        "vec3(smoothstep(1.,0.97,distance(p,vec2(0,0))))," +
        slide +
        ");"
}
