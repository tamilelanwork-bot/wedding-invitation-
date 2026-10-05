const intro=document.getElementById('intro'),story=document.getElementById('story'),openBtn=document.getElementById('openBtn'),music=document.getElementById('music'),sound=document.getElementById('sound');
openBtn.addEventListener('click',async()=>{intro.classList.add('open');try{music.currentTime=65;music.volume=.52;await music.play()}catch(e){}sound.classList.add('show');setTimeout(()=>{intro.style.display='none';story.setAttribute('aria-hidden','false');story.scrollTop=0;activate(panels[0])},3400)});
music.addEventListener('timeupdate',()=>{if(music.currentTime>=120){music.pause();music.currentTime=120;sound.classList.add('muted')}});
sound.addEventListener('click',()=>{if(music.paused){if(music.currentTime<65||music.currentTime>=120)music.currentTime=65;music.play();sound.classList.remove('muted')}else{music.pause();sound.classList.add('muted')}});
const panels=[...document.querySelectorAll('.panel')];function activate(p){panels.forEach(x=>x.classList.remove('active'));p.classList.add('active')}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.62)activate(e.target)}),{root:story,threshold:[.62,.78]});panels.forEach(p=>io.observe(p));
const canvas=document.getElementById('scratch'),save=canvas.closest('.save'),saveImg=save.querySelector('img'),hint=save.querySelector('.scratchHint');let ctx,drawing=false,last=null,cleared=false;
// Only the printed date plate is scratchable. Coordinates are measured on the original 1024×1536 artwork.
const DATE_BOX={x:470,y:755,w:205,h:235};
function placeScratch(){
 const pr=save.getBoundingClientRect(),iw=saveImg.naturalWidth||1024,ih=saveImg.naturalHeight||1536;
 const scale=Math.max(pr.width/iw,pr.height/ih),dw=iw*scale,dh=ih*scale,ox=(pr.width-dw)/2,oy=(pr.height-dh)/2;
 const x=ox+DATE_BOX.x*scale,y=oy+DATE_BOX.y*scale,w=DATE_BOX.w*scale,h=DATE_BOX.h*scale;
 Object.assign(canvas.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
 Object.assign(hint.style,{left:(x+w/2)+'px',top:(y+h+18)+'px'});
 return {w,h};
}
function setupScratch(){const r=placeScratch(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,r.w*dpr);canvas.height=Math.max(1,r.h*dpr);ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);let g=ctx.createLinearGradient(0,0,0,r.h);g.addColorStop(0,'#ead39e');g.addColorStop(.5,'#cda366');g.addColorStop(1,'#b98b53');ctx.fillStyle=g;ctx.fillRect(0,0,r.w,r.h);ctx.globalAlpha=.25;for(let i=0;i<420;i++){ctx.fillStyle=i%2?'#fff0c8':'#754922';ctx.fillRect(Math.random()*r.w,Math.random()*r.h,Math.random()*2+1,Math.random()*2+1)}ctx.globalAlpha=1;ctx.fillStyle='#fff7e8';ctx.textAlign='center';ctx.font='600 11px Arial';ctx.fillText('SCRATCH DATE',r.w/2,r.h/2);ctx.globalCompositeOperation='destination-out'}
function pos(e){const r=canvas.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top}}
function scratch(e){if(!drawing)return;e.preventDefault();const p=pos(e);ctx.lineWidth=Math.max(24,canvas.clientWidth*.18);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(last)ctx.moveTo(last.x,last.y);else ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle='#000';ctx.stroke();last=p;if(!cleared&&Math.random()<.12)checkClear()}
function checkClear(){const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let transparent=0,total=0;for(let i=3;i<d.length;i+=96){total++;if(d[i]<40)transparent++}if(transparent/total>.42){cleared=true;canvas.style.transition='opacity .7s';canvas.style.opacity='0';save.classList.add('revealed');setTimeout(()=>canvas.style.pointerEvents='none',700)}}
['mousedown','touchstart'].forEach(n=>canvas.addEventListener(n,e=>{drawing=true;last=pos(e)},{passive:false}));['mousemove','touchmove'].forEach(n=>canvas.addEventListener(n,scratch,{passive:false}));['mouseup','mouseleave','touchend','touchcancel'].forEach(n=>canvas.addEventListener(n,()=>{drawing=false;last=null}));window.addEventListener('resize',()=>{if(!cleared)setupScratch();else placeScratch()});if(saveImg.complete)setupScratch();else saveImg.addEventListener('load',setupScratch);

