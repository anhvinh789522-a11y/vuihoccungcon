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

// ⭐ Bộ mẫu nhiệm vụ của Bảo Nhi
const TASK_PRESETS=[
  {name:'Được cô khen học tốt',subject:'Kỹ năng sống',points:10,duration:'15 phút',instruction:'Cô khen học tốt ở trường'},
  {name:'Phụ bố mẹ 1 việc',subject:'Kỹ năng sống',points:5,duration:'15 phút',instruction:'Phụ bố mẹ một việc nhà'},
  {name:'Bị cô chê',subject:'Kỹ năng sống',points:-10,duration:'5 phút',instruction:'Bị cô chê ở trường — rút kinh nghiệm nhé'},
  {name:'Làm bài tập 1 môn',subject:'Toán',points:10,duration:'30 phút',instruction:'Hoàn thành bài tập của một môn'},
  {name:'Học tiếng Anh',subject:'Tiếng Anh',points:20,duration:'20 phút',instruction:'Học từ mới và luyện đọc'},
  {name:'Học tiếng Trung',subject:'Tiếng Trung',points:20,duration:'20 phút',instruction:'Học từ mới và luyện viết'},
  {name:'Chủ động giúp bà làm việc nhà',subject:'Kỹ năng sống',points:5,duration:'15 phút',instruction:'Tự giác giúp bà mà không cần nhắc'}
];

// ⚡ Bộ mẫu thưởng nóng khích lệ con nhanh
const QUICK_PRAISES=[
  {name:'Tự giác học bài',icon:'📚',points:10,reason:'Tự giác ngồi vào bàn học và ôn bài'},
  {name:'Ăn ngoan, tự giác',icon:'🥗',points:5,reason:'Tự giác ăn uống ngon miệng, gọn gàng'},
  {name:'Phụ giúp việc nhà',icon:'🧹',points:5,reason:'Chủ động giúp đỡ bố mẹ việc nhà'},
  {name:'Lễ phép, vâng lời',icon:'💖',points:5,reason:'Biết chào hỏi lễ phép và nghe lời người lớn'},
  {name:'Đọc sách chăm chỉ',icon:'📖',points:10,reason:'Chăm chú đọc sách và tìm hiểu tri thức mới'},
  {name:'Bài tập điểm tốt',icon:'💯',points:15,reason:'Làm bài tập cẩn thận và đạt kết quả tốt'},
  {name:'Sáng tạo & Khéo tay',icon:'🎨',points:10,reason:'Sáng tạo đồ chơi, tranh vẽ hoặc ý tưởng hay'},
  {name:'Ngủ sớm đúng giờ',icon:'🌙',points:5,reason:'Tự giác chuẩn bị và đi ngủ đúng giờ'}
];

// 📚 Bộ tiêu chí & mẫu cộng điểm học tập chuẩn giáo dục
const STUDY_PRESETS=[
  {id:'sp_10',name:'Điểm 10 kiểm tra / thi',icon:'💯',points:20,subject:'Toán',desc:'Bài kiểm tra hoặc bài thi đạt điểm 10 tuyệt đối'},
  {id:'sp_9',name:'Điểm 9 kiểm tra / thi',icon:'🌟',points:15,subject:'Toán',desc:'Bài kiểm tra đạt điểm 9 xuất sắc'},
  {id:'sp_8',name:'Điểm 8 kiểm tra / thi',icon:'👍',points:10,subject:'Toán',desc:'Bài kiểm tra đạt điểm 8 kết quả tốt'},
  {id:'sp_teacher',name:'Cô giáo khen / Hoa điểm 10',icon:'🌸',points:15,subject:'Kỹ năng sống',desc:'Được cô khen học tốt, chăm chỉ trên lớp'},
  {id:'sp_homework',name:'Xong bài tập về nhà xuất sắc',icon:'✍️',points:10,subject:'Toán',desc:'Tự giác hoàn thành bài tập về nhà sạch sẽ, đúng giờ'},
  {id:'sp_reading',name:'Đọc sách tri thức 20 phút',icon:'📖',points:10,subject:'Tiếng Việt',desc:'Tự giác đọc sách khoa học hoặc truyện bổ ích'},
  {id:'sp_handwriting',name:'Luyện viết chữ đẹp, sạch sẽ',icon:'📝',points:10,subject:'Tiếng Việt',desc:'Nét chữ nắn nót, vở sạch chữ đẹp'},
  {id:'sp_english',name:'Học Duolingo / Tiếng Anh 15p',icon:'🦉',points:10,subject:'Tiếng Anh',desc:'Học từ vựng và luyện phát âm tiếng Anh'},
  {id:'sp_math',name:'Toán tư duy / VioEdu / Violympic',icon:'🧮',points:15,subject:'Toán',desc:'Chăm chỉ luyện các bài toán đố và logic'},
  {id:'sp_speaking',name:'Thuộc bài & hăng hái phát biểu',icon:'🗣️',points:10,subject:'Tiếng Việt',desc:'Tự tin phát biểu xây dựng bài trong lớp'},
  {id:'sp_creative',name:'Sáng tạo tranh vẽ / Thủ công',icon:'🎨',points:10,subject:'Kỹ năng sống',desc:'Hoàn thành tác phẩm tranh vẽ, mô hình khéo tay'}
];

// 💡 Danh mục công cụ học tập chọn lọc
const DEFAULT_STUDY_TOOLS=[
  {id:'tool_khan',name:'Khan Academy Tiếng Việt',category:'Toán & Khoa học',icon:'📐',url:'https://vi.khanacademy.org',desc:'Học Toán & Khoa học miễn phí chuẩn quốc tế, có bài giảng video và bài tập tương tác sinh động.'},
  {id:'tool_vioedu',name:'VioEdu - Đấu trường Toán học',category:'Toán & Khoa học',icon:'🧮',url:'https://vio.edu.vn',desc:'Nền tảng học và luyện thi Toán tiểu học thông minh với hệ thống kiến thức bám sát SGK.'},
  {id:'tool_violympic',name:'Violympic Quốc Gia',category:'Toán & Khoa học',icon:'🏆',url:'https://violympic.vn',desc:'Sân chơi giải Toán và Tiếng Việt qua Internet dành cho học sinh cả nước.'},
  {id:'tool_duolingo',name:'Duolingo Tiếng Anh',category:'Tiếng Anh',icon:'🦉',url:'https://www.duolingo.com',desc:'Học tiếng Anh mỗi ngày qua các bài học tương tác vui nhộn như trò chơi mini-game.'},
  {id:'tool_british_council',name:'LearnEnglish Kids (British Council)',category:'Tiếng Anh',icon:'🇬🇧',url:'https://learnenglishkids.britishcouncil.org',desc:'Kho bài hát, trò chơi, câu chuyện và bài tập tiếng Anh thiếu nhi chuẩn Hội đồng Anh.'},
  {id:'tool_storyline',name:'Storyline Online (Sách nói)',category:'Tiếng Anh',icon:'📖',url:'https://storylineonline.net',desc:'Thư viện truyện tranh tiếng Anh có hình ảnh minh họa sống động và diễn viên đọc truyện.'},
  {id:'tool_trangnguyen',name:'Trạng Nguyên Tiếng Việt',category:'Tiếng Việt',icon:'🇻🇳',url:'https://trangnguyen.edu.vn',desc:'Sân chơi khám phá vẻ đẹp Tiếng Việt, câu đố dân gian và lịch sử hào hùng cho thiếu nhi.'},
  {id:'tool_scratch',name:'Scratch MIT - Lập trình sáng tạo',category:'Sáng tạo & Lập trình',icon:'🐱',url:'https://scratch.mit.edu',desc:'Học lập trình kéo thả sáng tạo game, phim hoạt hình và câu chuyện tương tác từ MIT.'},
  {id:'tool_codeorg',name:'Code.org - Giờ Lập Trình',category:'Sáng tạo & Lập trình',icon:'💻',url:'https://code.org',desc:'Khóa học tư duy máy tính trực quan cùng các nhân vật hoạt hình quen thuộc.'},
  {id:'tool_natgeo',name:'National Geographic Kids',category:'Khám phá thế giới',icon:'🌍',url:'https://kids.nationalgeographic.com',desc:'Khám phá thế giới kỳ diệu của động vật hoang dã, thiên nhiên và khoa học đời sống.'},
  {id:'tool_nasa',name:'NASA Kids\' Club',category:'Khám phá thế giới',icon:'🚀',url:'https://www.nasa.gov/learning-resources/nasa-kids-club/',desc:'Khám phá vũ trụ, phi thuyền, các hành tinh và tìm hiểu công việc của phi hành gia.'}
];

// 🎁 Danh mục phần quà mặc định đa dạng, linh hoạt
const DEFAULT_REWARDS=[
  {id:uid('r'),name:'Xem TV / iPad 15 phút',cost:20,category:'Thời gian & Đặc quyền',icon:'📺',rule:'Mỗi ngày tối đa 1 lần'},
  {id:uid('r'),name:'Chọn món ăn tối yêu thích',cost:30,category:'Thời gian & Đặc quyền',icon:'🍕',rule:'Bố mẹ nấu theo ý con'},
  {id:uid('r'),name:'1 cây kem mát lạnh',cost:40,category:'Đồ ăn & Thức uống',icon:'🍦',rule:'Đổi vào buổi chiều hoặc cuối tuần'},
  {id:uid('r'),name:'Đi công viên dạo chơi',cost:50,category:'Hoạt động & Dã ngoại',icon:'🌳',rule:'Vào ngày nghỉ cuối tuần'},
  {id:uid('r'),name:'1 ly trà sữa / nước ngọt',cost:60,category:'Đồ ăn & Thức uống',icon:'🧋',rule:'1 lần / tuần'},
  {id:uid('r'),name:'Mua 1 cuốn truyện mới',cost:100,category:'Sách & Đồ chơi',icon:'📚',rule:'Tự chọn tại nhà sách'},
  {id:uid('r'),name:'Đi siêu thị GO thỏa thích',cost:300,category:'Hoạt động & Dã ngoại',icon:'🛒',rule:'Dịp cuối tuần'},
  {id:uid('r'),name:'Chuyến đi chơi xa / Khu vui chơi',cost:500,category:'Hoạt động & Dã ngoại',icon:'🎡',rule:'Dịp nghỉ lễ hoặc cuối tháng'},
  {id:uid('r'),name:'Món quà lớn theo nguyện vọng',cost:1000,category:'Sách & Đồ chơi',icon:'🎁',rule:'Tích lũy dài hạn'}
];

// 🎒 DANH MỤC MÔN HỌC CHUẨN TIỂU HỌC (LỚP 1)
const GRADE1_SUBJECTS = [
  { name: 'Tiếng Việt', icon: '📖', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', textColor: '#6d28d9' },
  { name: 'Toán', icon: '📐', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', textColor: '#1d4ed8' },
  { name: 'Tiếng Anh', icon: '🇬🇧', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', textColor: '#b45309' },
  { name: 'Đạo đức', icon: '💖', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', textColor: '#be185d' },
  { name: 'TN & Xã hội', icon: '🔬', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', textColor: '#047857' },
  { name: 'Âm nhạc', icon: '🎵', color: '#06b6d4', bg: '#ecfeff', border: '#a5f3fc', textColor: '#0e7490' },
  { name: 'Mỹ thuật', icon: '🎨', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', textColor: '#c2410c' },
  { name: 'GD Thể chất', icon: '⚽', color: '#14b8a6', bg: '#f0fdfa', border: '#99f6e4', textColor: '#0f766e' },
  { name: 'HĐ Trải nghiệm', icon: '🌟', color: '#eab308', bg: '#fefce8', border: '#fef08a', textColor: '#a16207' },
  { name: 'Tin học', icon: '💻', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', textColor: '#4338ca' },
  { name: 'Toán tư duy', icon: '🧮', color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff', textColor: '#7e22ce' },
  { name: 'Bán trú / Nghỉ', icon: '😴', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', textColor: '#475569' }
];

// 🎒 MẪU THỜI KHÓA BIỂU LỚP 1 TIÊU CHUẨN (BỘ GD&ĐT)
const DEFAULT_GRADE1_TIMETABLE = {
  // Thứ 2
  "2_1": { subject: "HĐ Trải nghiệm", note: "Chào cờ đầu tuần" },
  "2_2": { subject: "Tiếng Việt", note: "Học vần" },
  "2_3": { subject: "Tiếng Việt", note: "Tập viết" },
  "2_4": { subject: "Toán", note: "Số & phép đếm" },
  "2_5": { subject: "Âm nhạc", note: "Hát múa vui nhộn" },
  "2_6": { subject: "GD Thể chất", note: "Vận động cơ bản" },
  "2_7": { subject: "Tiếng Việt", note: "Đọc mở rộng" },

  // Thứ 3
  "3_1": { subject: "Toán", note: "Phép cộng trừ" },
  "3_2": { subject: "Tiếng Việt", note: "Tập đọc" },
  "3_3": { subject: "Tiếng Việt", note: "Chính tả" },
  "3_4": { subject: "Tiếng Anh", note: "Từ vựng Unit" },
  "3_5": { subject: "Mỹ thuật", note: "Vẽ tranh & xé dán" },
  "3_6": { subject: "Toán tư duy", note: "Ghép que tính" },
  "3_7": { subject: "Tiếng Việt", note: "Kể chuyện" },

  // Thứ 4
  "4_1": { subject: "Tiếng Việt", note: "Học vần mới" },
  "4_2": { subject: "Tiếng Việt", note: "Luyện đọc câu" },
  "4_3": { subject: "Toán", note: "Hình học phẳng" },
  "4_4": { subject: "Đạo đức", note: "Gọn gàng ngăn nắp" },
  "4_5": { subject: "TN & Xã hội", note: "Gia đình em" },
  "4_6": { subject: "GD Thể chất", note: "Trò chơi vận động" },
  "4_7": { subject: "Tiếng Việt", note: "Đọc sách tranh" },

  // Thứ 5
  "5_1": { subject: "Toán", note: "Giải toán có lời văn" },
  "5_2": { subject: "Tiếng Việt", note: "Tập viết ô ly" },
  "5_3": { subject: "Tiếng Việt", note: "Luyện từ & câu" },
  "5_4": { subject: "Tiếng Anh", note: "Bài hát tiếng Anh" },
  "5_5": { subject: "TN & Xã hội", note: "Trường học thân yêu" },
  "5_6": { subject: "Tin học", note: "Làm quen chuột máy tính" },
  "5_7": { subject: "Kỹ năng sống", note: "Tự phục vụ bản thân" },

  // Thứ 6
  "6_1": { subject: "Tiếng Việt", note: "Ôn tập cuối tuần" },
  "6_2": { subject: "Tiếng Việt", note: "Kiểm tra đánh giá" },
  "6_3": { subject: "Toán", note: "Luyện tập chung" },
  "6_4": { subject: "Tiếng Anh", note: "Trò chơi đố chữ" },
  "6_5": { subject: "Mỹ thuật", note: "Tô màu sáng tạo" },
  "6_6": { subject: "HĐ Trải nghiệm", note: "Sinh hoạt lớp & Sao chăm ngoan" },
  "6_7": { subject: "Tổng kết tuần", note: "Khen thưởng cuối tuần" }
};


/* ============================================================
   🌟 ĐỊNH NGHĨA 3 NHÓM HÔM NAY: HỌC Ở NHÀ - TRÊN LỚP - PHỤ BỐ MẸ
   DỄ CỘNG & CÓ ĐIỂM TRỪ NHẬP ĐƯỢC
   ============================================================ */
const TODAY_CATEGORIES = {
  home_study: {
    id: 'home_study',
    name: 'Học ở nhà',
    icon: '🏠',
    color: '#10b981',
    bgColor: '#ecfdf5',
    praises: [
      { name: 'Xong bài tập cô giao', points: 10, icon: '✍️' },
      { name: 'Luyện viết chữ đẹp', points: 10, icon: '📝' },
      { name: 'Đọc sách 15 phút', points: 10, icon: '📖' },
      { name: 'Học Tiếng Anh / Duolingo', points: 10, icon: '🦉' },
      { name: 'Tập trung 15p (Con Ong)', points: 5, icon: '🐝' }
    ],
    penalties: [
      { name: 'Chưa làm bài tập / Lười học', points: -5, icon: '⚠️' },
      { name: 'Viết nguệch ngoạc, cẩu thả', points: -3, icon: '✏️' }
    ]
  },
  school_study: {
    id: 'school_study',
    name: 'Học tập trên lớp',
    icon: '🏫',
    color: '#6366f1',
    bgColor: '#eef2ff',
    praises: [
      { name: 'Điểm 10 kiểm tra / thi', points: 20, icon: '💯' },
      { name: 'Điểm 9 kiểm tra', points: 15, icon: '🌟' },
      { name: 'Cô giáo khen / Hoa điểm tốt', points: 15, icon: '🌸' },
      { name: 'Hăng hái phát biểu xây dựng bài', points: 5, icon: '🙋' },
      { name: 'Chú ý nghe giảng, giữ trật tự', points: 5, icon: '👂' }
    ],
    penalties: [
      { name: 'Bị cô giáo nhắc nhở', points: -5, icon: '⚠️' },
      { name: 'Mất trật tự trong lớp', points: -5, icon: '📢' },
      { name: 'Quên mang sách vở / đồ dùng', points: -3, icon: '🎒' }
    ]
  },
  parent_help: {
    id: 'parent_help',
    name: 'Phụ bố mẹ',
    icon: '🧹',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    praises: [
      { name: 'Tự dọn đồ chơi gọn gàng', points: 5, icon: '🧸' },
      { name: 'Cất cặp sách & góc học tập', points: 5, icon: '🎒' },
      { name: 'Ăn ngoan, không rơi vãi', points: 5, icon: '🥣' },
      { name: 'Phụ gấp quần áo / quét nhà', points: 5, icon: '👕' },
      { name: 'Lễ phép, vâng lời người lớn', points: 5, icon: '💖' },
      { name: 'Đi ngủ sớm đúng giờ', points: 5, icon: '🌙' }
    ],
    penalties: [
      { name: 'Mè nheo, không nghe lời', points: -5, icon: '😠' },
      { name: 'Xem tivi / iPad quá giờ', points: -5, icon: '📺' },
      { name: 'Bừa bãi đồ chơi không dọn', points: -3, icon: '🧸' },
      { name: 'Lười ăn, ngậm cơm lâu', points: -3, icon: '🍚' }
    ]
  }
};

function playPenaltySound(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx) return;
    const ctx=new AudioCtx();
    const notes=[392, 329.63, 261.63];
    notes.forEach((freq,i)=>{
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type='sine';
      osc.frequency.setValueAtTime(freq,ctx.currentTime+i*0.12);
      gain.gain.setValueAtTime(0.18,ctx.currentTime+i*0.12);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.12+0.25);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(ctx.currentTime+i*0.12);
      osc.stop(ctx.currentTime+i*0.12+0.25);
    });
  }catch(e){}
}

function seedBaoNhi(){
  return {
    children:[{
      id:uid('c'),name:'Bảo Nhi',gender:'female',score:0,highestScore:0,targetRewardId:null,
      tasks:TASK_PRESETS.map(p=>({id:uid('t'),seriesId:null,name:p.name,subject:p.subject,date:todayISO(),points:p.points,duration:p.duration,link:'',instruction:p.instruction,done:false,awardedPoints:0,completedAt:null})),
      giftHistory:[],
      pointHistory:[
        {id:uid('study'),type:'study',subject:'Toán',topic:'Kiểm tra 15 phút đạt điểm 10',amount:20,note:'Làm bài cẩn thận, không sai câu nào!',reason:'[Toán] Kiểm tra 15 phút đạt điểm 10 — Làm bài cẩn thận, không sai câu nào!',at:new Date().toISOString()},
        {id:uid('study'),type:'study',subject:'Tiếng Anh',topic:'Hoàn thành bài Duolingo & từ mới',amount:10,note:'Phát âm rất chuẩn',reason:'[Tiếng Anh] Hoàn thành bài Duolingo & từ mới — Phát âm rất chuẩn',at:new Date().toISOString()}
      ],
      rewards:structuredClone(DEFAULT_REWARDS),
      achievements:[],
      earnedAchievements:[]
    }],
    subjects:['Toán','Tiếng Việt','Tiếng Anh','Tiếng Trung','Kỹ năng sống'],
    studyTools:structuredClone(DEFAULT_STUDY_TOOLS),
    parentPassword:'1234',
    exchangeRate:{stars:100,vnd:5000}
  };
}
const defaultData=seedBaoNhi();

function loadData(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY) || localStorage.getItem('nhiemvu_sieubiet_public_clean_v1');
    if(!raw) return structuredClone(defaultData);
    const d=JSON.parse(raw);
    if(!Array.isArray(d.children)) d.children=[];
    if(!Array.isArray(d.subjects)) d.subjects=[];
    if(!Array.isArray(d.customSubjects)) d.customSubjects=[];
    if(!d.rideReminder) d.rideReminder={enabled:true,leadMinutes:10,morningTime:'07:15',afternoonTime:'13:30',pickupTime:'16:30',enableSound:true,enableSpeech:true,enableNotification:true};
    if(!Array.isArray(d.studyTools)) d.studyTools=structuredClone(DEFAULT_STUDY_TOOLS);
    if(!d.parentPassword) d.parentPassword='1234';
    if(!d.exchangeRate||!(Number(d.exchangeRate.stars)>0)||!(Number(d.exchangeRate.vnd)>0)) d.exchangeRate={stars:100,vnd:5000};

    const oldRewards=Array.isArray(d.rewards)?d.rewards:[];
    const oldAchievements=Array.isArray(d.achievements)?d.achievements:[];

    d.children.forEach((c,ci)=>{
      if(!c.id)c.id=uid('c');
      if(c.gender!=='male' && c.gender!=='female') c.gender='female';
      if(typeof c.score!=='number')c.score=0;
      if(typeof c.highestScore!=='number') c.highestScore=Math.max(0,c.score);
      if(c.score>c.highestScore) c.highestScore=c.score;
      if(!('targetRewardId' in c)) c.targetRewardId=null;
      if(!Array.isArray(c.tasks))c.tasks=[];
      if(!Array.isArray(c.giftHistory))c.giftHistory=[];
      if(!Array.isArray(c.pointHistory))c.pointHistory=[];
      if(!Array.isArray(c.rewards))c.rewards=oldRewards.length?oldRewards.map(r=>({...r,id:r.id||uid('r')})):structuredClone(DEFAULT_REWARDS);
      if(!Array.isArray(c.achievements))c.achievements=oldAchievements.map(a=>({...a,id:a.id||uid('a')}));
      if(!Array.isArray(c.earnedAchievements))c.earnedAchievements=[];
      if(!c.timetable || typeof c.timetable !== 'object' || !Object.keys(c.timetable).length) c.timetable=structuredClone(DEFAULT_GRADE1_TIMETABLE);
      if(!c.schoolBagPackedDate) c.schoolBagPackedDate='';

      c.rewards=c.rewards.map(r=>({
        id:r.id||uid('r'),
        name:String(r.name||''),
        cost:Number(r.cost||0),
        category:r.category||'Khác',
        icon:r.icon||'🎁',
        rule:String(r.rule||'')
      }));

      c.giftHistory.forEach(g=>{
        if(!('status' in g)) g.status='fulfilled';
      });

      c.achievements=c.achievements.map(a=>({id:a.id||uid('a'),points:Number(a.points||0),title:String(a.title||'')}));
      c.achievements=c.achievements.filter(a=>{const p=Number(a.points||0);return !(p===100||(p>=1000&&p<=100000&&p%1000===0));});

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
let selectedToolCategory='all';
let selectedRewardCategory='all';
let confirmCallback=null;
let pendingPraise=null;

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

// 🏅 101 danh hiệu tự động
const AUTO_RANKS=['Ngôi sao chăm chỉ','Chiến binh nhí','Kiện tướng nhí','Dũng sĩ nhí','Kim cương nhí','Siêu sao nhí','Nhà vô địch nhí','Anh hùng nhí','Bậc thầy nhí','Huyền thoại nhí'];
const AUTO_RANK_ICONS=['⭐','🚀','🏅','🛡️','💎','🌟','🏆','🦸','🌈','👑'];
const CUSTOM_AUTO_TITLES={
  1000:'🐝 Chú ong chăm chỉ',2000:'🌷 Bé ngoan gương mẫu',3000:'📚 Ngôi sao lớp học',4000:'👸 Công chúa chăm học',5000:'🔟 Nàng tiên điểm mười',
  6000:'✏️ Chiến binh bài tập',7000:'🧭 Nhà thám hiểm tri thức',8000:'🔤 Ngôi sao tiếng Anh',9000:'🐼 Ngôi sao tiếng Trung',10000:'💖 Cô bé hiếu thảo',
  11000:'👐 Đôi tay vàng việc nhà',12000:'🏅 Kiện tướng chăm ngoan',13000:'🌸 Bông hoa điểm tốt',14000:'☀️ Mặt trời bé con',15000:'🦸 Siêu nhân chăm chỉ',
  16000:'🏆 Nhà vô địch cố gắng',17000:'💎 Viên ngọc sáng',18000:'👑 Công chúa hiếu thảo',19000:'👸 Nữ hoàng chăm ngoan',20000:'😇 Thiên thần học tập',
  21000:'✨ Ngôi sao tỏa sáng',22000:'🛡️ Chiến binh kiên trì',23000:'🎓 Bậc thầy chăm chỉ',24000:'💠 Kim cương bé nhỏ',25000:'🌟 Nữ anh hùng nhí',
  26000:'🌈 Cầu vồng chăm ngoan',27000:'🏰 Huyền thoại chăm ngoan',28000:'🎖️ Huân chương vàng chăm ngoan',29000:'🎁 Báu vật gia đình',30000:'🌟 Công chúa sao vàng'
};
function autoAchievements(){
  const list=[{id:'auto_100',points:100,title:'🌱 Hạt mầm chăm chỉ'}];
  for(let s=1000;s<=100000;s+=1000){
    const lv=s/1000,rank=Math.min(10,Math.ceil(lv/10));
    const custom=CUSTOM_AUTO_TITLES[s];
    list.push({id:'auto_'+s,points:s,title:custom||(AUTO_RANK_ICONS[rank-1]+' '+AUTO_RANKS[rank-1]+' '+lv)});
  }
  return list;
}
const _autoAch=autoAchievements();
function effectiveAchievements(c){
  const autoPts=new Set(_autoAch.map(a=>a.points));
  const customs=(c.achievements||[]).filter(a=>!autoPts.has(Number(a.points||0))&&String(a.id||'').indexOf('auto_')!==0);
  return _autoAch.concat(customs);
}
function currentTitle(c){
  if(!c) return null;
  const earned=effectiveAchievements(c).filter(a=>(c.earnedAchievements||[]).indexOf(a.id)>=0).sort((a,b)=>b.points-a.points);
  return earned[0]||null;
}
function updateEarnedAchievements(c){
  if(!c)return;
  if(!Array.isArray(c.earnedAchievements))c.earnedAchievements=[];
  if(typeof c.highestScore!=='number') c.highestScore=Math.max(0,Number(c.score||0));
  if(Number(c.score||0)>c.highestScore) c.highestScore=Number(c.score||0);

  effectiveAchievements(c).forEach(a=>{
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

document.querySelectorAll('a[data-section]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    showSection(a.dataset.section);
    window.scrollTo({top:0,behavior:'smooth'});
  });
});
function showSection(name){
  currentSection=name;
  document.querySelectorAll('.app-section').forEach(s=>s.classList.remove('active'));
  document.getElementById(name+'Section')?.classList.add('active');
  document.querySelectorAll('a[data-section]').forEach(a=>a.classList.toggle('active',a.dataset.section===name));
  render();
}

// 🔊 Âm thanh Web Audio API
function playChime(type='success'){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx) return;
    const ctx=new AudioCtx();
    const notes=(type==='success')?[523.25,659.25,783.99,1046.50]:[440,554.37,659.25,880];
    notes.forEach((freq,i)=>{
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type='triangle';
      osc.frequency.setValueAtTime(freq,ctx.currentTime+i*0.07);
      gain.gain.setValueAtTime(0.18,ctx.currentTime+i*0.07);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.07+0.32);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(ctx.currentTime+i*0.07);
      osc.stop(ctx.currentTime+i*0.07+0.32);
    });
  }catch(e){}
}

// 🎆 Pháo hoa sao Confetti
let confettiAnimationId=null;
function triggerConfetti(){
  const canvas=document.getElementById('confettiCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  canvas.style.display='block';

  const particles=[];
  const colors=['#7c3aed','#f59e0b','#10b981','#ec4899','#3b82f6','#fbbf24'];
  for(let i=0;i<65;i++){
    particles.push({
      x:canvas.width/2,y:canvas.height/3,
      vx:(Math.random()-0.5)*14,vy:(Math.random()-0.75)*13,
      size:Math.random()*8+4,
      color:colors[Math.floor(Math.random()*colors.length)],
      alpha:1,rotation:Math.random()*360,vRot:(Math.random()-0.5)*10
    });
  }

  if(confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=false;
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.35;p.alpha-=0.016;p.rotation+=p.vRot;
      if(p.alpha>0){
        alive=true;
        ctx.save();ctx.globalAlpha=Math.max(0,p.alpha);
        ctx.translate(p.x,p.y);ctx.rotate((p.rotation*Math.PI)/180);
        ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        ctx.restore();
      }
    });
    if(alive){
      confettiAnimationId=requestAnimationFrame(frame);
    }else{
      canvas.style.display='none';confettiAnimationId=null;
    }
  }
  frame();
}

let toastTimer=null;
function showToast(msg){
  const el=document.getElementById('toastNotice');
  if(!el) return;
  el.textContent=msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{el.classList.remove('show')},3000);
}

function render(){
  ensureCurrentChild();
  renderChildSwitch();
  renderParentSelectors();
  renderToday();
  renderStudyPraise();
  renderQuickPraise();
  renderTargetGoalCards();
  renderStudyTools();
  renderAchievements();
  renderRewards();
  renderRideReminder();
  renderTimetable();
  renderSchoolBagChecklist();
  renderBeeTimer();
  renderCalendar();
  renderManagers();
  updateCloudStatusPill();
}

function updateCloudStatusPill(){
  const pill=document.getElementById('cloudStatusPill'),txt=document.getElementById('cloudStatusText');
  if(!pill||!txt)return;
  if(typeof syncCfg!=='undefined' && syncCfg && syncCfg.url && syncCfg.code){
    pill.classList.add('synced');
    txt.textContent='Đám mây ('+syncCfg.code+')';
  }else{
    pill.classList.remove('synced');
    txt.textContent='Dữ liệu trên máy';
  }
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

function taskCard(c,t){
  const el=document.createElement('div');
  el.className='task'+(t.done?' done':'');
  const left=document.createElement('div');
  
  let metaHtml='';
  if(t.subject) metaHtml+=`<span class="meta-chip">📘 ${safe(t.subject)}</span>`;
  if(t.duration) metaHtml+=`<span class="meta-chip">⏱ ${safe(t.duration)}</span>`;
  if(t.instruction) metaHtml+=`<span>${safe(t.instruction)}</span>`;

  left.innerHTML=`<div class="task-title">${safe(t.name)}</div><div class="meta">${metaHtml}</div>`;
  const actions=document.createElement('div');actions.className='actions';
  if(t.link){
    const a=document.createElement('a');a.className='linkbtn open';a.href=t.link;a.target='_blank';a.rel='noopener';
    a.innerHTML='↗ Mở bài học / Web';actions.appendChild(a);
  }
  left.appendChild(actions);

  const finish=document.createElement('button');
  finish.className='btn finish'+(t.done?' done':'');
  finish.innerHTML=t.done?'↩ Bỏ hoàn thành':((t.points<0?t.points:'+'+t.points)+' ⭐ Hoàn thành');
  finish.onclick=()=>toggleTaskCompletion(c.id,t.id);

  el.append(left,finish);
  return el;
}


let currentTodayCategoryFilter = 'all';
function setTodayCategoryFilter(cat){
  currentTodayCategoryFilter = cat;
  document.querySelectorAll('.today-cat-pill').forEach(btn => {
    const isAct = btn.getAttribute('onclick')?.includes("'" + cat + "'");
    btn.classList.toggle('active', !!isAct);
  });
  renderTodayCategories();
}

function renderToday(){
  const c=child();
  const avatarEl=document.getElementById('todayHeroAvatar');
  const helloEl=document.getElementById('hello');
  const scoreEl=document.getElementById('score');
  const countEl=document.getElementById('count');
  const barEl=document.getElementById('bar');
  const moneyEl=document.getElementById('moneyEquiv');
  const ht=document.getElementById('heroTitle');
  const goalNameEl=document.getElementById('goalName');

  if(!c){
    if(helloEl) helloEl.textContent='Chào con 👋';
    if(scoreEl) scoreEl.textContent='0';
    if(countEl) countEl.textContent='0/0';
    if(barEl) barEl.style.width='0%';
    if(moneyEl) moneyEl.textContent='0 đ';
    if(ht) ht.textContent='🌱 Chưa có hồ sơ bé';
    const container = document.getElementById('todayCategoriesContainer');
    if(container) container.innerHTML='<div class="empty">Chưa có hồ sơ bé nào. Vui lòng vào khu vực Phụ huynh để thêm hồ sơ bé!</div>';
    return;
  }

  const today=todayISO();
  const tasks=c.tasks.filter(t=>t.date===today);
  const done=tasks.filter(t=>t.done).length;

  if(avatarEl) avatarEl.textContent=childIcon(c);
  if(helloEl) helloEl.textContent='Chào '+childIcon(c)+' '+c.name+' 👋';
  if(scoreEl) scoreEl.textContent=c.score;
  if(countEl) countEl.textContent=done+'/'+tasks.length;
  if(barEl) barEl.style.width=(tasks.length?done/tasks.length*100:0)+'%';
  if(moneyEl) moneyEl.textContent=fmtVND(starsToVND(c.score));
  if(goalNameEl) goalNameEl.textContent=childIcon(c)+' '+c.name;

  const ct=currentTitle(c);
  if(ht){
    ht.textContent=ct?('🏅 '+ct.title):'🌱 Chưa có danh hiệu — từ 100 ⭐';
  }

  renderTodayCategories();
}

function renderTodayCategories(){
  const container = document.getElementById('todayCategoriesContainer');
  if(!container) return;
  const c = child();
  if(!c) {
    container.innerHTML = '<div class="empty">Chưa có hồ sơ bé nào. Vui lòng vào khu vực Phụ huynh để thêm hồ sơ bé!</div>';
    return;
  }
  const today = todayISO();
  const tasks = c.tasks.filter(t => t.date === today);

  // Phân loại các nhiệm vụ vào 3 nhóm
  const catKeys = ['home_study', 'school_study', 'parent_help'];
  const grouped = { home_study: [], school_study: [], parent_help: [] };

  tasks.forEach(t => {
    let cat = t.category;
    if(!cat || !grouped[cat]) {
      const s = ((t.name||'') + ' ' + (t.instruction||'') + ' ' + (t.subject||'')).toLowerCase();
      if(s.includes('cô') || s.includes('trường') || s.includes('lớp') || s.includes('thi') || s.includes('phát biểu') || s.includes('giảng')) {
        cat = 'school_study';
      } else if(s.includes('bố') || s.includes('mẹ') || s.includes('bà') || s.includes('nhà') || s.includes('dọn') || s.includes('đồ chơi') || s.includes('ngủ') || s.includes('ăn')) {
        cat = 'parent_help';
      } else {
        cat = 'home_study';
      }
      t.category = cat;
    }
    grouped[cat].push(t);
  });

  container.innerHTML = '';

  catKeys.forEach(key => {
    if(currentTodayCategoryFilter !== 'all' && currentTodayCategoryFilter !== key) return;

    const catMeta = TODAY_CATEGORIES[key];
    const catTasks = grouped[key] || [];
    const doneCount = catTasks.filter(t => t.done).length;

    const card = document.createElement('div');
    card.className = 'today-cat-card ' + key;

    // Header nhóm
    const head = document.createElement('div');
    head.className = 'today-cat-card-head';
    head.innerHTML = `
      <div class="today-cat-title-wrap">
        <span style="font-size:22px">${catMeta.icon}</span>
        <div class="today-cat-badge">${catMeta.name}</div>
        <span class="today-cat-count">${doneCount}/${catTasks.length} việc</span>
      </div>
      <div class="today-cat-quick-actions">
        <button type="button" class="today-cat-act-btn praise" onclick="openPointAdjustModal('praise', '${key}')" title="Thưởng sao nhanh cho ${catMeta.name}">
          <span>➕ Thưởng</span>
        </button>
        <button type="button" class="today-cat-act-btn penalty" onclick="openPointAdjustModal('penalty', '${key}')" title="Trừ điểm vi phạm">
          <span>➖ Trừ</span>
        </button>
      </div>
    `;
    card.appendChild(head);

    // Danh sách nhiệm vụ của nhóm
    const listWrap = document.createElement('div');
    if(!catTasks.length) {
      listWrap.innerHTML = `<div class="note" style="color:#94a3b8;padding:8px 2px;font-size:12.5px">Hôm nay chưa có việc nào trong mục <b>${catMeta.name}</b>. Bố mẹ có thể chạm <b>➕ Thưởng</b> ở trên hoặc chọn nhanh mẫu bên dưới!</div>`;
    } else {
      catTasks.forEach(t => {
        const isPenalty = Number(t.points) < 0;
        const row = document.createElement('div');
        row.className = 'today-task-row ' + (t.done ? 'done' : '') + ' ' + (isPenalty ? 'penalty-task' : '');

        let btnHtml = '';
        if(t.done) {
          btnHtml = `<button type="button" class="today-task-btn is-done" onclick="toggleTaskCompletion('${c.id}', '${t.id}')">✓ Đã xong</button>`;
        } else if(isPenalty) {
          btnHtml = `<button type="button" class="today-task-btn finish-penalty" onclick="toggleTaskCompletion('${c.id}', '${t.id}')">${t.points} ⭐ Phạt</button>`;
        } else {
          btnHtml = `<button type="button" class="today-task-btn finish-praise" onclick="toggleTaskCompletion('${c.id}', '${t.id}')">+${t.points} ⭐ Xong</button>`;
        }

        row.innerHTML = `
          <div class="today-task-info">
            <div class="today-task-name">${safe(t.name)}</div>
            <div class="today-task-meta">
              ${t.subject ? `<span class="today-task-chip">📘 ${safe(t.subject)}</span>` : ''}
              ${t.duration ? `<span class="today-task-chip">⏱ ${safe(t.duration)}</span>` : ''}
              ${t.instruction ? `<span class="note" style="font-size:11.5px;color:#64748b">${safe(t.instruction)}</span>` : ''}
            </div>
          </div>
          <div>${btnHtml}</div>
        `;
        listWrap.appendChild(row);
      });
    }
    card.appendChild(listWrap);

    // Mẫu chạm nhanh 1 lần (Praises & Penalties)
    const presetsWrap = document.createElement('div');
    presetsWrap.className = 'today-cat-presets-wrap';
    
    let pillsHtml = '';
    catMeta.praises.slice(0, 3).forEach(p => {
      pillsHtml += `<button type="button" class="today-preset-pill preset-praise" onclick="applyQuickPresetPoint('${key}', '${safe(p.name)}', ${p.points}, 'praise')"><span>${p.icon}</span> <span>${safe(p.name)}</span> <b>+${p.points}⭐</b></button>`;
    });
    catMeta.penalties.slice(0, 2).forEach(p => {
      pillsHtml += `<button type="button" class="today-preset-pill preset-penalty" onclick="applyQuickPresetPoint('${key}', '${safe(p.name)}', ${p.points}, 'penalty')"><span>${p.icon}</span> <span>${safe(p.name)}</span> <b>${p.points}⭐</b></button>`;
    });

    presetsWrap.innerHTML = `
      <div class="today-cat-presets-title">
        <span>⚡ Chạm 1 lần để cộng / trừ nhanh:</span>
      </div>
      <div class="today-cat-presets-pills">
        ${pillsHtml}
      </div>
    `;
    card.appendChild(presetsWrap);

    container.appendChild(card);
  });
}

function applyQuickPresetPoint(catKey, name, points, mode){
  const c = child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  const pts = Number(points);
  const isPenalty = (mode === 'penalty' || pts < 0);
  const delta = isPenalty ? -Math.abs(pts) : Math.abs(pts);
  const catName = TODAY_CATEGORIES[catKey]?.name || 'Hoạt động';

  c.score = Math.max(0, c.score + delta);
  if(delta > 0) c.highestScore = Math.max(c.highestScore, c.score);

  logPoint(c, isPenalty ? 'penalty' : 'bonus', delta, `[${catName}] ${name}`);
  updateEarnedAchievements(c);
  save();
  render();

  if(delta > 0) {
    playChime('success');
    triggerConfetti();
    showToast(`🎉 Đã thưởng +${Math.abs(delta)} ⭐ cho ${c.name}: ${name}!`);
  } else {
    playPenaltySound();
    showToast(`⚠️ Đã trừ ${delta} ⭐ của ${c.name}: ${name}. Bé chú ý rút kinh nghiệm nhé!`);
  }
}

/* ============================================================
   ⭐ MODAL CHẤM & TRỪ ĐIỂM SAO LINH HOẠT
   ============================================================ */
let pointAdjustState = {
  mode: 'praise',
  cat: 'home_study',
  amount: 5,
  childId: ''
};

function openPointAdjustModal(mode = 'praise', defaultCat = 'home_study', defaultPoints = null, defaultReason = ''){
  const c = child();
  fillChildSelect(document.getElementById('pointAdjustChild'));
  if(c) {
    document.getElementById('pointAdjustChild').value = c.id;
    document.getElementById('pointAdjustSubtitle').textContent = 'Dành cho ' + childIcon(c) + ' ' + c.name;
  }
  pointAdjustState.cat = defaultCat || 'home_study';
  setPointAdjustMode(mode);

  if(defaultPoints !== null) {
    document.getElementById('pointAdjustAmount').value = Math.abs(defaultPoints);
  } else {
    document.getElementById('pointAdjustAmount').value = mode === 'penalty' ? 5 : 10;
  }
  if(defaultReason) {
    document.getElementById('pointAdjustReason').value = defaultReason;
  } else {
    document.getElementById('pointAdjustReason').value = '';
  }

  selectPointAdjustCat(pointAdjustState.cat);
  document.getElementById('pointAdjustModal').classList.add('show');
}

function closePointAdjustModal(){
  document.getElementById('pointAdjustModal').classList.remove('show');
}

function setPointAdjustMode(mode){
  pointAdjustState.mode = mode;
  const isPraise = (mode === 'praise');

  document.getElementById('pointTypePraiseBtn').classList.toggle('active', isPraise);
  document.getElementById('pointTypePenaltyBtn').classList.toggle('active', !isPraise);

  const icon = document.getElementById('pointAdjustHeaderIcon');
  const title = document.getElementById('pointAdjustTitle');
  const prefix = document.getElementById('pointInputPrefix');
  const hint = document.getElementById('pointAdjustSignHint');
  const subBtn = document.getElementById('pointAdjustSubmitBtn');

  if(isPraise) {
    icon.textContent = '🌟';
    title.textContent = 'Thưởng sao cho bé';
    prefix.textContent = '+';
    prefix.className = 'point-input-prefix praise';
    hint.textContent = 'Sẽ cộng thêm sao vào ví của bé';
    hint.style.color = '#10b981';
    subBtn.className = 'primary';
    subBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    subBtn.innerHTML = '🌟 Thưởng sao ngay';
  } else {
    icon.textContent = '⚠️';
    title.textContent = 'Trừ điểm sao (Nhắc nhở vi phạm)';
    prefix.textContent = '-';
    prefix.className = 'point-input-prefix penalty';
    hint.textContent = 'Sẽ trừ bớt điểm sao của bé';
    hint.style.color = '#ef4444';
    subBtn.className = 'btn delete';
    subBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    subBtn.innerHTML = '⚠️ Xác nhận trừ điểm';
  }

  renderPointQuickChips();
  renderPointReasonSuggestions();
}

function selectPointAdjustCat(cat){
  pointAdjustState.cat = cat;
  document.getElementById('pointCatHomeBtn')?.classList.toggle('active', cat === 'home_study');
  document.getElementById('pointCatSchoolBtn')?.classList.toggle('active', cat === 'school_study');
  document.getElementById('pointCatParentBtn')?.classList.toggle('active', cat === 'parent_help');
  renderPointReasonSuggestions();
}

function renderPointQuickChips(){
  const box = document.getElementById('pointAdjustQuickChips');
  if(!box) return;
  box.innerHTML = '';
  const isPraise = (pointAdjustState.mode === 'praise');
  const list = isPraise ? [1, 2, 5, 10, 20] : [1, 2, 3, 5, 10];
  const curVal = Number(document.getElementById('pointAdjustAmount')?.value || (isPraise ? 10 : 5));

  list.forEach(val => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'point-quick-chip ' + (curVal === val ? 'active' : '');
    chip.textContent = (isPraise ? '+' : '-') + val + ' ⭐';
    chip.onclick = () => {
      document.getElementById('pointAdjustAmount').value = val;
      renderPointQuickChips();
    };
    box.appendChild(chip);
  });
}

function renderPointReasonSuggestions(){
  const box = document.getElementById('pointReasonSuggestions');
  if(!box) return;
  box.innerHTML = '';
  const isPraise = (pointAdjustState.mode === 'praise');
  const cat = pointAdjustState.cat || 'home_study';
  const meta = TODAY_CATEGORIES[cat] || TODAY_CATEGORIES.home_study;
  const items = isPraise ? meta.praises : meta.penalties;

  items.forEach(item => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'point-reason-pill';
    pill.innerHTML = `<span>${item.icon}</span> <span>${safe(item.name)}</span>`;
    pill.onclick = () => {
      document.getElementById('pointAdjustReason').value = item.name;
      document.getElementById('pointAdjustAmount').value = Math.abs(item.points);
      renderPointQuickChips();
    };
    box.appendChild(pill);
  });
}

function submitPointAdjust(){
  const childId = document.getElementById('pointAdjustChild')?.value;
  const rawPts = Number(document.getElementById('pointAdjustAmount')?.value || 0);
  const reason = document.getElementById('pointAdjustReason')?.value.trim();
  const c = data.children.find(x => x.id === childId);

  if(!c) return alert('Chưa chọn bé.');
  if(rawPts <= 0) return alert('Vui lòng nhập số điểm lớn hơn 0.');
  if(!reason) return alert('Vui lòng nhập lý do khen thưởng hoặc trừ điểm.');

  const isPenalty = (pointAdjustState.mode === 'penalty');
  const delta = isPenalty ? -Math.abs(rawPts) : Math.abs(rawPts);
  const catName = TODAY_CATEGORIES[pointAdjustState.cat]?.name || 'Hoạt động';

  c.score = Math.max(0, c.score + delta);
  if(delta > 0) c.highestScore = Math.max(c.highestScore, c.score);

  logPoint(c, isPenalty ? 'penalty' : 'bonus', delta, `[${catName}] ${reason}`);
  updateEarnedAchievements(c);
  save();
  render();
  closePointAdjustModal();

  if(delta > 0) {
    playChime('success');
    triggerConfetti();
    showToast(`🎉 Đã thưởng +${Math.abs(delta)} ⭐ cho ${c.name}: ${reason}!`);
  } else {
    playPenaltySound();
    showToast(`⚠️ Đã trừ ${delta} ⭐ của ${c.name}: ${reason}. Bé hãy cố gắng rút kinh nghiệm nhé!`);
  }
}

// ⚡ Thưởng nóng khích lệ
function renderQuickPraise(){
  const box=document.getElementById('quickPraiseList');
  if(!box)return;
  box.innerHTML='';
  QUICK_PRAISES.forEach((p,idx)=>{
    const b=document.createElement('button');
    b.className='praise-btn';
    b.innerHTML=`
      <div class="praise-btn-top">
        <span class="praise-btn-icon">${p.icon}</span>
        <span class="praise-btn-pts">+${p.points} ⭐</span>
      </div>
      <div class="praise-btn-name">${safe(p.name)}</div>
    `;
    b.onclick=()=>openQuickPraise(idx);
    box.appendChild(b);
  });

  const customBtn=document.createElement('button');
  customBtn.className='praise-custom-btn';
  customBtn.innerHTML='<span>➕</span><span>Tự nhập điểm & lý do...</span>';
  customBtn.onclick=()=>openCustomPraiseModal();
  box.appendChild(customBtn);
}

function openQuickPraise(idx){
  const c=child();
  if(!c)return alert('Chưa có hồ sơ bé.');
  const p=QUICK_PRAISES[idx];
  if(!p)return;
  pendingPraise={childId:c.id,points:p.points,reason:p.name,icon:p.icon,name:p.name};
  document.getElementById('praiseModalIcon').textContent=p.icon;
  document.getElementById('praiseModalTitle').textContent='Khen thưởng con';
  document.getElementById('praiseModalChild').textContent='Khích lệ '+childIcon(c)+' '+c.name;
  document.getElementById('praiseModalPoints').textContent='+'+p.points+' ⭐';
  document.getElementById('praiseModalReason').textContent=p.name+' — '+p.reason;
  document.getElementById('quickPraiseModal').classList.add('show');
}
function closeQuickPraiseModal(){
  document.getElementById('quickPraiseModal').classList.remove('show');
  pendingPraise=null;
}
function confirmQuickPraise(){
  if(!pendingPraise)return;
  const c=data.children.find(x=>x.id===pendingPraise.childId);
  if(!c)return;
  c.score+=pendingPraise.points;
  logPoint(c,'bonus',pendingPraise.points,'Khen thưởng khích lệ: '+pendingPraise.reason);
  updateEarnedAchievements(c);
  save();
  render();
  closeQuickPraiseModal();
  playChime('success');
  triggerConfetti();
  showToast('🎉 Đã thưởng +'+pendingPraise.points+' ⭐ cho '+c.name+': '+pendingPraise.name+'!');
}

function openCustomPraiseModal(){
  const c=child();
  fillChildSelect(document.getElementById('customPraiseChild'));
  if(c) document.getElementById('customPraiseChild').value=c.id;
  document.getElementById('customPraiseReason').value='';
  document.getElementById('customPraisePoints').value=10;
  document.getElementById('customPraiseModal').classList.add('show');
}
function closeCustomPraiseModal(){
  document.getElementById('customPraiseModal').classList.remove('show');
}
function submitCustomPraise(){
  const childId=document.getElementById('customPraiseChild').value;
  const reason=document.getElementById('customPraiseReason').value.trim();
  const pts=Number(document.getElementById('customPraisePoints').value||0);
  const c=data.children.find(x=>x.id===childId);
  if(!c)return alert('Chưa chọn bé.');
  if(pts<=0)return alert('Số điểm sao thưởng phải lớn hơn 0.');
  if(!reason)return alert('Hãy nhập lý do khen con.');
  c.score+=pts;
  logPoint(c,'bonus',pts,'Khen thưởng: '+reason);
  updateEarnedAchievements(c);
  save();
  render();
  closeCustomPraiseModal();
  playChime('success');
  triggerConfetti();
  showToast('🎉 Đã thưởng +'+pts+' ⭐ cho '+c.name+': '+reason+'!');
}

// 📚 Hiển thị danh mục cộng điểm học tập nhanh trên màn hình Hôm nay
function renderStudyPraise(){
  const box=document.getElementById('studyPresetList');
  if(!box)return;
  box.innerHTML='';
  STUDY_PRESETS.forEach(p=>{
    const b=document.createElement('button');
    b.className='study-preset-btn';
    b.innerHTML=`
      <div class="study-preset-top">
        <span class="study-preset-icon">${p.icon}</span>
        <span class="study-preset-pts">+${p.points} ⭐</span>
      </div>
      <div class="study-preset-name">${safe(p.name)}</div>
    `;
    b.onclick=()=>openStudyScoreModal(p.id);
    box.appendChild(b);
  });

  const customBtn=document.createElement('button');
  customBtn.className='study-preset-custom-btn';
  customBtn.innerHTML='<span>➕</span><span>Tự nhập điểm & bài học...</span>';
  customBtn.onclick=()=>openStudyScoreModal();
  box.appendChild(customBtn);
}

// 📚 Mở modal Chấm & Cộng điểm học tập
let activeStudyChipId=null;
function openStudyScoreModal(presetIdOrObj, defaultSubject){
  const c=child();
  fillChildSelect(document.getElementById('studyScoreChild'));
  if(c) document.getElementById('studyScoreChild').value=c.id;

  // Điền dropdown môn học
  const subjSelect=document.getElementById('studyScoreSubject');
  subjSelect.innerHTML='';
  const allSubjects=Array.from(new Set([...(data.subjects||[]),'Toán','Tiếng Việt','Tiếng Anh','Tiếng Trung','Kỹ năng sống']));
  allSubjects.forEach(s=>{
    const opt=document.createElement('option');
    opt.value=s;opt.textContent='📘 '+s;
    subjSelect.appendChild(opt);
  });
  const optOther=document.createElement('option');
  optOther.value='other';optOther.textContent='✏️ Môn học khác...';
  subjSelect.appendChild(optOther);

  document.getElementById('customSubjectWrap').style.display='none';
  document.getElementById('studyScoreCustomSubject').value='';

  // Điền danh sách chip chọn nhanh
  const chipBox=document.getElementById('studyScoreChips');
  chipBox.innerHTML='';
  STUDY_PRESETS.forEach(p=>{
    const chip=document.createElement('button');
    chip.type='button';
    chip.className='study-chip'+(presetIdOrObj===p.id?' active':'');
    chip.innerHTML=`<span>${p.icon}</span><span>${safe(p.name)}</span><b style="color:#4338ca">+${p.points}⭐</b>`;
    chip.onclick=()=>selectStudyPreset(p.id);
    chipBox.appendChild(chip);
  });

  let pFound=null;
  if(typeof presetIdOrObj==='string'){
    pFound=STUDY_PRESETS.find(x=>x.id===presetIdOrObj);
  }

  if(pFound){
    activeStudyChipId=pFound.id;
    document.getElementById('studyScoreTopic').value=pFound.name;
    document.getElementById('studyScorePoints').value=pFound.points;
    if(pFound.subject && allSubjects.includes(pFound.subject)){
      subjSelect.value=pFound.subject;
    }
    document.getElementById('studyScoreNote').value='Rất khen ngợi sự chăm chỉ và cố gắng của con!';
  }else{
    activeStudyChipId=null;
    document.getElementById('studyScoreTopic').value='';
    document.getElementById('studyScorePoints').value=10;
    if(defaultSubject && allSubjects.includes(defaultSubject)){
      subjSelect.value=defaultSubject;
    }
    document.getElementById('studyScoreNote').value='';
  }

  document.getElementById('studyScoreModal').classList.add('show');
}

function closeStudyScoreModal(){
  document.getElementById('studyScoreModal').classList.remove('show');
}

function checkCustomSubject(val){
  const wrap=document.getElementById('customSubjectWrap');
  if(val==='other'){
    wrap.style.display='block';
    document.getElementById('studyScoreCustomSubject').focus();
  }else{
    wrap.style.display='none';
  }
}

function selectStudyPreset(presetId){
  const p=STUDY_PRESETS.find(x=>x.id===presetId);
  if(!p)return;
  activeStudyChipId=p.id;
  document.querySelectorAll('.study-chip').forEach(c=>c.classList.remove('active'));
  event?.target?.closest('.study-chip')?.classList.add('active');

  document.getElementById('studyScoreTopic').value=p.name;
  document.getElementById('studyScorePoints').value=p.points;
  const subjSelect=document.getElementById('studyScoreSubject');
  if(p.subject && Array.from(subjSelect.options).some(o=>o.value===p.subject)){
    subjSelect.value=p.subject;
    document.getElementById('customSubjectWrap').style.display='none';
  }
  if(!document.getElementById('studyScoreNote').value){
    document.getElementById('studyScoreNote').value='Rất khen ngợi sự chăm chỉ và cố gắng của con!';
  }
}

function setStudyScoreQuickPoints(pts){
  document.getElementById('studyScorePoints').value=pts;
}

function submitStudyScore(){
  const childId=document.getElementById('studyScoreChild').value;
  let subject=document.getElementById('studyScoreSubject').value;
  if(subject==='other'){
    subject=document.getElementById('studyScoreCustomSubject').value.trim()||'Học tập';
    if(!data.subjects.includes(subject)) data.subjects.push(subject);
  }
  const pts=Number(document.getElementById('studyScorePoints').value||0);
  const topic=document.getElementById('studyScoreTopic').value.trim();
  const note=document.getElementById('studyScoreNote').value.trim();
  const c=data.children.find(x=>x.id===childId);

  if(!c)return alert('Chưa chọn bé.');
  if(pts<=0)return alert('Số điểm sao thưởng phải lớn hơn 0.');
  if(!topic)return alert('Hãy nhập tên bài kiểm tra hoặc nội dung học tập.');

  if(!Array.isArray(c.pointHistory)) c.pointHistory=[];
  c.score+=pts;

  const record={
    id:uid('study'),
    type:'study',
    subject:subject,
    topic:topic,
    amount:pts,
    note:note,
    reason:`[${subject}] ${topic}${note?' — '+note:''}`,
    at:new Date().toISOString()
  };
  c.pointHistory.push(record);
  updateEarnedAchievements(c);
  save();
  render();
  closeStudyScoreModal();
  playChime('success');
  triggerConfetti();
  showToast(`🎉 Đã cộng +${pts} ⭐ môn ${subject} cho ${c.name}: ${topic}!`);
}

function deleteStudyPointRecord(childId, recordId){
  const c=data.children.find(x=>x.id===childId);
  if(!c||!Array.isArray(c.pointHistory))return;
  const idx=c.pointHistory.findIndex(h=>h.id===recordId);
  if(idx<0)return;
  const item=c.pointHistory[idx];
  askConfirm(
    'Xóa điểm học tập',
    `Xóa lượt cộng điểm "${item.topic||item.reason}" (+${item.amount} ⭐) và hoàn lại điểm của ${c.name}?`,
    ()=>{
      c.score=Math.max(0,c.score-Number(item.amount||0));
      c.pointHistory.splice(idx,1);
      save();render();
      showToast('Đã xóa lượt cộng điểm học tập.');
    },
    {yesText:'Có, xóa lượt điểm',icon:'⚠️'}
  );
}

function renderStudyStats(){
  const c=child();
  const scoreBox=document.getElementById('studyTotalScore');
  const countBox=document.getElementById('studyEntryCount');
  const chipBox=document.getElementById('studySubjectStats');
  const listBox=document.getElementById('studyHistoryList');
  if(!scoreBox||!countBox||!chipBox||!listBox)return;

  if(!c){
    scoreBox.textContent='0 ⭐';
    countBox.textContent='0';
    chipBox.innerHTML='';
    listBox.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>';
    return;
  }

  const studyRecords=(c.pointHistory||[]).filter(h=>h.type==='study');
  const totalScore=studyRecords.reduce((sum,r)=>sum+Number(r.amount||0),0);
  scoreBox.textContent=totalScore.toLocaleString('vi-VN')+' ⭐';
  countBox.textContent=studyRecords.length;

  // Thống kê phân loại theo môn
  chipBox.innerHTML='';
  const bySubject={};
  studyRecords.forEach(r=>{
    const subj=r.subject||'Khác';
    if(!bySubject[subj]) bySubject[subj]={count:0,points:0};
    bySubject[subj].count++;
    bySubject[subj].points+=Number(r.amount||0);
  });
  const subKeys=Object.keys(bySubject);
  if(subKeys.length){
    subKeys.forEach(s=>{
      const b=document.createElement('span');
      b.className='study-subject-badge';
      b.innerHTML=`📘 ${safe(s)}: <b>+${bySubject[s].points} ⭐</b> <span style="color:#64748b">(${bySubject[s].count} lần)</span>`;
      chipBox.appendChild(b);
    });
  }

  // Danh sách nhật ký học tập (mới nhất lên đầu)
  listBox.innerHTML='';
  if(!studyRecords.length){
    listBox.innerHTML='<div class="empty">Bé chưa có lượt cộng điểm học tập nào. Hãy bấm nút <b>“➕ Cộng điểm học tập”</b> phía trên để ghi nhận thành tích đầu tiên nhé! ⭐</div>';
  }else{
    studyRecords.slice().reverse().forEach(r=>{
      const item=document.createElement('div');
      item.className='study-history-item';
      item.innerHTML=`
        <div class="study-history-left">
          <div class="study-history-badge">📘 ${safe(r.subject||'Học tập')}</div>
          <div class="study-history-topic"><b>${safe(r.topic||r.reason)}</b></div>
          ${r.note?`<div class="study-history-note">💬 ${safe(r.note)}</div>`:''}
          <div class="study-history-time">📅 ${fmtDate(r.at)}</div>
        </div>
        <div class="study-history-right">
          <div class="study-history-pts">+${r.amount} ⭐</div>
          <button class="study-history-del" onclick="deleteStudyPointRecord('${c.id}','${r.id}')" title="Xóa nếu ghi nhầm">✕</button>
        </div>
      `;
      listBox.appendChild(item);
    });
  }
}

// 🎯 Mục tiêu quà đang phấn đấu (Target Wishlist)
function setTargetGoal(rewardId){
  const c=child();if(!c)return;
  c.targetRewardId=rewardId;
  save();render();
  showToast('🎯 Đã đặt món quà làm mục tiêu phấn đấu!');
}
function clearTargetGoal(){
  const c=child();if(!c)return;
  c.targetRewardId=null;
  save();render();
}

function renderTargetGoalCards(){
  const c=child();
  ['todayTargetGoalCard','rewardsTargetGoalCard'].forEach(id=>{
    const box=document.getElementById(id);
    if(!box)return;
    if(!c||!c.targetRewardId){
      box.style.display='none';box.innerHTML='';return;
    }
    const target=c.rewards.find(r=>r.id===c.targetRewardId);
    if(!target){
      box.style.display='none';box.innerHTML='';return;
    }
    box.style.display='block';
    const percent=Math.min(100,Math.round((c.score/target.cost)*100));
    const isReady=c.score>=target.cost;

    box.innerHTML=`
      <div class="target-goal-card">
        <div class="target-goal-head">
          <div class="target-goal-title">
            <span>🎯</span>
            <span>Mục tiêu phấn đấu: <b>${safe(target.name)}</b></span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="target-goal-badge">${percent}%</span>
            <button onclick="clearTargetGoal()" title="Hủy mục tiêu" style="background:transparent;border:0;color:#64748b;font-weight:900;padding:2px 6px">✕</button>
          </div>
        </div>
        <div class="target-goal-progress"><i style="width:${percent}%"></i></div>
        <div class="target-goal-footer">
          <span>${c.score} / ${target.cost} ⭐</span>
          ${isReady
            ? `<button class="primary" style="padding:6px 14px;font-size:12px;background:linear-gradient(135deg,#10b981,#059669)" onclick="redeemTargetGoal('${target.id}')">🎉 Đủ điểm rồi, Đổi ngay!</button>`
            : `<span>Còn thiếu <b>${target.cost-c.score} ⭐</b> nữa</span>`
          }
        </div>
      </div>
    `;
  });
}

function redeemTargetGoal(rewardId){
  const c=child();if(!c)return;
  const target=c.rewards.find(r=>r.id===rewardId);
  if(!target)return;
  redeem(target);
}

// 💡 Góc học tập
function filterStudyTools(cat,btn){
  selectedToolCategory=cat;
  document.querySelectorAll('.tools-filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderStudyTools();
}
function renderStudyTools(){
  const box=document.getElementById('studyToolsGrid');
  if(!box)return;
  box.innerHTML='';
  const tools=Array.isArray(data.studyTools)&&data.studyTools.length?data.studyTools:DEFAULT_STUDY_TOOLS;
  const filtered=(selectedToolCategory==='all')?tools:tools.filter(t=>t.category===selectedToolCategory);

  if(!filtered.length){
    box.innerHTML='<div class="empty" style="grid-column:1/-1">Không có công cụ học tập nào trong nhóm này. Phụ huynh có thể bấm thêm trong khu vực Phụ huynh.</div>';
    return;
  }

  filtered.forEach(t=>{
    const card=document.createElement('div');
    card.className='tool-card';
    card.innerHTML=`
      <div>
        <div class="tool-card-head">
          <div class="tool-card-icon">${t.icon||'🌐'}</div>
          <div>
            <div class="tool-card-title">${safe(t.name)}</div>
            <span class="tool-card-cat">${safe(t.category)}</span>
          </div>
        </div>
        <div class="tool-card-desc">${safe(t.desc||'')}</div>
      </div>
      <div class="tool-card-actions">
        <a class="tool-btn-open" href="${safe(t.url)}" target="_blank" rel="noopener">Mở học ngay ↗</a>
        <button class="tool-btn-assign" onclick="assignTaskFromTool('${safe(t.id)}')">Giao bài 📝</button>
      </div>
    `;
    box.appendChild(card);
  });
}

function assignTaskFromTool(toolId){
  const tools=Array.isArray(data.studyTools)&&data.studyTools.length?data.studyTools:DEFAULT_STUDY_TOOLS;
  const tool=tools.find(t=>t.id===toolId);
  if(!tool)return;
  openParentModal();
  setTimeout(()=>{
    const quickSel=document.getElementById('taskQuickToolSelect');
    if(quickSel) quickSel.value=tool.id;
    fillTaskLinkFromTool(tool.id);
  },150);
}

function fillTaskLinkFromTool(toolId){
  if(!toolId)return;
  const tools=Array.isArray(data.studyTools)&&data.studyTools.length?data.studyTools:DEFAULT_STUDY_TOOLS;
  const tool=tools.find(t=>t.id===toolId);
  if(!tool)return;
  document.getElementById('taskLink').value=tool.url;
  if(!document.getElementById('taskName').value.trim()){
    document.getElementById('taskName').value='Học trên '+tool.name;
  }
  const subjSel=document.getElementById('subject');
  if(tool.category.includes('Toán')&&data.subjects.includes('Toán')) subjSel.value='Toán';
  else if(tool.category.includes('Tiếng Anh')&&data.subjects.includes('Tiếng Anh')) subjSel.value='Tiếng Anh';
  else if(tool.category.includes('Tiếng Việt')&&data.subjects.includes('Tiếng Việt')) subjSel.value='Tiếng Việt';
  else if(tool.category.includes('Lập trình')&&data.subjects.includes('Kỹ năng sống')) subjSel.value='Kỹ năng sống';
}

function toggleTaskCompletion(childId,taskId){
  const c=data.children.find(x=>x.id===childId);if(!c)return;
  const t=c.tasks.find(x=>x.id===taskId);if(!t)return;
  if(!t.done){
    askConfirm('Xác nhận hoàn thành',`Con chắc chắn đã hoàn thành nhiệm vụ "${t.name}" chưa?`,()=>{
      t.done=true;t.awardedPoints=Number(t.points||0);t.completedAt=new Date().toISOString();
      c.score+=t.awardedPoints;logPoint(c,'task',t.awardedPoints,'Hoàn thành: '+t.name);
      updateEarnedAchievements(c);save();render();
      playChime('success');
      triggerConfetti();
      showToast('🎉 Giỏi quá! Con đã hoàn thành "'+t.name+'" và nhận '+(t.points>0?'+':'')+t.points+' ⭐!');
    },{yesText:'Có, con đã hoàn thành',icon:'✅'});
  }else{
    askConfirm('Bỏ hoàn thành',`Con có chắc đã tích nhầm và muốn bỏ hoàn thành nhiệm vụ "${t.name}" không? Điểm của nhiệm vụ sẽ bị trừ lại.`,()=>{
      const back=Number(t.awardedPoints??t.points??0);
      c.score-=back;logPoint(c,'undo-task',-back,'Bỏ hoàn thành: '+t.name);
      t.done=false;t.awardedPoints=0;t.completedAt=null;save();render();
    },{yesText:'Có, bỏ hoàn thành',icon:'↩'});
  }
}

function renderAchievements(){
  const c=child();document.getElementById('achievementName').textContent=c?(childIcon(c)+' '+c.name):'bé';
  const earnedBox=document.getElementById('earnedAchievements');
  earnedBox.innerHTML='';
  if(!c){
    document.getElementById('completedCount').textContent='0';
    document.getElementById('achievementScore').textContent='0';
    document.getElementById('totalGiftsReceived').textContent='0';
    document.getElementById('penaltyCount').textContent='0';
    document.getElementById('penaltyTotal').textContent='0';
    earnedBox.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>';
    document.getElementById('giftAchievementStats').innerHTML='';
    document.getElementById('penaltyAchievementStats').innerHTML='';
    return;
  }
  const completedTasks=c.tasks.filter(t=>t.done);
  document.getElementById('completedCount').textContent=completedTasks.length;
  document.getElementById('achievementScore').textContent=c.score;
  renderStudyStats();

  const earnedList=effectiveAchievements(c).filter(a=>(c.earnedAchievements||[]).includes(a.id)).sort((a,b)=>b.points-a.points);
  if(!earnedList.length)earnedBox.innerHTML='<div class="empty">Bé chưa đạt mốc thành tích nào. Cùng cố gắng tích lũy từ 100 ⭐ nhé!</div>';
  else earnedList.forEach(a=>{
    const d=document.createElement('div');d.className='gift';
    d.innerHTML=`<div class="emoji">🏅</div><div class="grow"><b>${safe(a.title)}</b><div class="note">Đạt mốc ${a.points.toLocaleString('vi-VN')} ⭐</div></div>`;
    earnedBox.appendChild(d);
  });

  const giftBox=document.getElementById('giftAchievementStats'),gifts=Array.isArray(c.giftHistory)?c.giftHistory:[];
  document.getElementById('totalGiftsReceived').textContent=gifts.length;
  giftBox.innerHTML='';
  if(!gifts.length){giftBox.innerHTML='<div class="empty">Bé chưa đổi phần quà nào.</div>';}
  else{
    const counts={};
    gifts.forEach(g=>{counts[g.name]=(counts[g.name]||0)+1;});
    Object.keys(counts).forEach(name=>{
      const row=document.createElement('div');row.className='gift';
      row.innerHTML=`<div class="emoji">🎁</div><div class="grow"><b>${safe(name)}</b><div class="note">Đã nhận: ${counts[name]} lần</div></div>`;
      giftBox.appendChild(row);
    });
  }

  const penaltyBox=document.getElementById('penaltyAchievementStats');
  const penaltyHistory=(c.pointHistory||[]).filter(h=>h.type==='penalty');
  const penaltyTotal=penaltyHistory.reduce((sum,h)=>sum+Math.abs(Number(h.amount||0)),0);
  document.getElementById('penaltyCount').textContent=penaltyHistory.length;
  document.getElementById('penaltyTotal').textContent=penaltyTotal;
  penaltyBox.innerHTML='';
  if(!penaltyHistory.length){
    penaltyBox.innerHTML='<div class="empty">Bé chưa có lần nhắc nhở hay điểm phạt nào. Rất ngoan! 🌟</div>';
  }else{
    penaltyHistory.slice().reverse().forEach(h=>{
      const row=document.createElement('div');row.className='gift';
      row.innerHTML=
        '<div class="emoji">⚠️</div>'+
        '<div class="grow">'+
          '<b>'+safe(h.reason||'Nhắc nhở')+'</b>'+
          '<div class="note">Trừ '+Math.abs(h.amount)+' ⭐ • Ngày: '+fmtDate(h.at)+'</div>'+
        '</div>';
      penaltyBox.appendChild(row);
    });
  }
}

function currentRewards(){return child()?.rewards||[]}

function exchangeRate(){
  const r=data.exchangeRate;
  if(r&&Number(r.stars)>0&&Number(r.vnd)>0) return r;
  return {stars:100,vnd:5000};
}
function fmtVND(n){return Math.floor(Number(n||0)).toLocaleString('vi-VN')+' đ'}
function starsToVND(stars){
  const r=exchangeRate(),s=Number(stars||0);
  if(!(s>0)) return 0;
  return Math.round(s*Number(r.vnd)/Number(r.stars));
}

// 💱 Modal Đổi sao ra tiền mặt linh hoạt
function openFlexibleMoneyModal(){
  const c=child();
  if(!c)return alert('Chưa có hồ sơ bé.');
  const r=exchangeRate();
  document.getElementById('moneyModalRateInfo').textContent=`Tỷ giá: ${r.stars} ⭐ = ${fmtVND(r.vnd)} (1 ⭐ = ${fmtVND(r.vnd/r.stars)})`;
  document.getElementById('moneyModalCurrentStars').textContent=c.score+' ⭐ ('+fmtVND(starsToVND(c.score))+')';
  
  [20,50,100,200,500].forEach(p=>{
    const el=document.getElementById('qSub'+p);
    if(el) el.textContent=fmtVND(starsToVND(p));
  });

  const inp=document.getElementById('customMoneyStars');
  inp.value=Math.min(c.score,100)||'';
  updateCustomMoneyCalc();
  document.getElementById('flexibleMoneyModal').classList.add('show');
}
function closeFlexibleMoneyModal(){
  document.getElementById('flexibleMoneyModal').classList.remove('show');
}
function selectQuickMoney(stars){
  document.getElementById('customMoneyStars').value=stars;
  updateCustomMoneyCalc();
}
function selectAllStarsMoney(){
  const c=child();
  document.getElementById('customMoneyStars').value=c?c.score:0;
  updateCustomMoneyCalc();
}
function updateCustomMoneyCalc(){
  const stars=Number(document.getElementById('customMoneyStars').value||0);
  const vnd=starsToVND(stars);
  document.getElementById('customMoneyVndResult').textContent=fmtVND(vnd);
}
function confirmFlexibleMoneyRedeem(){
  const c=child();if(!c)return;
  const stars=Number(document.getElementById('customMoneyStars').value||0);
  if(stars<=0) return alert('Hãy nhập số sao muốn đổi (lớn hơn 0).');
  if(c.score<stars){
    document.getElementById('missingPoints').textContent=(stars-c.score).toLocaleString('vi-VN');
    closeFlexibleMoneyModal();
    document.getElementById('encourageModal').classList.add('show');
    return;
  }
  const vnd=starsToVND(stars);
  const giftName='Tiền thưởng '+fmtVND(vnd);
  askConfirm('Xác nhận đổi tiền',`Con chắc chắn muốn đổi ${stars.toLocaleString('vi-VN')} ⭐ ra ${giftName}?`,()=>{
    if(!Array.isArray(c.giftHistory))c.giftHistory=[];
    if(!Array.isArray(c.pointHistory))c.pointHistory=[];
    c.giftHistory.push({
      id:uid('g'),rewardId:'money_'+stars,name:giftName,cost:stars,
      status:'pending',receivedAt:new Date().toISOString()
    });
    c.score-=stars;
    logPoint(c,'reward',-stars,'Đổi sao ra tiền: '+giftName);
    save();render();
    closeFlexibleMoneyModal();
    playChime('success');
    triggerConfetti();
    document.getElementById('successGiftName').textContent=giftName;
    document.getElementById('successGiftPoints').textContent=stars.toLocaleString('vi-VN');
    document.getElementById('rewardSuccessModal').classList.add('show');
  },{yesText:'Có, con muốn đổi',icon:'💰'});
}

// ⚡ Modal Đổi quà theo thỏa thuận trực tiếp (Custom Reward Barter)
function openCustomRewardModal(){
  const c=child();
  fillChildSelect(document.getElementById('customRewardChild'));
  if(c) document.getElementById('customRewardChild').value=c.id;
  document.getElementById('customRewardName').value='';
  document.getElementById('customRewardCost').value=30;
  document.getElementById('customRewardModal').classList.add('show');
}
function closeCustomRewardModal(){
  document.getElementById('customRewardModal').classList.remove('show');
}
function submitCustomReward(){
  const childId=document.getElementById('customRewardChild').value;
  const name=document.getElementById('customRewardName').value.trim();
  const cost=Number(document.getElementById('customRewardCost').value||0);
  const c=data.children.find(x=>x.id===childId);
  if(!c)return alert('Chưa chọn bé.');
  if(!name)return alert('Hãy nhập tên món quà hoặc điều con muốn đổi.');
  if(cost<=0)return alert('Số sao thỏa thuận phải lớn hơn 0.');
  if(c.score<cost){
    document.getElementById('missingPoints').textContent=(cost-c.score).toLocaleString('vi-VN');
    closeCustomRewardModal();
    document.getElementById('encourageModal').classList.add('show');
    return;
  }
  askConfirm('Xác nhận đổi thỏa thuận',`Đổi "${name}" với ${cost} điểm sao cho ${c.name}?`,()=>{
    if(!Array.isArray(c.giftHistory))c.giftHistory=[];
    if(!Array.isArray(c.pointHistory))c.pointHistory=[];
    c.giftHistory.push({
      id:uid('g'),rewardId:'custom_'+Date.now(),name:name,cost:cost,
      status:'pending',receivedAt:new Date().toISOString()
    });
    c.score-=cost;
    logPoint(c,'reward',-cost,'Đổi quà thỏa thuận: '+name);
    save();render();
    closeCustomRewardModal();
    playChime('success');
    triggerConfetti();
    document.getElementById('successGiftName').textContent=name;
    document.getElementById('successGiftPoints').textContent=cost;
    document.getElementById('rewardSuccessModal').classList.add('show');
  },{yesText:'Có, xác nhận đổi',icon:'🎁'});
}

// 🎁 Bộ lọc danh mục quà & Render quà
function filterRewards(cat,btn){
  selectedRewardCategory=cat;
  document.querySelectorAll('.rewards-filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderRewards();
}

function renderRewards(){
  const c=child();
  const nameChildEl=document.getElementById('rewardNameChild');
  if(nameChildEl) nameChildEl.textContent=c?(childIcon(c)+' '+c.name):'bé';
  const scoreEl=document.getElementById('rewardCurrentScore');
  if(scoreEl) scoreEl.textContent=c?(c.score+' ⭐'):'0 ⭐';

  const boxToday=document.getElementById('rewardShopToday');
  const boxMain=document.getElementById('rewardShopStandalone');
  if(boxToday) boxToday.innerHTML='';
  if(boxMain) boxMain.innerHTML='';

  const rewards=currentRewards();
  if(!rewards.length){
    const e=document.createElement('div');e.className='empty';e.textContent='Chưa có phần quà nào được thiết lập cho bé.';
    if(boxToday) boxToday.appendChild(e.cloneNode(true));
    if(boxMain) boxMain.appendChild(e);
    renderPendingGifts();
    return;
  }

  // Render on Today page (preview 4 items)
  if(boxToday){
    rewards.slice(0,4).forEach(r=>{
      const row=document.createElement('div');row.className='gift';
      row.innerHTML=`
        <div class="emoji">${r.icon||'🎁'}</div>
        <div class="grow">
          <b>${safe(r.name)}</b>
          <div class="pts">${r.cost} ⭐</div>
        </div>
      `;
      const b=document.createElement('button');b.className='btn-redeem';b.textContent='Đổi';b.onclick=()=>redeem(r);
      row.appendChild(b);
      boxToday.appendChild(row);
    });
  }

  // Render on full Rewards page (with filtering and goal setting)
  if(boxMain){
    const filtered=(selectedRewardCategory==='all')?rewards:rewards.filter(r=>r.category===selectedRewardCategory);
    if(!filtered.length){
      boxMain.innerHTML='<div class="empty">Không có món quà nào trong nhóm này.</div>';
    }else{
      filtered.forEach(r=>{
        const isTarget=c && c.targetRewardId===r.id;
        const row=document.createElement('div');row.className='gift';
        row.innerHTML=`
          <div class="emoji">${r.icon||'🎁'}</div>
          <div class="grow">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <b>${safe(r.name)}</b>
              <span class="meta-chip" style="font-size:11px">${safe(r.category||'Quà tặng')}</span>
            </div>
            <div class="pts">${r.cost} ⭐</div>
            ${r.rule?`<div class="note">${safe(r.rule)}</div>`:''}
          </div>
          <div class="gift-actions">
            <button class="btn-set-goal${isTarget?' active':''}" onclick="setTargetGoal('${r.id}')">${isTarget?'🎯 Mục tiêu của con':'🎯 Đặt mục tiêu'}</button>
            <button class="btn-redeem" onclick="redeemById('${r.id}')">Đổi quà 🎁</button>
          </div>
        `;
        boxMain.appendChild(row);
      });
    }
  }

  renderPendingGifts();
}

function renderPendingGifts(){
  const c=child();
  const container=document.getElementById('pendingGiftsContainer');
  const list=document.getElementById('pendingGiftsList');
  if(!container||!list)return;
  if(!c){container.style.display='none';return;}

  const pendingGifts=(c.giftHistory||[]).filter(g=>g.status==='pending');
  if(!pendingGifts.length){
    container.style.display='none';list.innerHTML='';return;
  }

  container.style.display='block';
  list.innerHTML='';
  pendingGifts.forEach(g=>{
    const item=document.createElement('div');
    item.className='pending-gift-item';
    item.innerHTML=`
      <div>
        <div style="font-weight:800;font-size:14px">🎁 ${safe(g.name)}</div>
        <div class="note">Đã trừ: <b>${g.cost} ⭐</b> • Đổi lúc: ${fmtDate(g.receivedAt)}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="primary" style="padding:7px 12px;font-size:12px;background:#16a34a" onclick="fulfillGift('${g.id}')">✅ Đã trao quà</button>
        <button class="btn delete" style="padding:7px 10px;font-size:12px" onclick="refundGift('${g.id}')">↩ Hoàn sao</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function fulfillGift(giftId){
  const c=child();if(!c)return;
  const g=c.giftHistory.find(x=>x.id===giftId);if(!g)return;
  askConfirm('Xác nhận đã trao quà',`Bố mẹ đã thực hiện xong phần quà "${g.name}" cho ${c.name}?`,()=>{
    g.status='fulfilled';
    g.fulfilledAt=new Date().toISOString();
    save();render();
    playChime('success');
    showToast('🎉 Tuyệt vời! Đã hoàn thành trao quà cho con!');
  },{yesText:'Có, đã trao quà',icon:'✅'});
}

function refundGift(giftId){
  const c=child();if(!c)return;
  const g=c.giftHistory.find(x=>x.id===giftId);if(!g)return;
  askConfirm('Hoàn lại điểm sao',`Hủy nhận quà và hoàn trả ${g.cost} ⭐ lại cho ${c.name}?`,()=>{
    c.score+=Number(g.cost||0);
    logPoint(c,'undo-reward',Number(g.cost||0),'Hoàn lại sao: '+g.name);
    c.giftHistory=c.giftHistory.filter(x=>x.id!==giftId);
    save();render();
    showToast('↩ Đã hoàn lại '+g.cost+' ⭐ cho con!');
  },{yesText:'Có, hoàn sao',icon:'↩'});
}

function redeemById(rewardId){
  const c=child();if(!c)return;
  const r=c.rewards.find(x=>x.id===rewardId);
  if(!r)return;
  redeem(r);
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
    c.giftHistory.push({
      id:uid('g'),rewardId:r.id,name:r.name,cost:Number(r.cost||0),category:r.category,icon:r.icon,
      status:'pending',receivedAt:new Date().toISOString()
    });
    c.score-=Number(r.cost||0);logPoint(c,'reward',-Number(r.cost||0),'Đổi quà: '+r.name);
    save();render();
    playChime('success');
    triggerConfetti();
    document.getElementById('successGiftName').textContent=r.name;
    document.getElementById('successGiftPoints').textContent=r.cost;
    document.getElementById('rewardSuccessModal').classList.add('show');
  },{yesText:'Có, con muốn đổi',icon:'🎁'});
}
function closeRewardSuccess(){document.getElementById('rewardSuccessModal').classList.remove('show')}
function closeEncourage(){document.getElementById('encourageModal').classList.remove('show')}

function saveExchangeRate(){
  const s=Number(document.getElementById('rateStars').value||0),v=Number(document.getElementById('rateVnd').value||0);
  if(!(s>0)||!(v>0))return alert('Hãy nhập tỷ giá hợp lệ (số dương).');
  askConfirm('Lưu tỷ giá',`Đặt tỷ giá ${s} sao = ${fmtVND(v)} nhé?`,()=>{
    data.exchangeRate={stars:s,vnd:v};save();render();
  },{yesText:'Có, lưu tỷ giá',icon:'💱'});
}
function renderRateManager(){
  const rs=document.getElementById('rateStars'),rv=document.getElementById('rateVnd'),rc=document.getElementById('rateCurrent');
  if(!rs||!rv||!rc)return;
  const r=exchangeRate();
  if(document.activeElement!==rs)rs.value=r.stars;
  if(document.activeElement!==rv)rv.value=r.vnd;
  rc.textContent='Tỷ giá quy đổi: '+r.stars+' ⭐ = '+fmtVND(r.vnd)+' (1 ⭐ = '+fmtVND(r.vnd/r.stars)+').';
}

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
        rewardTarget=document.getElementById('rewardTarget'),achievementTarget=document.getElementById('achievementTarget'),
        quickToolSelect=document.getElementById('taskQuickToolSelect');
  fillChildSelect(assign,true);fillChildSelect(bonus);fillChildSelect(penalty);fillChildSelect(editChild);fillChildSelect(rewardTarget,true);fillChildSelect(achievementTarget,true);
  if(editChild && !editChild.value && currentChildId)editChild.value=currentChildId;
  if(rewardTarget && !rewardTarget.value && currentChildId)rewardTarget.value=currentChildId;
  if(achievementTarget && !achievementTarget.value && currentChildId)achievementTarget.value=currentChildId;
  const prev=subject.value;subject.innerHTML='';data.subjects.forEach(s=>subject.add(new Option(s,s)));
  if(!data.subjects.length)subject.add(new Option('Chưa có môn học',''));
  if([...subject.options].some(o=>o.value===prev))subject.value=prev;

  if(quickToolSelect){
    const prevT=quickToolSelect.value;
    quickToolSelect.innerHTML='<option value="">-- Chọn nguồn web có sẵn --</option>';
    const tools=Array.isArray(data.studyTools)&&data.studyTools.length?data.studyTools:DEFAULT_STUDY_TOOLS;
    tools.forEach(t=>{
      quickToolSelect.add(new Option((t.icon||'🌐')+' '+t.name,t.id));
    });
    if([...quickToolSelect.options].some(o=>o.value===prevT))quickToolSelect.value=prevT;
  }

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
        c.name=n;c.gender=g;save();render();
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

  renderParentToolList();
  renderRewardManager();
  renderAchievementManager();
  renderRateManager();
  renderPresets();
}

function renderParentToolList(){
  const box=document.getElementById('parentToolList');
  if(!box)return;
  box.innerHTML='';
  const tools=Array.isArray(data.studyTools)&&data.studyTools.length?data.studyTools:DEFAULT_STUDY_TOOLS;
  if(!tools.length){
    box.innerHTML='<div class="empty">Chưa có liên kết học tập nào.</div>';
    return;
  }
  tools.forEach(t=>{
    const item=document.createElement('div');
    item.className='compact-item';
    const head=document.createElement('div');
    head.className='compact-head';
    head.innerHTML=`<div><b>${t.icon||'🌐'} ${safe(t.name)}</b> <span class="note">(${safe(t.category)})</span></div><div class="compact-points">↗</div>`;
    head.onclick=()=>item.classList.toggle('open');
    const body=document.createElement('div');
    body.className='compact-body';
    body.innerHTML=`
      <div class="note" style="margin-bottom:8px">Link: <a href="${safe(t.url)}" target="_blank">${safe(t.url)}</a></div>
      <div class="note" style="margin-bottom:10px">${safe(t.desc||'')}</div>
      <div class="actions">
        <button class="btn delete" onclick="removeStudyTool('${safe(t.id)}')">🗑 Xóa liên kết này</button>
      </div>
    `;
    item.append(head,body);
    box.appendChild(item);
  });
}

function addStudyTool(){
  const name=document.getElementById('newToolName').value.trim();
  const cat=document.getElementById('newToolCategory').value;
  const url=document.getElementById('newToolUrl').value.trim();
  const icon=document.getElementById('newToolIcon').value.trim()||'🌐';
  const desc=document.getElementById('newToolDesc').value.trim();
  if(!name||!url) return alert('Hãy nhập tên nguồn học và link website.');

  if(!Array.isArray(data.studyTools)) data.studyTools=structuredClone(DEFAULT_STUDY_TOOLS);
  data.studyTools.push({id:uid('tool'),name,category:cat,icon,url,desc});
  save();
  render();
  document.getElementById('newToolName').value='';
  document.getElementById('newToolUrl').value='';
  document.getElementById('newToolDesc').value='';
  alert('Đã thêm công cụ học tập mới!');
}

function removeStudyTool(id){
  askConfirm('Xóa nguồn học','Bạn có chắc muốn xóa công cụ học tập này khỏi danh sách gợi ý?',()=>{
    if(!Array.isArray(data.studyTools)) data.studyTools=structuredClone(DEFAULT_STUDY_TOOLS);
    data.studyTools=data.studyTools.filter(t=>t.id!==id);
    save();
    render();
  },{yesText:'Có, xóa',icon:'🗑️'});
}

function resetDefaultStudyTools(){
  askConfirm('Khôi phục gợi ý gốc','Khôi phục toàn bộ danh mục công cụ học tập chọn lọc mặc định?',()=>{
    data.studyTools=structuredClone(DEFAULT_STUDY_TOOLS);
    save();
    render();
    alert('Đã khôi phục danh mục gợi ý gốc.');
  },{yesText:'Có, khôi phục',icon:'🔄'});
}

function renderPresets(){
  const box=document.getElementById('presetList');if(!box)return;box.innerHTML='';
  TASK_PRESETS.forEach((p,i)=>{
    const b=document.createElement('button');b.className='btn open';
    b.textContent=(p.points<0?p.points:'+'+p.points)+' ⭐ '+p.name;
    b.onclick=()=>fillPreset(i);
    box.appendChild(b);
  });
  const q=document.createElement('span');q.className='note';q.style.alignSelf='center';
  q.textContent='…hoặc tự điền tên nhiệm vụ bên dưới + chọn nhanh 5 / 10 / 20 ⭐.';
  box.appendChild(q);
}
function setQuickPoints(p){document.getElementById('taskPoints').value=p;}
function fillPreset(i){
  const p=TASK_PRESETS[i];if(!p)return;
  if(!data.subjects.includes(p.subject)){data.subjects.push(p.subject);save();}
  renderParentSelectors();
  document.getElementById('taskName').value=p.name;
  document.getElementById('subject').value=p.subject;
  document.getElementById('taskPoints').value=p.points;
  document.getElementById('duration').value=p.duration;
  document.getElementById('instruction').value=p.instruction||'';
  document.getElementById('taskName').focus();
}

function selectedRewardChild(){
  const id=document.getElementById('rewardTarget')?.value||currentChildId;
  if(id==='all') return null;
  return data.children.find(c=>c.id===id)||null;
}
function renderRewardManager(){
  const c=selectedRewardChild(),targetId=document.getElementById('rewardTarget')?.value;
  const rm=document.getElementById('rewardManager');rm.innerHTML='';
  if(targetId==='all'){
    rm.innerHTML='<div class="note" style="padding:10px">Quà thêm lúc này sẽ được gán cho <b>Tất cả các con</b>. Để sửa từng món quà, hãy chọn cụ thể từng bé ở trên.</div>';
    return;
  }
  if(!c){rm.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>';return}
  if(!c.rewards.length)rm.innerHTML='<div class="empty">Bé chưa có phần quà nào.</div>';
  c.rewards.forEach((r,i)=>{
    const item=document.createElement('div');item.className='compact-item';
    const head=document.createElement('div');head.className='compact-head';
    head.innerHTML=`<div class="compact-title">${r.icon||'🎁'} ${safe(r.name)} <span class="note">(${safe(r.category||'Quà')})</span></div><div class="compact-points">${r.cost} ⭐</div>`;
    head.onclick=()=>item.classList.toggle('open');
    const body=document.createElement('div');body.className='compact-body';
    const grid=document.createElement('div');grid.className='formgrid';
    const name=document.createElement('input');name.value=r.name;
    const cost=document.createElement('input');cost.type='number';cost.value=r.cost;
    const cat=document.createElement('select');
    ['Thời gian & Đặc quyền','Đồ ăn & Thức uống','Hoạt động & Dã ngoại','Sách & Đồ chơi','Khác'].forEach(opt=>cat.add(new Option(opt,opt)));
    cat.value=r.category||'Khác';
    const icon=document.createElement('input');icon.value=r.icon||'🎁';
    const rule=document.createElement('input');rule.value=r.rule||'';
    
    grid.innerHTML='<div><div class="note">Tên quà</div></div><div><div class="note">Điểm cần đổi</div></div><div><div class="note">Nhóm quà</div></div><div><div class="note">Emoji</div></div><div style="grid-column:1/-1"><div class="note">Quy định</div></div>';
    grid.children[0].appendChild(name);grid.children[1].appendChild(cost);
    grid.children[2].appendChild(cat);grid.children[3].appendChild(icon);
    grid.children[4].appendChild(rule);
    
    const acts=document.createElement('div');acts.className='actions';
    const saveB=document.createElement('button');saveB.className='primary';saveB.textContent='Lưu quà';
    saveB.onclick=e=>{
      e.stopPropagation();
      const n=name.value.trim(),ct=Number(cost.value||0);
      if(!n||ct<=0)return alert('Tên quà và điểm không hợp lệ.');
      askConfirm('Lưu quà',`Lưu thay đổi cho quà "${n}"?`,()=>{
        r.name=n;r.cost=ct;r.category=cat.value;r.icon=icon.value.trim()||'🎁';r.rule=rule.value.trim();save();render();
      },{yesText:'Có, lưu',icon:'🎁'});
    };
    const del=document.createElement('button');del.className='btn delete';del.textContent='🗑 Xóa quà';
    del.onclick=e=>{
      e.stopPropagation();
      askConfirm('Xóa quà',`Xóa quà "${r.name}" của ${c.name}?`,()=>{c.rewards.splice(i,1);save();render()},{yesText:'Có, xóa',icon:'🗑️'});
    };
    acts.append(saveB,del);body.append(grid,acts);item.append(head,body);rm.appendChild(item);
  });
}

function addReward(){
  const targetId=document.getElementById('rewardTarget')?.value;
  const name=document.getElementById('rewardName').value.trim(),
        cost=Number(document.getElementById('rewardCost').value||0),
        cat=document.getElementById('rewardCategoryInput')?.value||'Khác',
        icon=document.getElementById('rewardIconInput')?.value.trim()||'🎁',
        rule=document.getElementById('rewardRule').value.trim();
  if(!targetId)return alert('Chưa chọn bé.');
  if(!name||cost<=0)return alert('Hãy nhập tên quà và điểm hợp lệ.');
  const targets=targetId==='all'?data.children:data.children.filter(c=>c.id===targetId);
  if(!targets.length)return alert('Chưa có bé để thiết lập quà.');
  askConfirm('Thêm quà',`Thêm quà "${name}" (${cost} điểm) cho ${targetId==='all'?'TẤT CẢ CÁC CON':targets[0].name}?`,()=>{
    targets.forEach(c=>c.rewards.push({id:uid('r'),name,cost,category:cat,icon,rule}));
    document.getElementById('rewardName').value='';document.getElementById('rewardCost').value='';document.getElementById('rewardRule').value='';
    save();render();
  },{yesText:'Có, thêm quà',icon:'🎁'});
}

function selectedAchievementChild(){
  const id=document.getElementById('achievementTarget')?.value||currentChildId;
  if(id==='all') return null;
  return data.children.find(c=>c.id===id)||null;
}
function renderAchievementManager(){
  const c=selectedAchievementChild(),targetId=document.getElementById('achievementTarget')?.value;
  const am=document.getElementById('achievementManager');am.innerHTML='';
  if(targetId==='all'){
    am.innerHTML='<div class="note" style="padding:10px">Thành tích thêm lúc này sẽ được áp dụng cho <b>Tất cả các con</b>. Để sửa từng mốc, hãy chọn cụ thể từng bé ở trên.</div>';
    return;
  }
  if(!c){am.innerHTML='<div class="empty">Chưa có hồ sơ bé.</div>';return}
  if(!c.achievements.length)am.innerHTML='<div class="empty">Bé chưa có mốc thành tích bổ sung nào (đã có sẵn 101 mốc danh hiệu tự động).</div>';
  c.achievements.forEach((a,i)=>{
    const item=document.createElement('div');item.className='compact-item';
    const head=document.createElement('div');head.className='compact-head';
    head.innerHTML=`<div class="compact-title">🏅 ${safe(a.title)}</div><div class="compact-points">${a.points.toLocaleString('vi-VN')} ⭐</div>`;
    head.onclick=()=>item.classList.toggle('open');
    const body=document.createElement('div');body.className='compact-body';
    const grid=document.createElement('div');grid.className='formgrid';
    const pts=document.createElement('input');pts.type='number';pts.value=a.points;
    const title=document.createElement('input');title.value=a.title;
    grid.innerHTML='<div><div class="note">Số điểm</div></div><div><div class="note">Tên thành tích</div></div>';
    grid.children[0].appendChild(pts);grid.children[1].appendChild(title);
    const acts=document.createElement('div');acts.className='actions';
    const saveB=document.createElement('button');saveB.className='primary';saveB.textContent='Lưu mốc';
    saveB.onclick=e=>{
      e.stopPropagation();
      const p=Number(pts.value||0),t=title.value.trim();
      if(p<=0||!t)return alert('Thông tin không hợp lệ.');
      askConfirm('Lưu thành tích',`Lưu mốc "${t}" ở ${p} điểm?`,()=>{a.points=p;a.title=t;updateEarnedAchievements(c);save();render()},{yesText:'Có, lưu',icon:'🏅'});
    };
    const del=document.createElement('button');del.className='btn delete';del.textContent='🗑 Xóa mốc';
    del.onclick=e=>{
      e.stopPropagation();
      askConfirm('Xóa thành tích',`Xóa mốc "${a.title}" của ${c.name}?`,()=>{c.achievements.splice(i,1);c.earnedAchievements=(c.earnedAchievements||[]).filter(id=>id!==a.id);updateEarnedAchievements(c);save();render()},{yesText:'Có, xóa',icon:'🗑️'});
    };
    acts.append(saveB,del);body.append(grid,acts);item.append(head,body);am.appendChild(item);
  });
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
    document.getElementById('achievementPoints').value='';document.getElementById('achievementTitle').value='';
    save();render();
  },{yesText:'Có, thêm mốc',icon:'🏅'});
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
        t.name=newName;t.subject=subject.value;t.date=String(date.value||todayISO()).slice(0,10);
        t.points=newPts;t.duration=duration.value.trim();t.link=link.value.trim();t.instruction=instruction.value.trim();
        selectedParentTaskDate=t.date;save();render();
      },{yesText:'Có, lưu riêng ngày này',icon:'💾'});
    };

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
          `Sửa ${editableSeries.length} nhiệm vụ CHƯA hoàn thành trong chuỗi "${t.name}"? ${lockedSeries.length} nhiệm vụ đã hoàn thành sẽ được giữ nguyên.`,
          ()=>{
            editableSeries.forEach(st=>{
              st.name=newName;st.subject=subject.value;st.points=newPts;st.duration=duration.value.trim();st.link=link.value.trim();st.instruction=instruction.value.trim();
            });
            save();render();
          },
          {yesText:'Có, sửa các nhiệm vụ chưa hoàn thành',icon:'🔁'}
        );
      };
    }

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
          selectedParentTaskDate='';save();render();
        },
        {yesText:'Có, xóa riêng ngày này',icon:'🗑️'}
      );
    };

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
          `Xóa ${pendingSeries.length} nhiệm vụ CHƯA hoàn thành trong chuỗi "${t.name}"? ${completedSeries.length} nhiệm vụ đã hoàn thành sẽ được giữ nguyên và điểm của con không bị trừ.`,
          ()=>{
            const pendingIds=new Set(pendingSeries.map(x=>x.id));
            c.tasks=c.tasks.filter(x=>!pendingIds.has(x.id));
            selectedParentTaskDate='';save();render();
          },
          {yesText:'Có, xóa phần chưa hoàn thành',icon:'⚠️'}
        );
      };
    }

    acts.append(saveB);
    if(saveSeriesB) acts.append(saveSeriesB);
    acts.append(del);
    if(delSeriesB) acts.append(delSeriesB);
    body.append(grid,acts);item.append(head,body);list.appendChild(item);
  });
}

function addChild(){
  const inp=document.getElementById('newChildName'),name=inp.value.trim();if(!name)return alert('Hãy nhập tên bé.');
  const gender=document.getElementById('newChildGender')?.value||'female';
  askConfirm('Thêm bé',`Thêm hồ sơ cho "${name}" (${gender==='male'?'Nam':'Nữ'})?`,()=>{
    const c={id:uid('c'),name,gender,score:0,highestScore:0,targetRewardId:null,tasks:[],giftHistory:[],pointHistory:[],rewards:structuredClone(DEFAULT_REWARDS),achievements:[],earnedAchievements:[]};
    data.children.push(c);
    if(!currentChildId)currentChildId=c.id;
    inp.value='';save();render();
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
function bonusScore(){
  const id=document.getElementById('bonusTarget').value,pts=Number(document.getElementById('bonusPoints').value||0),reason=document.getElementById('bonusReason').value.trim(),c=data.children.find(x=>x.id===id);
  if(!c)return alert('Chưa chọn bé.');if(pts<=0)return alert('Điểm thưởng phải lớn hơn 0.');
  askConfirm('Cộng điểm thưởng',`Phụ huynh xác nhận cộng ${pts} điểm thưởng cho ${c.name}${reason?' vì: '+reason:''}?`,()=>{
    c.score+=pts;logPoint(c,'bonus',pts,reason);updateEarnedAchievements(c);save();render();
    playChime('success');triggerConfetti();
    document.getElementById('bonusPoints').value='';document.getElementById('bonusReason').value='';
    showToast('🎉 Đã thưởng +'+pts+' ⭐ cho '+c.name+'!');
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
      c.pointHistory.push({id:uid('penalty'),type:'penalty',amount:-Math.abs(pts),reason:reason,at:new Date().toISOString()});
      save();render();
      document.getElementById('penaltyPoints').value='';document.getElementById('penaltyReason').value='';
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
        category=document.getElementById('taskCategory')?.value||'home_study',duration=document.getElementById('duration').value.trim(),link=document.getElementById('taskLink').value.trim(),instruction=document.getElementById('instruction').value.trim();
  if(!target)return alert('Chưa có bé để giao bài.');if(!name)return alert('Hãy nhập tên nhiệm vụ.');if(!subject)return alert('Hãy tạo môn học trước.');
  const dates=datesForAssignment(start,end,mode);if(!dates.length)return alert('Khoảng ngày chưa hợp lệ.');
  const targets=target==='all'?data.children:data.children.filter(c=>c.id===target);
  askConfirm('Giao nhiệm vụ',`Giao "${name}" cho ${target==='all'?'TẤT CẢ CÁC CON':targets[0]?.name} trong ${dates.length} ngày?`,()=>{
    const seriesId=mode==='once'?null:uid('series');
    targets.forEach(c=>dates.forEach(date=>c.tasks.push({id:uid('t'),seriesId,name,subject,category,date,points:pts,duration,link,instruction,done:false,awardedPoints:0,completedAt:null})));
    save();render();document.getElementById('taskName').value='';document.getElementById('taskLink').value='';document.getElementById('instruction').value='';
    showToast('📝 Đã giao nhiệm vụ thành công!');
  },{yesText:'Có, giao nhiệm vụ',icon:'📝'});
}

data.children.forEach(c=>{updateEarnedAchievements(c)});
save();
document.getElementById('taskDate').value=todayISO();
document.getElementById('taskEndDate').value=todayISO();
document.getElementById('duration').value='15 phút';
render();


/* ============================================================
   🎒 THỜI KHÓA BIỂU & NHẮC BÁO CHỞ ĐI HỌC (LỚP 1)
   ============================================================ */

// 1. ÂM THANH & GIỌNG NÓI TIẾNG VIỆT
function playSchoolBell(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx) return;
    const ctx=new AudioCtx();
    const times=[0, 0.35, 0.8, 1.15];
    const freqs=[880, 659.25, 880, 659.25];
    times.forEach((t,i)=>{
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type='sine';
      osc.frequency.setValueAtTime(freqs[i],ctx.currentTime+t);
      gain.gain.setValueAtTime(0.28,ctx.currentTime+t);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.34);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(ctx.currentTime+t);
      osc.stop(ctx.currentTime+t+0.36);
    });
  }catch(e){}
}

function playPopSound(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx) return;
    const ctx=new AudioCtx();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(320,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750,ctx.currentTime+0.1);
    gain.gain.setValueAtTime(0.25,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.12);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime+0.12);
  }catch(e){}
}

function speakVietnamese(text){
  try{
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang='vi-VN';
    u.rate=0.95;
    u.pitch=1.05;
    const voices=window.speechSynthesis.getVoices();
    const viVoice=voices.find(v=>v.lang.startsWith('vi')||v.lang.includes('VIE'));
    if(viVoice) u.voice=viVoice;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

function sendBrowserNotification(title,body){
  try{
    if(!('Notification' in window)) return;
    if(Notification.permission==='granted'){
      new Notification(title,{body:body,icon:'icon.svg',tag:'school-ride-alert'});
    }else if(Notification.permission!=='denied'){
      Notification.requestPermission();
    }
  }catch(e){}
}

// 2. NHẮC BÁO GIỜ CHỞ BÉ ĐI HỌC (TRƯỚC 10 PHÚT)
let rideAlertHistory={}; // chống lặp chuông trong cùng 1 cữ giờ

function getRideReminderConfig(){
  if(!data.rideReminder){
    data.rideReminder={
      enabled:true,
      leadMinutes:10,
      morningTime:'07:15',
      afternoonTime:'13:30',
      pickupTime:'16:30',
      enableSound:true,
      enableSpeech:true,
      enableNotification:true
    };
  }
  return data.rideReminder;
}

function formatMinutesToHHMM(totalMins){
  let m=((totalMins%1440)+1440)%1440;
  const h=Math.floor(m/60);
  const min=m%60;
  return String(h).padStart(2,'0') + ':' + String(min).padStart(2,'0');
}

function getNextRideEvent(){
  const cfg=getRideReminderConfig();
  if(!cfg.enabled) return null;
  const now=new Date();
  const currentMinutes=now.getHours()*60+now.getMinutes();
  const currentSeconds=currentMinutes*60+now.getSeconds();

  function parseMins(str){
    if(!str) return 0;
    const parts=str.split(':').map(Number);
    return (parts[0]||0)*60+(parts[1]||0);
  }

  const lead=Number(cfg.leadMinutes||10);
  const events=[
    { type:'morning', label:'Chở con đi học Buổi Sáng', schoolTime:cfg.morningTime||'07:15', icon:'🛵🌅', role:'đi học' },
    { type:'afternoon', label:'Chở con đi học Buổi Chiều', schoolTime:cfg.afternoonTime||'13:30', icon:'🛵☀️', role:'đi học' },
    { type:'pickup', label:'Đón con tan trường về', schoolTime:cfg.pickupTime||'16:30', icon:'🛵🎒', role:'đón con' }
  ].map(ev=>{
    const schoolMins=parseMins(ev.schoolTime);
    const departMins=schoolMins-lead;
    const departSecs=departMins*60;
    const schoolSecs=schoolMins*60;
    return {
      ...ev,
      schoolMins,
      departMins,
      departTimeStr:formatMinutesToHHMM(departMins),
      diffDepartSecs:departSecs-currentSeconds,
      diffSchoolSecs:schoolSecs-currentSeconds
    };
  });

  const upcoming=events.find(ev=>ev.diffSchoolSecs>-10*60);
  return upcoming||events[0];
}

function triggerSchoolRideAlert(ev){
  const cfg=getRideReminderConfig();
  if(!cfg.enabled) return;
  const c=child();
  const childName=c?c.name:'con';

  if(cfg.enableSound) playSchoolBell();
  if(cfg.enableSpeech){
    const msg=(ev.type==='pickup')
      ? 'Bố mẹ ơi! Còn ' + cfg.leadMinutes + ' phút nữa là đến giờ tan trường lúc ' + ev.schoolTime + ', chuẩn bị đi đón bé ' + childName + ' về nhé!'
      : 'Bố mẹ ơi! Còn ' + cfg.leadMinutes + ' phút nữa là vào học lúc ' + ev.schoolTime + ', cùng bé ' + childName + ' chuẩn bị cặp sách và xuất phát đến trường thôi nào!';
    setTimeout(()=>speakVietnamese(msg), 400);
  }
  if(cfg.enableNotification){
    sendBrowserNotification('🛵 Đến giờ ' + ev.role + '!', 'Còn ' + cfg.leadMinutes + ' phút nữa là đến giờ lúc ' + ev.schoolTime + '. Cùng bé ' + childName + ' xuất phát nhé!');
  }
  showToast('🚨 ĐẾN GIỜ XUẤT PHÁT! Còn ' + cfg.leadMinutes + ' phút nữa vào học lúc ' + ev.schoolTime + '!');
}

function updateRideReminderTick(){
  const cfg=getRideReminderConfig();
  if(!cfg.enabled) return;

  const ev=getNextRideEvent();
  if(!ev) return;

  const todayKey=todayISO() + '_' + ev.type;
  if(ev.diffDepartSecs<=3 && ev.diffDepartSecs>=-10 && !rideAlertHistory[todayKey]){
    rideAlertHistory[todayKey]=true;
    triggerSchoolRideAlert(ev);
  }

  const isUrgent=(ev.diffDepartSecs<=0 && ev.diffSchoolSecs>=0);
  const cdText=formatCountdownRide(ev.diffDepartSecs, ev.diffSchoolSecs);

  ['todayRideReminderCard','scheduleRideReminderCard'].forEach(cardId=>{
    const card=document.getElementById(cardId);
    if(!card) return;
    const cdEl=card.querySelector('.ride-countdown') || card.querySelector('.ride-compact-cd');
    if(cdEl) cdEl.innerHTML=cdText;
    card.classList.toggle('urgent', isUrgent);
  });
}

function formatCountdownRide(diffDepartSecs, diffSchoolSecs){
  if(diffDepartSecs<=0 && diffSchoolSecs>=0){
    const sRemain=diffSchoolSecs;
    const m=Math.floor(sRemain/60), s=sRemain%60;
    return '🚨 ĐẾN GIỜ XUẤT PHÁT! Vào học sau: <b>' + m + 'p ' + String(s).padStart(2,'0') + 's</b>';
  }
  if(diffSchoolSecs<0){
    return '✅ Đã qua giờ học';
  }
  const sRemain=diffDepartSecs;
  const h=Math.floor(sRemain/3600);
  const m=Math.floor((sRemain%3600)/60);
  const s=sRemain%60;
  if(h>0) return '⏳ Xuất phát sau: <b>' + h + 'h ' + m + 'p ' + String(s).padStart(2,'0') + 's</b>';
  return '⏳ Xuất phát sau: <b>' + m + ' phút ' + String(s).padStart(2,'0') + ' giây</b>';
}

function renderRideReminder(){
  const cfg=getRideReminderConfig();
  const c=child();
  const childName=c?(childIcon(c)+' '+c.name):'bé';
  const ev=getNextRideEvent();

  const isUrgent=(ev && ev.diffDepartSecs<=0 && ev.diffSchoolSecs>=0);
  const cdText=ev?formatCountdownRide(ev.diffDepartSecs, ev.diffSchoolSecs):'--:--';

  const html=`
    <div class="ride-card-inner">
      <div class="ride-card-left">
        <div class="ride-icon-bubble">🛵</div>
        <div>
          <div class="ride-info-title">
            <span>Giờ chở ${childName} đi học</span>
            <span class="ride-badge">${ev?ev.label:'Hôm nay'}</span>
            <span class="note" style="color:#b45309">Nhắc trước <b>${cfg.leadMinutes} phút</b></span>
          </div>
          <div style="font-size:13.5px;color:#78350f;margin-top:2px">
            Vào lớp: <b>${ev?ev.schoolTime:'07:15'}</b> ➔ Xuất phát: <b style="color:#dc2626">${ev?ev.departTimeStr:'07:05'}</b>
          </div>
          <div class="ride-countdown">${cdText}</div>
        </div>
      </div>
      <div class="ride-card-actions">
        <label class="ride-switch-label" title="Bật/Tắt nhắc nhở">
          <input type="checkbox" ${cfg.enabled?'checked':''} onchange="toggleRideReminderEnabled(this.checked)" style="width:16px;height:16px">
          <span>${cfg.enabled?'🔔 Đang bật':'🔕 Đang tắt'}</span>
        </label>
        <button type="button" class="ride-btn ride-btn-test" onclick="testSchoolRideAlert()">🔊 Thử chuông</button>
        <button type="button" class="ride-btn ride-btn-cfg" onclick="openRideReminderModal()">⚙️ Đổi giờ học</button>
      </div>
    </div>
  `;

  const compactHtml=`
    <div class="ride-compact-bar">
      <div class="ride-compact-left">
        <span class="ride-compact-icon">🛵</span>
        <div class="ride-compact-text">
          <div><b>Giờ chở đi học:</b> Vào lớp <b>${ev?ev.schoolTime:'07:15'}</b> ➔ Xuất phát <b style="color:#dc2626">${ev?ev.departTimeStr:'07:05'}</b></div>
          <div style="font-size:11.5px;color:#b45309"><span class="ride-compact-cd">${cdText}</span> <span class="note" style="color:#b45309">(${ev?ev.label:'Hôm nay'})</span></div>
        </div>
      </div>
      <div class="ride-compact-actions">
        <button type="button" class="ride-compact-btn" onclick="testSchoolRideAlert()" title="Thử chuông báo 10 phút">🔔 Thử</button>
        <button type="button" class="ride-compact-btn" onclick="openRideReminderModal()" title="Cài đặt giờ">⚙️ Đổi giờ</button>
      </div>
    </div>
  `;

  const todayEl = document.getElementById('todayRideReminderCard');
  if(todayEl){
    todayEl.innerHTML = compactHtml;
    todayEl.classList.toggle('urgent', !!isUrgent);
  }

  const schEl = document.getElementById('scheduleRideReminderCard');
  if(schEl){
    schEl.innerHTML = html;
    schEl.classList.toggle('urgent', !!isUrgent);
  }
}

function toggleRideReminderEnabled(val){
  const cfg=getRideReminderConfig();
  cfg.enabled=val;
  save();
  renderRideReminder();
  showToast(val?'🔔 Đã bật nhắc báo giờ chở con đi học!':'🔕 Đã tắt nhắc nhở.');
}

function testSchoolRideAlert(){
  const cfg=getRideReminderConfig();
  const ev=getNextRideEvent()||{schoolTime:'07:15',role:'đi học',type:'morning'};
  triggerSchoolRideAlert(ev);
}

function openRideReminderModal(){
  const cfg=getRideReminderConfig();
  document.getElementById('rideCfgEnabled').checked=cfg.enabled!==false;
  document.getElementById('rideCfgMorningTime').value=cfg.morningTime||'07:15';
  document.getElementById('rideCfgAfternoonTime').value=cfg.afternoonTime||'13:30';
  document.getElementById('rideCfgPickupTime').value=cfg.pickupTime||'16:30';
  document.getElementById('rideCfgLeadMinutes').value=String(cfg.leadMinutes||10);
  document.getElementById('rideCfgEnableSound').checked=cfg.enableSound!==false;
  document.getElementById('rideCfgEnableSpeech').checked=cfg.enableSpeech!==false;
  document.getElementById('rideCfgEnableNotification').checked=cfg.enableNotification!==false;
  document.getElementById('rideReminderModal').classList.add('show');
}

function closeRideReminderModal(){
  document.getElementById('rideReminderModal').classList.remove('show');
}

function saveRideReminderConfig(){
  const cfg=getRideReminderConfig();
  cfg.enabled=document.getElementById('rideCfgEnabled').checked;
  cfg.morningTime=document.getElementById('rideCfgMorningTime').value||'07:15';
  cfg.afternoonTime=document.getElementById('rideCfgAfternoonTime').value||'13:30';
  cfg.pickupTime=document.getElementById('rideCfgPickupTime').value||'16:30';
  cfg.leadMinutes=Number(document.getElementById('rideCfgLeadMinutes').value||10);
  cfg.enableSound=document.getElementById('rideCfgEnableSound').checked;
  cfg.enableSpeech=document.getElementById('rideCfgEnableSpeech').checked;
  cfg.enableNotification=document.getElementById('rideCfgEnableNotification').checked;

  if(cfg.enableNotification && 'Notification' in window && Notification.permission==='default'){
    Notification.requestPermission();
  }

  save();
  closeRideReminderModal();
  renderRideReminder();
  showToast('💾 Đã lưu cài đặt giờ chở bé đi học!');
}

// 3. THỜI KHÓA BIỂU KÉO THẢ (WEEKLY TIMETABLE)
let selectedPaletteSubject=null;
let draggedSubject=null;
let draggedCellCoord=null;
let currentTtDayFilter='all';
let editingCellCoord=null;

function getAllSubjects(){
  const custom=Array.isArray(data.customSubjects)?data.customSubjects:[];
  return [...GRADE1_SUBJECTS,...custom];
}

function getSubjectMeta(name){
  if(!name) return null;
  return getAllSubjects().find(s=>s.name.toLowerCase()===String(name).toLowerCase())||{
    name:name,
    icon:'📘',
    color:'#3b82f6',
    bg:'#eff6ff',
    border:'#bfdbfe',
    textColor:'#1d4ed8'
  };
}

function switchTimetableTab(tabName){
  const tabs=['timetable','bag','bee','calendar'];
  tabs.forEach(t=>{
    const btn=document.getElementById('ttView' + t.charAt(0).toUpperCase() + t.slice(1) + 'Btn');
    const wrap=document.getElementById('tt' + t.charAt(0).toUpperCase() + t.slice(1) + 'TabWrap');
    if(btn) btn.classList.toggle('active', t===tabName);
    if(wrap) wrap.style.display=(t===tabName)?'block':'none';
  });
}

function setTimetableDayFilter(day, btnEl){
  currentTtDayFilter=day;
  document.querySelectorAll('.tt-day-pill').forEach(b=>b.classList.remove('active'));
  if(btnEl) btnEl.classList.add('active');
  renderTimetableTable();
}

function renderTimetablePalette(){
  const box=document.getElementById('ttPaletteChips');
  if(!box) return;
  box.innerHTML='';

  const subjects=getAllSubjects();
  subjects.forEach(sub=>{
    const pill=document.createElement('div');
    pill.className='tt-subject-pill';
    pill.draggable=true;
    pill.style.background=sub.bg;
    pill.style.borderColor=sub.border;
    pill.style.color=sub.textColor;
    pill.innerHTML='<span>' + sub.icon + '</span> <span>' + sub.name + '</span>';

    if(selectedPaletteSubject===sub.name){
      pill.classList.add('selected');
    }

    pill.addEventListener('dragstart', (e)=>onTtDragStart(e, sub.name));
    pill.addEventListener('click', ()=>{ onTtPaletteClick(sub.name); });
    box.appendChild(pill);
  });

  const notice=document.getElementById('ttSelectedNotice');
  const nameEl=document.getElementById('ttSelectedSubjectName');
  if(notice && nameEl){
    if(selectedPaletteSubject){
      notice.style.display='flex';
      nameEl.textContent=selectedPaletteSubject;
    }else{
      notice.style.display='none';
    }
  }
}

function onTtPaletteClick(subName){
  if(selectedPaletteSubject===subName){
    selectedPaletteSubject=null;
    playPopSound();
  }else{
    selectedPaletteSubject=subName;
    playPopSound();
    showToast('👉 Đang chọn môn "' + subName + '". Chạm vào ô tiết học trong bảng để dán!');
  }
  renderTimetablePalette();
}

function clearSelectedPaletteSubject(){
  selectedPaletteSubject=null;
  renderTimetablePalette();
}

function onTtDragStart(e, subName){
  draggedSubject=subName;
  draggedCellCoord=null;
  e.dataTransfer.setData('text/plain', JSON.stringify({ type:'subject', name:subName }));
  e.dataTransfer.effectAllowed='copyMove';
}

function onTtCellDragStart(e, coord){
  const c=child();
  if(!c||!c.timetable||!c.timetable[coord]) return;
  draggedCellCoord=coord;
  draggedSubject=c.timetable[coord].subject;
  e.dataTransfer.setData('text/plain', JSON.stringify({ type:'cell', coord:coord, data:c.timetable[coord] }));
  e.dataTransfer.effectAllowed='move';
}

function onTtDragOver(e){
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function onTtDragLeave(e){
  e.currentTarget.classList.remove('drag-over');
}

function onTtDrop(e, day, period){
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const c=child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  if(!c.timetable) c.timetable={};

  const targetCoord=day + '_' + period;

  try{
    const raw=e.dataTransfer.getData('text/plain');
    if(!raw) return;
    const payload=JSON.parse(raw);

    if(payload.type==='subject'){
      c.timetable[targetCoord]={ subject:payload.name, note:'' };
      playPopSound();
      save();
      renderTimetableTable();
      renderSchoolBagChecklist();
      showToast('✅ Đã xếp môn ' + payload.name + ' vào Thứ ' + day + ' Tiết ' + period + '!');
    }else if(payload.type==='cell'){
      const sourceCoord=payload.coord;
      if(sourceCoord!==targetCoord){
        const temp=c.timetable[targetCoord];
        c.timetable[targetCoord]=c.timetable[sourceCoord];
        if(temp) c.timetable[sourceCoord]=temp;
        else delete c.timetable[sourceCoord];
        playPopSound();
        save();
        renderTimetableTable();
        renderSchoolBagChecklist();
        showToast('🔄 Đã chuyển vị trí tiết học!');
      }
    }
  }catch(err){}
}

function onTtCellClick(day, period){
  const c=child();
  if(!c) return;
  if(!c.timetable) c.timetable={};
  const coord=day + '_' + period;

  if(selectedPaletteSubject){
    c.timetable[coord]={ subject:selectedPaletteSubject, note:'' };
    playPopSound();
    save();
    renderTimetableTable();
    renderSchoolBagChecklist();
    showToast('✅ Đã dán môn "' + selectedPaletteSubject + '" vào Thứ ' + day + ' Tiết ' + period + '!');
    return;
  }

  openTimetableCellModal(coord);
}

function openTimetableCellModal(coord){
  editingCellCoord=coord;
  const parts=coord.split('_');
  const day=parts[0], period=parts[1];
  const c=child();
  const entry=c?.timetable?.[coord];

  document.getElementById('ttCellModalTitle').textContent='Chỉnh sửa Tiết ' + period;
  document.getElementById('ttCellModalSubtitle').textContent='Thứ ' + (day==='7'?'7':(day==='CN'?'Chủ Nhật':'Thứ '+day)) + ' • ' + (period<=4?'Buổi Sáng':'Buổi Chiều');

  const sel=document.getElementById('ttCellSubjectSelect');
  sel.innerHTML='<option value="">-- Chọn môn học có sẵn --</option>';
  getAllSubjects().forEach(sub=>{
    sel.add(new Option(sub.icon + ' ' + sub.name, sub.name));
  });

  if(entry && entry.subject){
    sel.value=entry.subject;
    document.getElementById('ttCellCustomSubject').value=entry.subject;
    document.getElementById('ttCellNote').value=entry.note||'';
  }else{
    sel.value='';
    document.getElementById('ttCellCustomSubject').value='';
    document.getElementById('ttCellNote').value='';
  }

  document.getElementById('timetableCellModal').classList.add('show');
}

function closeTimetableCellModal(){
  document.getElementById('timetableCellModal').classList.remove('show');
  editingCellCoord=null;
}

function onTtCellSelectChange(){
  const val=document.getElementById('ttCellSubjectSelect').value;
  if(val){
    document.getElementById('ttCellCustomSubject').value=val;
  }
}

function saveCurrentTimetableCell(){
  if(!editingCellCoord) return;
  const c=child();
  if(!c) return;
  if(!c.timetable) c.timetable={};

  const subj=document.getElementById('ttCellCustomSubject').value.trim();
  const note=document.getElementById('ttCellNote').value.trim();

  if(!subj){
    delete c.timetable[editingCellCoord];
  }else{
    c.timetable[editingCellCoord]={ subject:subj, note:note };
  }

  save();
  closeTimetableCellModal();
  renderTimetableTable();
  renderSchoolBagChecklist();
  showToast('💾 Đã lưu tiết học!');
}

function deleteCurrentTimetableCell(){
  if(!editingCellCoord) return;
  const c=child();
  if(c && c.timetable){
    delete c.timetable[editingCellCoord];
    save();
  }
  closeTimetableCellModal();
  renderTimetableTable();
  renderSchoolBagChecklist();
  showToast('🗑 Đã xóa tiết học.');
}

function deleteTimetableCell(coord, e){
  if(e) e.stopPropagation();
  const c=child();
  if(!c||!c.timetable) return;
  delete c.timetable[coord];
  playPopSound();
  save();
  renderTimetableTable();
  renderSchoolBagChecklist();
}

function renderTimetableTable(){
  const table=document.getElementById('timetableTable');
  if(!table) return;
  const c=child();
  const tt=c?.timetable||{};

  const now=new Date();
  const currentDayOfWeek=now.getDay()===0?8:(now.getDay()+1);

  let daysToShow=['2','3','4','5','6','7'];
  if(currentTtDayFilter!=='all'){
    daysToShow=[currentTtDayFilter];
  }

  const dayHeaders={
    '2':'Thứ 2', '3':'Thứ 3', '4':'Thứ 4',
    '5':'Thứ 5', '6':'Thứ 6', '7':'Thứ 7'
  };

  let theadHtml='<thead><tr><th class="tt-col-period">Tiết / Giờ</th>';
  daysToShow.forEach(d=>{
    const isToday=Number(d)===currentDayOfWeek;
    theadHtml+='<th class="' + (isToday?'today-col':'') + '">' + dayHeaders[d] + (isToday?' <span style="font-size:11px;background:#3b82f6;color:#fff;padding:1px 6px;border-radius:10px;margin-left:4px">Hôm nay</span>':'') + '</th>';
  });
  theadHtml+='</tr></thead>';

  const periodRows=[
    { id:1, name:'Tiết 1', time:'07:45 - 08:20', session:'morning' },
    { id:2, name:'Tiết 2', time:'08:25 - 09:00', session:'morning' },
    { id:'break_morning', name:'Ra chơi sáng', time:'09:00 - 09:20', isBreak:true, label:'🧃 Ra chơi & Uống sữa, tập thể dục giữa giờ (20 phút)' },
    { id:3, name:'Tiết 3', time:'09:20 - 09:55', session:'morning' },
    { id:4, name:'Tiết 4', time:'10:00 - 10:35', session:'morning' },
    { id:'break_noon', name:'Nghỉ trưa', time:'10:45 - 13:45', isBreak:true, label:'🍚 Ăn trưa bán trú & Ngủ trưa tại trường' },
    { id:5, name:'Tiết 1 (Chiều)', time:'14:00 - 14:35', session:'afternoon' },
    { id:6, name:'Tiết 2 (Chiều)', time:'14:45 - 15:20', session:'afternoon' },
    { id:7, name:'Tiết 3 (Chiều)', time:'15:30 - 16:05', session:'afternoon' }
  ];

  let tbodyHtml='<tbody>';

  periodRows.forEach(row=>{
    if(row.isBreak){
      tbodyHtml+='<tr class="tt-break-row"><td class="tt-col-period"><div class="p-num" style="color:#b45309">⏰ ' + row.time + '</div></td><td colspan="' + daysToShow.length + '">' + row.label + '</td></tr>';
      return;
    }

    const p=row.id;
    tbodyHtml+='<tr><td class="tt-col-period"><div class="p-num">' + row.name + '</div><div class="p-time">' + row.time + '</div></td>';

    daysToShow.forEach(d=>{
      const coord=d + '_' + p;
      const entry=tt[coord];
      const meta=entry?getSubjectMeta(entry.subject):null;

      if(entry && meta){
        tbodyHtml+='<td><div class="tt-cell" ondragover="onTtDragOver(event)" ondragleave="onTtDragLeave(event)" ondrop="onTtDrop(event,\'' + d + '\',' + p + ')" onclick="onTtCellClick(\'' + d + '\',' + p + ')"><div class="tt-cell-filled" draggable="true" ondragstart="onTtCellDragStart(event,\'' + coord + '\')" style="background:' + meta.bg + ';border:1.5px solid ' + meta.border + ';color:' + meta.textColor + '"><button type="button" class="tt-cell-del" title="Xóa môn này" onclick="deleteTimetableCell(\'' + coord + '\',event)">✕</button><div class="tt-cell-icon">' + meta.icon + '</div><div class="tt-cell-name">' + safe(entry.subject) + '</div>' + (entry.note?('<div class="tt-cell-note" title="' + safe(entry.note) + '">' + safe(entry.note) + '</div>'):'') + '</div></div></td>';
      }else{
        tbodyHtml+='<td><div class="tt-cell empty" ondragover="onTtDragOver(event)" ondragleave="onTtDragLeave(event)" ondrop="onTtDrop(event,\'' + d + '\',' + p + ')" onclick="onTtCellClick(\'' + d + '\',' + p + ')" title="Bấm để chọn môn hoặc kéo môn vào đây"><span>+</span></div></td>';
      }
    });

    tbodyHtml+='</tr>';
  });

  tbodyHtml+='</tbody>';
  table.innerHTML=theadHtml+tbodyHtml;
}

function renderTimetable(){
  const c=child();
  const nameEl=document.getElementById('scheduleName');
  if(nameEl) nameEl.textContent=c?(childIcon(c)+' '+c.name):'bé';

  renderTimetablePalette();
  renderTimetableTable();
}

function loadGrade1DefaultTimetable(){
  const c=child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  askConfirm('Nạp Thời khóa biểu Lớp 1 chuẩn', 'Bạn muốn nạp Mẫu Thời khóa biểu Lớp 1 chuẩn của Bộ Giáo dục & Đào tạo cho bé? (Các tiết học hiện tại sẽ được cập nhật)', ()=>{
    c.timetable=structuredClone(DEFAULT_GRADE1_TIMETABLE);
    save();
    renderTimetable();
    renderSchoolBagChecklist();
    playChime('success');
    showToast('🎉 Đã nạp thành công Thời khóa biểu Lớp 1 chuẩn!');
  },{yesText:'Nạp mẫu chuẩn'});
}

function confirmClearTimetable(){
  const c=child();
  if(!c) return;
  askConfirm('Xóa trắng Thời khóa biểu', 'Bạn có chắc chắn muốn xóa toàn bộ môn học trong Thời khóa biểu tuần của bé?', ()=>{
    c.timetable={};
    save();
    renderTimetable();
    renderSchoolBagChecklist();
    showToast('🧹 Đã xóa trắng thời khóa biểu.');
  },{yesText:'Có, xóa trắng',icon:'🧹'});
}

// ➕ THÊM MÔN HỌC TÙY CHỈNH
function openCustomSubjectModal(){
  document.getElementById('newSubjName').value='';
  document.getElementById('newSubjIcon').value='🌟';
  document.getElementById('customSubjectModal').classList.add('show');
}

function closeCustomSubjectModal(){
  document.getElementById('customSubjectModal').classList.remove('show');
}

function submitCustomSubject(){
  const name=document.getElementById('newSubjName').value.trim();
  const icon=document.getElementById('newSubjIcon').value.trim()||'🌟';
  const color=document.getElementById('newSubjColor').value||'#3b82f6';

  if(!name) return alert('Vui lòng nhập tên môn học.');
  if(!Array.isArray(data.customSubjects)) data.customSubjects=[];

  data.customSubjects.push({
    name,icon,color,
    bg:'#f8fafc',
    border:color,
    textColor:color
  });

  save();
  closeCustomSubjectModal();
  renderTimetablePalette();
  showToast('🎉 Đã thêm môn "' + name + '" vào khay môn học!');
}

// 4. 🎒 SOẠN CẶP SÁCH ĐẾN TRƯỜNG THEO THỜI KHÓA BIỂU
let bagCheckedItems={};

function getTomorrowDayNumber(){
  const now=new Date();
  const currentHour=now.getHours();
  let targetDate=new Date();
  if(currentHour>=15){
    targetDate.setDate(targetDate.getDate()+1);
  }
  const day=targetDate.getDay();
  if(day===0) return '2';
  if(day===6) return '7';
  return String(day+1);
}

function renderSchoolBagChecklist(){
  const c=child();
  const targetDay=getTomorrowDayNumber();
  const dayLabels={'2':'Thứ 2','3':'Thứ 3','4':'Thứ 4','5':'Thứ 5','6':'Thứ 6','7':'Thứ 7'};
  const dayName=dayLabels[targetDay]||'Ngày mai';

  const tt=c?.timetable||{};
  const subjectsInDay=new Set();
  [1,2,3,4,5,6,7].forEach(p=>{
    const entry=tt[targetDay + '_' + p];
    if(entry && entry.subject && entry.subject!=='Bán trú / Nghỉ'){
      subjectsInDay.add(entry.subject);
    }
  });

  const subjectArr=Array.from(subjectsInDay);

  const items=[
    { id:'pencil_case', text:'Hộp bút chì 2B (đã gọt nhọn 3 cây, gôm tẩy sạch, thước kẻ 20cm)' },
    { id:'water_bottle', text:'Bình nước uống cá nhân & Khăn tay nhỏ' },
    { id:'hat_badge', text:'Mũ che nắng & Thẻ học sinh đeo cổ' }
  ];

  subjectArr.forEach(sub=>{
    const lower=sub.toLowerCase();
    if(lower.includes('toán')){
      items.push({ id:'book_math', text:'Sách Toán Lớp 1, Vở bài tập Toán & Bảng con, phấn trắng, que tính' });
    }else if(lower.includes('tiếng việt')){
      items.push({ id:'book_viet', text:'Sách Tiếng Việt Tập 1 & Vở ô ly tập viết chữ nắn nót' });
    }else if(lower.includes('tiếng anh')){
      items.push({ id:'book_english', text:'Sách Tiếng Anh & Thẻ học từ vựng' });
    }else if(lower.includes('mỹ thuật')||lower.includes('vẽ')){
      items.push({ id:'art_kit', text:'Hộp bút sáp màu 12 màu, Giấy vẽ A4 & Kéo thủ công an toàn' });
    }else if(lower.includes('thể chất')||lower.includes('thể dục')){
      items.push({ id:'pe_kit', text:'Đi giày thể thao êm chân & Mặc trang phục thể dục thoáng mát' });
    }else if(lower.includes('âm nhạc')){
      items.push({ id:'music_kit', text:'Thanh phách âm nhạc / Trống gõ' });
    }else if(lower.includes('tự nhiên')||lower.includes('tn & xh')){
      items.push({ id:'science_kit', text:'Sách Tự nhiên và Xã hội Lớp 1' });
    }else{
      items.push({ id:'sub_' + sub, text:'Sách vở & Đồ dùng môn ' + sub });
    }
  });

  const storageKey='bag_' + (c?.id||'c') + '_' + todayISO();
  if(!bagCheckedItems[storageKey]) bagCheckedItems[storageKey]={};
  const checkedMap=bagCheckedItems[storageKey];

  let checkedCount=0;
  items.forEach(it=>{ if(checkedMap[it.id]) checkedCount++; });
  const pct=items.length?Math.round((checkedCount/items.length)*100):0;
  const isAllDone=(items.length>0 && checkedCount===items.length);

  const subjectBadges=subjectArr.length
    ? subjectArr.map(s=>'<span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:12px;font-size:11.5px;font-weight:800;margin-right:4px">' + s + '</span>').join('')
    : '<span style="color:#64748b;font-size:12px">Chưa có môn trong TKB</span>';

  let checklistHtml=items.map(it=>{
    const checked=!!checkedMap[it.id];
    return '<div class="bag-item ' + (checked?'checked':'') + '" onclick="toggleBagItem(\'' + storageKey + '\',\'' + it.id + '\')"><div class="bag-check-circle">' + (checked?'✓':'') + '</div><div class="bag-item-text">' + it.text + '</div></div>';
  }).join('');

  const html=`
    <div class="bag-card-head">
      <div>
        <div class="bag-title">
          <span>🎒</span>
          <span>Soạn cặp sách đến trường (${dayName})</span>
          <span class="bag-reward-pill">+5 ⭐ Thưởng tự giác</span>
        </div>
        <div style="font-size:12.5px;color:#047857;margin-top:2px">
          Các môn học trong TKB: ${subjectBadges}
        </div>
      </div>
      <div class="bag-progress-wrap">
        <span>Tiến độ: <b>${checkedCount}/${items.length}</b> (${pct}%)</span>
        <div class="bag-progress-bar"><i style="width:${pct}%"></i></div>
      </div>
    </div>
    <div class="bag-checklist">${checklistHtml}</div>
    ${isAllDone ? '<div style="margin-top:12px;background:#d1fae5;border:1.5px dashed #10b981;border-radius:var(--radius-sm);padding:10px 14px;text-align:center;font-weight:800;color:#065f46">🎉 Hoan hô bé đã soạn cặp sách đầy đủ và ngăn nắp! Cặp sách đã sẵn sàng cho ngày mai rồi!</div>' : ''}
  `;

  ['todaySchoolBagCard','scheduleSchoolBagCard'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.innerHTML=html;
  });
}

function toggleBagItem(storageKey, itemId){
  if(!bagCheckedItems[storageKey]) bagCheckedItems[storageKey]={};
  const current=!!bagCheckedItems[storageKey][itemId];
  bagCheckedItems[storageKey][itemId]=!current;
  playPopSound();

  const c=child();
  const allChecked=document.querySelectorAll('.bag-item:not(.checked)').length<=1 && !current;
  if(allChecked && c && c.schoolBagPackedDate!==todayISO()){
    c.schoolBagPackedDate=todayISO();
    c.score+=5;
    if(!Array.isArray(c.pointHistory)) c.pointHistory=[];
    c.pointHistory.push({
      id:uid('bag'),
      type:'study',
      subject:'Kỹ năng sống',
      topic:'Tự giác soạn cặp sách ngăn nắp theo TKB',
      amount:5,
      note:'Đã kiểm tra đầy đủ sách vở, bút thước và bình nước!',
      reason:'[Kỹ năng sống] Tự giác soạn cặp sách ngăn nắp (+5 ⭐)',
      at:new Date().toISOString()
    });
    updateEarnedAchievements(c);
    save();
    playChime('success');
    triggerConfetti();
    setTimeout(()=>{
      speakVietnamese('Hoan hô bé ' + c.name + ' đã tự giác soạn cặp sách rất gọn gàng! Thưởng con năm điểm sao nhé!');
    },300);
    showToast('🎉 Hoàn thành soạn cặp sách! +5 ⭐');
  }

  renderSchoolBagChecklist();
}

// 5. 🐝 ĐỒNG HỒ CON ONG 15 PHÚT TẬP TRUNG (KIDS FOCUS TIMER)
let beeTimerSeconds=15*60;
let beeTimerTotalSeconds=15*60;
let beeTimerInterval=null;
let beeTimerRunning=false;

function openBeeTimerModal(){
  updateBeeTimerDisplay();
  document.getElementById('beeTimerModal').classList.add('show');
}

function closeBeeTimerModal(){
  document.getElementById('beeTimerModal').classList.remove('show');
}

function setBeeTimerMinutes(mins){
  if(beeTimerRunning) toggleBeeTimer();
  beeTimerSeconds=mins*60;
  beeTimerTotalSeconds=mins*60;
  updateBeeTimerDisplay();
  playPopSound();
}

function toggleBeeTimer(){
  const btnModal=document.getElementById('beeStartBtnModal');
  const btnInline=document.getElementById('beeStartBtnInline');

  if(beeTimerRunning){
    clearInterval(beeTimerInterval);
    beeTimerRunning=false;
    if(btnModal) btnModal.textContent='▶ Tiếp tục';
    if(btnInline) btnInline.textContent='▶ Tiếp tục';
    showToast('⏸ Đã tạm dừng đồng hồ.');
  }else{
    beeTimerRunning=true;
    if(btnModal) btnModal.textContent='⏸ Tạm dừng';
    if(btnInline) btnInline.textContent='⏸ Tạm dừng';
    playPopSound();

    beeTimerInterval=setInterval(()=>{
      beeTimerSeconds--;
      updateBeeTimerDisplay();

      if(beeTimerSeconds<=0){
        clearInterval(beeTimerInterval);
        beeTimerRunning=false;
        if(btnModal) btnModal.textContent='🚀 Bắt đầu ngay';
        if(btnInline) btnInline.textContent='🚀 Bắt đầu ngay';
        onBeeTimerFinished();
      }
    },1000);
  }
}

function resetBeeTimer(){
  if(beeTimerInterval) clearInterval(beeTimerInterval);
  beeTimerRunning=false;
  beeTimerSeconds=beeTimerTotalSeconds;
  updateBeeTimerDisplay();
  const btnModal=document.getElementById('beeStartBtnModal');
  const btnInline=document.getElementById('beeStartBtnInline');
  if(btnModal) btnModal.textContent='🚀 Bắt đầu ngay';
  if(btnInline) btnInline.textContent='🚀 Bắt đầu ngay';
}

function updateBeeTimerDisplay(){
  const m=Math.floor(beeTimerSeconds/60);
  const s=beeTimerSeconds%60;
  const str=String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');

  const elModal=document.getElementById('beeTimerDisplayModal');
  if(elModal) elModal.textContent=str;

  const elInline=document.getElementById('beeTimerDisplayInline');
  if(elInline) elInline.textContent=str;
}

function onBeeTimerFinished(){
  playSchoolBell();
  triggerConfetti();
  const c=child();
  if(c){
    c.score+=5;
    if(!Array.isArray(c.pointHistory)) c.pointHistory=[];
    c.pointHistory.push({
      id:uid('bee'),
      type:'study',
      subject:'Kỹ năng sống',
      topic:'Hoàn thành 15 phút tập trung học tập (Đồng hồ Con Ong)',
      amount:5,
      note:'Tập trung ngồi học nghiêm túc, không phân tâm!',
      reason:'[Kỹ năng sống] 15 phút tập trung học ngoan (+5 ⭐)',
      at:new Date().toISOString()
    });
    updateEarnedAchievements(c);
    save();
    render();
  }
  speakVietnamese('Hoan hô bé ' + (c?c.name:'con') + '! Đã hết 15 phút tập trung làm bài rất ngoan! Con đứng dậy vươn vai và uống một cốc nước nhé!');
  showToast('🎉 XUẤT SẮC! Hoàn thành 15 phút tập trung! +5 ⭐');
}

function renderBeeTimer(){
  const wrap=document.getElementById('scheduleBeeTimerCard');
  if(!wrap) return;

  const m=Math.floor(beeTimerSeconds/60);
  const s=beeTimerSeconds%60;
  const str=String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');

  wrap.innerHTML=`
    <div style="font-size:18px;font-weight:900;color:#854d0e;display:flex;align-items:center;justify-content:center;gap:8px">
      <span>🐝⏰</span>
      <span>Đồng hồ Con Ong 15 Phút Tập Trung</span>
    </div>
    <div style="font-size:13px;color:#a16207;margin-top:4px">Dành riêng cho học sinh Lớp 1: Rèn luyện tính tự giác ngồi học tập trung từng đợt ngắn 15 phút!</div>
    <div class="bee-timer-display" id="beeTimerDisplayInline">${str}</div>
    <div style="display:flex;justify-content:center;gap:6px;margin-bottom:12px">
      <button class="tt-day-pill ${beeTimerTotalSeconds===600?'active':''}" onclick="setBeeTimerMinutes(10)">10 phút</button>
      <button class="tt-day-pill ${beeTimerTotalSeconds===900?'active':''}" onclick="setBeeTimerMinutes(15)">15 phút (Chuẩn)</button>
      <button class="tt-day-pill ${beeTimerTotalSeconds===1200?'active':''}" onclick="setBeeTimerMinutes(20)">20 phút</button>
    </div>
    <div class="bee-timer-actions">
      <button class="bee-btn primary" id="beeStartBtnInline" onclick="toggleBeeTimer()">${beeTimerRunning?'⏸ Tạm dừng':'🚀 Bắt đầu ngay'}</button>
      <button class="bee-btn secondary" onclick="resetBeeTimer()">🔄 Cài lại</button>
      <button class="bee-btn secondary" onclick="openBeeTimerModal()">🔍 Phóng to</button>
    </div>
  `;
}

// Bắt đầu nhịp tick đếm ngược cho Nhắc báo giờ chở con đi học (mỗi 1 giây)
setInterval(updateRideReminderTick, 1000);

function applyInitialHash() {
  const urlParams = new URLSearchParams(window.location.search);
  const secParam = urlParams.get('section');
  const h = secParam || (location.hash || '').replace('#', '');
  if (h && typeof showSection === 'function') {
    showSection(h);
  }
  const tabParam = urlParams.get('tab');
  if (tabParam && typeof switchTimetableTab === 'function') {
    switchTimetableTab(tabParam);
  }
}
applyInitialHash();
window.addEventListener('hashchange', applyInitialHash);
