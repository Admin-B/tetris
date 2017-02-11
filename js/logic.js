requestAnimationFrame(logic);
var oldAniTime=-Infinity;
var update=500;
var now;
function logic(timestamp){
  var delta =timestamp-oldAniTime;
  canvas.width=canvas.width;
  if(!now){
    now=new Block(block_prototype[random(0,block_prototype.length-1)],map.width/2,0,random(0,3));
  }
  now.draw();
  for(var i=0; i<map.height; i++){
    for(var j=0; j<map.width; j++){
      if(map.data[i][j]!==0){
        ctx.fillStyle=map.data[i][j];
        ctx.fillRect(j*Bsize,i*Bsize,Bsize,Bsize);
      }
    }
  }
  if(delta>=update){
    oldAniTime=timestamp;
    var t=shapes[now.shapes[now.index]];
    if(now.y+t.height+1>map.height){
      stop(t);
      now=null;
    }else{
      now.y++;
      for(var y=0; y<t.height; y++){
        for(var x=0; x<t.width; x++){
          if(map.data[now.y+y][now.x+x]!==0 && t._data[y][x]==1){
            now.y--;
            stop(t);
            break;
          }
        }
        if(!now){
          break;
        }
      }
    }
  }

  requestAnimationFrame(logic);
}
function stop(t){
  for(var y=0; y<t.height; y++){
    for(var x=0; x<t.width; x++){
        if(map.data[y+now.y][x+now.x]===0 && t._data[y][x]!==0){
          map.data[y+now.y][x+now.x]=t.background;
        }
    }
  }
  var temp=0;
  for(var i=0; i<map.height; i++){
    for(var j=0; j<map.width; j++){
      if(map.data[i][j]===0){
        break;
      }
      temp++;
    }
    if(temp==map.width){
      map.data.splice(i,1);
      map.data.unshift([]);
      for(var x=0; x<map.width; x++){
        map.data[0][x]=0;
      }
    }
    temp=0;
  }
  now=null;
}
var cavnas=document.getElementById("canvas");
var ctx   =canvas.getContext('2d');

function Block(shapes,x,y,index){
  this.shapes=shapes;//Array [num,num,...]
  this.index =index || 0;
  this.x     =x     || 0;
  this.y     =y     || 0;
}
Block.prototype.draw=function(){
  var index=this.shapes[this.index];
  var shape=shapes[index];
  var data =shape._data;
  ctx.fillStyle=shape.background;
  for(var y=0; y<data.length; y++){
    for(var x=0; x<data[y].length; x++){
      if(data[y][x]!==1){
        continue;
      }
      ctx.fillRect(x*Bsize+this.x*Bsize,y*Bsize+this.y*Bsize,Bsize,Bsize);
    }
  }
}

function push(){
  ctx.save();
}
function pop(){
  ctx.restore();
}
function random(a,b){
  return Math.floor((Math.random()*(b-a+1))+a);
}
window.onkeyup=function(e){
  if(e.keyCode==32){
    update=500;
  }
}
window.onkeydown=function(e){
  if(!now){
    return;
  }
  console.log(e.keyCode);
  var x=0,y=0,index=now.index;
  switch (e.keyCode) {
    case 39:
      x=1;
      break;
    case 37:
      x=-1;
      break;
    case 65:
      index=now.index+1<now.shapes.length ? now.index+1 : 0;
      break;
    case 32:
      update=50;
  }

  if(now.x+shapes[now.shapes[index]].width>=map.width){
    now.x-=shapes[now.shapes[index]].width-shapes[now.shapes[now.index]].width;
  }
  now.index=index;
  if(now.x+x+shapes[now.shapes[now.index]].width<=map.width && now.x+x>=0){
    now.x+=x;
  }
  var t=shapes[now.shapes[now.index]];
  for(var i=0; i<t.height; i++){
    for(var j=0; j<t.width; j++){
      if(map.data[now.y+i][now.x+j]!==0 && t._data[i][j]==1){
        now.x-=x;
        return;
      }
    }
  }
}
