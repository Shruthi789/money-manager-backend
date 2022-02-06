import express from "express";
import {getIncome,addIncome,getCategories,editIncome,getDivisions,getIncomeData} from '../actions/incomeActions.js';
import jwt from 'jsonwebtoken';
import {incomeAuth} from '../middlleware/auth.js';

const router=express.Router();

router.route('/')
               .post(async(request,response)=>{
                  console.log(request.body);
                  const incomeData=request.body;
                  const result=await addIncome(incomeData);
                  const token=jwt.sign({id:result.insertedId},process.env.SECRET_KEY_ONE,{ expiresIn: '12h' });
                  response.send({result,token});
               });

router.route('/:id')
              .put(incomeAuth,async(request,response)=>{
                  const {id}=request.params;
                  const incomeData=request.body;
                  const result=await editIncome(id,incomeData);
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
                     //  let filterData=request.query;
                     //  if(startDate){
                     //     let {category,division}=filterData;
                     //     filterData={category,division,dateandtime:{$gte:startDate,$lt:endDate}}
                     //  }
                      let aggregateData=[];
                      switch(option){
                       case 'Monthly': aggregateData=[ {$group:{ _id: { $month: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       case 'Yearly': aggregateData=[ {$group:{ _id: { $year: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       case 'Weekly': aggregateData=[{$group:{ _id: { $week: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       default: aggregateData=[];
                      }
                      const result=await getIncomeData(aggregateData);
                      response.send(result);
                      });

export const incomeRouter=router;