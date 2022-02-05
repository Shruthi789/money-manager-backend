import jwt from 'jsonwebtoken';

function incomeAuth(request,response,next){
    try{
    const adminToken=request.header('x-auth-token');
    jwt.verify(adminToken,process.env.SECRET_KEY_ONE);
    next();
    }catch(error){
      response.status(401).send(error.message);
    }

}
function expenseAuth(request,response,next){
  try{
  const adminToken=request.header('x-auth-token');
  jwt.verify(adminToken,process.env.SECRET_KEY_TWO);
  next();
  }catch(error){
    response.status(401).send(error.message);
  }

}
export {incomeAuth,expenseAuth};