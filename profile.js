const cache = new Map();
const CACHE_MS = 60_000;
async function getJson(url, options = {}) { const r=await fetch(url,options); const d=await r.json().catch(()=>({})); if(!r.ok){const e=new Error(d.cause||d.error||`Upstream request failed (${r.status})`);e.status=r.status;throw e;} return d; }
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
 const key=process.env.HYPIXEL_API_KEY;if(!key)return res.status(503).json({error:'Server configuration missing: add HYPIXEL_API_KEY in Vercel Environment Variables.'});
 const username=String(req.query.username||'').trim();if(!/^[A-Za-z0-9_]{3,16}$/.test(username))return res.status(400).json({error:'Enter a valid Minecraft Java username (3–16 letters, numbers or underscores).'});
 const cacheKey=username.toLowerCase(),cached=cache.get(cacheKey);if(cached&&Date.now()-cached.at<CACHE_MS)return res.status(200).json(cached.data);
 try{
  const mojang=await getJson(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`);if(!mojang.id)return res.status(404).json({error:'Minecraft player not found.'});
  const pd=await getJson(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${encodeURIComponent(mojang.id)}`,{headers:{'API-Key':key}});
  if(!pd.success)return res.status(502).json({error:pd.cause||'Hypixel could not complete the profile request.'});
  if(!Array.isArray(pd.profiles)||!pd.profiles.length)return res.status(404).json({error:'No SkyBlock profiles found. The player may not have played SkyBlock or may have restricted API access.'});
  const profile=pd.profiles.find(x=>x.selected)||pd.profiles[0],uuid=mojang.id.replace(/-/g,''),member=profile.members?.[uuid]||profile.members?.[mojang.id]||{};
  const result={username:mojang.name||username,uuid:mojang.id,profileName:profile.cute_name||'SkyBlock',profileId:profile.profile_id,gameMode:profile.game_mode||'normal',profile,member};cache.set(cacheKey,{at:Date.now(),data:result});return res.status(200).json(result);
 }catch(e){const status=e.status===429?429:502;return res.status(status).json({error:status===429?'Hypixel or Mojang rate limit reached. Wait a little and try again.':(e.message||'Could not load the SkyBlock profile.')});}
}
