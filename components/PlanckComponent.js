import React, { useState } from 'react'
import { Stage, Container, Sprite, useTick, Graphics, Text } from '@inlet/react-pixi'
import { settings, SCALE_MODES } from 'pixi.js'
import * as PLANK from 'planck-js';

settings.SCALE_MODE = SCALE_MODES.NEAREST


const DynamicCoin = ({speed}) => {
    const [rotation, setRotation] = useState(0)
    const [posX, setPosX] = useState(0)
    const [posY, setPosY] = useState(0)
    //   useTick((delta) => delta && setRotation(rotation + speed * delta))

    useTick((delta) => {
        plank_world.step(delta * 0.01);

        var po = plankPositionToPixi(ball_body.getPosition());
        // ball_sprite.position.set(po.x,po.y);
        setPosX(po.x)
        setPosY(po.y)
        // console.log(po.x,po.y)
        // ball_sprite.rotation = ball_body.getAngle()*-1;
        setRotation(ball_body.getAngle()*-1)

        
    })

  return <Sprite image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png" anchor={0.5} scale={0.25} rotation={rotation} x={posX} y={posY}/>
}

const StaticCoin = ({posX, posY}) => {

  return <Sprite image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png" anchor={0.5} scale={0.25} x={posX} y={posY} />
}

//PLANK js PHYSICS
var plank_world;
var ball_body;
const YSCALE = 500;

const PixiComponent = () => {
    //Init Physics world
    plank_world = PLANK.World(
        {
            gravity: PLANK.Vec2(0, -10)
        }
    );

    //create physics walls
    var walls = plank_world.createBody();
    walls.createFixture(PLANK.Edge(pixiPositionToPlank(0,0),pixiPositionToPlank(500,0)));
    walls.createFixture(PLANK.Edge(pixiPositionToPlank(500,0),pixiPositionToPlank(500,500)));
    walls.createFixture(PLANK.Edge(pixiPositionToPlank(0,0),pixiPositionToPlank(0,500)));
    walls.createFixture(PLANK.Edge(pixiPositionToPlank(0,500),pixiPositionToPlank(500,500)));
    
    //create ball and setup ball properties 
    var ball=plank_world.createDynamicBody(pixiPositionToPlank(100,80)).createFixture(PLANK.Circle(0.1),{density:10,restitution:0.5,friction:0.9});
    ball_body = ball.getBody();
    // var po = plankPositionToPixi(ball_body.getPosition());
    // ball_sprite.position.set(po.x,po.y);

    const pushBall = () => {
        var f = PLANK.Vec2(ball_body.getPosition());
        var p = pixiPositionToPlank(120,-10);
    
        f = f.sub(p);//force direction
        f.normalize();
        f.mul(2);//force magnitude
        ball_body.applyLinearImpulse(f, p, true);    
    }

    plank_world.on('pre-solve', function(contact, oldManifold) {
        var manifold = contact.getManifold();
    
        if (manifold.pointCount == 0) {
          return;
        }
        var po = plankPositionToPixi(ball_body.getPosition());

        console.log("HIT!! ",po.x,po.y);
        
    });

    const drawEdges = React.useCallback(g => {
        g.clear()
        g.beginFill(0xff3300)
        g.lineStyle(4, 0xffd900, 1)
        g.moveTo(0, 3)
        g.lineTo(500, 3)
        g.moveTo(500, 3)
        g.lineTo(500, 500-3)
        g.moveTo(500, 500-3)
        g.lineTo(0, 500-3)
        g.moveTo(0, 500-3)
        g.lineTo(0, 3)
        g.endFill()
      }, [])
    
      const drawBox = React.useCallback(g => {
        g.clear()
        g.beginFill(0x003300)
        g.lineStyle(4, 0x00d900, 1)
        g.moveTo(0, 0)
        g.lineTo(500, 0)
        g.lineTo(500, 500)
        g.lineTo(0, 500)
        g.endFill()
      }, [])

      // Give inital push
      pushBall();
  return (
    <Stage width={500} height={YSCALE} options={{ backgroundColor: 0xeef1f5 }} onPointerUp={() => pushBall() }>
      <Graphics draw={drawEdges} />
      {/* <Container position={[250,0]} > */}
      {/* <Graphics draw={drawBox} alpha={0.25} /> */}
        <DynamicCoin speed={0.01} />
        {/* <StaticCoin posX={100} posY={430}  /> */}
        <Text text="Click anywhere..." anchor={0.5} x={100} y={20} />
      {/* </Container> */}
    </Stage>
  )
}

export default PixiComponent

//UTIL================

function pixiPositionToPlank(x, y) {
    /*
    Orientation Change
    ==================
    Pixi cordinate system      +
    -------------->+           ^
    |                          |
    |                          |
    |                  ==>     |
    |                          |
    v                           ------------->+
    +                           Plank cordinate system 
    */

    //change Y origin point and direction
    y=(y-YSCALE)*-1;
    //convert pixels to meters (64px = 0.1m)
    y *= 0.0015625;
    x *= 0.0015625;
    
    return PLANK.Vec2(x,y);
}

function plankPositionToPixi(v) {


     /*
    Orientation Change
    ==================
    Pixi cordinate system      +
    -------------->+           ^
    |                          |
    |                          |
    |                  <==     |
    |                          |
    v                           ------------->+
    +                           Plank cordinate system 
    */

    
    //convert pixels to meters (64px = 0.1m)
    var retY = v.y*640;
    var retX = v.x*640;
    //change Y origin point and direction
    retY = (retY*-1)+YSCALE;
    return { x: retX, y: retY };
}
