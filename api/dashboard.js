const {sb,json,validSession,clean}=require('./_lib');
module.exports=async function handler(req,res){
  if(!validSession(req)) return json(res,401,{error:'Unauthorized'});
  if(req.method!=='GET' && req.method!=='PATCH') return json(res,405,{error:'Method not allowed'});
  try{
    if(req.method==='PATCH'){
      const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
      const id=clean(body.id,80), status=clean(body.status,20);
      if(!id || !['new','contacted','booked','closed'].includes(status)) return json(res,400,{error:'Invalid update'});
      await sb(`inquiries?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status})});
      return json(res,200,{ok:true});
    }
    const days=Math.max(1,Math.min(365,Number(req.query?.days)||30));
    const since=new Date(Date.now()-days*86400000).toISOString();
    const [views,inquiries]=await Promise.all([
      sb(`page_views?select=id,page,session_id,referrer,created_at&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=5000`),
      sb('inquiries?select=id,name,email,phone,arrival,departure,guests,message,source_page,status,created_at&order=created_at.desc&limit=1000')
    ]);
    const unique=new Set(views.map(v=>v.session_id)).size;
    const byPage={}; const byDay={};
    views.forEach(v=>{byPage[v.page]=(byPage[v.page]||0)+1;const day=v.created_at.slice(0,10);byDay[day]=(byDay[day]||0)+1;});
    const recentInquiries=inquiries.filter(i=>new Date(i.created_at)>=new Date(since));
    return json(res,200,{period_days:days,metrics:{views:views.length,unique_visitors:unique,inquiries:recentInquiries.length,conversion:unique?recentInquiries.length/unique:0},views_by_page:Object.entries(byPage).sort((a,b)=>b[1]-a[1]),views_by_day:Object.entries(byDay).sort((a,b)=>a[0].localeCompare(b[0])),inquiries});
  }catch(err){console.error(err);return json(res,500,{error:'Dashboard data is unavailable. Check the Supabase configuration.'});}
}
