const wishBadge = document.getElementById("wish-badge");
const wishModal = document.querySelectorAll('.wishlist-modal');
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

const wishModal = document.getElementById('show-');
wishModal.array.forEach(element => {
   element.addEventListener('click', ()=>{

   })
});