
varying vec2 vUv;

uniform sampler2D uTex;
uniform float uInterval;    // 等高线间隔（0.1 表示每隔0.1绘一条线）
uniform float uLineWidth;   // 线宽度（如 0.01）

void main()
{
float value = texture2D(uTex, vUv).r;
float scaled = value / uInterval;
float edgeBand = fwidth(scaled) * uLineWidth; // 自适应屏幕宽度

// 判断当前是否靠近整数，即处于某个等值线带
float distanceToLine = abs(fract(scaled) - 0.5); // 与中心的距离
float mask = smoothstep(0.5, 0.5 - edgeBand, distanceToLine); // 越接近中心线越黑

if(mask<1.0)
{
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
}else
{
    gl_FragColor=vec4(1.0,1.0,1.0,1.0);
}
}