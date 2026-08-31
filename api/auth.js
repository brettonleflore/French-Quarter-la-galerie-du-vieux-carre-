const {env,json,makeSession,cookie,validSession}=require('./_lib');
const crypto=require('crypto');
function equal(a,b){const A=Buffer.from(String(a)),B=Buffer.from(String(b));return A.length===B.length&&crypto.timingSafeEqual(A,B)}
module.exports=async function handler(req,res){
  if(req.method==='GET') return json(res,200,{authenticated:validSession(req)});
  if(req.method==='DELETE'){res.setHeader('Set-Cookie',cookie('',0));return json(res,200,{ok:true});}
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    if(!equal(body.password,env('OWNER_DASHBOARD_PASSWORD'))) return json(res,401,{error:'Incorrect password'});
    res.setHeader('Set-Cookie',cookie(makeSession()));
    return json(res,200,{ok:true});
  }catch(err){console.error(err);return json(res,500,{error:'Dashboard authentication is not configured.'});}
}
