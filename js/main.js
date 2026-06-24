// ================================
// Main JavaScript File
// ================================

// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {


initializeHeader();


updateCartCount();


updateWishlistCount();


}
// ================================
// Header & Navigation
// ================================

function initializeHeader() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.getElementById('closeSearch');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Mobile Menu Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Search Modal
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            searchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

function performSearch(){


const searchTerm =
document.getElementById("searchInput")
.value
.toLowerCase();


const searchResults =
document.getElementById("searchResults");



if(searchTerm.length < 2){


searchResults.innerHTML="";


return;


}



const products =
getAllProducts();



const filteredProducts =
products.filter(product =>


product.name.toLowerCase()
.includes(searchTerm)

||

product.category.toLowerCase()
.includes(searchTerm)


);




if(filteredProducts.length > 0){



searchResults.innerHTML = `


<div class="search-results-list">


${

filteredProducts
.slice(0,5)
.map(product=>`


<a href="product-details.html?id=${product.id}"
class="search-result-item">


<img src="${product.image}">


<div>


<h4>${product.name}</h4>


<p>₹${product.price}</p>


</div>


</a>


`).join("")


}


</div>


`;



}

else{


searchResults.innerHTML =

"<p>No products found</p>";


}



}

function updateCartCount(){


let cart = JSON.parse(
localStorage.getItem("cart")
)
|| [];


let count =
document.querySelector(".cart-count");


if(count){

count.innerHTML =
cart.length;

}


}



function updateWishlistCount(){


let wishlist = JSON.parse(
localStorage.getItem("wishlist")
)
|| [];


let count =
document.querySelector(".wishlist-count");


if(count){

count.innerHTML =
wishlist.length;

}


}




// MOBILE HAMBURGER MENU

const mobileToggle =
document.getElementById("mobileToggle");

const navMenu =
document.getElementById("navMenu");


if(mobileToggle && navMenu){

mobileToggle.addEventListener(
"click",
function(){

navMenu.classList.toggle("active");

}

);

}