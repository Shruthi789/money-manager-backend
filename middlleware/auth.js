import jwt from 'jsonwebtoken';

function adminAuth(request,response,next){
    try{
    const adminToken=request.header('x-auth-token');
    jwt.verify(adminToken,process.env.SECRET_KEY_ADMIN);
    next();
    }catch(error){
      response.status(401).send(error.message);
    }

}
function editAuth(request,response,next){
  try{
  const editToken=request.header('x-auth-token');
  jwt.verify(editToken,process.env.SECRET_KEY_EDIT);
  next();
  }catch(error){
    response.status(401).send(error.message);
  }

}
export {adminAuth,editAuth};