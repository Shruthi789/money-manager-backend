import { ObjectId } from 'mongodb';
import {client} from '../index.js';

function getIncome(income){
    return client.db('MoneyMgrDB').collection('Income').find(income).toArray();
}
function getIncomeData(aggData){
    return client.db('MoneyMgrDB').collection('Income').aggregate(aggData).toArray();
}

function addIncome(income){
    return client.db('MoneyMgrDB').collection('Income').insertOne(income);
}

function getCategories() {
    return client.db('MoneyMgrDB').collection('Income').distinct('category');
}
function editIncome(id,incomeData){
    return client.db('MoneyMgrDB').collection('Income').updateOne({_id:ObjectId(id)},{$set:incomeData});
}
function deleteIncome(id){
    return client.db('MoneyMgrDB').collection('Income').deleteOne({_id:ObjectId(id)});
}
function getDivisions() {
    return client.db('MoneyMgrDB').collection('Income').distinct('division');
  }

export {getIncome,addIncome,getCategories,editIncome,getDivisions,getIncomeData,deleteIncome};