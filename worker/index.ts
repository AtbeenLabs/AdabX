interface Env { AI_API_KEY:string; AI_API_URL?:string; AI_MODEL?:string; ALLOWED_ORIGIN?:string; }
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  const origin=request.headers.get('Origin')||'';
  const allowed=env.ALLOWED_ORIGIN||'https://atbeenlabs.github.io';
  const cors={'Access-Control-Allow-Origin':origin===allowed?origin:allowed,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};
  if(request.method==='OPTIONS')return new Response(null,{headers:cors});
  if(request.method!=='POST')return Response.json({error:'Method not allowed'},{status:405,headers:cors});
  if(!env.AI_API_KEY)return Response.json({error:'AI service is not configured'},{status:503,headers:cors});
  try{
   const body=await request.json() as {message?:string;context?:string};
   const message=typeof body.message==='string'?body.message.trim():'';
   if(!message||message.length>4000)return Response.json({error:'Message must be between 1 and 4000 characters'},{status:400,headers:cors});
   const upstream=await fetch(env.AI_API_URL||'https://api.openai.com/v1/chat/completions',{
    method:'POST',headers:{Authorization:`Bearer ${env.AI_API_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify({model:env.AI_MODEL||'gpt-4o-mini',temperature:.35,max_tokens:900,messages:[
     {role:'system',content:'تو دستیار آموزشی AdabX برای یادگیری ادبیات فارسی هشتم و آمادگی المپیاد ادبی هستی. فارسی روان، دقیق و آموزشی پاسخ بده. اگر اطلاعات یا متن کافی نیست، حدس نزن و درخواست منبع کن. ادعای پاسخ‌نامهٔ رسمی نکن مگر منبع رسمی ارائه شده باشد.'},
     {role:'user',content:`${body.context||''}\n\nپرسش دانش‌آموز: ${message}`}
    ]})
   });
   if(!upstream.ok)return Response.json({error:'AI provider error'},{status:502,headers:cors});
   const data=await upstream.json() as {choices?:Array<{message?:{content?:string}}>};
   const answer=data.choices?.[0]?.message?.content;
   if(!answer)return Response.json({error:'Empty AI response'},{status:502,headers:cors});
   return Response.json({answer},{headers:{...cors,'Cache-Control':'no-store'}});
  }catch{return Response.json({error:'Invalid request or upstream failure'},{status:400,headers:cors});}
 }
};