// square moving
let a = 0;
 const square = document.querySelector('#square');
 square.addEventListener('click', moving);
 const mouse = document.querySelector(".mouse");
 function moving() {
     if(a == 0){
         a=1; console.log(a);
         square.addEventListener("mousemove",aa);
 }else{
     square.removeEventListener("mousemove",aa);
     square.style.animation = 'rint 10s linear 0s infinite'
     a=0;
     
 }

 }
 function aa(e) {
     const mouseX = e.clientX;
         const mouseY = e.clientY;
         const X = mouseX / 2;
         const Y = mouseY / 2;
         square.style.animation = 'none'
         square.style.transform = `rotateX(${X}deg) rotateY(${X}deg)`;
 }    

//chat button
    

    
