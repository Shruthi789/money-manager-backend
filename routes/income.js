import express from "express";
import {deleteIncome,addIncome,getCategories,editIncome,getDivisions,getIncomeData} from '../actions/incomeActions.js';
import jwt from 'jsonwebtoken';
import {editAuth,adminAuth} from '../middlleware/auth.js';
import { StartandEndDateFilter,StartDateFilter,EndDateFilter, getMonthName } from "../actions/dateFilterActions.js";

const router=express.Router();

router.route('/')
               .post(adminAuth,async(request,response)=>{
                  let incomeData=request.body;
                  incomeData.dateandtime=new Date(incomeData.dateandtime);
                  const result=await addIncome(incomeData);
                  const token=jwt.sign({id:result.insertedId},process.env.SECRET_KEY_EDIT,{ expiresIn: '12h' });
                  response.send({result,token});
               });

router.route('/:id')
              .put(editAuth,async(request,response)=>{
                  const {id}=request.params;
                  const incomeData=request.body;
                  incomeData.dateandtime=new Date(incomeData.dateandtime);
                  const result=await editIncome(id,incomeData);
                  response.send(result);
              })
              .delete(adminAuth,async(request,response)=>{
                const {id}=request.params;
                const result=await deleteIncome(id);
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
                       case 'Monthly': aggregateData=[ {$match:filterData},{$group:{ _id: { $month: "$dateandtime" }, totalIncome: { $sum: "$amount" }, }} ]; break;
                       case 'Yearly': aggregateData=[ {$match:filterData},{$group:{ _id: { $year: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       case 'Weekly': aggregateData=[{$match:filterData},{$group:{ _id: { $week: "$dateandtime"}, totalIncome: { $sum: "$amount" }, }} ]; break;
                       default: aggregateData=[];
                      }
                      let result=await getIncomeData(aggregateData);
                      if(option==='Monthly'){
                         result=getMonthName(result,'Income');
                      }
                      response.send(result);
                  });

export const incomeRouter=router;