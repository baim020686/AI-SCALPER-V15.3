(() => {
const $=id=>document.getElementById(id);
let candles=[],balance=1000,starting=1000,pnl=0,position=null,history=[],timer=null,seed=0;
const rand=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
function makeCandle(prev){let o=prev??2350,move=(rand()-.49)*1.8,c=o+move;return {open:o,high:Math.max(o,c)+rand()*.45,low:Math.min(o,c)-rand()*.45,close:c,time:new Date(Date.now()+candles.length*60000)}}
function initCandles(){seed=42;candles=[];let p=2350;for(let i=0;i<100;i++){let c=makeCandle(p);candles.push(c);p=c.close}}
function ema(vals,n){if(vals.length<n)return NaN;let k=2/(n+1),v=vals.slice(0,n).reduce((a,b)=>a+b,0)/n;for(let i=n;i<vals.length;i++)v=vals[i]*k+v*(1-k);return v}
function rsi(vals,n=14){if(vals.length<=n)return 50;let up=0,dn=0;for(let i=vals.length-n;i<vals.length;i++){let d=vals[i]-vals[i-1];if(d>0)up+=d;else dn-=d}if(dn===0)return 100;return 100-100/(1+(up/n)/(dn/n))}
function metrics(){let closes=candles.map(c=>c.close);return {fast:ema(closes,5),slow:ema(closes,20),rsi:rsi(closes)}}
function signal(){let m=metrics(),n=candles.length;let c=candles[n-1],p=candles[n-2];let crossUp=ema(candles.slice(0,-1).map(x=>x.close),5)<=ema(candles.slice(0,-1).map(x=>x.close),20)&&m.fast>m.slow;let crossDn=ema(candles.slice(0,-1).map(x=>x.close),5)>=ema(candles.slice(0,-1).map(x=>x.close),20)&&m.fast<m.slow;
 // Simplified transparent demo filters. Not a faithful or validated reproduction of the source's SMC definitions.
 let liqLow=c.low<Math.min(...candles.slice(-11,-1).map(x=>x.low));let liqHigh=c.high>Math.max(...candles.slice(-11,-1).map(x=>x.high));
 let haBull=c.close>=c.open,haBear=c.close<c.open;
 let bullOB=p.close<p.open&&c.close>c.open,bearOB=p.close>p.open&&c.close<c.open;
 let buy=haBull&&crossUp&&m.rsi>50&&liqLow&&bullOB,sell=haBear&&crossDn&&m.rsi<50&&liqHigh&&bearOB;
 return {m,buy,sell,c,reason:buy?"Filter BUY terpenuhi (simulasi)":sell?"Filter SELL terpenuhi (simulasi)":"Filter lengkap belum terpenuhi"}}
function draw(){let cv=$("chart"),ctx=cv.getContext("2d"),w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle="#2b3650";ctx.lineWidth=1;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,h*i/5);ctx.lineTo(w,h*i/5);ctx.stroke()}let view=candles.slice(-70),lo=Math.min(...view.map(c=>c.low)),hi=Math.max(...view.map(c=>c.high)),range=hi-lo||1,step=w/view.length;view.forEach((c,i)=>{let x=i*step+step/2,y=v=>h-(v-lo)/range*(h-25)-12;ctx.strokeStyle=c.close>=c.open?"#36d399":"#fb7185";ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(x,y(c.high));ctx.lineTo(x,y(c.low));ctx.stroke();let top=Math.min(y(c.open),y(c.close)),bh=Math.max(2,Math.abs(y(c.open)-y(c.close)));ctx.fillRect(x-step*.28,top,step*.56,bh)})}
function render(){let s=signal(),m=s.m;$("emaFast").textContent=Number.isFinite(m.fast)?m.fast.toFixed(2):"—";$("emaSlow").textContent=Number.isFinite(m.slow)?m.slow.toFixed(2):"—";$("rsi").textContent=m.rsi.toFixed(1);$("priceLine").textContent="Harga demo: "+s.c.close.toFixed(2)+" • waktu simulasi "+s.c.time.toLocaleTimeString("id-ID");let sig=s.buy?"BUY":s.sell?"SELL":"WAIT";$("signal").textContent=sig;$("signal").className="signal "+sig.toLowerCase();$("reason").textContent=s.reason;$("position").textContent=position?position.side+" @ "+position.price.toFixed(2):"Tidak ada";$("balance").textContent="$"+balance.toFixed(2);$("pnl").textContent=(pnl<0?"-$":"$")+Math.abs(pnl).toFixed(2);$("pnl").style.color=pnl>=0?"#36d399":"#fb7185";draw();renderHistory()}
function renderHistory(){$("history").innerHTML=history.length?history.slice().reverse().map(x=>`<tr><td>${x.time}</td><td class="${x.side.toLowerCase()}">${x.side}</td><td>${x.price.toFixed(2)}</td><td>${x.status}</td><td>${x.pnl===null?"—":(x.pnl>=0?"+":"")+x.pnl.toFixed(2)}</td></tr>`).join(""):'<tr><td colspan="5" class="muted">Belum ada transaksi.</td></tr>'}
function addCandle(){candles.push(makeCandle(candles[candles.length-1].close));if(candles.length>500)candles.shift();let s=signal(),c=s.c;
 if(position){let pct=(c.close-position.price)/position.price*(position.side==="BUY"?1:-1)*100;let sl=Number($("sl").value)||.5,tp=Number($("tp").value)||.8;if(pct<=-sl||pct>=tp){let tradePnl=balance*(Number($("risk").value)/100)*pct/sl;balance+=tradePnl;pnl+=tradePnl;history.push({time:c.time.toLocaleTimeString("id-ID"),side:position.side,price:position.price,status:pct>=tp?"TP demo":"SL demo",pnl:tradePnl});position=null}}
 if(!position&&(s.buy||s.sell)){position={side:s.buy?"BUY":"SELL",price:c.close};history.push({time:c.time.toLocaleTimeString("id-ID"),side:position.side,price:c.close,status:"OPEN demo",pnl:null})}
 render()}
function start(){if(timer){clearInterval(timer);timer=null;$("start").textContent="Start paper session";$("feed").textContent="DEMO PAUSED"}else{timer=setInterval(addCandle,3000);$("start").textContent="Pause paper session";$("feed").textContent="DEMO RUNNING"}}
$("start").addEventListener("click",start);$("step").addEventListener("click",addCandle);
$("reset").addEventListener("click",()=>{if(timer){clearInterval(timer);timer=null}$("start").textContent="Start paper session";$("feed").textContent="DEMO FEED";balance=starting;pnl=0;position=null;history=[];initCandles();render()});
$("save").addEventListener("click",()=>{$("settingsMsg").textContent="Pengaturan berlaku untuk sesi simulasi ini. Tidak ada order broker yang dikirim."});
initCandles();render();
})();