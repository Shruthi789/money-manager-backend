import bcrypt from 'bcrypt';
import { client } from '../index.js';

async function genPassword(password)
{
  const salt=await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword=await bcrypt.hash(password,salt);
  console.log(hashedPassword);
  return hashedPassword;
}

async function comparePassword(password,storedPassword)
{
  const result=await bcrypt.compare(password,storedPassword);
  console.log(result);
  return result;
}

function addUser(user){
    return client.db('MoneyMgrDB').collection('users').insertOne(user);
}

function getUsers(){
    return client.db('MoneyMgrDB').collection('users').find().toArray();
}

function getUser(username){
    return client.db('MoneyMgrDB').collection('users').findOne({username});
}

function passwordStrength(password){
    const regexp=new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})','g');
    const condition=regexp.test(password);
    if(condition)
    {
        return 'Password Strong!!'
    }
    return 'Password weak!!'
}
export {genPassword,addUser,getUsers,passwordStrength,getUser,comparePassword}
