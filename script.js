
const canvas=document.getElementById("game")
const ctx=canvas.getContext("2d");
canvas.width=innerWidth;
canvas.height=innerHeight;


class Player{
   constructor(x,y,radius,color){
      this.x=x,
      this.y=y,
      this.color=color,
      this.radius=radius
   }
   draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
      ctx.fillStyle=this.color;
      ctx.fill()
   }
}

class ProjectTile extends Player{
   constructor(x,y,radius,color,veloCtiy){
      super(x,y,radius,color)
      this.veloCtiy=veloCtiy;
   }
   draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
      ctx.fillStyle=this.color;
      ctx.fill();
   }
   update(){
      this.draw();
      this.x=this.x+this.veloCtiy.x;
      this.y=this.y+this.veloCtiy.y;
   }
};

class Enimies extends ProjectTile{
   constructor(x,y,radius,color,veloCtiy){
      super(x,y,radius,color,veloCtiy)
   }
   draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
      ctx.fillStyle=this.color;
      ctx.fill();
   }
   update(){
      this.draw();
      this.x=this.x+this.veloCtiy.x;
      this.y=this.y+this.veloCtiy.y;
   }
}

const x=canvas.width / 2;
const y =canvas.height / 2;
const player= new Player(x,y,25,"blue");

const projectTiles=[];
const enimies=[];

function spawnEnimies(){
   setInterval(()=>{
      const radius=Math.random()*(30-5)+5;
      let x;
      let y;
      if(Math.random()<0.5){
        x=Math.random()<0.5?0-radius:canvas.width+radius;
        y=Math.random()*canvas.height;
      }
      else{
         x=Math.random()*canvas.width;
         y=Math.random()<0.5?0-radius:canvas.height+radius;

      }
      const color="red"
      const angle=Math.atan2(
         canvas.height/2-y,
         canvas.width/2-x
      )
      const veloCtiy={
         x:Math.cos(angle),
         y:Math.sin(angle)
      }
      enimies.push(new Enimies(x,y,radius,color,veloCtiy))
   },1000)
}
let animationId;
function animate(){
   animationId=requestAnimationFrame(animate)
   ctx.clearRect(0,0,canvas.width,canvas.height)
   ctx.fillStyle="rgba(0, 0, 0, 0.1)"
   ctx.fillRect(0,0,canvas.width,canvas.height)
   projectTiles.forEach((projectTile,index)=>{
      projectTile.update()
      if(projectTile.x+projectTile.radius<0 
         || projectTile.x - projectTile.radius>canvas.width
         ||projectTile.y + projectTile.radius<0 
         || projectTile.y - projectTile.radius>canvas.height
         ){
            setTimeout(()=>{
               projectTiles.splice(index,1)
            },0)
         }
   })
   enimies.forEach((eniems,index)=>{
      const dist=Math.hypot(player.x - eniems.x,player.y - eniems.y)
      if(dist-eniems.radius-player.radius < 1){
         cancelAnimationFrame(animationId);
      }


      eniems.update();
      projectTiles.forEach((projectTile,pIndex)=>{

         const dist=Math.hypot(projectTile.x-eniems.x,projectTile.y-eniems.y)

         if(dist-eniems.radius-projectTile.radius < 1){
            setTimeout(()=>{
               enimies.splice(index,1);
               projectTiles.splice(pIndex,1);
            },0)
         }
      })
   }) 
   player.draw();
}

window.addEventListener("click",(event)=>{
   const angle=Math.atan2(
      event.clientY-canvas.height/2,
      event.clientX-canvas.width/2
   )
   const veloCtiy={
      x:Math.cos(angle)*6,
      y:Math.sin(angle)*6
   }
   projectTiles.push(new ProjectTile(canvas.width/2,canvas.height/2,10,"yellow",veloCtiy))
})
window.addEventListener("keydown",()=>location.reload())
animate()
spawnEnimies( )



