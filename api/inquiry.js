const {sb,json,clean}=require('./_lib');
module.exports=async function handler(req,res){
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const name=clean(body.name,120), email=clean(body.email,200).toLowerCase(), phone=clean(body.phone,80);
    const arrival=clean(body.arrival,20), departure=clean(body.departure,20), guests=Math.max(1,Math.min(12,Number(body.guests)||1));
    const message=clean(body.message,2000), source_page=clean(body.source_page,180)||'/';
    if(!name||!email||!arrival||!departure) return json(res,400,{error:'Please complete name, email, arrival and departure.'});
    if(!/^\S+@\S+\.\S+$/.test(email)) return json(res,400,{error:'Please enter a valid email.'});
    const a=new Date(`${arrival}T12:00:00Z`), d=new Date(`${departure}T12:00:00Z`);
    const nights=Math.round((d-a)/86400000);
    if(!Number.isFinite(nights)||nights<30) return json(res,400,{error:'Private stays require at least 30 nights.'});
    const rows=await sb('inquiries',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify([{name,email,phone,arrival,departure,guests,message,source_page,status:'new'}])});
    return json(res,201,{ok:true,id:rows?.[0]?.id||null,nights});
  }catch(err){console.error(err);return json(res,500,{error:'We could not save your inquiry. Please try again.'});}
}
