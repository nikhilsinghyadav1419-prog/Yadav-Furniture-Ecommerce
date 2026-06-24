// ================================
// Firebase Imports
// ================================


import { db } 
from "./firebase.js";
let allOrders = [];


import {

collection,
getDocs,
doc,
updateDoc

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


const ADMIN_EMAIL =
"anushkashrivastav0912@gmail.com";

// ================================
// Admin Security Check
// ================================

onAuthStateChanged(
auth,
(user)=>{


if(!user){

alert(
"Please login first"
);

window.location.href =
"login.html";

return;

}



if(user.email !== ADMIN_EMAIL){

alert(
"You are not admin ❌"
);

window.location.href =
"index.html";

return;

}



console.log(
"Admin Verified 🔥"
);


initializeAdminOrders();


}

);

// ================================
// Admin JavaScript File
// ================================



document.addEventListener(
"DOMContentLoaded",
function(){


onAuthStateChanged(
auth,
(user)=>{


if(!user){

alert("Please login first");

window.location.href =
"login.html";

return;

}



if(user.email !== ADMIN_EMAIL){

alert("You are not admin ❌");

window.location.href =
"index.html";

return;

}



console.log(
"Admin Verified 🔥"
);



initializeDashboard();

initializeAdminProducts();

initializeAdminOrders();



}

);


});




// ================================
// Admin Products Storage
// ================================


// ================================
// Admin Products Storage
// ================================


let adminProducts = [];







// ================================
// Dashboard
// ================================


function initializeDashboard(){



let totalProducts =
document.getElementById(
"totalProducts"
);



if(!totalProducts)
return;





let orders =
JSON.parse(
localStorage.getItem("orders")
)
||[];





let users =
JSON.parse(
localStorage.getItem("users")
)
||[];





setText(
"totalProducts",
adminProducts.length
);



setText(
"totalOrders",
orders.length
);



setText(
"totalCustomers",
users.length
);



let revenue =
orders.reduce(
(sum,o)=>{

let amount =
parseInt(
String(o.total)
.replace("₹","")
);

return sum+amount;


},0);



setText(
"totalRevenue",
"₹"+revenue
);





loadRecentOrders(
orders
);



loadTopProducts();



}








// ================================
// Recent Orders
// ================================



function loadRecentOrders(orders){



let table =
document.getElementById(
"recentOrdersTable"
);



if(!table)
return;





table.innerHTML =
orders.slice(0,5)
.map(order=>`


<tr>


<td>${order.id}</td>

<td>Customer</td>

<td>${order.total}</td>

<td>

<span class="status">

${order.status}

</span>

</td>

<td>${order.date}</td>



</tr>



`)
.join("");



}









// ================================
// Top Products
// ================================


function loadTopProducts(){



let box =
document.getElementById(
"topProductsList"
);



if(!box)
return;





box.innerHTML =

adminProducts
.slice(0,5)
.map(p=>`


<div class="top-product">


<img src="${p.image}">


<div>

<h4>${p.name}</h4>

<p>₹${p.price}</p>


</div>


</div>



`)
.join("");




}









// ================================
// Products Management
// ================================



function initializeAdminProducts(){



let table =
document.getElementById(
"productsTable"
);



if(!table)
return;





loadAdminProducts();




let form =
document.getElementById(
"productForm"
);



if(form){



form.addEventListener(
"submit",
saveProduct
);



}




}








function renderProducts(){



let table =
document.getElementById(
"productsTable"
);



if(!table)
return;





table.innerHTML =

adminProducts.map(
(product,index)=>`




<tr>


<td>

<img width="60"
src="${product.image}">

</td>


<td>${product.name}</td>


<td>${product.category}</td>


<td>₹${product.price}</td>


<td>${product.stock}</td>



<td>



<button

onclick="deleteProduct(${index})"

class="btn btn-danger">


Delete


</button>



</td>



</tr>



`
)

.join("");




}










// ================================
// Add Product
// ================================




// ================================
// Add Product
// ================================


// ================================
// Add Product Firebase
// ================================


// ================================
// Add Product Firebase With Image
// ================================


async function saveProduct(e){


e.preventDefault();



// Get selected image

let imageFile =
document.getElementById(
"productImage1"
).files[0];



if(!imageFile){

alert(
"Please Select Product Image"
);

return;

}




let reader =
new FileReader();




reader.onload = async function(){



let imageBase64 =
reader.result;





let product = {


name:
document.getElementById(
"productName"
).value,



category:
document.getElementById(
"productCategory"
).value,



price:
Number(

document.getElementById(
"productPrice"
).value

),




discount:
Number(

document.getElementById(
"productDiscount"
).value

) || 0,




stock:
Number(

document.getElementById(
"productStock"
).value

),




description:

document.getElementById(
"productDescription"
).value,




material:

document.getElementById(
"productMaterial"
).value,




dimensions:

document.getElementById(
"productDimensions"
).value,




color:

document.getElementById(
"productColor"
).value,




weight:

document.getElementById(
"productWeight"
).value,




sku:

document.getElementById(
"productSKU"
).value,





// image saved here

image:

imageBase64,





rating:

5,




featured:

document.getElementById(
"productFeatured"
).checked,




createdAt:

new Date()



};







try{


await addDoc(

collection(

db,

"products"

),

product

);





alert(

"Product Added With Image Successfully 🔥"

);




e.target.reset();




loadAdminProducts();




}



catch(error){



console.log(error);



alert(

"Firebase Error"

);



}




};






reader.readAsDataURL(

imageFile

);



}








// ================================
// Delete Product
// ================================



function deleteProduct(index){





if(

confirm(
"Delete this product?"
)

){



adminProducts.splice(
index,
1
);




localStorage.setItem(

"adminProducts",

JSON.stringify(adminProducts)

);





renderProducts();




}




}










// ================================
// Orders Management
// ================================



// ================================
// Firebase Orders Management
// ================================


async function initializeAdminOrders(){


console.log("Admin Orders Started 🔥");


let table =
document.getElementById(
"ordersTable"
);


if(!table)
return;



let snapshot =
await getDocs(

collection(db,"orders")

);


console.log(
"Orders Found = ",
snapshot.size
);



let orders=[];



snapshot.forEach(doc=>{


orders.push({

firebaseId:doc.id,

...doc.data()

});


});
allOrders = orders;



console.log(
"Orders Data",
orders
);





table.innerHTML =

orders.map((order,index)=>`



<tr>


<td>

${order.id || order.firebaseId}

</td>



<td>

Customer

</td>



<td>

${order.items ? order.items.length : 0}
 Products

</td>



<td>

${order.total || "₹0"}

</td>



<td>

COD

</td>



<td>


<span class="status">

${order.status || "Pending"}

</span>


</td>




<td>

${order.date || ""}

</td>




<td>


<button onclick="viewOrder(${index})">

View

</button>

</td>



</tr>



`

)

.join("");



}









// ================================
// Update Order Status
// ================================





















// ================================
// Helpers
// ================================



function getValue(id){



let element =
document.getElementById(id);



return element
?
element.value
:
"";



}




function setText(id,value){



let element =
document.getElementById(id);



if(element){


element.innerHTML=value;


}



}

// ================================
// Load Firebase Products
// ================================


async function loadAdminProducts(){



let snapshot =

await getDocs(

collection(db,"products")

);



adminProducts=[];




snapshot.forEach(

(doc)=>{


adminProducts.push({

id:doc.id,

...doc.data()

});


}

);



renderProducts();



}

// ================================
// View Order Details
// ================================

window.viewOrder = function(index){

let order = allOrders[index];

console.log("VIEW ORDER =", order);


alert(`
🔥 ORDER DETAILS 🔥

Order ID:
${order.id}

Customer:
${order.customerName || "No Name"}

Phone:
${order.phone || "No Phone"}

Address:
${order.address || "No Address"}

Products:

${order.items.map(item=>`

Name: ${item.name}
Quantity: ${item.quantity}
Price: ₹${item.price}

`).join("")}

Total:
${order.total}

Payment:
${order.payment}

Payment ID:
${order.paymentId || "COD"}

Status:
${order.status}


`);


let newStatus =
prompt(
"Update Status:\nConfirmed\nPacked\nShipped\nDelivered",
order.status
);


if(newStatus){

changeStatus(
order.firebaseId,
newStatus
);

}


}


window.changeStatus = async function(id,status){

console.log("Updating ID =",id);
console.log("New Status =",status);

await updateDoc(
doc(db,"orders",id),
{
status: status
}
);

alert("Order Status Updated 🔥");

location.reload();

}