import { ObjectId } from 'mongodb';
import {client} from '../index.js';

function getExpense(expense){
    return client.db('MoneyMgrDB').collection('Expense').find(expense).toArray();
}
function getExpenses(aggData){
    return client.db('MoneyMgrDB').collection('Expense').aggregate(aggData).toArray();
}

function addExpense(Expense){
    return client.db('MoneyMgrDB').collection('Expense').insertOne(Expense);
}

function getCategories() {
    return client.db('MoneyMgrDB').collection('Expense').distinct('category');
}
function editExpense(id,ExpenseData){
    return client.db('MoneyMgrDB').collection('Expense').updateOne({_id:ObjectId(id)},{$set:ExpenseData});
}
function getDivisions() {
    return client.db('MoneyMgrDB').collection('Expense').distinct('division');
  }

export {getExpense,addExpense,getCategories,editExpense,getDivisions,getExpenses};