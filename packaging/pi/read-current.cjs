// Read only the active native tab. No file contents, editor actions or arbitrary JS input.
(async()=>{
 const ts=await fetch('http://127.0.0.1:9222/json/list',{signal:AbortSignal.timeout(2000)}).then(r=>r.json());
 const target=ts.find(t=>t.type==='page'&&t.url.startsWith('file:///opt/office/apps/shell/out/'));
 if(!target)throw Error('Native shell unavailable');
 const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;setTimeout(()=>j(Error('Connection timed out')),2000).unref()});
 try{
 const result=await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(Error('Native editor timed out')),3000);
 ws.onmessage=e=>{const d=JSON.parse(e.data);if(d.id!==1)return;clearTimeout(timer);d.error?reject(Error('Native read failed')):resolve(d.result)};
 ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:`window.aiOfficeTabs.list().then(tabs=>{const t=tabs.find(t=>t.active);if(!t||t.kind==='home')return {state:'none'};if(!Object.hasOwn(t,'filePath'))return {state:'unavailable'};return {state:t.filePath?'ready':'unsaved',tab:t.id,kind:t.kind,filePath:t.filePath}})`,awaitPromise:true,returnByValue:true}}));
 });if(result.exceptionDetails||!result.result.value)throw Error('Native metadata unavailable');console.log(JSON.stringify(result.result.value));
 }finally{ws.close()}
})().catch(()=>{console.log(JSON.stringify({state:'unavailable'}));process.exitCode=1});
