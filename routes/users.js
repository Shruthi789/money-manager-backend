import express from "express";
import jwt from "jsonwebtoken";
import {genPassword,addUser,passwordStrength,getUser,comparePassword} from '../actions/userActions.js';
const router=express.Router();

router.route('/signup')
    .post(async (request,response)=>{
  const {username,password}=request.body;
  const user=await getUser(username);
  const passStr=passwordStrength(password);
  if(user){
    response.status(400).send('Duplicate Value!! Please enter a unique value');
  }
  else if(passStr==='Password weak!!'){
    response.send(passStr);
  }
  else{
  const hashedPassword=await genPassword(password);
  const result=await addUser({username,password:hashedPassword});
  response.send(`${passStr} ${JSON.stringify(result)}`);
  }
  });

  router.route('/signin')
        .post(async (request,response)=>{
    const {username,password}=request.body;
    const user=await getUser(username);
    if(!user){
      response.status(401).send('Invalid credentials');
      return;
    }
    const passValid=await comparePassword(password,user.password);
    if(!passValid){
      response.status(401).send('Invalid credentials');
      return;
    }
      const token=jwt.sign({id:user._id},process.env.SECRET_KEY_ADMIN);
      response.send({message:"Sign in successful",token});
    });

 export const usersRouter=router;