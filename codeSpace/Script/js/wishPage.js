const wishBadge = document.getElementById("wish-badge");
var count = 0;
document.addEventListener('DOMContentLoaded', (event)=>{
   const addWish = document.querySelectorAll('.wish-btn');
   addWish.forEach(btn => {
    btn.addEventListener("click", addtoWish);
   });
});

function addtoWish(){
 wishBadge.innerHTML = count++;
}
