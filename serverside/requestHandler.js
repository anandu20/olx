import userSchema from './models/user.model.js'
import productSchema from "./models/product.model.js"
import wishlistSchema from './models/wishlist.model.js'
import bookSchema from './models/book.model.js'
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt'
import pkg from "jsonwebtoken";

const {sign}=pkg;
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "32e3fc4c91dfe7",
      pass: "bba41aa17f1f97",
    },
  });

export async function getProducts(req,res) {
    try {
        console.log(req.user.userId);
        const _id = req.user.userId;
        const user = await userSchema.findOne({_id});
        console.log(user);
        if(!user) 
            return res.status(403).send({msg:"Unauthorized access"})
        const products=await productSchema.find({sellerId:{$ne:_id}});
        const wlist=await wishlistSchema.find({buyerId:_id});
        res.status(200).send({products,profile:user.profile,id:user._id,wlist})
        
    } catch (error) {
        res.status(404).send({msg:error})
    }
}
export async function getSProduct(req,res) {
    try {
        const {id}=req.params
        const data=await productSchema.find({sellerId:id});
        console.log(data);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function addProducts(req,res){
    try{  
        const{pname,price,category,description,place,sellerId,address,pincode,phone,images}=req.body;
        console.log(pname);
            productSchema.create({pname,price,category,description,place,sellerId,address,pincode,phone,images})
            .then(()=>{
                console.log("success");
                return res.status(201).send({msg:"success"})
            })
            .catch((error)=>{
                console.log("failed");
                return res.status(404).send({msg:"fail"})

            })
    }catch(error){
        res.status(404).send(error);
    
        
    }
}

export async function getUser(req,res) {
    try {
        const {id}=req.params;
        const data=await userSchema.findOne({_id:id});
        console.log("HAI");
        
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function editUser(req,res) {
    try {
        const {_id}=req.params;
    const {...user}=req.body;
    const data=await userSchema.updateOne({_id},{$set:{...user}});
    res.status(201).send(data);
    } catch (error) {
        res.status(404).send(error)
    }
    
}



export async function signUp(req,res) {
    try{
        const {email,username,password,cpassword,place,profile,address,phone,pincode} = req.body;
        console.log(email,username,password,cpassword,place,profile,address,phone,pincode);
        if(!(email&& username&& password&& cpassword && place && profile && address && phone && pincode))
            return res.status(404).send({msg:"fields are empty"})
        if(password !== cpassword)
            return res.status(404).send({msg:"password not matching"})
        bcrypt
        .hash(password,10)
        .then((hashedPassword)=>{
            console.log(hashedPassword);
            userSchema
            .create({email,username,password:hashedPassword,place,profile,address,phone,pincode})
            .then(()=>{
                console.log("success");
                return res.status(201).send({msg:"successs"})
            })
            .catch((error)=>{
                console.log("faliure");
                return res.status(404).send({msg:"not registered"})

            })
        })
    }
     catch(error){
        return res.status(404).send({msg:error})

    }
    
}

export async function signIn(req,res) {
    console.log(req.body);
    const{email,password}=req.body;
    if(!(email&& password))
        return res.status(404).send({msg:"fields are empty"});
    const user=await userSchema.findOne({email});
    console.log(user);
    if(user===null){
        return res.status(404).send({msg:"Invalid username"});
    }
    const success=await bcrypt.compare(password,user.password);
    console.log(success);
    if(success!==true)
        return res.status(404).send({msg:"email or password is invalid"});

    const token = await sign({userId:user._id},process.env.JWT_KEY,{expiresIn:"24h"});
    console.log(token);
    return res.status(200).send({msg:"successfully logged in",token})
    
    
    
}


export async function getProduct(req,res) {
    try {
        const {_id}=req.params;
        const data=await productSchema.findOne({_id});
        console.log("HAI");
        
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error)
    }
}

export async function editProduct(req,res){
    try {
        const {_id}=req.params
        const {...products}=req.body;
        const data=await productSchema.updateOne({_id},{$set:{...products}});
        res.status(201).send(data)

        
    } catch (error) {
        res.status(404).send(error)

        
    }

}

export async function addWish(req,res) {
    try {
        const {...wishlist} = req.body;
        wishlistSchema
            .create({...wishlist})
            .then(()=>{
                console.log("success");
                return res.status(201).send({msg:"successs"})
            })
            .catch((error)=>{
                console.log("faliure");
                return res.status(404).send({msg:"list not added"})
            })
    } catch (error) {
        res.status(404).send(error);
    }
}
export async function deleteWish(req,res) {
    try {
        const {_id}=req.params;
        console.log(_id);
        const data=await wishlistSchema.deleteOne({"products._id":_id});
        res.status(201).send(data);
    } catch (error) {
        res.status(404).send(error)
    }   
}

export async function forgetPassword(req,res) {
    const {email}=req.body;
    const user=await userSchema.findOne({email});
    if(!user)
        return res.status(403).send({msg:"User not exist"})
    const otp=Math.floor(Math.random()*1000000);
    const update=await userSchema.updateOne({email},{$set:{otp:otp}})
    console.log(update);
    
     // send mail with defined transport object
    // const info = await transporter.sendMail({
    //     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "OTP", // Subject line
    //     text: "your otp", // plain text body
    //     html: `<h1>${otp}</h1>`, // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    console.log(otp);
    return res.status(201).send({email});
}
export async function otpCheck(req,res) {
    const {email,otp}=req.body;
    const check=await userSchema.findOne({$and:[{email:email},{otp:otp}]})
    if(!check)
        return res.status(403).send({msg:"Otp does not match"})
    return res.status(200).send({msg:"OTP matched successfully"})
}
export async function resetPassword(req,res) {
    const {email,password}=req.body;
    const update=await userSchema.updateOne({email},{$set:{otp:""}})
    bcrypt.hash(password,10).then((hashedPassword)=>{
        console.log(hashedPassword);
        userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
            console.log("hai");
            return res.status(200).send({msg:"success"});
        }).catch((error)=>{
            return res.status(404).send({msg:"Not registered"})
        })
    }).catch((error)=>{
        return res.status(404).send({msg:error}); 
    })
}

export async function setBook(req,res) {
    try {
        if (req.user!==null) {
            const _id = req.user.userId;
            const {product,date} = req.body;
            console.log(product);
            const buyer=await userSchema.findOne({_id},{username:1,place:1,phone:1}); // we needed only these details so we add 1 to this
            bookSchema.create({sellerId:product.sellerId,buyerId:_id,date,buyer,product})
            .then(()=>{
                return res.status(201).send({msg:"Booking Successfull"});
            })
            .catch((error)=>{
                return res.status(404).send({msg:"product not added"});
            })
        }else{
            return res.status(403).send({products,msg:"Something went wrong"});
        }   
    } catch (error) {
        res.status(404).send({msg:"error"});
    }
}

    

export async function getBook(req,res) {
    try {
        const {sellerId}=req.params;
        console.log(sellerId);
        const data = await bookSchema.find({sellerId});
        res.status(200).send(data)    
    } catch (error) {
        res.status(404).send(error)

        
    }
    
}