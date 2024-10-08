import userSchema from './models/user.model.js'
import productSchema from "./models/product.model.js"
import bcrypt from 'bcrypt'
import pkg from "jsonwebtoken";

const {sign}=pkg;

export async function getProducts(req,res) {
    try {
        console.log(req.user.userId);
        const _id = req.user.userId;
        const user = await userSchema.findOne({_id});
        console.log(user);
        if(!user) 
            return res.status(403).send({msg:"Unauthorized access"})
        const products=await productSchema.find();
        res.status(200).send({products,profile:user.profile,id:user._id})
        
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