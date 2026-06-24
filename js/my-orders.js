import { db }
from "./firebase.js";


import {

collection,
query,
where,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

getAuth,
onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




const auth =
getAuth();


const box =
document.getElementById(
"myOrders"
);





onAuthStateChanged(
auth,
(user)=>{


if(!user){


box.innerHTML =
"Please login first";

return;

}



let q =
query(

collection(db,"orders"),

where(
"userEmail",
"==",
user.email
)

);




onSnapshot(q,(snapshot)=>{


box.innerHTML="";



snapshot.forEach(doc=>{


let order =
doc.data();



box.innerHTML +=
`


<div class="order-card">


<h2>
${order.items[0].name}
</h2>


<h3>
${order.total}
</h3>


<p>
Payment: ${order.payment}
</p>



<div class="tracking">


${track(order.status)}


</div>



</div>


`;



});



});



}

);





function track(status){


let steps =
[
"Confirmed",
"Packed",
"Shipped",
"Delivered"
];



let html="";



steps.forEach(step=>{


html +=
`

<p>

${status==step ? "🚚" : "✔"}

${step}

</p>

`;



});


return html;


}