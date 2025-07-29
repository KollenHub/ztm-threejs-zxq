
varying vec2 vUV;

#define PI 3.1415926535897932384626433832795
//随机数
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

//绕点旋转
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    float strength = 0.0;
    //pattern 1 
    // gl_FragColor = vec4(vUV,1.0, 1.0);
     
    //pattern 2 红绿渐变
    // gl_FragColor = vec4(vUV,0.0,1.0);

    //pattern 3 从左到右 黑白渐变
    // gl_FragColor = vec4(vUV.x,vUV.x,vUV.x,1.0);

    //pattern 4 从下到上 黑白渐变
    // gl_FragColor = vec4(vUV.y,vUV.y,vUV.y,1.0);

    //pattern 5 从上到下 黑白渐变
    // float reverseY  = 1.0 - vUV.y;
    // gl_FragColor =vec4(reverseY,reverseY,reverseY,1.0);

    //pattern 6 压缩为原来的十分之一
    // strength = vUV.y * 10.0;

    //pattern7 取模 10段 0-1
    // strength = mod(vUV.y * 10.0,1.0);

    //pattern8 step 函数
    // strength = step(0.5,mod(vUV.y * 10.0,1.0));

    //pattern9 step 横线
    // strength = step(0.8,mod(vUV.y * 10.0,1.0));

    //pattern10 step 竖线
    // strength = step(0.90,mod(vUV.x*10.0 + 0.5,1.0)) + vUV.x;

    //pattern11 step 网格
    // float strengthY= step(0.8,mod(vUV.y * 10.0,1.0));
    // float strengthX =step(0.8,mod(vUV.x * 10.0,1.0)); 
    // strength= strengthY +strengthX;

    //pattern12 点阵
    // float strengthY= step(0.8,mod(vUV.y * 10.0,1.0));
    // float strengthX =step(0.8,mod(vUV.x * 10.0,1.0)); 
    // strength= strengthY * strengthX;

    //pattern13 横虚线
    // float strengthY= step(0.8,mod(vUV.y * 10.0,1.0));
    // float strengthX =step(0.4,mod(vUV.x * 10.0,1.0)); 
    // strength= strengthY *strengthX;

    //pattern14 直角
    // strength = step(0.8,mod(vUV.y * 10.0,1.0)) * step(0.4,mod(vUV.x * 10.0,1.0)); 
    // strength  += step(0.8,mod(vUV.x * 10.0,1.0)) * step(0.4, mod(vUV.y * 10.0,1.0 ));

    //pattern15 十字
    // float barX = step(0.4, mod(vUV.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUV.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUV.x * 10.0, 1.0)) * step(0.4, mod(vUV.y * 10.0 - 0.2, 1.0));
    // strength = barX + barY;

    //pattern16 绝对值
    // strength=abs(vUV.x-0.5);

    //pattern 17 米字
    // strength =min(abs(vUV.x-0.5),abs(vUV.y-0.5));

    //pattern 18 四角星
    // strength = max(abs(vUV.x-0.5),abs(vUV.y-0.5));

    //pattern 19 矩形
    // strength =step(0.2,max(abs(vUV.x-0.5),abs(vUV.y-0.5)));

    //pattern 20 矩形环
    // strength =step(0.2,max(abs(vUV.x-0.5),abs(vUV.y-0.5))) * (1.0 - step(0.25,max(abs(vUV.x-0.5),abs(vUV.y-0.5))));

    //pattern 21 色阶图
    // strength= floor(mod(vUV.x*10.0,10.0))/10.0;

    //pattern 22 双向色阶图
    // strength= floor(mod(vUV.y*10.f,10.f))/10.0* floor(mod(vUV.x*10.0,10.0))/10.0;

    //pattern 23 随机数
    // strength = random(vUV);

    //pattern 24 随机马赛克
    // vec2 gridUV= vec2(floor(vUV.x*10.0)/10.f,floor(vUV.y*10.0)/10.0);
    // strength = random(gridUV);

    //pattern 25 随机马赛克-斜
    // vec2 gridUV= vec2(floor(vUV.x*10.0)/10.f,floor((vUV.y + vUV.x*0.5) *10.0 )/10.0);
    // strength = random(gridUV);
    
    //pattern 26 黑零点
    // strength = distance(vUV,vec2(0.f,0.f));

    //pattern 27 中心黑点
    // strength =distance(vUV,vec2(0.5,0.5));

    //pattern 28 中心白点
    // strength =1.0 - distance(vUV,vec2(0.5,0.5));

    //pattern 29 中心亮点
    // strength = 0.015 / distance(vUV,vec2(0.5,0.5));

    //pattern 30 椭圆
    //  strength = 0.15 / distance(vec2(vUV.x,(vUV.y-0.5)*10.0) ,vec2(0.5,0));

    //pattern 31 四角星
    // strength =(0.15 / distance(vec2(vUV.x,(vUV.y-0.5)*10.0) ,vec2(0.5,0)))*( 0.15 / distance(vec2((vUV.x-0.5)*10.0,vUV.y) ,vec2(0,0.5)));

   //pattern 32旋转四角星
   //vec2 rotateUV=rotate(vUV,PI/4.0,vec2(0.5,0.5));
  //strength =(0.15 / distance(vec2(rotateUV.x,(rotateUV.y-0.5)*10.0) ,vec2(0.5, 0)))*( 0.15 / distance(vec2((rotateUV.x-0.5)*10.0,rotateUV.y) ,vec2(0,0.5)));

    //pattern 33 圆
    // strength =step(0.25, distance(vec2(vUV.x,vUV.y),vec2(0.5,0.5)));

    //pattern 34模糊圆环
    // strength =abs(distance(vUV,vec2(0.5,0.5 ) ) - 0.25);


    //pattern 35圆环
    // strength =step(0.01,abs(distance(vUV,vec2(0.5,0.5 ) ) - 0.25));

    //pattern 36反向圆环
    // strength =1.f - step(0.02,abs(distance(vUV,vec2(0.5,0.5 ) ) - 0.25));

    //pattern 37 波浪环
    // vec2 waveUV=vec2(vUV.x,sin(vUV.x*50.f)*0.1+vUV.y);
    // strength =1.f -  step(0.02,abs(distance(waveUV,vec2(0.5,0.5 ) ) - 0.25));

    //pattern 38 双向波浪环
    // vec2 waveUV=vec2(cos(vUV.y*30.f)*0.1+vUV.x,cos(vUV.x*30.f)*0.1+vUV.y);
    // strength =1.f -  step(0.02,abs(distance(waveUV,vec2(0.5,0.5 ) ) - 0.25));

    //pattern 39 大频率波浪环
    // vec2 waveUV=vec2(vUV.x+sin(vUV.y*100.f)*0.1,vUV.y+sin(vUV.x*100.f)*0.1);
    // strength =1.f -  step(0.02,abs(distance(waveUV,vec2(0.5,0.5 ) ) - 0.25));

    //pattern 40 角度
    // float angle=atan(vUV.y/vUV.x);
    // strength=angle;

    //pattern 41 一半角度
    //  float angle=atan((vUV.y - 0.5)/(vUV.x - 0.5));
    // strength=angle;

    //pattern 42 旋转角度
    // float angle=atan(vUV.x-0.5,vUV.y-0.5);
    // angle/=PI*2.f;
    // angle+=0.5;
    // strength=angle;

    //pattern 43 角度取模
    // float angle = atan(vUV.x - 0.5, vUV.y - 0.5) / (PI * 2.0) + 0.5;
    // strength = mod(angle * 20.0, 1.0);

    //pattern 43 角度取模取阶梯
    // float angle = atan(vUV.x - 0.5, vUV.y - 0.5) / (PI * 2.0) + 0.5;
    // strength =step(0.5, mod(angle * 20.0, 1.0));

    //pattern 44 圆形波浪环
    // float angle = atan(vUV.x - 0.5, vUV.y - 0.5) / (PI * 2.0) + 0.5;
    // float radius = 0.25 + sin(angle * 100.0) * 0.02;
    // strength = 1.0 - step(0.01, abs(distance(vUV, vec2(0.5)) - radius));
       

    //随机噪点图
    // strength=cnoise(vUV*10.f);

    //阶梯噪点图
    // strength=step(0.0,cnoise(vUV*10.f));

    //1-噪点图
    // strength=1.0-abs(cnoise(vUV*10.f));

    // strength=sin(cnoise(vUV*10.f)*20.0);

    strength=step(0.9, sin(cnoise(vUV*10.f)*20.0));









 




    

    gl_FragColor = vec4(strength,strength,strength, 1.0);
}
