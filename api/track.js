const {sb,json,clean,safePath}=require('./_lib');
module.exports=async function handler(req,res){
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const page=safePath(body.page), session_id=clean(body.session_id,80), referrer=clean(body.referrer,500);
    if(!session_id) return json(res,400,{error:'Missing session'});
    await sb('page_views',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify([{page,session_id,referrer}])});
    return json(res,201,{ok:true});
  }catch(err){console.error(err);return json(res,204,{});}
}
