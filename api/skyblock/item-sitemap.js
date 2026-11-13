const blocked = new Set(["SWORD","BOW","WAND","DAGGER","AXE","WEAPON","CROSSBOW","SHORTBOW","LONGSWORD"]);
function safe(x){const c=String(x.category||"").toUpperCase(),m=String(x.material||"").toUpperCase();return !blocked.has(c)&&!/(WEAPON|SWORD|BOW|DAGGER|WAND|CROSSBOW)/.test(c+" "+m)&&x.name&&x.id&&/^[A-Z0-9_]{2,100}$/.test(x.id);}
export default async function handler(req,res){
 res.setHeader("Content-Type","application/xml; charset=utf-8");
 res.setHeader("Cache-Control","s-maxage=3600, stale-while-revalidate=86400");
 try{
  const r=await fetch("https://api.hypixel.net/v2/resources/skyblock/items");const d=await r.json();
  if(!r.ok||!Array.isArray(d.items))throw new Error("upstream");
  const urls=d.items.filter(safe).map(x=>"<url><loc>https://skyblock-vault.vercel.app/item/"+encodeURIComponent(x.id)+"</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>").join("");
  return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+"</urlset>");
 }catch(e){return res.status(502).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');}
}