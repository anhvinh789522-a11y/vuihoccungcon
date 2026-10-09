// ☁️ Đồng bộ đa thiết bị qua Supabase (dùng REST API trực tiếp, không cần thư viện).
// Thiết bị nào lưu sau cùng sẽ thắng. Tải về sẽ tự sao lưu bản trên máy trước khi ghi đè.
const SYNC_KEY='vuihoc_baonhi_sync_v1';
let syncCfg=null;
try{syncCfg=JSON.parse(localStorage.getItem(SYNC_KEY)||'null')}catch(e){syncCfg=null}
let _pushTimer=null;

// Giữ bản lưu local gốc để Tải về không kích hoạt Đẩy lên vòng lặp.
const _localSave=save;
save=function(){_localSave();schedulePush();};

function persistSync(){localStorage.setItem(SYNC_KEY,JSON.stringify(syncCfg))}
function syncBase(){return String(syncCfg.url||'').replace(/\/+$/,'')}
function syncHeaders(){return {'apikey':syncCfg.anon,'Authorization':'Bearer '+syncCfg.anon,'Content-Type':'application/json'}}
function setSyncStatus(msg){const el=document.getElementById('syncStatus');if(el)el.textContent=msg}
function fillSyncForm(){
  if(!syncCfg)return;
  const u=document.getElementById('syncUrl'),k=document.getElementById('syncKey'),cd=document.getElementById('syncCode'),a=document.getElementById('syncAuto');
  if(u)u.value=syncCfg.url||'';
  if(k)k.value=syncCfg.anon||'';
  if(cd)cd.value=syncCfg.code||'';
  if(a)a.checked=syncCfg.auto!==false;
}
function syncReady(){return syncCfg&&syncCfg.url&&syncCfg.anon&&syncCfg.code}

function schedulePush(){
  if(!syncReady()||syncCfg.auto===false)return;
  clearTimeout(_pushTimer);
  _pushTimer=setTimeout(()=>syncPush(true),2000);
}

async function syncPush(silent){
  if(!syncReady()){if(!silent)setSyncStatus('Chưa cấu hình đồng bộ.');return false}
  try{
    if(!silent)setSyncStatus('Đang đẩy lên…');
    const now=new Date().toISOString();
    const res=await fetch(syncBase()+'/rest/v1/family_state',{
      method:'POST',
      headers:Object.assign({},syncHeaders(),{'Prefer':'resolution=merge-duplicates'}),
      body:JSON.stringify([{code:syncCfg.code,data:data,updated_at:now}])
    });
    if(!res.ok)throw new Error('HTTP '+res.status);
    syncCfg.updatedAt=now;persistSync();
    setSyncStatus('Đã đẩy lên lúc '+new Date().toLocaleString('vi-VN')+'.');
    return true;
  }catch(e){
    setSyncStatus('Đẩy lên thất bại: '+e.message+(navigator.onLine?'':' (mất mạng?)'));
    return false;
  }
}

async function syncPull(silent){
  if(!syncReady()){if(!silent)setSyncStatus('Chưa cấu hình đồng bộ.');return false}
  try{
    if(!silent)setSyncStatus('Đang tải về…');
    const res=await fetch(syncBase()+'/rest/v1/family_state?code=eq.'+encodeURIComponent(syncCfg.code)+'&select=data,updated_at',{headers:syncHeaders()});
    if(!res.ok)throw new Error('HTTP '+res.status);
    const rows=await res.json();
    if(!rows.length){if(!silent)setSyncStatus('Đám mây chưa có dữ liệu cho mã này. Bấm Đẩy lên để lưu.');return false}
    try{localStorage.setItem(STORAGE_KEY+'.backup',JSON.stringify(data))}catch(e){}
    data=rows[0].data||data;
    if(!data.exchangeRate)data.exchangeRate={stars:100,vnd:5000};
    if(!Array.isArray(data.children))data.children=[];
    if(!Array.isArray(data.subjects))data.subjects=[];
    if(!data.parentPassword)data.parentPassword='1234';
    data.children.forEach(c=>{updateEarnedAchievements(c)});
    _localSave();
    syncCfg.updatedAt=rows[0].updated_at;persistSync();
    render();
    setSyncStatus('Đã tải về lúc '+new Date().toLocaleString('vi-VN')+'.');
    return true;
  }catch(e){
    if(!silent)setSyncStatus('Tải về thất bại: '+e.message+(navigator.onLine?'':' (mất mạng?)'));
    return false;
  }
}

function confirmPull(){
  askConfirm('Tải về','Tải dữ liệu đám mây về máy này? Dữ liệu trên máy sẽ bị ghi đè (đã tự sao lưu).',()=>{
    syncPull(false);
  },{yesText:'Có, tải về',icon:'⬇️'});
}

async function connectSync(){
  const u=document.getElementById('syncUrl').value.trim().replace(/\/+$/,''),
        k=document.getElementById('syncKey').value.trim(),
        cd=document.getElementById('syncCode').value.trim(),
        a=document.getElementById('syncAuto').checked;
  if(!u||!k||!cd)return alert('Hãy nhập đủ Supabase URL, Anon key và Mã gia đình.');
  syncCfg={url:u,anon:k,code:cd,auto:a,updatedAt:null};persistSync();
  setSyncStatus('Đang kết nối…');
  const hasRemote=await syncPull(false);
  if(!hasRemote)await syncPush(false);
}

function disconnectSync(){
  askConfirm('Ngắt đồng bộ','Ngắt kết nối đám mây trên thiết bị này? Dữ liệu trên máy giữ nguyên.',()=>{
    syncCfg=null;localStorage.removeItem(SYNC_KEY);fillSyncForm();setSyncStatus('Đã ngắt đồng bộ.');
  },{yesText:'Có, ngắt',icon:'☁️'});
}

// Tự tải về khi mở web nếu bật tự động.
(async function(){
  fillSyncForm();
  if(syncReady()&&syncCfg.auto!==false){
    setSyncStatus('Đang đồng bộ…');
    await syncPull(true);
    setSyncStatus(syncCfg.updatedAt?('Đã đồng bộ lúc '+new Date().toLocaleString('vi-VN')+'.'):'Chưa có dữ liệu đám mây.');
  }else{
    setSyncStatus(syncCfg?'Chưa bật tự động.':'Chưa cấu hình đồng bộ.');
  }
})();
