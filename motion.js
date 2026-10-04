'use strict';
const projects=window.portfolioProjects;
const featured=['flowing-piano','guanlan','software-hub','chrome-profile-manager','skc-assistant'].map(id=>({...projects.find(p=>p.id===id),...window.portfolioFilms[id]}));
featured.push(window.portfolioCollection);
const $=selector=>document.querySelector(selector);
const dialog=$('#detailDialog'),frame=$('#mediaFrame'),cinema=$('#cinema'),reducedQuery=matchMedia('(prefers-reduced-motion: reduce)');
let video=$('#sceneVideo'),current=-1,paused=reducedQuery.matches,autoplay=false,visible=true,sound=false;
// Only active media owns UI updates. One ready session is retained for Cancel.
let active=null,rollback=null,indicatorMotion=null;
const motions=new Set(),clock=n=>'00:'+String(Math.floor(Number.isFinite(n)?n:0)).padStart(2,'0');
const suspended=()=>document.hidden||!visible||dialog.open;
const tabs=featured.slice(0,5).map((film,index)=>{
  const b=document.createElement('button');b.className='project-tab';b.dataset.project=index;
  const n=document.createElement('span');n.className='project-number';n.textContent=String(index+1).padStart(2,'0');
  const copy=document.createElement('div'),label=document.createElement('span'),title=document.createElement('strong'),arrow=document.createElement('span');
  label.className='project-category';label.textContent=film.label;title.textContent=film.name;arrow.className='tab-arrow';arrow.textContent='↗';
  const cover=document.createElement('img');cover.className='film-cover';cover.src=film.cover;cover.alt='';cover.width=1280;cover.height=720;cover.loading='lazy';
  const play=document.createElement('span');play.className='cover-play';play.textContent='▶ 播放影片 · '+clock(film.duration);
  b.setAttribute('aria-label','播放 '+film.name+' 影片');
  copy.append(label,title);b.append(cover,play,n,copy,arrow);b.addEventListener('click',()=>{selectScene(index);paused=false;syncPlayback();cinema.scrollIntoView({behavior:reducedQuery.matches?'instant':'smooth',block:'center'})});return b;
});
const indicator=document.createElement('span');indicator.className='project-indicator';indicator.setAttribute('aria-hidden','true');
$('#projectNav').replaceChildren(...tabs,indicator);
function animate(el,frames,options){if(reducedQuery.matches)return;const a=el.animate(frames,options);motions.add(a);a.finished.then(()=>motions.delete(a),()=>motions.delete(a))}
function stopMotion(){for(const a of motions)a.cancel();motions.clear()}
function moveIndicator(instant=false){
  if(current<0)return;
  indicator.hidden=current===5;if(current===5){indicatorMotion?.cancel();return}
  const from=indicator.getBoundingClientRect(),to=tabs[current].getBoundingClientRect(),nav=$('#projectNav').getBoundingClientRect();indicatorMotion?.cancel();
  Object.assign(indicator.style,{left:(to.left-nav.left)+'px',top:(to.bottom-nav.top-2)+'px',width:to.width+'px'});
  if(!instant&&!reducedQuery.matches&&from.width)indicatorMotion=indicator.animate([
    {transform:`translate(${from.left-to.left}px,${from.top-to.bottom+2}px) scaleX(${from.width/to.width})`},{transform:'none'}
  ],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});
}
function filmDuration(){return Number.isFinite(video.duration)?video.duration:featured[current].duration}
function updateControls(){
  $('#motionToggle').textContent=paused?'▶':'Ⅱ';$('#motionToggle').setAttribute('aria-label',paused?'播放影片':'暂停影片');$('#motionToggle').setAttribute('aria-pressed',String(paused));
  $('#soundToggle').setAttribute('aria-pressed',String(sound));$('#soundLabel').textContent=sound?'声音已开启 · 点击静音':'开启声音 · 从头体验';
  $('#autoNext').disabled=reducedQuery.matches;$('#timeline').disabled=!active?.ready||Boolean(active?.failure);
}
function status(){
  if(!active)return;const s=active;
  let state='ready',badge='已就绪',title='',detail='',retry=false,cancel=false;
  if(s.failure){state='error';badge='加载失败';title='影片暂时无法载入';detail='可重试加载，或通过下方“下载影片”保存观看。';retry=true;cancel=Boolean(rollback)}
  else if(s.cancelled){state='cancelled';badge='已取消';title='已取消加载';detail='点击“重新加载”继续，也可以选择其他项目。';retry=true}
  else if(!s.ready){state='loading';badge='加载中';title='正在准备 '+featured[current].name;detail=paused?'载入后保持暂停。':'载入后播放；你可以暂停或切换项目。';cancel=true}
  else if(s.blocked){state='blocked';badge='等待播放';title='影片已就绪，请点击播放';detail=s.blocked;retry=true}
  else if(s.waiting&&!paused&&!suspended()){state='buffering';badge='缓冲中';title='正在缓冲';detail='画面已保留，加载完成后继续。可随时暂停。'}
  else if(video.ended){state='ended';badge='已播完'}else if(!video.paused){state='playing';badge='播放中'}
  else if(paused||suspended()){state='paused';badge=suspended()&&!paused?'已暂存 · 返回后继续':'已暂停'}
  cinema.dataset.mediaState=state;cinema.setAttribute('aria-busy',String(state==='loading'||state==='buffering'));
  $('#playbackState').textContent=badge;$('#mediaStatus').hidden=!title;$('#mediaStatusTitle').textContent=title;$('#mediaStatusText').textContent=detail;
  $('#mediaRetry').hidden=!retry;$('#mediaRetry').textContent=state==='blocked'?'播放影片':state==='cancelled'?'重新加载':'重试加载';
  $('#mediaCancel').hidden=!cancel;$('#mediaCancel').textContent=rollback?'返回 '+featured[rollback.session.index].name:'取消加载';updateControls();
}
function draw(){
  const film=featured[current],time=video.currentTime||0,phase=Math.max(0,film.chapters.findLastIndex(c=>time>=c[0]));
  $('#phaseNumber').textContent=String(phase+1).padStart(2,'0')+' / '+String(film.chapters.length).padStart(2,'0');
  $('#phaseTitle').textContent=film.chapters[phase][1];$('#phaseDescription').textContent=film.chapters[phase][2];
  $('#timecode').textContent=clock(time);$('#timeline').value=time;$('#timeline').setAttribute('aria-valuetext',clock(time)+'，'+film.chapters[phase][1]);
}
function stopPlayback(s){s.playTicket++;s.pendingPlay=false;s.video.pause()}
function syncPlayback(){
  const s=active;if(!s)return;
  if(paused||suspended()||!s.ready||s.failure||s.cancelled){stopPlayback(s);status();return}
  if(s.pendingPlay||!video.paused){status();return}
  const ticket=++s.playTicket;s.pendingPlay=true;
  s.video.play().then(()=>{
    if(active!==s||ticket!==s.playTicket)return;s.pendingPlay=false;s.blocked='';if(paused||suspended())stopPlayback(s);status();
  }).catch(error=>{
    if(active!==s||ticket!==s.playTicket)return;s.pendingPlay=false;
    if(error.name!=='AbortError'){paused=true;s.blocked=error.name==='NotAllowedError'?'浏览器尚未允许自动播放，点击后即可继续。':'播放未能开始，请再次点击播放。'}status();
  });
}
function dispose(s){if(s){s.events.abort();stopPlayback(s);s.video.remove();s.video.removeAttribute('src');s.video.load()}}
function updateFilm(route='push',instant=false){
  const film=featured[current];document.body.dataset.scene=current;$('#projectTitle').replaceChildren(document.createTextNode(film.name));
  const subtitle=document.createElement('span');subtitle.textContent=film.tagline;$('#projectTitle').append(subtitle);
  $('#projectEyebrow').textContent=String(current+1).padStart(2,'0')+' / '+film.label;
  $('#stageLabel').textContent=film.name+' / 功能影片';$('#stageMode').textContent=film.version+' / '+(film.format||'1080P');$('#featureSummary').textContent=film.summary;$('#filmDownload').href=film.src;
  $('#timeline').max=filmDuration();$('#duration').textContent=clock(filmDuration());
  tabs.forEach((b,i)=>{b.classList.toggle('selected',i===current);b.setAttribute('aria-pressed',String(i===current))});moveIndicator(instant);
  $('#showOverview').setAttribute('aria-pressed',String(current===5));$('#projectDetail').innerHTML=current===5?'探索全部作品 <span>↗</span>':'了解项目 <span>↗</span>';
  if(route!=='none'){const url=new URL(location.href);url.searchParams.set('variant','ABCDEF'[current]);try{history[route==='replace'?'replaceState':'pushState']({},'',url)}catch{}}
  draw();status();
}
function reveal(s){
  if(s.revealed)return;s.revealed=true;
  const distance=Math.min(16,frame.clientWidth*.012)*s.direction;
  animate(s.video,[{transform:`translateX(${distance}px)`},{transform:'none'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
  animate(s.video,[{opacity:.35},{opacity:1}],{duration:180,easing:'ease-out'});
  animate($('.scene-caption>div'),[{opacity:.4},{opacity:1}],{duration:210,delay:65,easing:'ease-out'});
}
function bindMedia(s){
  const on=(name,handler)=>s.video.addEventListener(name,()=>{if(active===s)handler()},{signal:s.events.signal});
  const ready=()=>{
    if(s.video.readyState<2||s.failure||s.cancelled)return;s.ready=true;s.waiting=false;
    if(rollback){dispose(rollback.session);rollback=null}reveal(s);draw();syncPlayback();
  };
  on('loadedmetadata',()=>{
    $('#timeline').max=filmDuration();$('#duration').textContent=clock(filmDuration());
    if(s.pendingSeek!==null){s.video.currentTime=Math.min(s.pendingSeek,filmDuration());s.pendingSeek=null}draw();status();
  });
  on('loadeddata',ready);on('canplay',ready);on('timeupdate',draw);
  on('seeked',()=>{s.waiting=false;draw();status()});on('playing',()=>{s.waiting=false;s.blocked='';status()});on('pause',status);on('waiting',()=>{s.waiting=true;status()});
  on('ended',()=>{if(autoplay&&!reducedQuery.matches)selectScene((current+1)%featured.length,{route:'replace'});else{paused=true;status();draw()}});
  on('error',()=>{if(!s.cancelled){s.failure=true;paused=true;stopPlayback(s);status()}});
}
function selectScene(index,{force=false,route='push'}={}){
  if(index===current&&!force){if(active.failure||active.cancelled)selectScene(index,{force:true,route:'replace'});return}
  const previous=current;stopMotion();
  if(active?.ready&&!active.failure){if(rollback)dispose(rollback.session);rollback={session:active,paused};stopPlayback(active);active.video.remove()}
  else if(active)dispose(active);else video.remove();
  current=index;video=document.createElement('video');video.id='sceneVideo';video.playsInline=true;video.preload='auto';video.tabIndex=0;
  video.poster=featured[index].poster;video.muted=!sound;video.setAttribute('aria-label',featured[index].name+'：'+featured[index].summary);
  active={index,video,events:new AbortController(),ready:false,failure:false,cancelled:false,blocked:'',waiting:false,pendingSeek:null,playTicket:0,pendingPlay:false,revealed:false,direction:index>=previous?1:-1};
  bindMedia(active);frame.prepend(video);video.src=featured[index].src;video.load();updateFilm(route,previous<0);
  if(previous>=0)animate($('#projectTitle'),[{transform:`translateX(${active.direction*8}px)`},{transform:'none'}],{duration:220,easing:'cubic-bezier(.22,1,.36,1)'});syncPlayback();
}
function cancelLoad(){
  if(!active)return;stopMotion();
  if(rollback){const saved=rollback;rollback=null;dispose(active);active=saved.session;video=active.video;current=active.index;paused=saved.paused||reducedQuery.matches;video.muted=!sound;frame.prepend(video);updateFilm('replace');syncPlayback()}
  else{active.cancelled=true;active.failure=false;paused=true;stopPlayback(active);video.removeAttribute('src');video.load();draw();status()}
  (tabs[current]||$('#showOverview')).focus({preventScroll:true});
}
function seek(value){const target=Math.max(0,Math.min(filmDuration(),value));if(video.readyState<1)active.pendingSeek=target;else video.currentTime=target;draw()}
$('#mediaCancel').addEventListener('click',cancelLoad);
$('#mediaRetry').addEventListener('click',()=>{if(active.blocked){active.blocked='';paused=false;syncPlayback()}else selectScene(current,{force:true,route:'replace'});$('#motionToggle').focus({preventScroll:true})});
$('#timeline').addEventListener('input',e=>seek(Number(e.target.value)));
$('#motionToggle').addEventListener('click',()=>{if(active.failure||active.cancelled){paused=false;selectScene(current,{force:true,route:'replace'});return}paused=!paused;active.blocked='';if(!paused&&video.ended)seek(0);syncPlayback()});
$('#replay').addEventListener('click',()=>{paused=false;if(active.failure||active.cancelled)selectScene(current,{force:true,route:'replace'});else{seek(0);active.blocked='';syncPlayback()}});
$('#soundToggle').addEventListener('click',()=>{sound=!sound;video.muted=!sound;if(sound){seek(0);paused=false;active.blocked=''}syncPlayback()});
$('#autoNext').addEventListener('click',()=>{if(reducedQuery.matches)return;autoplay=!autoplay;$('#autoNext').setAttribute('aria-pressed',String(autoplay));$('#autoNext span').textContent=autoplay?'开':'关'});
document.addEventListener('keydown',event=>{
  if(dialog.open||event.target.closest('input,textarea,button,a,[contenteditable]'))return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();selectScene((current+(event.key==='ArrowRight'?1:featured.length-1))%featured.length)}else if(event.code==='Space'){event.preventDefault();$('#motionToggle').click()}
});
function openDetail(index){
  const project=projects[index];$('#detailKicker').textContent=project.label;$('#detailTitle').textContent=project.name;$('#detailBody').textContent=project.detail;
  $('#detailPoints').replaceChildren(...project.tags.map(tag=>{const el=document.createElement('span');el.textContent=tag;return el}));if(!dialog.open)dialog.showModal();syncPlayback();
}
$('#projectDetail').addEventListener('click',()=>{if(current===5){$('#archive').scrollIntoView({behavior:reducedQuery.matches?'instant':'smooth'});return}openDetail(projects.findIndex(p=>p.id===featured[current].id))});
$('#showOverview').addEventListener('click',()=>{selectScene(5);paused=false;syncPlayback();cinema.scrollIntoView({behavior:reducedQuery.matches?'instant':'smooth',block:'center'})});
$('#about').addEventListener('click',()=>{
  $('#detailKicker').textContent='QINGYV / PROJECTS IN MOTION';$('#detailTitle').textContent='把想法，做成作品。';
  $('#detailBody').textContent='从音乐创作、策略研究，到日常工作工具。这里用影片展示每个项目的主要功能，也记录它们继续生长的过程。';$('#detailPoints').replaceChildren();if(!dialog.open)dialog.showModal();syncPlayback();
});
document.querySelectorAll('.dialog-close,.dialog-return').forEach(b=>b.addEventListener('click',()=>dialog.close()));dialog.addEventListener('close',syncPlayback);
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
document.addEventListener('visibilitychange',syncPlayback);
const visibilityObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;syncPlayback()},{threshold:.05});visibilityObserver.observe(cinema);
reducedQuery.addEventListener('change',()=>{stopMotion();moveIndicator(true);if(reducedQuery.matches){paused=true;autoplay=false;$('#autoNext span').textContent='关';$('#autoNext').setAttribute('aria-pressed','false')}syncPlayback()});
window.addEventListener('resize',()=>moveIndicator(true));window.addEventListener('pagehide',()=>stopPlayback(active));window.addEventListener('pageshow',syncPlayback);
const routeIndex=()=>{const v=new URL(location.href).searchParams.get('variant');return /^[ABCDEF]$/.test(v)?'ABCDEF'.indexOf(v):5};
window.addEventListener('popstate',()=>selectScene(routeIndex(),{route:'none'}));selectScene(routeIndex(),{route:'replace'});
