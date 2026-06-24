// ================================
// Cart JavaScript File
// ================================

// ================================
// Firebase Orders
// ================================


import { db }

from "./firebase.js";


import {

collection,
addDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================================
// Cart Storage
// ================================

let cart = JSON.parse(
localStorage.getItem("cart")
)
|| [];

let appliedDiscount = 0;



// Initialize

document.addEventListener(
"DOMContentLoaded",
function(){

    initializeCart();

    initializeCheckout();

});




// ================================
// Cart Page
// ================================


function initializeCart(){


    const cartTable =
    document.getElementById("cartItemsTable");


    if(!cartTable)
    return;



    renderCart();


    const clearBtn =
    document.getElementById("clearCartBtn");


    if(clearBtn){

        clearBtn.addEventListener(
        "click",
        clearCart
        );

    }



    const couponBtn =
    document.getElementById("applyCouponBtn");


    if(couponBtn){


        couponBtn.addEventListener(
        "click",
        applyCoupon
        );


    }



    const checkoutBtn =
    document.getElementById(
    "proceedCheckoutBtn"
    );


    if(checkoutBtn){


        checkoutBtn.onclick=()=>{


            if(cart.length===0){

                alert(
                "Cart is empty"
                );

                return;

            }


            window.location.href=
            "checkout.html";


        };


    }



}







// ================================
// Render Cart Items
// ================================


function renderCart(){


cart = JSON.parse(
localStorage.getItem("cart")
)
|| [];

// CART PAGE COUNT UPDATE
let cartItemCount =
document.getElementById(
"cartItemCount"
);


if(cartItemCount){

cartItemCount.innerHTML =
cart.length;

}
// HERO CART TITLE UPDATE

let headings =
document.querySelectorAll(
"h1"
);


headings.forEach(h=>{


if(
h.innerHTML.includes("Shopping Cart")
){


h.innerHTML =
`Shopping Cart (${cart.length} items)`;


}


});

const empty =
document.getElementById(
"emptyCart"
);


const content =
document.getElementById(
"cartContent"
);



if(cart.length===0){


if(empty)
empty.style.display="block";


if(content)
content.style.display="none";


return;


}



if(empty)
empty.style.display="none";


if(content)
content.style.display="flex";



let table =
document.getElementById(
"cartItemsTable"
);

console.log("Cart Table =",table);
console.log("Cart Data =",cart);

if(!table)
return;



table.innerHTML =
cart.map((item,index)=>`


<tr>


<td>

<div class="cart-product">

<img src="${item.image}">

<div>

<h4>${item.name}</h4>

<p>${item.category}</p>

</div>

</div>

</td>



<td>

₹${item.price}

</td>



<td>


<button onclick="changeQuantity('${item.id}',-1)">
-
</button>


<span>${item.quantity}</span>


<button onclick="changeQuantity('${item.id}',1)">
+
</button>


</td>



<td>

₹${item.price * item.quantity}

</td>



<td>


<button onclick="removeItem('${item.id}')">

<i class="fas fa-trash"></i>

</button>


</td>


</tr>


`).join("");



calculateTotal();



}

window.renderCart = renderCart;


document.addEventListener(
"DOMContentLoaded",
()=>{

renderCart();

}
);




// ================================
// Quantity Update
// ================================



function changeQuantity(id,value){



let item =
cart.find(
p=>p.id==id
);



if(!item)
return;



item.quantity += value;



if(item.quantity<=0){


removeItem(id);

return;


}



saveCart();

renderCart();

updateCartCount();



}







// ================================
// Remove Product
// ================================



function removeItem(id){



cart =
cart.filter(
p=>p.id!=id
);



saveCart();

renderCart();

updateCartCount();



}








// ================================
// Clear Cart
// ================================



function clearCart(){



if(
confirm(
"Remove all items?"
)
){



cart=[];


saveCart();


renderCart();


updateCartCount();



}



}







// ================================
// Calculate Price
// ================================


function calculateTotal(){



let subtotal =
cart.reduce(
(sum,item)=>

sum + item.price*item.quantity

,0);



let delivery =

subtotal>10000 ? 0 : 500;




let discount =

subtotal * appliedDiscount/100;



let total =

subtotal + delivery - discount;





setText(
"cartSubtotal",
"₹"+subtotal
);


setText(
"deliveryCharges",
"₹"+delivery
);



setText(
"cartDiscount",
"-₹"+discount
);



setText(
"cartTotal",
"₹"+total
);



}






// ================================
// Coupon System
// ================================



function applyCoupon(){



let code =
document
.getElementById("couponCode")
.value
.toUpperCase();



let message =
document.getElementById(
"couponMessage"
);



if(code==="SAVE10"){


appliedDiscount=10;


message.innerHTML=
"Coupon Applied Successfully";


message.className=
"coupon-message success";


}



else if(code==="SAVE15"){


appliedDiscount=15;


message.innerHTML=
"Coupon Applied Successfully";


message.className=
"coupon-message success";


}



else if(code==="FIRST20"){


appliedDiscount=20;


message.innerHTML=
"Coupon Applied Successfully";


message.className=
"coupon-message success";


}



else{


appliedDiscount=0;


message.innerHTML=
"Invalid Coupon";


message.className=
"coupon-message error";


}



calculateTotal();



}









// ================================
// Checkout Page
// ================================



function initializeCheckout(){



const summary =
document.getElementById(
"summaryItems"
);



if(!summary)
return;




loadSummary();




const shipping =
document.getElementById(
"shippingForm"
);




if(shipping){


shipping.addEventListener(
"submit",
(e)=>{


e.preventDefault();


document
.getElementById("shippingStep")
.classList.remove("active");


document
.getElementById("paymentStep")
.classList.add("active");


});


}





const placeBtn =
document.getElementById(
"placeOrderBtn"
);



if(placeBtn){



placeBtn.onclick =
startRazorpay;



}




}








// ================================
// Checkout Summary
// ================================



function loadSummary(){

cart = JSON.parse(
localStorage.getItem("cart")
)
|| [];


let box =
document.getElementById(
"summaryItems"
);



box.innerHTML =
cart.map(item=>`


<div class="summary-product">


<img src="${item.image}">


<div>

<h4>${item.name}</h4>

<p>

${item.quantity} × ₹${item.price}

</p>


</div>


</div>


`).join("");





let subtotal =
cart.reduce(
(s,i)=>s+i.price*i.quantity,
0
);




setText(
"summarySubtotal",
"₹"+subtotal
);



setText(
"summaryDelivery",
subtotal>10000?
"Free":
"₹500"
);



setText(
"summaryTotal",
"₹"+(
subtotal+
(subtotal>10000?0:500)
)
);



}








// ================================
// Place Order
// ================================



// ================================
// Place Order Firebase
// ================================
function startRazorpay(){


let amountText =
document.getElementById(
"summaryTotal"
).innerHTML;


let amount =
Number(
amountText.replace("₹","")
);



var options = {


key:"rzp_test_T00JcMELpsTwxr",


amount:
amount * 100,


currency:"INR",


name:"Yadav Furniture",


description:"Furniture Order Payment",



handler: async function(response){

console.log(
"Payment Success",
response
);


let order={

id:
"ORD"+Date.now(),

items:cart,

date:
new Date()
.toLocaleDateString(),

status:
"Confirmed",

payment:
"Paid",

paymentId:
response.razorpay_payment_id,

total:
document
.getElementById("summaryTotal")
.innerHTML

};


console.log("ONLINE ORDER SAVE", order);
let docRef = await addDoc(

collection(db,"orders"),

order

);


console.log(
"FIREBASE SAVED ID = ",
docRef.id
);



cart=[];

saveCart();


alert(
"Payment Successful Order Confirmed 🔥"
);


window.location.href =
"index.html";


},

prefill:{

name:"Nikhil Yadav",

email:"test@gmail.com",

contact:"9876543210"

},


theme:{

color:"#243447"

}


};



var pay =
new Razorpay(options);



pay.open();



}

async function placeOrder(){



if(cart.length===0){


alert("Cart Empty");

return;


}




let order={


id:

"ORD"+Date.now(),


items:

cart,


date:

new Date()
.toLocaleDateString(),


status:

"Pending",


total:

document
.getElementById(
"summaryTotal"
)
.innerHTML,


customerId:

localStorage.getItem(
"currentUser"
)

|| "Guest",


userEmail:

localStorage.getItem(
"userEmail"
)

|| "Guest",


createdAt:

new Date()


};







try{



await addDoc(

collection(

db,

"orders"

),

order

);





cart=[];



saveCart();





let modal =

document.getElementById(

"orderSuccessModal"

);





if(modal){



document.getElementById(

"orderIdDisplay"

).innerHTML =

order.id;





document.getElementById(

"orderTotalDisplay"

).innerHTML =

order.total;






modal.classList.add(

"active"

);



}




alert(

"Order Saved To Firebase 🔥"

);



}




catch(error){



console.log(error);



alert(

"Order Firebase Error"

);



}




}








// ================================
// Helpers
// ================================


function setText(id,value){


let el =
document.getElementById(id);


if(el){

el.innerHTML=value;

}


}




function saveCart(){


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


}

window.changeQuantity = changeQuantity;

window.removeItem = removeItem;

window.clearCart = clearCart;