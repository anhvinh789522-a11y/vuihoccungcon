// ☁️ Đồng bộ đa thiết bị qua Google Trang Tính (Google Sheets) hoặc Supabase.
// Thiết bị nào lưu sau cùng sẽ thắng. Tải về sẽ tự sao lưu bản trên máy trước khi ghi đè.
const SYNC_KEY='vuihoc_baonhi_sync_v1';
let syncCfg=null;
try{syncCfg=JSON.parse(localStorage.getItem(SYNC_KEY)||'null')}catch(e){syncCfg=null}
let _pushTimer=null;

// Giữ bản lưu local gốc để Tải về không kích hoạt Đẩy lên vòng lặp.
const _localSave=save;
save=function(){_localSave();schedulePush();};

function isGoogleSheets(u){
  return String(u||'').includes('script.google.com');
}

function persistSync(){
  localStorage.setItem(SYNC_KEY,JSON.stringify(syncCfg));
  if(typeof updateCloudStatusPill==='function') updateCloudStatusPill();
}

function syncBase(){return String(syncCfg?.url||'').replace(/\/+$/,'')}
function syncHeaders(){return {'apikey':syncCfg?.anon||'','Authorization':'Bearer '+(syncCfg?.anon||''),'Content-Type':'application/json'}}

function setSyncStatus(msg){
  const el=document.getElementById('syncStatus');if(el)el.textContent=msg;
  if(typeof updateCloudStatusPill==='function') updateCloudStatusPill();
}

function fillSyncForm(){
  if(!syncCfg)return;
  const u=document.getElementById('syncUrl'),k=document.getElementById('syncKey'),cd=document.getElementById('syncCode'),a=document.getElementById('syncAuto');
  if(u)u.value=syncCfg.url||'';
  if(k)k.value=syncCfg.anon||'';
  if(cd)cd.value=syncCfg.code||'';
  if(a)a.checked=syncCfg.auto!==false;
}

function syncReady(){
  if(!syncCfg || !syncCfg.url) return false;
  if(isGoogleSheets(syncCfg.url)) return true; // Google Sheets chỉ cần link Web App
  return Boolean(syncCfg.anon && syncCfg.code); // Supabase cần đủ URL, Key, Code
}

function schedulePush(){
  if(!syncReady()||syncCfg.auto===false)return;
  clearTimeout(_pushTimer);
  _pushTimer=setTimeout(()=>syncPush(true),2000);
}

// 📤 Đẩy dữ liệu lên Cloud (Google Sheets hoặc Supabase)
async function syncPush(silent){
  if(!syncReady()){if(!silent)setSyncStatus('Chưa cấu hình đồng bộ.');return false}
  try{
    if(!silent)setSyncStatus('Đang đẩy lên…');
    const now=new Date().toISOString();

    if(isGoogleSheets(syncCfg.url)){
      // 📊 ĐỒNG BỘ GOOGLE TRANG TÍNH (GOOGLE APPS SCRIPT WEB APP)
      const res=await fetch(syncCfg.url,{
        method:'POST',
        body:JSON.stringify({
          action:'save',
          code:syncCfg.code||'baonhi',
          data:data,
          updated_at:now
        })
      });
      if(!res.ok)throw new Error('HTTP '+res.status);
      syncCfg.updatedAt=now;
      syncCfg.provider='sheets';
      persistSync();
      setSyncStatus('Đã đồng bộ lên Google Trang tính lúc '+new Date().toLocaleString('vi-VN')+'.');
      return true;
    } else {
      // ⚡ ĐỒNG BỘ SUPABASE
      const res=await fetch(syncBase()+'/rest/v1/family_state',{
        method:'POST',
        headers:Object.assign({},syncHeaders(),{'Prefer':'resolution=merge-duplicates'}),
        body:JSON.stringify([{code:syncCfg.code,data:data,updated_at:now}])
      });
      if(!res.ok)throw new Error('HTTP '+res.status);
      syncCfg.updatedAt=now;
      syncCfg.provider='supabase';
      persistSync();
      setSyncStatus('Đã đẩy lên Supabase lúc '+new Date().toLocaleString('vi-VN')+'.');
      return true;
    }
  }catch(e){
    setSyncStatus('Đẩy lên thất bại: '+e.message+(navigator.onLine?'':' (mất mạng?)'));
    return false;
  }
}

// 📥 Tải dữ liệu về từ Cloud (Google Sheets hoặc Supabase)
async function syncPull(silent){
  if(!syncReady()){if(!silent)setSyncStatus('Chưa cấu hình đồng bộ.');return false}
  try{
    if(!silent)setSyncStatus('Đang tải về…');

    let remoteData=null;
    let remoteUpdatedAt=null;

    if(isGoogleSheets(syncCfg.url)){
      // 📊 TẢI TỪ GOOGLE TRANG TÍNH
      const getUrl=syncCfg.url+(syncCfg.url.includes('?')?'&':'?')+'action=get&code='+encodeURIComponent(syncCfg.code||'baonhi');
      const res=await fetch(getUrl);
      if(!res.ok)throw new Error('HTTP '+res.status);
      const json=await res.json();
      if(!json || !json.data){
        if(!silent)setSyncStatus('Google Trang tính chưa có dữ liệu. Bấm Đẩy lên để lưu bản đầu tiên.');
        return false;
      }
      remoteData=json.data;
      remoteUpdatedAt=json.updated_at||new Date().toISOString();
    } else {
      // ⚡ TẢI TỪ SUPABASE
      const res=await fetch(syncBase()+'/rest/v1/family_state?code=eq.'+encodeURIComponent(syncCfg.code)+'&select=data,updated_at',{headers:syncHeaders()});
      if(!res.ok)throw new Error('HTTP '+res.status);
      const rows=await res.json();
      if(!rows.length){if(!silent)setSyncStatus('Đám mây chưa có dữ liệu cho mã này. Bấm Đẩy lên để lưu.');return false}
      remoteData=rows[0].data;
      remoteUpdatedAt=rows[0].updated_at;
    }

    try{localStorage.setItem(STORAGE_KEY+'.backup',JSON.stringify(data))}catch(e){}
    data=remoteData||data;
    if(!data.exchangeRate || data.exchangeRate.vnd === 5000) data.exchangeRate = {stars: 100, vnd: 10000};
    if(!Array.isArray(data.children))data.children=[];
    if(!Array.isArray(data.subjects))data.subjects=[];
    if(!Array.isArray(data.studyTools))data.studyTools=(typeof DEFAULT_STUDY_TOOLS!=='undefined'?structuredClone(DEFAULT_STUDY_TOOLS):[]);
    if(!data.parentPassword)data.parentPassword='1234';
    data.children.forEach(c=>{if(typeof ensurePiggyPet==="function") ensurePiggyPet(c); updateEarnedAchievements(c);});
    _localSave();

    syncCfg.updatedAt=remoteUpdatedAt;
    syncCfg.provider=isGoogleSheets(syncCfg.url)?'sheets':'supabase';
    persistSync();
    render();
    const providerName=syncCfg.provider==='sheets'?'Google Trang tính':'Supabase';
    setSyncStatus('Đã tải về từ '+providerName+' lúc '+new Date().toLocaleString('vi-VN')+'.');
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
        k=document.getElementById('syncKey')?document.getElementById('syncKey').value.trim():'',
        cd=document.getElementById('syncCode')?document.getElementById('syncCode').value.trim():'baonhi',
        a=document.getElementById('syncAuto')?document.getElementById('syncAuto').checked:true;

  if(!u) return alert('Hãy dán link Web App Google Trang tính hoặc Supabase URL.');

  if(isGoogleSheets(u)){
    syncCfg={url:u,anon:'',code:cd||'baonhi',auto:a,provider:'sheets',updatedAt:null};
  } else {
    if(!k||!cd) return alert('Dùng Supabase thì hãy nhập đủ URL, Anon key và Mã gia đình.');
    syncCfg={url:u,anon:k,code:cd,auto:a,provider:'supabase',updatedAt:null};
  }

  persistSync();
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
    const providerName=syncCfg.provider==='sheets'?'Google Trang tính':'Đám mây';
    setSyncStatus(syncCfg.updatedAt?('Đã đồng bộ ('+providerName+') lúc '+new Date().toLocaleString('vi-VN')+'.'):'Chưa có dữ liệu đám mây.');
  }else{
    setSyncStatus(syncCfg?'Chưa bật tự động.':'Chưa cấu hình đồng bộ.');
  }
  if(typeof updateCloudStatusPill==='function') updateCloudStatusPill();
})();
