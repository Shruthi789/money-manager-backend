import express from "express";
import {deleteExpense,addExpense,getCategories,editExpense,getDivisions,getExpenses} from '../actions/expenditureActions.js';
import jwt from 'jsonwebtoken';
import {adminAuth,editAuth} from '../middlleware/auth.js';
import { StartandEndDateFilter,StartDateFilter,EndDateFilter, getMonthName } from "../actions/dateFilterActions.js";

const router=express.Router();

router.route('/')
               .post(adminAuth,async(request,response)=>{
                  const expenseData=request.body;
                  expenseData.dateandtime=new Date(expenseData.dateandtime);
                  const result=await addExpense(expenseData);
                  const token=jwt.sign({id:result.insertedId},process.env.SECRET_KEY_EDIT,{ expiresIn: '12h' });
                  response.send({result,token});
               });

router.route('/:id')
              .put(editAuth,async(request,response)=>{
                  const {id}=request.params;
                  const expenseData=request.body;
                  expenseData.dateandtime=new Date(expenseData.dateandtime);
                  const result=await editExpense(id,expenseData);
                  response.send(result);
              })
              .delete(adminAuth,async(request,response)=>{
                const {id}=request.params;
                const result=await deleteExpense(id);
                response.send(result);
            })

router.route('/category')
              .get(adminAuth,async (request,response)=>{
                const result=await getCategories();
                response.send(result);
                });
router.route('/division')
                .get(adminAuth,async (request,response)=>{
                  const result=await getDivisions();
                  response.send(result);
                  });
router.route('/:option')
              .get(adminAuth,async(request,response)=>{
                  const {option}=request.params;
                  let filterData=request.query;
                  if(filterData.startDate && filterData.endDate){
                    filterData=StartandEndDateFilter(filterData);
                }
                else if(filterData.startDate && !filterData.endDate){
                    filterData=StartDateFilter(filterData);
                }
                else if(!filterData.startDate && filterData.endDate){
                  filterData=EndDateFilter(filterData);
              }
                  let aggregateData=[];
                  switch(option){
                   case 'Monthly': aggregateData=[ {$match:filterData},{$group:{ _id: { $month: "$dateandtime" }, totalExpense: { $sum: "$amount" }, }} ]; break;
                   case 'Yearly': aggregateData=[ {$match:filterData},{$group:{ _id: { $year: "$dateandtime"}, totalExpense: { $sum: "$amount" }, }} ]; break;
                   case 'Weekly': aggregateData=[{$match:filterData},{$group:{ _id: { $week: "$dateandtime"}, totalExpense: { $sum: "$amount" }, }} ]; break;
                   default: aggregateData=[];
                  }
                  let result=await getExpenses(aggregateData);
                  if(option==='Monthly'){
                    result=getMonthName(result,'Expenditure');
                 }
                  response.send(result);
                  });

export const expenseRouter=router;