const STORAGE_KEY='nhiemvu_sieubiet_public_v2';
function todayISO(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function localDateISO(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function parseISO(iso){ return new Date(String(iso).slice(0,10)+'T00:00:00'); }
function fmtDate(iso){ return parseISO(iso).toLocaleDateString('vi-VN'); }
function uid(prefix='id'){ return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8); }
function safe(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function seedBaoNhi(){
  return {
    children:[{
      id:uid('c'),name:'Bảo Nhi',gender:'female',score:0,highestScore:0,
      tasks:[
        {id:uid('t'),seriesId:null,name:'Đọc 1 câu chuyện',subject:'Tiếng Việt',date:todayISO(),points:10,duration:'15 phút',link:'',instruction:'Đọc to, rõ ràng rồi kể lại cho ba mẹ nghe nhé',done:false,awardedPoints:0,completedAt:null},
        {id:uid('t'),seriesId:null,name:'Ôn bảng cửu chương',subject:'Toán',date:todayISO(),points:10,duration:'10 phút',link:'',instruction:'Đọc thuộc rồi đố nhanh cùng ba mẹ',done:false,awardedPoints:0,completedAt:null},
        {id:uid('t'),seriesId:null,name:'Học 5 từ mới',subject:'Tiếng Anh',date:todayISO(),points:10,duration:'10 phút',link:'',instruction:'Đọc - viết - đặt câu với mỗi từ',done:false,awardedPoints:0,completedAt:null}
      ],
      giftHistory:[],pointHistory:[],
      rewards:[
        {id:uid('r'),name:'Xem tivi 15 phút',cost:20,rule:'Mỗi ngày tối đa 1 lần'},
        {id:uid('r'),name:'Đi công viên',cost:50,rule:'Cuối tuần'},
        {id:uid('r'),name:'Đi siêu thị GO',cost:300,rule:'Cuối tuần'},
        {id:uid('r'),name:'Đi chơi',cost:500,rule:'Dịp cuối tuần hoặc ngày lễ'},
        {id:uid('r'),name:'Quà sinh nhật',cost:1000,rule:'Tích lũy cả năm'}
      ],
      achievements:[
        {id:uid('a'),points:100,title:'Ngôi sao chăm chỉ'},
        {id:uid('a'),points:300,title:'Siêu sao học tập'},
        {id:uid('a'),points:500,title:'Nhà vô địch nhí'}
      ],
      earnedAchievements:[]
    }],
    subjects:['Toán','Tiếng Việt','Tiếng Anh','Kỹ năng sống'],
    parentPassword:'1234',
    exchangeRate:{stars:100,vnd:10000}
  };
}
const defaultData=seedBaoNhi();

function loadData(){
  try{
    // Migrate from previous public key if present.
    const raw=localStorage.getItem(STORAGE_KEY) || localStorage.getItem('nhiemvu_sieubiet_public_clean_v1');
    if(!raw) return structuredClone(defaultData);
    const d=JSON.parse(raw);
    if(!Array.isArray(d.children)) d.children=[];
    if(!Array.isArray(d.subjects)) d.subjects=[];
    if(!d.parentPassword) d.parentPassword='1234';
    if(!d.exchangeRate||!(Number(d.exchangeRate.stars)>0)||!(Number(d.exchangeRate.vnd)>0)) d.exchangeRate={stars:100,vnd:10000};

    const oldRewards=Array.isArray(d.rewards)?d.rewards:[];
    const oldAchievements=Array.isArray(d.achievements)?d.achievements:[];

    d.children.forEach((c,ci)=>{
      if(!c.id)c.id=uid('c');
      if(c.gender!=='male' && c.gender!=='female') c.gender='female';
      if(typeof c.score!=='number')c.score=0;
      if(typeof c.highestScore!=='number') c.highestScore=Math.max(0,c.score);
      if(c.score>c.highestScore) c.highestScore=c.score;
      if(!Array.isArray(c.tasks))c.tasks=[];
      if(!Array.isArray(c.giftHistory))c.giftHistory=[];
      if(!Array.isArray(c.pointHistory))c.pointHistory=[];
      if(!Array.isArray(c.pointHistory))c.pointHistory=[];
      if(!Array.isArray(c.rewards))c.rewards=oldRewards.map(r=>({...r,id:r.id||uid('r')}));
      if(!Array.isArray(c.achievements))c.achievements=oldAchievements.map(a=>({...a,id:a.id||uid('a')}));
      if(!Array.isArray(c.earnedAchievements))c.earnedAchievements=[];

      c.rewards=c.rewards.map(r=>({id:r.id||uid('r'),name:String(r.name||''),cost:Number(r.cost||0),rule:String(r.rule||'')}));
      c.achievements=c.achievements.map(a=>({id:a.id||uid('a'),points:Number(a.points||0),title:String(a.title||'')}));

      c.tasks.forEach((t,i)=>{
        if(!t.id)t.id=uid('t');
        t.date=String(t.date||todayISO()).slice(0,10);
        t.points=Number(t.points||0);
        t.done=!!t.done;
        if(t.done && typeof t.awardedPoints!=='number')t.awardedPoints=t.points;
        if(!t.done)t.awardedPoints=0;
        if(!('completedAt' in t))t.completedAt=null;
      });
    });
    delete d.rewards;
    delete d.achievements;
    return d;
  }catch(e){
    return structuredClone(defaultData);
  }
}

let data=loadData();
let currentChildId=data.children[0]?.id||null;
let currentSection='today';
let calendarCursor=new Date();
let selectedCalendarDate=todayISO();
let selectedParentTaskDate='';
let confirmCallback=null;

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}
function child(){return data.children.find(c=>c.id===currentChildId)||null}
function childIcon(c){return c?.gender==='male'?'👦':'👧'}
function ensureCurrentChild(){
  if(!currentChildId && data.children.length)currentChildId=data.children[0].id;
  if(currentChildId && !data.children.some(c=>c.id===currentChildId))currentChildId=data.children[0]?.id||null;
}
function logPoint(c,type,amount,reason=''){
  if(!Array.isArray(c.pointHistory))c.pointHistory=[];
  c.pointHistory.push({id:uid('p'),type,amount:Number(amount||0),reason,at:new Date().toISOString()});
}
function updateEarnedAchievements(c){
  if(!c)return;
  if(!Array.isArray(c.earnedAchievements))c.earnedAchievements=[];
  if(typeof c.highestScore!=='number') c.highestScore=Math.max(0,Number(c.score||0));
  if(Number(c.score||0)>c.highestScore) c.highestScore=Number(c.score||0);

  // Thành tích xét theo mốc điểm cao nhất bé đã từng đạt.
  // Khi đổi quà / bị trừ điểm, danh hiệu đã nhận vẫn được giữ nguyên.
  (c.achievements||[]).forEach(a=>{
    if(c.highestScore>=Number(a.points||0) && !c.earnedAchievements.includes(a.id)){
      c.earnedAchievements.push(a.id);
    }
  });
}

function askConfirm(title,message,onYes,{yesText='Có, xác nhận',icon='❓'}={}){
  confirmCallback=onYes;
  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMessage').textContent=message;
  document.getElementById('confirmIcon').textContent=icon;
  document.getElementById('confirmYesButton').textContent=yesText;
  document.getElementById('confirmModal').classList.add('show');
}
function closeConfirm(confirmed){
  document.getElementById('confirmModal').classList.remove('show');
  const cb=confirmCallback;
  confirmCallback=null;
  if(confirmed && typeof cb==='function')cb();
}

document.querySelectorAll('nav a[data-section]').forEach(a=>{
  a.addEventListener('click',e=>{e.preventDefault();showSection(a.dataset.section)});
});
function showSection(name){
  currentSection=name;
  document.querySelectorAll('.app-section').forEach(s=>s.classList.remove('active'));
  document.getElementById(name+'Section')?.classList.add('active');
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.section===name));
  render();
}

function render(){
  ensureCurrentChild();
  renderChildSwitch();
  renderParentSelectors();
  renderToday();
  renderAchievements();
  renderRewards();
  renderCalendar();
  renderManagers();
}

function renderChildSwitch(){
  const box=document.getElementById('childSwitch');
  box.innerHTML='';
  data.children.forEach(c=>{
    const b=document.createElement('button');
    b.textContent=childIcon(c)+' '+c.name;
    b.classList.toggle('active',c.id===currentChildId);
    b.onclick=()=>{currentChildId=c.id;selectedCalendarDate=todayISO();selectedParentTaskDate='';render()};
    box.appendChild(b);
  });
}

function taskCard(c,t,allowPast=true){
  const el=document.createElement('div');
  el.className='task'+(t.done?' done':'');
  const left=document.createElement('div');
  left.innerHTML='<b>'+safe(t.name)+'</b><div class="meta">'+safe(t.subject||'')+(t.duration?' • '+safe(t.duration):'')+(t.instruction?' • '+safe(t.instruction):'')+'</div>';
  const actions=document.createElement('div');actions.className='actions';
  if(t.link){
    const a=document.createElement('a');a.className='linkbtn open';a.href=t.link;a.target='_blank';a.rel='noopener';a.textContent='Mở tài liệu';
    actions.appendChild(a);
  }
  left.appendChild(actions);

  const finish=document.createElement('button');
  finish.className='btn finish'+(t.done?' done':'');
  finish.textContent=t.done?'↩ Bỏ hoàn thành':('+'+t.points+' ⭐ Hoàn thành');
  finish.onclick=()=>toggleTaskCompletion(c.id,t.id);

  el.append(left,finish);
  return el;
}

function renderToday(){
  const c=child(),list=document.getElementById('taskList');
  if(!c){
    document.getElementById('hello').textContent='Chào con 👋';
    document.getElementById('heroText').textContent='Phụ huynh chưa tạo hồ sơ cho bé.';
    document.getElementById('score').textContent='0';document.getElementById('count').textContent='0/0';
    document.getElementById('bar').style.width='0%';document.getElementById('taskTitle').textContent='📚 Nhiệm vụ hôm nay';
    document.getElementById('goalName').textContent='bé';document.getElementById('goalScore').textContent='0';document.getElementById('moneyEquiv').textContent='0 đ';
    list.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>';return;
  }
  const today=todayISO();
  const tasks=c.tasks.filter(t=>t.date===today);
  const done=tasks.filter(t=>t.done).length;
  document.getElementById('hello').textContent='Chào '+childIcon(c)+' '+c.name+' 👋';
  document.getElementById('heroText').textContent=tasks.length?`Hôm nay con có ${tasks.length} nhiệm vụ.`:'Hôm nay chưa có nhiệm vụ nào được giao.';
  document.getElementById('score').textContent=c.score;
  document.getElementById('count').textContent=done+'/'+tasks.length;
  document.getElementById('bar').style.width=(tasks.length?done/tasks.length*100:0)+'%';
  document.getElementById('taskTitle').textContent='📚 Nhiệm vụ hôm nay của '+childIcon(c)+' '+c.name;
  document.getElementById('goalName').textContent=childIcon(c)+' '+c.name;document.getElementById('goalScore').textContent=c.score;document.getElementById('moneyEquiv').textContent=fmtVND(starsToVND(c.score));
  list.innerHTML='';
  if(!tasks.length){list.innerHTML='<div class="empty">Hôm nay chưa có nhiệm vụ nào.</div>';return}
  tasks.forEach(t=>list.appendChild(taskCard(c,t)));
}

function toggleTaskCompletion(childId,taskId){
  const c=data.children.find(x=>x.id===childId);if(!c)return;
  const t=c.tasks.find(x=>x.id===taskId);if(!t)return;
  if(!t.done){
    askConfirm('Xác nhận hoàn thành',`Con chắc chắn đã hoàn thành nhiệm vụ "${t.name}" chưa?`,()=>{
      t.done=true;t.awardedPoints=Number(t.points||0);t.completedAt=new Date().toISOString();
      c.score+=t.awardedPoints;logPoint(c,'task',t.awardedPoints,'Hoàn thành: '+t.name);
      updateEarnedAchievements(c);save();render();
    },{yesText:'Có, con đã hoàn thành',icon:'✅'});
  }else{
    askConfirm('Bỏ hoàn thành',`Con có chắc đã tích nhầm và muốn bỏ hoàn thành nhiệm vụ "${t.name}" không? Điểm của nhiệm vụ sẽ bị trừ lại.`,()=>{
      const back=Number(t.awardedPoints??t.points??0);
      c.score-=back;logPoint(c,'undo-task',-back,'Bỏ hoàn thành: '+t.name);
      t.done=false;t.awardedPoints=0;t.completedAt=null;save();render();
    },{yesText:'Có, bỏ hoàn thành',icon:'↩️'});
  }
}

function renderAchievements(){
  const c=child();
  document.getElementById('achievementName').textContent=c?(childIcon(c)+' '+c.name):'bé';
  document.getElementById('completedCount').textContent=c?c.tasks.filter(t=>t.done).length:0;
  document.getElementById('achievementScore').textContent=c?.score||0;
  const box=document.getElementById('earnedAchievements');box.innerHTML='';
  if(!c){box.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>'}
  else{
    updateEarnedAchievements(c);
    const earned=(c.achievements||[]).filter(a=>c.earnedAchievements.includes(a.id)).sort((a,b)=>a.points-b.points);
    if(!earned.length)box.innerHTML='<div class="empty">Chưa đạt mốc thành tích nào.</div>';
    else earned.forEach((a,i)=>{
      const row=document.createElement('div');row.className='day-task';
      row.innerHTML=`<div style="display:flex;justify-content:space-between;gap:12px"><div><b>🏅 ${safe(a.title)}</b><div class="note">Thành tích số ${i+1}</div></div><b style="color:var(--brand)">${a.points} ⭐</b></div>`;
      box.appendChild(row);
    });
  }
  const gt=document.getElementById('totalGiftsReceived'),gs=document.getElementById('giftAchievementStats');
  gt.textContent=c?.giftHistory?.length||0;
  gs.innerHTML='';

  // QUÀ ĐÃ ĐẠT ĐƯỢC - xử lý độc lập, không được dừng render phần điểm phạt
  if(!c || !Array.isArray(c.giftHistory) || !c.giftHistory.length){
    gs.innerHTML='<div class="empty">Con chưa đổi phần quà nào.</div>';
  }else{
    const grouped={};
    c.giftHistory.forEach(g=>{
      const key=g.rewardId||g.name;
      if(!grouped[key])grouped[key]={name:g.name,count:0,totalPoints:0};
      grouped[key].count++;
      grouped[key].totalPoints+=Number(g.cost||0);
    });

    Object.values(grouped).forEach(g=>{
      const row=document.createElement('div');
      row.className='day-task';
      row.innerHTML=`<div style="display:flex;justify-content:space-between;gap:12px"><div><b>🎁 ${safe(g.name)}</b><div class="note">Tổng điểm đã dùng: ${g.totalPoints} ⭐</div></div><b style="color:var(--brand)">${g.count} lần</b></div>`;
      gs.appendChild(row);
    });
  }

  // NHẮC NHỞ / ĐIỂM PHẠT - riêng từng bé
  const penaltyCountEl=document.getElementById('penaltyCount');
  const penaltyTotalEl=document.getElementById('penaltyTotal');
  const penaltyBox=document.getElementById('penaltyAchievementStats');

  const penalties=(Array.isArray(c?.pointHistory)?c.pointHistory:[])
    .filter(p=>{
      const type=String(p.type||'').toLowerCase();
      return type==='penalty' || type==='phat' || type==='penalty-score';
    })
    .slice()
    .reverse();

  if(penaltyCountEl) penaltyCountEl.textContent=penalties.length;
  if(penaltyTotalEl) penaltyTotalEl.textContent=penalties.reduce((sum,p)=>sum+Math.abs(Number(p.amount||0)),0);

  if(penaltyBox){
    penaltyBox.innerHTML='';
    if(!c){
      penaltyBox.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>';
    }else if(!penalties.length){
      penaltyBox.innerHTML='<div class="empty">Con chưa có lần nhắc nhở nào. Tiếp tục phát huy nhé! 🌟</div>';
    }else{
      penalties.forEach((p,index)=>{
        const row=document.createElement('div');
        row.className='day-task penalty';
        const when=p.at ? new Date(p.at).toLocaleString('vi-VN') : '';
        row.innerHTML=
          '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">'+
            '<div><b>⚠️ Nhắc nhở '+(penalties.length-index)+'</b>'+
            '<div class="note">'+safe(p.reason||'Cần chú ý hơn ở lần sau')+'</div>'+
            (when?'<div class="note">'+safe(when)+'</div>':'')+
            '</div>'+
            '<b style="color:var(--danger)">-'+Math.abs(Number(p.amount||0))+' ⭐</b>'+
          '</div>';
        penaltyBox.appendChild(row);
      });
    }
  }
}

function currentRewards(){return child()?.rewards||[]}

// 💱 Quy đổi sao ra tiền mặt: tỷ giá mặc định 100 ⭐ = 10.000đ, thang tự sinh tới 10.000 ⭐.
const MAX_MONEY_STARS=10000;
function exchangeRate(){
  const r=data.exchangeRate;
  if(r&&Number(r.stars)>0&&Number(r.vnd)>0) return r;
  return {stars:100,vnd:10000};
}
function fmtVND(n){return Math.floor(Number(n||0)).toLocaleString('vi-VN')+' đ'}
// Đường cong giảm dần: giữ chuẩn (100 ⭐ = 10.000đ), mốc càng cao giá mỗi sao càng giảm.
// Khích lệ con tích lũy lên mốc lớn mà tổng tiền vẫn hợp lý (10.000 ⭐ ≈ 158.000đ).
const DIMINISH_POWER=0.6, VND_ROUND=1000;
function starsToVND(stars){
  const r=exchangeRate(),s=Number(stars||0);
  if(!(s>0)) return 0;
  const base=Number(r.vnd)*Math.pow(s/Number(r.stars),DIMINISH_POWER);
  return Math.floor((base*(1+1e-9))/VND_ROUND)*VND_ROUND;
}
function moneyTiers(){
  // Nhiều mốc nhỏ để con thấy động lực: 100→1000 mỗi 100 sao, sau đó tới 10.000 sao.
  const steps=[];
  for(let s=100;s<=1000;s+=100) steps.push(s);
  [1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000].forEach(s=>steps.push(s));
  return steps.filter(s=>s<=MAX_MONEY_STARS).map(s=>({stars:s,vnd:starsToVND(s),name:'Tiền thưởng '+fmtVND(starsToVND(s))}));
}
function renderMoneyBlock(box){
  const tiers=moneyTiers(),r=exchangeRate();
  const head=document.createElement('div');head.className='note';head.style.margin='14px 0 6px';
  head.innerHTML='<b>💱 Đổi sao ra tiền mặt</b> (chuẩn '+r.stars+' ⭐ = '+fmtVND(r.vnd)+' • mốc cao giá mỗi sao giảm dần để khích lệ tích lũy)';
  box.appendChild(head);
  tiers.forEach(t=>{
    const eff=Math.round(t.vnd/t.stars);
    const row=document.createElement('div');row.className='gift';
    row.innerHTML='<div class="emoji">💰</div><div class="grow"><b>'+safe(t.name)+'</b><div class="pts">'+t.stars.toLocaleString('vi-VN')+' ⭐</div><div class="note">≈ '+eff.toLocaleString('vi-VN')+'đ/sao</div></div>';
    const b=document.createElement('button');b.textContent='Đổi';b.onclick=()=>redeemMoney(t);
    row.appendChild(b);box.appendChild(row);
  });
}
function redeemMoney(t){
  const c=child();if(!c)return;
  if(c.score<t.stars){
    document.getElementById('missingPoints').textContent=(t.stars-c.score).toLocaleString('vi-VN');
    document.getElementById('encourageModal').classList.add('show');return;
  }
  askConfirm('Xác nhận đổi tiền','Con chắc chắn muốn đổi '+t.stars.toLocaleString('vi-VN')+' sao ra '+t.name+' không?',()=>{
    if(!Array.isArray(c.giftHistory))c.giftHistory=[];
    if(!Array.isArray(c.pointHistory))c.pointHistory=[];
    c.giftHistory.push({id:uid('g'),rewardId:'money_'+t.stars,name:t.name,cost:t.stars,receivedAt:new Date().toISOString()});
    c.score-=t.stars;logPoint(c,'reward',-t.stars,'Đổi sao ra tiền: '+t.name);
    save();render();
    document.getElementById('successGiftName').textContent=t.name;
    document.getElementById('successGiftPoints').textContent=t.stars.toLocaleString('vi-VN');
    document.getElementById('rewardSuccessModal').classList.add('show');
  },{yesText:'Có, con muốn đổi',icon:'💰'});
}
function saveExchangeRate(){
  const s=Number(document.getElementById('rateStars').value||0),v=Number(document.getElementById('rateVnd').value||0);
  if(!(s>0)||!(v>0))return alert('Hãy nhập tỷ giá hợp lệ (số dương).');
  askConfirm('Lưu tỷ giá','Đặt tỷ giá '+s+' sao = '+fmtVND(v)+' nhé? Cửa hàng đổi tiền sẽ tự cập nhật.',()=>{
    data.exchangeRate={stars:s,vnd:v};save();render();
  },{yesText:'Có, lưu tỷ giá',icon:'💱'});
}
function renderRateManager(){
  const rs=document.getElementById('rateStars'),rv=document.getElementById('rateVnd'),rc=document.getElementById('rateCurrent');
  if(!rs||!rv||!rc)return;
  const r=exchangeRate();
  if(document.activeElement!==rs)rs.value=r.stars;
  if(document.activeElement!==rv)rv.value=r.vnd;
  rc.textContent='Tỷ giá chuẩn: '+r.stars+' ⭐ = '+fmtVND(r.vnd)+' • Mốc cao nhất '+MAX_MONEY_STARS.toLocaleString('vi-VN')+' ⭐ ≈ '+fmtVND(starsToVND(MAX_MONEY_STARS))+'.';
}
function renderRewards(){
  const c=child();document.getElementById('rewardNameChild').textContent=c?(childIcon(c)+' '+c.name):'bé';
  ['rewardShopToday','rewardShopStandalone'].forEach(id=>{
    const box=document.getElementById(id);box.innerHTML='';
    const rewards=currentRewards();
    if(!rewards.length){
      const e=document.createElement('div');e.className='empty';e.textContent='Chưa có phần quà nào được thiết lập cho bé này.';
      box.appendChild(e);
    }else rewards.forEach(r=>{
      const row=document.createElement('div');row.className='gift';
      row.innerHTML=`<div class="emoji">🎁</div><div class="grow"><b>${safe(r.name)}</b><div class="pts">${r.cost} ⭐</div>${r.rule?'<div class="note">'+safe(r.rule)+'</div>':''}</div>`;
      const b=document.createElement('button');b.textContent='Đổi';b.onclick=()=>redeem(r);
      row.appendChild(b);box.appendChild(row);
    });
    if(c) renderMoneyBlock(box);
  });
}
function redeem(r){
  const c=child();if(!c)return;
  if(c.score<r.cost){
    document.getElementById('missingPoints').textContent=r.cost-c.score;
    document.getElementById('encourageModal').classList.add('show');return;
  }
  askConfirm('Xác nhận đổi quà',`Con chắc chắn muốn đổi "${r.name}" với ${r.cost} điểm không?`,()=>{
    if(!Array.isArray(c.giftHistory))c.giftHistory=[];
      if(!Array.isArray(c.pointHistory))c.pointHistory=[];
    c.giftHistory.push({id:uid('g'),rewardId:r.id,name:r.name,cost:Number(r.cost||0),receivedAt:new Date().toISOString()});
    c.score-=Number(r.cost||0);logPoint(c,'reward',-Number(r.cost||0),'Đổi quà: '+r.name);
    // Không giảm highestScore và không xóa earnedAchievements khi đổi quà.
    save();render();
    document.getElementById('successGiftName').textContent=r.name;
    document.getElementById('successGiftPoints').textContent=r.cost;
    document.getElementById('rewardSuccessModal').classList.add('show');
  },{yesText:'Có, con muốn đổi',icon:'🎁'});
}
function closeRewardSuccess(){document.getElementById('rewardSuccessModal').classList.remove('show')}
function closeEncourage(){document.getElementById('encourageModal').classList.remove('show')}

function renderCalendar(){
  const c=child();document.getElementById('scheduleName').textContent=c?(childIcon(c)+' '+c.name):'bé';
  const grid=document.getElementById('calendarGrid');grid.innerHTML='';
  ['T2','T3','T4','T5','T6','T7','CN'].forEach(x=>{const d=document.createElement('div');d.className='weekday';d.textContent=x;grid.appendChild(d)});
  const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth();
  document.getElementById('calendarTitle').textContent='Tháng '+(m+1)+' / '+y;
  const first=new Date(y,m,1),last=new Date(y,m+1,0),offset=(first.getDay()+6)%7,total=Math.ceil((offset+last.getDate())/7)*7;
  for(let i=0;i<total;i++){
    const n=i-offset+1,d=document.createElement('button');d.className='day';
    if(n<1||n>last.getDate()){d.classList.add('muted');d.disabled=true}
    else{
      const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(n).padStart(2,'0')}`;d.textContent=n;
      if(c?.tasks.some(t=>t.date===iso)){d.classList.add('has-task');const dot=document.createElement('span');dot.className='dot';d.appendChild(dot)}
      if(iso===selectedCalendarDate)d.classList.add('selected');
      d.onclick=()=>{selectedCalendarDate=iso;renderCalendar()};
    }
    grid.appendChild(d);
  }
  renderDayTasks();
}
function changeMonth(delta){
  calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()+delta,1);
  selectedCalendarDate=localDateISO(calendarCursor);renderCalendar();
}
function renderDayTasks(){
  const box=document.getElementById('dayTasks'),c=child();
  box.innerHTML='<h3>Nhiệm vụ ngày '+fmtDate(selectedCalendarDate)+'</h3>';
  if(!c){box.innerHTML+='<div class="empty">Chưa có hồ sơ bé.</div>';return}
  const tasks=c.tasks.filter(t=>t.date===selectedCalendarDate);
  if(!tasks.length){box.innerHTML+='<div class="empty">Không có nhiệm vụ trong ngày này.</div>';return}
  tasks.forEach(t=>{
    const d=document.createElement('div');d.className='day-task';
    d.innerHTML=`<b>${safe(t.name)}</b><div class="meta">${safe(t.subject||'')}${t.duration?' • '+safe(t.duration):''}</div>`;
    const actions=document.createElement('div');actions.className='task-history-actions';
    if(t.link){const a=document.createElement('a');a.className='linkbtn open';a.href=t.link;a.target='_blank';a.textContent='Mở tài liệu';actions.appendChild(a)}
    const b=document.createElement('button');b.className='btn finish'+(t.done?' done':'');b.textContent=t.done?'↩ Bỏ hoàn thành':'✅ Xác nhận hoàn thành';b.onclick=()=>toggleTaskCompletion(c.id,t.id);actions.appendChild(b);
    d.appendChild(actions);box.appendChild(d);
  });
}

function openParentModal(){document.getElementById('parentModal').classList.add('show')}
function closeParentModal(){
  document.getElementById('parentModal').classList.remove('show');
  document.getElementById('parentArea').style.display='none';document.getElementById('parentLogin').style.display='block';document.getElementById('parentPasswordInput').value='';
}
function unlockParent(){
  const input=document.getElementById('parentPasswordInput'),v=input.value;
  if(v==='****'){
    const p=prompt('Đặt mật khẩu phụ huynh mới (tối thiểu 4 ký tự):');if(p===null)return;
    if(p.trim().length<4){alert('Mật khẩu mới cần ít nhất 4 ký tự.');return}
    const p2=prompt('Nhập lại mật khẩu mới để xác nhận:');if(p2!==p.trim()){alert('Hai lần nhập không khớp.');return}
    data.parentPassword=p.trim();save();input.value='';alert('Đã cài lại mật khẩu.');return;
  }
  if(v!==data.parentPassword){alert('Mật khẩu không đúng.');return}
  document.getElementById('parentLogin').style.display='none';document.getElementById('parentArea').style.display='block';input.value='';renderManagers();
}
function changePassword(){
  const oldp=document.getElementById('oldPassword').value,newp=document.getElementById('newPassword').value.trim();
  if(oldp!==data.parentPassword){alert('Mật khẩu hiện tại không đúng.');return}
  if(newp.length<4){alert('Mật khẩu mới cần ít nhất 4 ký tự.');return}
  askConfirm('Đổi mật khẩu','Phụ huynh chắc chắn muốn đổi mật khẩu?',()=>{
    data.parentPassword=newp;save();document.getElementById('oldPassword').value='';document.getElementById('newPassword').value='';alert('Đã đổi mật khẩu.');
  },{yesText:'Có, đổi mật khẩu',icon:'🔑'});
}

function fillChildSelect(sel,includeAll=false){
  const prev=sel.value;sel.innerHTML='';
  data.children.forEach(c=>sel.add(new Option(childIcon(c)+' '+c.name,c.id)));
  if(includeAll&&data.children.length>=1)sel.add(new Option('👨‍👩‍👧‍👦 Tất cả các con','all'));
  if(!data.children.length)sel.add(new Option('Chưa có bé',''));
  if([...sel.options].some(o=>o.value===prev))sel.value=prev;
}
function renderParentSelectors(){
  const assign=document.getElementById('assignTo'),bonus=document.getElementById('bonusTarget'),penalty=document.getElementById('penaltyTarget'),
        subject=document.getElementById('subject'),editChild=document.getElementById('editParentChild'),
        rewardTarget=document.getElementById('rewardTarget'),achievementTarget=document.getElementById('achievementTarget');
  fillChildSelect(assign,true);fillChildSelect(bonus);fillChildSelect(penalty);fillChildSelect(editChild);fillChildSelect(rewardTarget,true);fillChildSelect(achievementTarget,true);
  if(editChild && !editChild.value && currentChildId)editChild.value=currentChildId;
  if(rewardTarget && !rewardTarget.value && currentChildId)rewardTarget.value=currentChildId;
  if(achievementTarget && !achievementTarget.value && currentChildId)achievementTarget.value=currentChildId;
  const prev=subject.value;subject.innerHTML='';data.subjects.forEach(s=>subject.add(new Option(s,s)));
  if(!data.subjects.length)subject.add(new Option('Chưa có môn học',''));
  if([...subject.options].some(o=>o.value===prev))subject.value=prev;
  renderParentTaskDates();
}

function renderManagers(){
  renderParentSelectors();

  const cm=document.getElementById('childManager');cm.innerHTML='';
  if(!data.children.length)cm.innerHTML='<div class="empty">Chưa có hồ sơ bé nào.</div>';
  data.children.forEach(c=>{
    const row=document.createElement('div');row.className='manager-row';
    const inp=document.createElement('input');inp.value=c.name;inp.style.maxWidth='240px';

    const genderSel=document.createElement('select');
    genderSel.style.maxWidth='150px';
    genderSel.add(new Option('Nữ 👧','female'));
    genderSel.add(new Option('Nam 👦','male'));
    genderSel.value=c.gender||'female';

    const saveB=document.createElement('button');saveB.className='primary';saveB.textContent='Lưu hồ sơ';
    saveB.onclick=()=>{
      const n=inp.value.trim();
      if(!n)return alert('Tên bé không được để trống.');
      const g=genderSel.value;
      askConfirm('Lưu hồ sơ bé',`Lưu tên "${n}" và giới tính ${g==='male'?'Nam':'Nữ'}?`,()=>{
        c.name=n;
        c.gender=g;
        save();
        render();
      },{yesText:'Có, lưu hồ sơ',icon:g==='male'?'👦':'👧'});
    };

    const del=document.createElement('button');del.className='btn delete';del.textContent='🗑 Xóa bé';del.onclick=()=>removeChild(c.id);
    row.append(inp,genderSel,saveB,del);cm.appendChild(row);
  });

  const sm=document.getElementById('subjectManager');sm.innerHTML='';
  if(!data.subjects.length)sm.innerHTML='<div class="empty">Chưa có môn học nào.</div>';
  data.subjects.forEach((s,i)=>{
    const chip=document.createElement('span');chip.className='subject-chip';chip.innerHTML='<span>📘 '+safe(s)+'</span>';
    const b=document.createElement('button');b.textContent='×';b.onclick=()=>askConfirm('Xóa môn học',`Xóa môn "${s}"?`,()=>{data.subjects.splice(i,1);save();render()},{yesText:'Có, xóa',icon:'🗑️'});
    chip.appendChild(b);sm.appendChild(chip);
  });

  renderRewardManager();
  renderAchievementManager();
  renderRateManager();
}

function selectedRewardChild(){
  const id=document.getElementById('rewardTarget')?.value||currentChildId;
  if(id==='all') return null;
  return data.children.find(c=>c.id===id)||null;
}
function renderRewardManager(){
  const rm=document.getElementById('rewardManager');if(!rm)return;rm.innerHTML='';
  const rewardTargetId=document.getElementById('rewardTarget')?.value;
  if(rewardTargetId==='all'){
    rm.innerHTML='<div class="empty">Đang chọn TẤT CẢ CÁC CON. Hãy dùng phần thêm quà phía trên để tạo cùng một quà cho tất cả các bé. Muốn sửa/xóa, hãy chọn từng bé.</div>';
    return;
  }
  const c=selectedRewardChild();if(!c){rm.innerHTML='<div class="empty">Chưa có bé.</div>';return}
  if(!c.rewards.length)rm.innerHTML='<div class="empty">Bé này chưa có quà tặng nào.</div>';
  c.rewards.forEach((r,i)=>{
    const item=document.createElement('div');item.className='compact-item';
    const head=document.createElement('div');head.className='compact-head';head.innerHTML=`<div class="compact-title">🎁 ${safe(r.name)}</div><div class="compact-points">${r.cost} ⭐</div>`;head.onclick=()=>item.classList.toggle('open');
    const body=document.createElement('div');body.className='compact-body';
    const grid=document.createElement('div');grid.className='formgrid';
    const n=document.createElement('input');n.value=r.name;const cost=document.createElement('input');cost.type='number';cost.value=r.cost;const rule=document.createElement('input');rule.value=r.rule||'';
    grid.innerHTML='<div><div class="note">Tên quà</div></div><div><div class="note">Điểm đổi</div></div><div style="grid-column:1/-1"><div class="note">Quy định</div></div>';
    grid.children[0].appendChild(n);grid.children[1].appendChild(cost);grid.children[2].appendChild(rule);
    const acts=document.createElement('div');acts.className='actions';
    const saveB=document.createElement('button');saveB.className='primary';saveB.textContent='Lưu chỉnh sửa';saveB.onclick=e=>{e.stopPropagation();const nn=n.value.trim(),cc=Number(cost.value||0);if(!nn||cc<=0)return alert('Thông tin chưa hợp lệ.');askConfirm('Lưu quà tặng',`Lưu chỉnh sửa quà "${nn}"?`,()=>{c.rewards[i]={...r,name:nn,cost:cc,rule:rule.value.trim()};save();render()},{yesText:'Có, lưu',icon:'🎁'})};
    const del=document.createElement('button');del.className='btn delete';del.textContent='🗑 Xóa quà';del.onclick=e=>{e.stopPropagation();askConfirm('Xóa quà',`Xóa "${r.name}" khỏi danh sách quà của ${c.name}?`,()=>{c.rewards.splice(i,1);save();render()},{yesText:'Có, xóa',icon:'🗑️'})};
    acts.append(saveB,del);body.append(grid,acts);item.append(head,body);rm.appendChild(item);
  });
}

function selectedAchievementChild(){
  const id=document.getElementById('achievementTarget')?.value||currentChildId;
  if(id==='all') return null;
  return data.children.find(c=>c.id===id)||null;
}
function renderAchievementManager(){
  const am=document.getElementById('achievementManager');if(!am)return;am.innerHTML='';
  const achievementTargetId=document.getElementById('achievementTarget')?.value;
  if(achievementTargetId==='all'){
    am.innerHTML='<div class="empty">Đang chọn TẤT CẢ CÁC CON. Hãy dùng phần thêm mốc phía trên để tạo cùng một mốc cho tất cả các bé. Muốn sửa/xóa, hãy chọn từng bé.</div>';
    return;
  }
  const c=selectedAchievementChild();if(!c){am.innerHTML='<div class="empty">Chưa có bé.</div>';return}
  if(!c.achievements.length)am.innerHTML='<div class="empty">Bé này chưa có mốc thành tích nào.</div>';
  c.achievements.map((a,idx)=>({a,idx})).sort((x,y)=>x.a.points-y.a.points).forEach(({a,idx})=>{
    const item=document.createElement('div');item.className='compact-item';
    const head=document.createElement('div');head.className='compact-head';head.innerHTML=`<div class="compact-title">🏅 ${safe(a.title)}</div><div class="compact-points">${a.points} ⭐</div>`;head.onclick=()=>item.classList.toggle('open');
    const body=document.createElement('div');body.className='compact-body';
    const grid=document.createElement('div');grid.className='formgrid';const pts=document.createElement('input');pts.type='number';pts.value=a.points;const title=document.createElement('input');title.value=a.title;
    grid.innerHTML='<div><div class="note">Mốc điểm</div></div><div><div class="note">Tên thành tích</div></div>';grid.children[0].appendChild(pts);grid.children[1].appendChild(title);
    const acts=document.createElement('div');acts.className='actions';
    const saveB=document.createElement('button');saveB.className='primary';saveB.textContent='Lưu chỉnh sửa';saveB.onclick=e=>{e.stopPropagation();const p=Number(pts.value||0),t=title.value.trim();if(p<=0||!t)return alert('Thông tin chưa hợp lệ.');askConfirm('Lưu thành tích',`Lưu mốc "${t}" ở ${p} điểm?`,()=>{c.achievements[idx]={...a,points:p,title:t};updateEarnedAchievements(c);save();render()},{yesText:'Có, lưu',icon:'🏅'})};
    const del=document.createElement('button');del.className='btn delete';del.textContent='🗑 Xóa';del.onclick=e=>{e.stopPropagation();askConfirm('Xóa thành tích',`Xóa mốc "${a.title}" của ${c.name}?`,()=>{c.achievements.splice(idx,1);c.earnedAchievements=c.earnedAchievements.filter(id=>id!==a.id);save();render()},{yesText:'Có, xóa',icon:'🗑️'})};
    acts.append(saveB,del);body.append(grid,acts);item.append(head,body);am.appendChild(item);
  });
}

function renderParentTaskDates(){
  const childId=document.getElementById('editParentChild')?.value,bar=document.getElementById('parentTaskDateBar'),list=document.getElementById('parentTaskList');
  if(!bar||!list)return;bar.innerHTML='';list.innerHTML='';
  const c=data.children.find(x=>x.id===childId);if(!c){bar.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>';return}
  const dates=[...new Set(c.tasks.map(t=>t.date).filter(Boolean))].sort();
  if(!dates.length){bar.innerHTML='<div class="empty">Chưa có ngày nào có nhiệm vụ.</div>';list.innerHTML='<div class="empty">Chưa có nhiệm vụ đã giao.</div>';return}
  if(!selectedParentTaskDate||!dates.includes(selectedParentTaskDate))selectedParentTaskDate=dates[0];
  dates.forEach(d=>{const b=document.createElement('button');b.className='parent-task-datebtn'+(d===selectedParentTaskDate?' active':'');b.textContent=fmtDate(d);b.onclick=()=>{selectedParentTaskDate=d;renderParentTaskDates()};bar.appendChild(b)});
  renderParentTasksForDate();
}

function renderParentTasksForDate(){
  const childId=document.getElementById('editParentChild')?.value,list=document.getElementById('parentTaskList');if(!list)return;
  const c=data.children.find(x=>x.id===childId);if(!c)return;
  const tasks=c.tasks.filter(t=>t.date===selectedParentTaskDate);list.innerHTML='';
  if(!tasks.length){list.innerHTML='<div class="empty">Không có nhiệm vụ trong ngày này.</div>';return}
  tasks.forEach(t=>{
    const item=document.createElement('div');item.className='parent-task-item';
    const head=document.createElement('div');head.className='parent-task-head';head.innerHTML=`<div><b>${safe(t.name)}</b><div class="note">${safe(t.subject||'')}</div></div><div class="note">${t.done?'✅ Đã hoàn thành':'⏳ Chưa hoàn thành'}</div>`;head.onclick=()=>item.classList.toggle('open');
    const body=document.createElement('div');
    body.className='parent-task-body';

    // Nhiệm vụ đã hoàn thành: khóa chỉnh sửa/xóa để bảo toàn điểm đã nhận.
    if(t.done){
      body.innerHTML=
        '<div class="repeat-note">'+
          '<b>🔒 Nhiệm vụ đã hoàn thành</b><br>'+
          'Nhiệm vụ này đã được xác nhận hoàn thành nên không thể chỉnh sửa hoặc xóa. '+
          'Điểm đã nhận của con được giữ nguyên.'+
        '</div>';
      item.append(head,body);
      list.appendChild(item);
      return;
    }

    const grid=document.createElement('div');grid.className='formgrid';
    const name=document.createElement('input');name.value=t.name||'';
    const subject=document.createElement('select');
    data.subjects.forEach(s=>subject.add(new Option(s,s)));
    subject.value=t.subject||'';
    const date=document.createElement('input');date.type='date';date.value=t.date;
    const points=document.createElement('input');points.type='number';points.value=t.points;
    const duration=document.createElement('select');
    for(let m=5;m<=60;m+=5) duration.add(new Option(m+' phút',m+' phút'));
    if(t.duration && ![...duration.options].some(o=>o.value===t.duration)) duration.add(new Option(t.duration,t.duration));
    duration.value=t.duration||'15 phút';
    const link=document.createElement('input');link.value=t.link||'';
    const instruction=document.createElement('textarea');instruction.value=t.instruction||'';

    grid.innerHTML='<div><div class="note">Tên nhiệm vụ</div></div><div><div class="note">Môn học</div></div><div><div class="note">Ngày giao</div></div><div><div class="note">Điểm</div></div><div><div class="note">Thời lượng</div></div><div><div class="note">Link</div></div><div style="grid-column:1/-1"><div class="note">Hướng dẫn</div></div>';
    [name,subject,date,points,duration,link,instruction].forEach((el,i)=>grid.children[i].appendChild(el));

    const acts=document.createElement('div');acts.className='actions';

    // Lưu riêng nhiệm vụ chưa hoàn thành của ngày đang chọn
    const saveB=document.createElement('button');
    saveB.className='primary';
    saveB.textContent='Lưu riêng ngày này';
    saveB.onclick=e=>{
      e.stopPropagation();
      const newPts=Number(points.value||0);
      const newName=name.value.trim();
      if(!newName){alert('Tên nhiệm vụ không được để trống.');return}
      if(!subject.value){alert('Hãy chọn môn học.');return}
      askConfirm('Lưu nhiệm vụ',`Chỉ lưu thay đổi cho nhiệm vụ ngày ${fmtDate(t.date)}?`,()=>{
        t.name=newName;
        t.subject=subject.value;
        t.date=String(date.value||todayISO()).slice(0,10);
        t.points=newPts;
        t.duration=duration.value.trim();
        t.link=link.value.trim();
        t.instruction=instruction.value.trim();
        selectedParentTaskDate=t.date;
        save();
        render();
      },{yesText:'Có, lưu riêng ngày này',icon:'💾'});
    };

    // Sửa hàng loạt: chỉ sửa các nhiệm vụ CHƯA hoàn thành trong cùng chuỗi.
    let saveSeriesB=null;
    if(t.seriesId){
      saveSeriesB=document.createElement('button');
      saveSeriesB.className='secondary';
      saveSeriesB.textContent='🔁 Lưu chuỗi chưa hoàn thành';
      saveSeriesB.onclick=e=>{
        e.stopPropagation();
        const newPts=Number(points.value||0);
        const newName=name.value.trim();
        if(!newName){alert('Tên nhiệm vụ không được để trống.');return}
        if(!subject.value){alert('Hãy chọn môn học.');return}

        const editableSeries=c.tasks.filter(x=>x.seriesId===t.seriesId && !x.done);
        const lockedSeries=c.tasks.filter(x=>x.seriesId===t.seriesId && x.done);

        askConfirm(
          'Chỉnh sửa hàng loạt',
          `Sửa ${editableSeries.length} nhiệm vụ CHƯA hoàn thành trong chuỗi "${t.name}"? `+
          `${lockedSeries.length} nhiệm vụ đã hoàn thành sẽ được giữ nguyên.`,
          ()=>{
            editableSeries.forEach(st=>{
              st.name=newName;
              st.subject=subject.value;
              st.points=newPts;
              st.duration=duration.value.trim();
              st.link=link.value.trim();
              st.instruction=instruction.value.trim();
            });
            save();
            render();
          },
          {yesText:'Có, sửa các nhiệm vụ chưa hoàn thành',icon:'🔁'}
        );
      };
    }

    // Xóa riêng: chỉ áp dụng vì t đang ở trạng thái chưa hoàn thành.
    const del=document.createElement('button');
    del.className='btn delete';
    del.textContent='🗑 Xóa riêng ngày này';
    del.onclick=e=>{
      e.stopPropagation();
      askConfirm(
        'Xóa nhiệm vụ',
        `Xóa nhiệm vụ chưa hoàn thành "${t.name}" ngày ${fmtDate(t.date)}?`,
        ()=>{
          c.tasks=c.tasks.filter(x=>x.id!==t.id);
          selectedParentTaskDate='';
          save();
          render();
        },
        {yesText:'Có, xóa riêng ngày này',icon:'🗑️'}
      );
    };

    // Xóa hàng loạt: chỉ xóa các nhiệm vụ CHƯA hoàn thành trong chuỗi.
    let delSeriesB=null;
    if(t.seriesId){
      delSeriesB=document.createElement('button');
      delSeriesB.className='btn delete';
      delSeriesB.textContent='🗑 Xóa chuỗi chưa hoàn thành';
      delSeriesB.onclick=e=>{
        e.stopPropagation();

        const pendingSeries=c.tasks.filter(x=>x.seriesId===t.seriesId && !x.done);
        const completedSeries=c.tasks.filter(x=>x.seriesId===t.seriesId && x.done);

        askConfirm(
          'Xóa các nhiệm vụ chưa hoàn thành',
          `Xóa ${pendingSeries.length} nhiệm vụ CHƯA hoàn thành trong chuỗi "${t.name}"? `+
          `${completedSeries.length} nhiệm vụ đã hoàn thành sẽ được giữ nguyên và điểm của con không bị trừ.`,
          ()=>{
            const pendingIds=new Set(pendingSeries.map(x=>x.id));
            c.tasks=c.tasks.filter(x=>!pendingIds.has(x.id));
            selectedParentTaskDate='';
            save();
            render();
          },
          {yesText:'Có, xóa phần chưa hoàn thành',icon:'⚠️'}
        );
      };
    }

    acts.append(saveB);
    if(saveSeriesB) acts.append(saveSeriesB);
    acts.append(del);
    if(delSeriesB) acts.append(delSeriesB);
    body.append(grid,acts);
    item.append(head,body);
    list.appendChild(item);
  });
}

function addChild(){
  const inp=document.getElementById('newChildName'),name=inp.value.trim();if(!name)return alert('Hãy nhập tên bé.');
  const gender=document.getElementById('newChildGender')?.value||'female';
  askConfirm('Thêm bé',`Thêm hồ sơ cho "${name}" (${gender==='male'?'Nam':'Nữ'})?`,()=>{
    const c={id:uid('c'),name,gender,score:0,highestScore:0,tasks:[],giftHistory:[],pointHistory:[],rewards:[],achievements:[],earnedAchievements:[]};
    data.children.push(c);
    if(!currentChildId)currentChildId=c.id;
    inp.value='';
    save();
    render();
  },{yesText:'Có, thêm bé',icon:gender==='male'?'👦':'👧'});
}
function removeChild(id){
  const c=data.children.find(x=>x.id===id);if(!c)return;
  askConfirm('Xóa hồ sơ bé',`Xóa toàn bộ hồ sơ, điểm, nhiệm vụ, quà và thành tích của ${c.name}?`,()=>{
    data.children=data.children.filter(x=>x.id!==id);if(currentChildId===id)currentChildId=data.children[0]?.id||null;save();render();
  },{yesText:'Có, xóa hồ sơ',icon:'⚠️'});
}
function addSubject(){
  const inp=document.getElementById('newSubjectName'),name=inp.value.trim();if(!name)return alert('Hãy nhập tên môn học.');
  if(data.subjects.some(s=>s.toLowerCase()===name.toLowerCase()))return alert('Môn này đã có.');
  askConfirm('Thêm môn học',`Thêm môn "${name}"?`,()=>{data.subjects.push(name);inp.value='';save();render()},{yesText:'Có, thêm',icon:'📚'});
}
function addReward(){
  const targetId=document.getElementById('rewardTarget')?.value;
  const name=document.getElementById('rewardName').value.trim(),
        cost=Number(document.getElementById('rewardCost').value||0),
        rule=document.getElementById('rewardRule').value.trim();
  if(!targetId)return alert('Chưa chọn bé.');
  if(!name||cost<=0)return alert('Hãy nhập tên quà và điểm hợp lệ.');

  const targets=targetId==='all'?data.children:data.children.filter(c=>c.id===targetId);
  if(!targets.length)return alert('Chưa có bé để thiết lập quà.');

  askConfirm('Thêm quà',`Thêm quà "${name}" (${cost} điểm) cho ${targetId==='all'?'TẤT CẢ CÁC CON':targets[0].name}?`,()=>{
    targets.forEach(c=>c.rewards.push({id:uid('r'),name,cost,rule}));
    document.getElementById('rewardName').value='';
    document.getElementById('rewardCost').value='';
    document.getElementById('rewardRule').value='';
    save();render();
  },{yesText:'Có, thêm quà',icon:'🎁'});
}
function addAchievement(){
  const targetId=document.getElementById('achievementTarget')?.value;
  const points=Number(document.getElementById('achievementPoints').value||0),
        title=document.getElementById('achievementTitle').value.trim();
  if(!targetId)return alert('Chưa chọn bé.');
  if(points<=0||!title)return alert('Thông tin chưa hợp lệ.');

  const targets=targetId==='all'?data.children:data.children.filter(c=>c.id===targetId);
  if(!targets.length)return alert('Chưa có bé để thiết lập thành tích.');

  askConfirm('Thêm thành tích',`Thêm mốc "${title}" ở ${points} điểm cho ${targetId==='all'?'TẤT CẢ CÁC CON':targets[0].name}?`,()=>{
    targets.forEach(c=>{
      c.achievements.push({id:uid('a'),points,title});
      updateEarnedAchievements(c);
    });
    document.getElementById('achievementPoints').value='';
    document.getElementById('achievementTitle').value='';
    save();render();
  },{yesText:'Có, thêm mốc',icon:'🏅'});
}
function bonusScore(){
  const id=document.getElementById('bonusTarget').value,pts=Number(document.getElementById('bonusPoints').value||0),reason=document.getElementById('bonusReason').value.trim(),c=data.children.find(x=>x.id===id);
  if(!c)return alert('Chưa chọn bé.');if(pts<=0)return alert('Điểm thưởng phải lớn hơn 0.');
  askConfirm('Cộng điểm thưởng',`Phụ huynh xác nhận cộng ${pts} điểm thưởng cho ${c.name}${reason?' vì: '+reason:''}?`,()=>{
    c.score+=pts;logPoint(c,'bonus',pts,reason);updateEarnedAchievements(c);save();render();document.getElementById('bonusPoints').value='';document.getElementById('bonusReason').value='';
  },{yesText:'Có, cộng điểm',icon:'🌟'});
}
function penaltyScore(){
  const id=document.getElementById('penaltyTarget').value;
  const pts=Number(document.getElementById('penaltyPoints').value||0);
  const reason=document.getElementById('penaltyReason').value.trim();
  const c=data.children.find(x=>x.id===id);

  if(!c) return alert('Chưa chọn bé.');
  if(pts<=0) return alert('Điểm phạt phải lớn hơn 0.');
  if(!reason) return alert('Hãy nhập lý do nhắc nhở / điểm phạt.');

  askConfirm(
    'Trừ điểm',
    `Phụ huynh xác nhận trừ ${pts} điểm của ${c.name} vì: ${reason}?`,
    ()=>{
      if(!Array.isArray(c.pointHistory)) c.pointHistory=[];

      c.score-=pts;

      c.pointHistory.push({
        id:uid('penalty'),
        type:'penalty',
        amount:-Math.abs(pts),
        reason:reason,
        at:new Date().toISOString()
      });

      save();
      render();

      document.getElementById('penaltyPoints').value='';
      document.getElementById('penaltyReason').value='';

      alert(`Đã trừ ${pts} điểm của ${c.name} và ghi nhận vào mục Nhắc nhở / Điểm phạt.`);
    },
    {yesText:'Có, trừ điểm',icon:'⚠️'}
  );
}
function datesForAssignment(start,end,mode){
  const out=[];let d=parseISO(start),last=parseISO(end||start);
  if(mode==='once')return [start];
  if(last<d)return [];
  while(d<=last){
    const day=d.getDay();
    if(mode==='daily'||(mode==='weekdays'&&day>=1&&day<=5))out.push(localDateISO(d));
    d.setDate(d.getDate()+1);
  }
  return out;
}
function addTask(){
  const target=document.getElementById('assignTo').value,name=document.getElementById('taskName').value.trim(),subject=document.getElementById('subject').value,
        start=String(document.getElementById('taskDate').value||todayISO()).slice(0,10),mode=document.getElementById('taskRepeat').value,
        end=String(document.getElementById('taskEndDate').value||start).slice(0,10),pts=Number(document.getElementById('taskPoints').value||0),
        duration=document.getElementById('duration').value.trim(),link=document.getElementById('taskLink').value.trim(),instruction=document.getElementById('instruction').value.trim();
  if(!target)return alert('Chưa có bé để giao bài.');if(!name)return alert('Hãy nhập tên nhiệm vụ.');if(!subject)return alert('Hãy tạo môn học trước.');
  const dates=datesForAssignment(start,end,mode);if(!dates.length)return alert('Khoảng ngày chưa hợp lệ.');
  const targets=target==='all'?data.children:data.children.filter(c=>c.id===target);
  askConfirm('Giao nhiệm vụ',`Giao "${name}" cho ${target==='all'?'TẤT CẢ CÁC CON':targets[0]?.name} trong ${dates.length} ngày?`,()=>{
    const seriesId=mode==='once'?null:uid('series');
    targets.forEach(c=>dates.forEach(date=>c.tasks.push({id:uid('t'),seriesId,name,subject,date,points:pts,duration,link,instruction,done:false,awardedPoints:0,completedAt:null})));
    save();render();document.getElementById('taskName').value='';document.getElementById('taskLink').value='';document.getElementById('instruction').value='';
  },{yesText:'Có, giao nhiệm vụ',icon:'📝'});
}

data.children.forEach(c=>{updateEarnedAchievements(c)});
save();
document.getElementById('taskDate').value=todayISO();
document.getElementById('taskEndDate').value=todayISO();
document.getElementById('duration').value='15 phút';
render();

