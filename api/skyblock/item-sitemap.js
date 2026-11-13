const blocked = new Set(["SWORD","BOW","WAND","DAGGER","AXE","WEAPON","CROSSBOW","SHORTBOW","LONGSWORD"]);
function safe(x){const c=String(x.category||"").toUpperCase(),m=String(x.material||"").toUpperCase(),id=String(x.id||"").toUpperCase(),name=String(x.name||"");const bad=/(^|_)(WEAPON|SWORD|BOW|DAGGER|WAND|AXE|CROSSBOW|SHORTBOW|LONGSWORD)(_|$)/;return !blocked.has(c)&&!bad.test(c)&&!bad.test(m)&&!bad.test(id)&&!/(\\b)(sword|bow|wand|dagger|axe)(\\b)/i.test(name)&&x.name&&x.id&&/^[A-Z0-9_]{2,100}$/.test(x.id);}
function hasUsefulInfo(x){return !!((x.stats&&Object.keys(x.stats).length)||typeof x.npc_sell_price==="number"||x.requirements?.length||x.soulbound||x.origin||x.museum===true||x.glowing===true||x.unstackable===true);}
export default async function handler(req,res){
 res.setHeader("Content-Type","application/xml; charset=utf-8");
 res.setHeader("Cache-Control","s-maxage=3600, stale-while-revalidate=86400");
 try{
  const r=await fetch("https://api.hypixel.net/v2/resources/skyblock/items");const d=await r.json();
  if(!r.ok||!Array.isArray(d.items))throw new Error("upstream");
  const urls=d.items.filter(x=>safe(x)&&hasUsefulInfo(x)).map(x=>"<url><loc>https://skyblock-vault.vercel.app/item/"+encodeURIComponent(x.id)+"</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>").join("");
  return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+"</urlset>");
 }catch(e){return res.status(502).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');}
}