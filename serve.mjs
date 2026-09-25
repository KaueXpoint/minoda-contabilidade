import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.mp4':'video/mp4','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Página não encontrada.');}
  const size=fs.statSync(file).size,range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);let start=0,end=size-1;
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
  if(range){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;if(start>end){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}headers['Content-Range']=`bytes ${start}-${end}/${size}`;}
  headers['Content-Length']=end-start+1;res.writeHead(range?206:200,headers);if(req.method==='HEAD')return res.end();fs.createReadStream(file,{start,end}).pipe(res);
 }catch{res.writeHead(400);res.end('Requisição inválida.');}
}).listen(Number(process.env.PORT||8011),'127.0.0.1',()=>console.log('Minoda — http://127.0.0.1:'+(process.env.PORT||8011)));
