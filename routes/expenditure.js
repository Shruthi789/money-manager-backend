import express from "express";
import {getExpense,addExpense,getCategories,editExpense,getDivisions,getExpenses} from '../actions/expenditureActions.js';
import jwt from 'jsonwebtoken';
import {expenseAuth} from '../middlleware/auth.js';

const router=express.Router();

router.route('/')
               .post(async(request,response)=>{
                  console.log(request.body);
                  const expenseData=request.body;
                  const result=await addExpense(expenseData);
                  const token=jwt.sign({id:result.insertedId},process.env.SECRET_KEY_TWO,{ expiresIn: '12h' });
                  response.send({result,token});
               });

router.route('/:id')
              .put(expenseAuth,async(request,response)=>{
                  const {id}=request.params;
                  const expenseData=request.body;
                  const result=await editExpense(id,expenseData);
                  response.send(result);
              });

router.route('/category')
              .get(async (request,response)=>{
                const result=await getCategories();
                response.send(result);
                });
router.route('/division')
                .get(async (request,response)=>{
                  const result=await getDivisions();
                  response.send(result);
                  });
router.route('/:option')
              .get(async(request,response)=>{
                  const {option}=request.params;
                  let filterData=request.query;
                      if(startDate || endDate){
                         let {category,division}=filterData;
                         filterData={category,division,dateandtime:{$gte:startDate,$lt:endDate}}
                      }
                      let aggregateData=[];
                      switch(option){
                       case 'Monthly': aggregateData=[{$match:filterData }, {$group:{ _id: { $month: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       case 'Yearly': aggregateData=[{$match:filterData }, {$group:{ _id: { $year: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       case 'Weekly': aggregateData=[{ $match:filterData}, {$group:{ _id: { $week: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       default: aggregateData=[];
                      }
                  const result=await getExpenses(aggregateData);
                  response.send(result);
                  });

export const expenseRouter=router;