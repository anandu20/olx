const url=window.location.href;
const urlParams=new URLSearchParams(url.split("?")[1]);
const id=urlParams.get("id");
console.log(id);
async function getProduct(){
    const res=await fetch(`http://localhost:3000/api/getproduct/${id}`); // if two api used then we need to give differ name for const
    const product=await res.json();
    const res2=await fetch(`http://localhost:3000/api/getuser/${product.sellerId}`);
    const user=await res2.json();
    console.log(product);

    document.getElementById("category").innerText=`Category:${product.category}`;
    document.getElementById("pname").innerText=product.pname;
    document.getElementById("img").src=product.images[0];
    document.getElementById("description").innerText=product.description;
    document.getElementById("price").innerText= `₹${product.price}`;
    document.getElementById("username").innerText=user.username;
    document.getElementById("phone").innerText=user.phone;
    document.getElementById("email").innerText=user.email;
    document.getElementById("address").innerText=user.address;
    document.getElementById("place").innerText=user.place;
    document.getElementById("pincode").innerText=user.pincode;
    document.getElementById("edit").innerHTML= `<a href="../pages/proedit.html?id=${product._id}">Edit</a>`
    document.getElementById("delete").innerHTML=`<button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>`

    product.images.map((img)=>{
        const data=document.createElement("img");
        data.src=img;
        data.setAttribute("onmouseover",`change("${img}")`);
        document.getElementById("smallimg").appendChild(data);
    })

}
getProduct();


function change(e){
    document.getElementById("img").src=e;
}

async function deleteProduct(id) {
    console.log(id);
    
    fetch(`http://localhost:3000/api/deleteproduct/${id}`,{
      method:"DELETE",
          headers:{"Content-Type":"application/json"}
    }).then(async(res)=>{
        const result= await res.json
        console.log(result);
        
          if(res.status==201){
              alert("Deleted")
              window.location.href="../index.html";

          }else{
              alert("error");
          }
      }). catch ((error)=>{
          console.log(error);
          
      })
}
    
