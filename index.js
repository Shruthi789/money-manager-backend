import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import cors from 'cors';
import { incomeRouter } from "./routes/income.js";
import { expenseRouter } from "./routes/expenditure.js";

dotenv.config();
const app=express();
const PORT=process.env.PORT;

app.use(express.json());
app.use(cors());
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
app.use('/income',incomeRouter);
app.use('/expenditure',expenseRouter);

app.listen(PORT,()=>{console.log("Server Connected")});

export {client};