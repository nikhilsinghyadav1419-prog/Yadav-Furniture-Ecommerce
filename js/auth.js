// ================================
// Firebase Auth
// ================================


import { auth, db } from "./firebase.js";


import {

createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



import {

doc,
setDoc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// ================================
// Initialize
// ================================


document.addEventListener(

"DOMContentLoaded",

function(){


initializeSignup();

initializeLogin();

initializeProfile();

initializePasswordToggle();


}

);










// ================================
// Firebase Signup
// ================================


function initializeSignup(){


const signupForm =
document.getElementById(
"signupForm"
);



if(!signupForm)
return;





signupForm.addEventListener(

"submit",

async function(e){



e.preventDefault();



console.log(
"Signup Started 🔥"
);





let name =
document.getElementById(
"signupName"
).value;



let email =
document.getElementById(
"signupEmail"
).value;



let phone =
document.getElementById(
"signupPhone"
).value;




let password =
document.getElementById(
"signupPassword"
).value;




let confirmPassword =
document.getElementById(
"confirmPassword"
).value;






if(
password !== confirmPassword
){


alert(
"Passwords do not match"
);


return;


}







try{



let result =
await createUserWithEmailAndPassword(

auth,

email,

password

);







await setDoc(

doc(

db,

"users",

result.user.uid

),


{


uid:
result.user.uid,


name:
name,


email:
email,


phone:
phone,


address:
"",


createdAt:
new Date()


}



);






alert(

"Account Created Successfully 🔥"

);





window.location.href =
"login.html";




}



catch(error){



console.log(error);



alert(

error.message

);



}




}

);



}











// ================================
// Firebase Login
// ================================


function initializeLogin(){



const loginForm =
document.getElementById(

"loginForm"

);



if(!loginForm)

return;







loginForm.addEventListener(

"submit",

async function(e){



e.preventDefault();





let email =
document.getElementById(
"loginEmail"
).value;




let password =
document.getElementById(
"loginPassword"
).value;







try{



let result =
await signInWithEmailAndPassword(

auth,

email,

password

);





localStorage.setItem(

"currentUser",

result.user.uid

);

localStorage.setItem(

"userEmail",

result.user.email

);





alert(

"Login Successful 🔥"

);




window.location.href =
"index.html";



}




catch(error){



console.log(error);



alert(

"Invalid Email or Password"

);



}




}

);



}











// ================================
// Profile
// ================================


async function initializeProfile(){



let profile =
document.getElementById(

"profileContent"

);



if(!profile)

return;





let uid =
localStorage.getItem(

"currentUser"

);





if(!uid){



window.location.href =
"login.html";

return;


}







let userData =
await getDoc(

doc(

db,

"users",

uid

)

);






let user =
userData.data();






profile.innerHTML = `


<div class="profile-card">


<h2>

${user.name}

</h2>


<p>

${user.email}

</p>


<p>

${user.phone}

</p>


</div>


`;



}











// ================================
// Password Toggle
// ================================


function initializePasswordToggle(){



let buttons =
document.querySelectorAll(

".toggle-password"

);





buttons.forEach(

btn=>{



btn.addEventListener(

"click",

()=>{



let input =
btn.parentElement.querySelector(

"input"

);




if(
input.type==="password"
){


input.type="text";


}

else{


input.type="password";


}




}

);



}

);



}










// ================================
// Logout
// ================================


window.logoutUser = async function(){



await signOut(auth);




localStorage.removeItem(

"currentUser"

);




window.location.href =
"login.html";



};