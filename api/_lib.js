const crypto = require('crypto');

function env(name){
  const value = process.env[name];
  if(!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function supabaseHeaders(extra={}){
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  return {
    apikey:key,
    Authorization:`Bearer ${key}`,
    'Content-Type':'application/json',
    ...extra
  };
}

async function sb(path, options={}){
  const base = env('SUPABASE_URL').replace(/\/$/,'');
  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers:supabaseHeaders(options.headers || {})
  });
  if(!response.ok){
    const text = await response.text();
    throw new Error(`Supabase ${response.status}: ${text}`);
  }
  const text = await response.text();
  if(!text) return null;
  try{return JSON.parse(text)}catch{return text}
}

function parseCookies(req){
  return Object.fromEntries((req.headers.cookie || '').split(';').map(v=>v.trim()).filter(Boolean).map(v=>{
    const i=v.indexOf('='); return [decodeURIComponent(v.slice(0,i)),decodeURIComponent(v.slice(i+1))];
  }));
}

function b64url(input){return Buffer.from(input).toString('base64url')}
function sign(value){
  const secret = process.env.DASHBOARD_SESSION_SECRET || process.env.OWNER_DASHBOARD_PASSWORD || '';
  return crypto.createHmac('sha256',secret).update(value).digest('base64url');
}
function makeSession(){
  const payload = JSON.stringify({exp:Date.now()+1000*60*60*12});
  const encoded=b64url(payload);
  return `${encoded}.${sign(encoded)}`;
}
function validSession(req){
  const token=parseCookies(req).lgvc_owner;
  if(!token) return false;
  const [encoded,sig]=token.split('.');
  if(!encoded||!sig) return false;
  const expected=sign(encoded);
  const a=Buffer.from(sig), b=Buffer.from(expected);
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return false;
  try{const data=JSON.parse(Buffer.from(encoded,'base64url').toString('utf8'));return data.exp>Date.now();}catch{return false}
}
function cookie(value,maxAge=43200){
  const secure=process.env.NODE_ENV==='production'?'; Secure':'';
  return `lgvc_owner=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}
function json(res,status,payload){
  res.statusCode=status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(payload));
}
function clean(value,max=500){return String(value??'').trim().slice(0,max)}
function safePath(value){
  const s=clean(value,180); return s.startsWith('/')?s:'/'
}
module.exports={sb,env,validSession,makeSession,cookie,json,clean,safePath};
