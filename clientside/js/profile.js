const url=window.location.href;
const urlParams=new URLSearchParams(url.split("?")[1]);
const id=urlParams.get("id");
console.log(id);
async function getUser() {
    const res=await fetch(`http://localhost:3000/api/getuser/${id}`);
    const user=await res.json();
    if(user.profile)
;
    document.getElementById("profile").src=user.profile;
    document.getElementById("username").textContent=user.username;
    document.getElementById("email").textContent=user.email;
    document.getElementById("place").textContent=user.place;
    document.getElementById("address").textContent=user.address;
    document.getElementById("pincode").textContent=user.pincode;
    document.getElementById("phone").textContent=user.phone;
    document.getElementById("edit").innerHTML=`<button ><a href="../pages/edit.html?id=${user._id}">Edit Profile</a></button>`
    document.getElementById("signout").innerHTML=`<button onclick="logout()">Sign Out</button>`
}
getUser();

async function  getSProduct() {
    
    const res=await fetch(`http://localhost:3000/api/getSProduct/${id}`)
    const products= await res.json();
    console.log(products);
    
    str=``;
    products.map((product)=>{
        str+=`
        <div class="prods">
        <a href="./pages/product.html?id={product._id}">
        <img src="${product.images[0]}" alt="">
       
         <div class="content">
              <h3>${product.pname}</h3>
              <h2>Rs ${product.price}</h2>
               <h4>${product.description}</h4>
         </div>
         </a>
     </div>`

    })
    document.getElementById("products").innerHTML=str;
}
getSProduct();

function logout(){
    localStorage.removeItem("Auth");
    window.location.href="../pages/signin.html"
}