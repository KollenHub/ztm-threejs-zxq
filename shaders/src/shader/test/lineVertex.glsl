uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec3 position;
attribute vec2 uv;

//时间参数
uniform float uTime;
//评率参数
uniform vec2 uFrequency; 

varying vec2 vUv;

 void main(){

    vec4 modelPosition=modelMatrix * vec4(position, 1.0);

    //设置z轴变化
    modelPosition.z+=sin(modelPosition.x * uFrequency.x - uTime);
    modelPosition.z+=sin(modelPosition.y * uFrequency.y - uTime) * 0.4;

    modelPosition.z=modelPosition.z +0.03;

    vec4 viewPosition=viewMatrix * modelPosition;

    vec4 projectedPosition=projectionMatrix * viewPosition;

    gl_Position=projectedPosition;

    vUv=uv;
 }