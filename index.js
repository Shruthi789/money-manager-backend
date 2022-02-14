import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import cors from 'cors';
import { incomeRouter } from "./routes/income.js";
import { expenseRouter } from "./routes/expenditure.js";
import { usersRouter } from "./routes/users.js";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT;

async function createConnection(){
    const client=new MongoClient(process.env.Mongo_URL);
    await client.connect();
    console.log("MongoDB connected");
    return client;
}
const client= await createConnection();

app.get('/',(request,response)=>{
    response.send('Welcome to the Money Manager')
})
app.use('/users',usersRouter);
app.use('/income',incomeRouter);
app.use('/expenditure',expenseRouter);

app.listen(PORT,()=>{console.log("Server Connected")});

export {client};