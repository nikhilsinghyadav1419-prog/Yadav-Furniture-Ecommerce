// ================================
// Firebase Imports
// ================================

import { db }

from "./firebase.js";


import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// Cart Storage
// ================================

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];


let wishlist = JSON.parse(
    localStorage.getItem("wishlist")
) || [];
// ================================
// Products JavaScript File
// ================================



// Furniture Products Data

let products = [];


// ================================
// Merge Admin Products
// ================================


let adminAddedProducts =

JSON.parse(
localStorage.getItem("adminProducts")
)

|| [];



products = [

...products,

...adminAddedProducts

];


// Load Page

document.addEventListener(
"DOMContentLoaded",
()=>{


loadFirebaseProducts();


});

// ================================
// Load Products From Firebase
// ================================


async function loadFirebaseProducts(){


let snapshot =

await getDocs(

collection(db,"products")

);



products=[];




snapshot.forEach(doc=>{


products.push({

id:doc.id,

...doc.data()

});


});





loadFeaturedProducts();

loadAllProducts();

loadProductDetails();



}


// ================================
// Product Card Template
// ================================


function productCard(product){


return `


<div class="product-card">


<div class="product-image">

<img src="${product.image}">


<div class="product-actions">


<button onclick="addWishlist('${product.id}')">

<i class="fas fa-heart"></i>

</button>



<button onclick="window.location.href='product-details.html?id=${product.id}'">

<i class="fas fa-eye"></i>

</button>


</div>


</div>




<div class="product-info">


<h3>${product.name}</h3>



<div class="stars">

${generateStars(product.rating)}

</div>



<p>${product.description}</p>



<div class="product-price">

<span class="price">

₹${product.price}

</span>


<span class="old-price">

₹${product.oldPrice}

</span>


</div>



<button class="btn btn-primary"

onclick="addToCart('${product.id}')">


Add To Cart


</button>


</div>


</div>



`;

}




// ================================
// Stars
// ================================



function generateStars(rating){


let html="";


for(let i=1;i<=5;i++){


html +=

i<=rating

? `<i class="fas fa-star"></i>`

: `<i class="far fa-star"></i>`;


}



return html;


}





// ================================
// Featured Products
// ================================



function loadFeaturedProducts(){



let featuredBox =
document.getElementById(
"featuredProducts"
);



if(featuredBox){


let data =
products.filter(
p=>p.featured
);



featuredBox.innerHTML =

data.map(productCard)
.join("");



}





let arrival =
document.getElementById(
"newArrivals"
);



if(arrival){


arrival.innerHTML =

products
.slice(0,4)
.map(productCard)
.join("");

}



let best =
document.getElementById(
"bestSellers"
);


if(best){


best.innerHTML =

products
.slice(1,5)
.map(productCard)
.join("");


}




}






// ================================
// Products Listing Page
// ================================


function loadAllProducts(){



const grid =
document.getElementById(
"productsGrid"
);



if(!grid)
return;



let data=[...products];



// URL category

const params =
new URLSearchParams(
window.location.search
);


let cat =
params.get("category");



if(cat){


data=data.filter(
p=>p.category==cat
);


}



displayProducts(data);



initializeFilters();



}





function displayProducts(data){


const grid =
document.getElementById(
"productsGrid"
);



if(!grid)return;



grid.innerHTML =

data.map(productCard)
.join("");



let count =
document.getElementById(
"resultsCount"
);



if(count){


count.innerText =

`Showing ${data.length} products`;


}



}






// ================================
// Filters
// ================================


function initializeFilters(){



let sort =
document.getElementById(
"sortSelect"
);



if(sort){



sort.addEventListener(
"change",
()=>{


let data=[...products];


if(sort.value==="price-low"){


data.sort(
(a,b)=>a.price-b.price
);


}



if(sort.value==="price-high"){


data.sort(
(a,b)=>b.price-a.price
);


}




if(sort.value==="rating"){


data.sort(
(a,b)=>b.rating-a.rating
);


}



displayProducts(data);



});



}



}







// ================================
// Product Details Page
// ================================



function loadProductDetails(){


let box =
document.getElementById(
"productDetailsWrapper"
);



if(!box)
return;



let params =
new URLSearchParams(
window.location.search
);



let id =
params.get("id");



let product =
products.find(
p=>p.id==id
);



if(!product)
return;




box.innerHTML = `



<div class="product-gallery">


<img src="${product.image}" class="main-product-img">


</div>



<div class="product-detail-info">


<h1>${product.name}</h1>



<div class="stars">

${generateStars(product.rating)}

</div>



<h2>

₹${product.price}

</h2>



<p>

${product.description}

</p>



<p>

<b>Material:</b>

${product.material}

</p>



<p>

<b>Available Stock:</b>

${product.stock}

</p>



<button class="btn btn-primary"

onclick="addToCart('${product.id}')">


Add To Cart


</button>



<button class="btn btn-outline"
onclick="addWishlist('${product.id}')">


Add Wishlist


</button>




</div>



`;



// related products


let related =
document.getElementById(
"relatedProducts"
);



if(related){


related.innerHTML =

products

.filter(
p=>p.category==product.category &&
p.id!=product.id
)

.map(productCard)

.join("");



}




}







// ================================
// Add Cart
// ================================


function addToCart(id){
    console.log("Add cart clicked", id);



let item =
products.find(
p=>p.id==id
);



let exist =
cart.find(
p=>p.id==id
);



if(exist){


exist.quantity++;


}

else{


cart.push({

...item,

quantity:1


});


}



localStorage.setItem(

"cart",

JSON.stringify(cart)

);



updateCartCount();



alert(
"Product Added To Cart"
);



}

window.addToCart = addToCart;






// ================================
// Wishlist
// ================================


function addWishlist(id){



let item =
products.find(
p=>p.id==id
);



if(
!wishlist.find(p=>p.id==id)
){


wishlist.push(item);


}



localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);



updateWishlistCount();



alert(
"Added To Wishlist"
);



}

// ================================
// Update Cart Count
// ================================

// ================================
// Update Cart Count
// ================================

function updateCartCount(){


let count =
document.getElementById(
"cartCount"
);


if(count){


let total =

cart.reduce(

(sum,item)=>{

return sum + item.quantity;

},

0

);



count.innerHTML =

total;



}



}





// ================================
// Update Wishlist Count
// ================================

function updateWishlistCount(){



let count =

document.getElementById(

"wishlistCount"

);



if(count){



count.innerHTML =

wishlist.length;



}



}


// ================================
// Load Counts On Page Start
// ================================


updateCartCount();


updateWishlistCount();