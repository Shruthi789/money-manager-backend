
function StartandEndDateFilter(filterData){
    let data;
    if(!filterData.category && !filterData.division){
        data={dateandtime:{$gt:new Date(filterData.startDate),$lt:new Date(filterData.endDate)}}
    }
    else if(filterData.category && !filterData.division){
      let {category}=filterData;
      data={category,dateandtime:{$gt:new Date(filterData.startDate),$lt:new Date(filterData.endDate)}}
    }
    else if( !filterData.category && filterData.division){
      let {division}=filterData;
      data={division,dateandtime:{$gt:new Date(filterData.startDate),$lt:new Date(filterData.endDate)}}
  }
  else if(filterData.category && filterData.division){
      let {category,division}=filterData;
      data={category,division,dateandtime:{$gt:new Date(filterData.startDate),$lt:new Date(filterData.endDate)}}
  }
  return data;
}

function StartDateFilter(filterData){
    let data;
    if(!filterData.category && !filterData.division){
        data={dateandtime:{$gte:new Date(filterData.startDate)}}
    }
    else if(filterData.category && !filterData.division){
      let {category}=filterData;
      data={category,dateandtime:{$gte:new Date(filterData.startDate)}}
    }
    else if( !filterData.category && filterData.division){
      let {division}=filterData;
      data={division,dateandtime:{$gte:new Date(filterData.startDate)}}
  }
  else if(filterData.category && filterData.division){
      let {category,division}=filterData;
      data={category,division,dateandtime:{$gte:new Date(filterData.startDate)}}
  }
  return data;
}
function EndDateFilter(filterData){
    let data;
    if(!filterData.category && !filterData.division){
        data={dateandtime:{$lte:new Date(filterData.endDate)}}
    }
    else if(filterData.category && !filterData.division){
      let {category}=filterData;
      data={category,dateandtime:{$lte:new Date(filterData.endDate)}}
    }
    else if( !filterData.category && filterData.division){
      let {division}=filterData;
      data={division,dateandtime:{$lte:new Date(filterData.endDate)}}
  }
  else if(filterData.category && filterData.division){
      let {category,division}=filterData;
      data={category,division,dateandtime:{$lte:new Date(filterData.endDate)}}
  }
  return data;
}

function getMonthName(result,action){
    const monthObjList=[{no:1,month:"January"},{no:2,month:"February"},{no:3,month:"March"},{no:4,month:"April"},
    {no:5,month:"May"},{no:6,month:"June"},{no:7,month:"July"},{no:8,month:"August"},
    {no:9,month:"September"},{no:10,month:"October"},{no:11,month:"November"},{no:12,month:"December"}];
    let newList;
    if(action==='Income'){
    newList=result.map(({_id,totalIncome})=>{
        const {month}=monthObjList.find(({no})=>no===_id);
        return {_id:month,totalIncome};
    })
   }
   if(action=='Expenditure'){
    newList=result.map(({_id,totalExpense})=>{
        const {month}=monthObjList.find(({no})=>no===_id);
        return {_id:month,totalExpense};
    })
   }
    return newList;
}
export {StartandEndDateFilter,StartDateFilter,EndDateFilter,getMonthName};