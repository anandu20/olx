let buyerId;
const value = localStorage.getItem("Auth");
async function getProducts() {

      const res=await fetch("http://localhost:3000/api/getproducts",{headers:{
        "Authorization" : `Bearer ${value}`}})
        const result = await res.json();
        console.log(result);
        
        str=``;
    if(res.status==200){
        buyerId=result.id;

            document.getElementById("profileImage").src=`${result.profile}`
            document.getElementById("img2").src=`${result.profile}`
            document.getElementById("link").innerHTML=`<a href="./pages/profile.html?id=${result.id}"><button>View or Edit Profile</button></a>`
            document.getElementById("log").innerHTML="<button onclick='logout()'>Logout</button>";
            document.getElementById("but").innerHTML=`<a href="./pages/addprod.html?id=${result.id}">+ SELL</a>`
            console.log(result);
            result.products.map((product)=>{
                str+=`
                <div class="prods">
                <a href="./pages/prod.html?id=${product._id}">  
                <img src="${product.images[0]}" alt=""> 
               
                 <div class="content">
                     <h3>${product.pname}</h3>
                     <h2>₹ ${product.price}</h2>
                     <h4>${product.category}</h4>
                 </div>
                 </a>
                    <div class="hearts">
                        <img src="./images/normal.png" alt="" class="heart" onclick="toggleHeart(this,'${product._id}')" id=${product._id}>
                    </div>
            </div>`
            });
            document.getElementById("products").innerHTML=str;
            console.log(result.wlist);
            result.wlist.map((l)=>{
                document.getElementById(`${l.products._id}`).src='./images/red.png';
            })
    }
    else{
        document.getElementById("log").innerHTML="<button ><a href='./pages/signin.html'>LOGIN</a></button>";
        document.getElementById("but").innerHTML="<a href='./pages/signin.html'>LOGIN</a>";
        console.log(document.getElementById("but"));
        result.products1.map((product)=>{
            str+=`
            <div class="prods">
            <a href="./pages/prod.html?id=${product._id}">  
            <img src="${product.images[0]}" alt=""> 
           
             <div class="content">
                 <h3>${product.pname}</h3>
                 <h2>₹ ${product.price}</h2>
                 <h4>${product.category}</h4>
             </div>
             </a>
                <div class="hearts">
                    <img src="./images/normal.png" alt="" class="heart" onclick="toggleHeart(this,'${product._id}')" id=${product._id}>
                </div>
        </div>`
        });
        document.getElementById("products").innerHTML=str;
    }
}
getProducts();
const profileImage = document.getElementById('profileImage');
const dropdownMenu = document.getElementById('dropdownMenu');

function dropdown(){
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown if clicked outside
window.addEventListener('click', (event) => {
    if (!profileImage.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

function logout(){
    localStorage.removeItem("Auth");
    window.location.href="../pages/signin.html"
}

document.getElementById("filter").addEventListener('keyup',async(e)=>{   
    //by using filter first fetch the data and using title we can filter 
        try {
            const res=await fetch("http://localhost:3000/api/getproducts",{headers:{
                "Authorization" : `Bearer ${value}`}})  // to get the global product details
            const products=await res.json();
                        console.log(products);
            str=``;
            products.products.filter((i)=>i.pname.toLowerCase().includes(e.target.value.toLowerCase())).map((product)=>{
    
                str+=`
                <div class="prods">
                <a href="./pages/prod.html?id=${product._id}">  
                <img src="${product.images[0]}" alt="" > 
               
                 <div class="content">
                     <h3>${product.pname}</h3>
                     <h2> ${product.price}</h2>
                      <h4>${product.category}</h4>
                 </div>
                 </a>

            </div>`
            })
    
            document.getElementById("products").innerHTML=str;
            result.wlist.map((l)=>{
                document.getElementById(`${l.products._id}`).src='./images/red.png';
            })
    
        } catch (error) {
            console.log(error);
            
            
        }
    });

    async function toggleHeart(heartElement,id) {
        const normalHeart = './images/normal.png';
        const redHeart = './images/red.png';
        if (heartElement.currentSrc.includes('normal.png')) {
            heartElement.src = redHeart;
            const res=await fetch(`http://localhost:3000/api/getproduct/${id}`);
        const products=await res.json();  
        console.log(products);
        fetch("http://localhost:3000/api/wishlist",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({buyerId,products})
        }).then((res)=>{
            console.log(res);
            if(res.status==201){
                console.log(buyerId,products);
                alert("success")
                console.log(res);  
            }
            else if (res.status==404){
                alert("error")
            }
            else{
                alert("error")
            }
            
        }).catch((error)=>{
            console.log(error);
            
        });
        }
         else {
            heartElement.src = normalHeart;
                fetch(`http://localhost:3000/api/deletewish/${id}`,{
                  method:"DELETE",
                      headers:{"Content-Type":"application/json"}
                }).then((res)=>{
                    console.log(id);
                      console.log(res);
                      if(res.status==201){
                          alert("Deleted")
                      }else{
                          alert("error");
                      }
                  }). catch ((error)=>{
                      console.log(error);
                      
                  })
        }
        
    }
      