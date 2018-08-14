var twist1, twist2, arms1, arms2, slide1, slide2;
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); 

    shad = createShader(
            vert(),
            frag(lantern(
                    mult(slides.flower0,
                         slides.flower1))));

    shader(shad);
    shad.setUniform("ratio", width/height);
    // slide 1 rotation matrix
    shad.setUniform("rot1", rot(0)); // id matrix
    frameRate(30);

    // ui
    let lm = 40;
    let get = getURLParams();
    createSpan('arms')
        .position(lm,36);
    arms1 = createSlider(1, 20, 
            (get.arms1?parseInt(get.arms1):random(1,20)))
        .position(lm,40)
        .input(updateShader);
    arms2 = createSlider(1, 20, 
            (get.arms2?parseInt(get.arms2):random(1,20)))
        .position(lm,60)
        .input(updateShader);
    createSpan('twist')
        .position(lm,96);
    twist1 = createSlider(-2, 2, 
            (get.twist1?parseFloat(get.twist1):random(-2,2)), 0.1)
        .position(lm,100)
        .input(updateShader);
    twist2 = createSlider(-2, 2, 
            (get.twist2?parseFloat(get.twist2):random(-2,2)), 0.1)
        .position(lm,120)
        .input(updateShader);

    slide1 = createCheckbox('slide 1', true)
        .position(lm, 160)
        .input(updateShader);
    slide2 = createCheckbox('slide 2', true)
        .position(lm, 180)
        .input(updateShader);

    updateShader();
}

function updateShader() {
    shad.setUniform("uTwist1", twist1.value());
    shad.setUniform("uTwist2", twist2.value());
    shad.setUniform("uArms1", arms1.value());
    shad.setUniform("uArms2", arms2.value());
    shad.setUniform("uSlide1", slide1.checked());
    shad.setUniform("uSlide2", slide2.checked());


    history.replaceState("","",
            "?"+Object.entries({
                "twist1": twist1.value(),
                "twist2": twist2.value(),
                "arms1": arms1.value(),
                "arms2": arms2.value()
            }).map(([k,v]) => k+"="+v).join("&"))
    

}

function draw() {
    // shad.setUniform("uTime", millis()/4000.);
    shad.setUniform("uTime", frameCount / 120.);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);

    // if(frameCount < 300)
    //     saveCanvas('frame'+nf(frameCount,5, 0), 'png');
}

function frag(colour) {
  return "precision highp float;" +
      "varying vec2 vPos;" +
      "uniform float uTime;" +
      "uniform float uTwist1;" +
      "uniform float uTwist2;" +
      "uniform float uArms1;" +
      "uniform float uArms2;" +
      "uniform bool  uSlide1;" +
      "uniform bool  uSlide2;" +
      "uniform float ratio;" +
      "mat2 rot1 = mat2(cos(uTime),sin(uTime),-sin(uTime),cos(uTime));" +
      "mat2 rot2 = mat2(cos(-uTime),sin(-uTime),-sin(-uTime),cos(-uTime));" +
      "void main(){" +
      "  vec2 uv = vPos;" +
      "  uv.x *= ratio;" +
      "  vec2 st = vec2(atan(uv.x,uv.y), length(uv));" +
      "  vec3 colour = " + colour +
      "  colour -= vec3(0.,1.,1.)*vec3(smoothstep(0.01,0.0,length(uv)));"+
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
    return "(uSlide1?"+a("rot1")+":1.)" +"*(uSlide2?"+ b("rot2")+":1.)";
}

const slides = { empty: () => "vec3(1.)" };
// bar: "vec3(smoothstep(0.36,0.4,abs((rot2 * p).y)))"
slides.st = (d) => "vec2(atan(("+d+"*uv).x,("+d+"*uv).y), length(uv))";

slides.bar = (d) => "(length(uv)*uTwist1+"+slides.st(d)+".x/6.2831+.5)*uArms1";
slides.bar2 = (d) => "(-length(uv)*uTwist2+"+slides.st(d)+".x/6.2831+.5)*uArms2";

slides.zigzag = (d) => "min(fract("+slides.bar2(d)+"), fract(1.-"+slides.bar(d)+"))";
slides.zigzag2 = (d) => "min(fract("+slides.bar2(d)+"), fract(1.-"+slides.bar(d)+"))";
slides.flower0 = (d) => "smoothstep(0.,.013, "+slides.zigzag(d)+"*1.2+.1 - length(uv))";
slides.flower1 = (d) => "smoothstep(0.,.013, "+slides.zigzag2(d)+"*1.2+.1 - length(uv))";
slides.flower2 = (d) => "smoothstep(0.,.1, "+slides.zigzag(d)+"*1.2+.3 - length(uv))";
slides.flower3 = (d) => "max("+slides.flower1(d)+ "," +slides.flower2(d)+")";

function keyTyped() {
    if(key == " ") {
        arms1.value(random(1,20))
        arms2.value(random(1,20))
        twist1.value(random(-2,2))
        twist2.value(random(-2,2))
    }
    updateShader();
}
