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

// 🌟 5 MÔN HỌC TRỌNG TÂM CỦA CON (Các môn khác được thu gọn lại)
const CORE_STUDY_SUBJECTS=['Toán tư duy','Học Đàn','Tiếng Anh','Tiếng Trung','Truyện kể Vĩ nhân'];

// ⭐ Bộ mẫu nhiệm vụ của Bảo Nhi (Ưu tiên 5 môn chính)
const TASK_PRESETS=[
  {name:'Học Toán tư duy (15 phút)',subject:'Toán tư duy',points:15,duration:'15 phút',instruction:'Giải các bài toán đố logic, quy luật và tư duy'},
  {name:'Luyện Đàn chăm chỉ',subject:'Học Đàn',points:15,duration:'20 phút',instruction:'Luyện ngón, tập đúng nhịp và hoàn thành bản nhạc'},
  {name:'Học Tiếng Anh Little Fox',subject:'Tiếng Anh',points:20,duration:'20 phút',instruction:'Lật thẻ từ vựng và luyện nói câu theo bậc thang Little Fox'},
  {name:'Học Tiếng Trung (Pinyin & Từ mới)',subject:'Tiếng Trung',points:20,duration:'20 phút',instruction:'Nghe phát âm chuẩn và tập nói câu Tiếng Trung cơ bản'},
  {name:'Nghe truyện kể về Vĩ nhân',subject:'Truyện kể Vĩ nhân',points:15,duration:'15 phút',instruction:'Nghe kể chuyện tấm gương danh nhân và chia sẻ bài học rút ra'},
  {name:'Được cô khen học tốt',subject:'Kỹ năng sống',points:10,duration:'15 phút',instruction:'Cô khen học tốt ở trường'},
  {name:'Phụ bố mẹ 1 việc',subject:'Kỹ năng sống',points:5,duration:'15 phút',instruction:'Phụ bố mẹ một việc nhà'},
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

// 📚 Bộ tiêu chí & mẫu cộng điểm học tập (5 Môn chính hiển thị nổi bật, các nội dung khác thu gọn)
const STUDY_PRESETS=[
  {id:'sp_math_logic',name:'Giải Toán tư duy xuất sắc',icon:'🧮',points:15,subject:'Toán tư duy',core:true,desc:'Chăm chỉ giải các bài toán logic, quy luật và tư duy'},
  {id:'sp_piano',name:'Luyện Đàn chăm chỉ đúng nhịp',icon:'🎹',points:15,subject:'Học Đàn',core:true,desc:'Tự giác ngồi luyện ngón và đánh đàn 15–20 phút'},
  {id:'sp_english',name:'Học Tiếng Anh Little Fox & Nói câu',icon:'🇬🇧',points:15,subject:'Tiếng Anh',core:true,desc:'Học thẻ từ và luyện nói câu tiếng Anh theo Level'},
  {id:'sp_chinese',name:'Học từ & phát âm Tiếng Trung',icon:'🐼',points:15,subject:'Tiếng Trung',core:true,desc:'Luyện phát âm Pinyin và nói câu tiếng Trung chuẩn'},
  {id:'sp_great_figures',name:'Nghe truyện Vĩ nhân & Rút bài học',icon:'👑',points:15,subject:'Truyện kể Vĩ nhân',core:true,desc:'Nghe câu chuyện tấm gương vĩ nhân và kể lại bài học hay'},
  // Các nội dung khác (sẽ được thu gọn trong mục mở rộng)
  {id:'sp_10',name:'Điểm 10 kiểm tra / thi',icon:'💯',points:20,subject:'Toán tư duy',core:false,desc:'Bài kiểm tra hoặc bài thi đạt điểm 10 tuyệt đối'},
  {id:'sp_9',name:'Điểm 9 kiểm tra / thi',icon:'🌟',points:15,subject:'Toán tư duy',core:false,desc:'Bài kiểm tra đạt điểm 9 xuất sắc'},
  {id:'sp_8',name:'Điểm 8 kiểm tra / thi',icon:'👍',points:10,subject:'Toán tư duy',core:false,desc:'Bài kiểm tra đạt điểm 8 kết quả tốt'},
  {id:'sp_teacher',name:'Cô giáo khen / Hoa điểm 10',icon:'🌸',points:15,subject:'Kỹ năng sống',core:false,desc:'Được cô khen học tốt, chăm chỉ trên lớp'},
  {id:'sp_homework',name:'Xong bài tập về nhà xuất sắc',icon:'✍️',points:10,subject:'Toán tư duy',core:false,desc:'Tự giác hoàn thành bài tập về nhà sạch sẽ, đúng giờ'},
  {id:'sp_reading',name:'Đọc sách tri thức 20 phút',icon:'📖',points:10,subject:'Tiếng Việt',core:false,desc:'Tự giác đọc sách khoa học hoặc truyện bổ ích'},
  {id:'sp_handwriting',name:'Luyện viết chữ đẹp, sạch sẽ',icon:'📝',points:10,subject:'Tiếng Việt',core:false,desc:'Nét chữ nắn nót, vở sạch chữ đẹp'},
  {id:'sp_speaking',name:'Thuộc bài & hăng hái phát biểu',icon:'🗣️',points:10,subject:'Tiếng Việt',core:false,desc:'Tự tin phát biểu xây dựng bài trong lớp'},
  {id:'sp_creative',name:'Sáng tạo tranh vẽ / Thủ công',icon:'🎨',points:10,subject:'Kỹ năng sống',core:false,desc:'Hoàn thành tác phẩm tranh vẽ, mô hình khéo tay'}
];

// 💡 Danh mục công cụ học tập chọn lọc (5 môn chính + các nguồn bổ sung thu gọn)
const DEFAULT_STUDY_TOOLS=[
  // 1. Toán tư duy
  {id:'tool_vioedu',name:'VioEdu - Đấu trường Toán tư duy',category:'Toán tư duy',core:true,icon:'🧮',url:'https://vio.edu.vn',desc:'Luyện các dạng toán tư duy, toán đố logic và thử thách trí tuệ tiểu học sinh động.'},
  {id:'tool_khan',name:'Khan Academy Toán Tư Duy',category:'Toán tư duy',core:true,icon:'📐',url:'https://vi.khanacademy.org',desc:'Học tư duy Toán học từ cơ bản đến nâng cao qua video và bài tập tương tác trực quan.'},
  {id:'tool_mathplayground',name:'Math Playground - Game Toán Logic',category:'Toán tư duy',core:true,icon:'🧩',url:'https://www.mathplayground.com',desc:'Trò chơi rèn luyện tư duy logic, xếp hình, giải đố số học vui nhộn cho bé.'},
  // 2. Học Đàn
  {id:'tool_musicca',name:'Musicca - Đàn Piano ảo & Nhạc lý',category:'Học Đàn',core:true,icon:'🎹',url:'https://www.musicca.com/vi/piano',desc:'Đàn Piano trực tuyến miễn phí kết hợp bài tập nhận biết nốt nhạc, hợp âm và tiết tấu.'},
  {id:'tool_chrome_music',name:'Chrome Music Lab - Sáng tạo Giai điệu',category:'Học Đàn',core:true,icon:'🎵',url:'https://musiclab.chromeexperiments.com/Song-Maker',desc:'Tự tay sáng tác giai điệu Piano, khám phá nhịp điệu và sóng âm thanh cực kỳ thú vị.'},
  // 3. Tiếng Anh
  {id:'tool_littlefox',name:'Little Fox English - Truyện & Bài hát',category:'Tiếng Anh',core:true,icon:'🦊',url:'https://www.littlefox.com',desc:'Thư viện truyện hoạt hình Tiếng Anh phân theo Level 1 đến Level 9 giúp bé nghe và nói câu tự nhiên.'},
  {id:'tool_duolingo',name:'Duolingo Tiếng Anh',category:'Tiếng Anh',core:true,icon:'🦉',url:'https://www.duolingo.com',desc:'Học tiếng Anh mỗi ngày qua các bài học tương tác vui nhộn như trò chơi mini-game.'},
  {id:'tool_british_council',name:'LearnEnglish Kids (British Council)',category:'Tiếng Anh',core:true,icon:'🇬🇧',url:'https://learnenglishkids.britishcouncil.org',desc:'Kho bài hát, trò chơi, câu chuyện và bài tập tiếng Anh thiếu nhi chuẩn Hội đồng Anh.'},
  // 4. Tiếng Trung
  {id:'tool_littlefox_cn',name:'Little Fox Chinese - Tiếng Trung cho bé',category:'Tiếng Trung',core:true,icon:'🐼',url:'https://chinese.littlefox.com',desc:'Học Tiếng Trung qua truyện hoạt hình và bài hát thiếu nhi theo từng cấp độ từ cơ bản.'},
  {id:'tool_duolingo_cn',name:'Duolingo Tiếng Trung (Pinyin & Hán tự)',category:'Tiếng Trung',core:true,icon:'🏮',url:'https://www.duolingo.com/course/zh/en/Learn-Chinese',desc:'Luyện phát âm thanh điệu Pinyin, nhận diện chữ Hán và mẫu câu giao tiếp hàng ngày.'},
  // 5. Truyện kể Vĩ nhân
  {id:'tool_vinhan_audio',name:'Kho Truyện Kể Danh Nhân & Vĩ Nhân',category:'Truyện kể Vĩ nhân',core:true,icon:'👑',url:'https://www.youtube.com/results?search_query=k%E1%BB%83+chuy%E1%BB%87n+danh+nh%C3%A2n+th%E1%BA%BF+gi%E1%BB%9Bi+cho+b%C3%A9',desc:'Tuyển tập phim hoạt hình & truyện kể về các nhà bác học, danh nhân lịch sử truyền cảm hứng cho bé.'},
  // Các nguồn bổ sung khác (Thu gọn)
  {id:'tool_trangnguyen',name:'Trạng Nguyên Tiếng Việt',category:'Tiếng Việt',core:false,icon:'🇻🇳',url:'https://trangnguyen.edu.vn',desc:'Sân chơi khám phá vẻ đẹp Tiếng Việt, câu đố dân gian và lịch sử hào hùng cho thiếu nhi.'},
  {id:'tool_scratch',name:'Scratch MIT - Lập trình sáng tạo',category:'Sáng tạo & Lập trình',core:false,icon:'🐱',url:'https://scratch.mit.edu',desc:'Học lập trình kéo thả sáng tạo game, phim hoạt hình và câu chuyện tương tác từ MIT.'},
  {id:'tool_codeorg',name:'Code.org - Giờ Lập Trình',category:'Sáng tạo & Lập trình',core:false,icon:'💻',url:'https://code.org',desc:'Khóa học tư duy máy tính trực quan cùng các nhân vật hoạt hình quen thuộc.'},
  {id:'tool_natgeo',name:'National Geographic Kids',category:'Khám phá thế giới',core:false,icon:'🌍',url:'https://kids.nationalgeographic.com',desc:'Khám phá thế giới kỳ diệu của động vật hoang dã, thiên nhiên và khoa học đời sống.'},
  {id:'tool_nasa',name:'NASA Kids\' Club',category:'Khám phá thế giới',core:false,icon:'🚀',url:'https://www.nasa.gov/learning-resources/nasa-kids-club/',desc:'Khám phá vũ trụ, phi thuyền, các hành tinh và tìm hiểu công việc của phi hành gia.'}
];

// 🎁 Danh mục phần quà mặc định đa dạng, linh hoạt
// 🎁 Danh mục phần quà chuẩn: 100 ⭐ = 10.000đ (Ưu tiên đồ dùng học tập, bánh ngon ấm bụng, quà & đi chơi; Không dùng đồ lạnh!)
const DEFAULT_REWARDS=[
  // ✏️ ĐỒ DÙNG HỌC TẬP (ƯU TIÊN HÀNG ĐẦU)
  {id:uid('r'),name:'Gọt bút chì quay tay cute / Bút sáp màu',cost:50,category:'Đồ dùng học tập',icon:'✏️',rule:'Dụng cụ học tập xinh xắn cho con'},
  {id:uid('r'),name:'Bộ thước kẻ hình thú & Tẩy hoạt hình',cost:100,category:'Đồ dùng học tập',icon:'📐',rule:'Tự chọn màu sắc yêu thích'},
  {id:uid('r'),name:'Hộp bút hoạt hình / Bút dạ quang 6 màu',cost:150,category:'Đồ dùng học tập',icon:'🖊️',rule:'Dùng trong góc học tập & trên lớp'},
  {id:uid('r'),name:'Tập vở ô li sạch đẹp & Bút máy rèn chữ',cost:200,category:'Đồ dùng học tập',icon:'📓',rule:'Khen ngợi nét chữ nắn nót'},
  {id:uid('r'),name:'Cuốn truyện tranh / Sách khoa học thiếu nhi',cost:300,category:'Đồ dùng học tập',icon:'📚',rule:'Tự chọn sách hay tại nhà sách'},
  {id:uid('r'),name:'Bộ đồ dùng học tập cao cấp (Màu nước, đất nặn)',cost:500,category:'Đồ dùng học tập',icon:'🎨',rule:'Tích lũy chăm chỉ từ 1 - 2 tuần'},

  // 🍪 BÁNH & MÓN NGON ẤM BỤNG (KHÔNG DÙNG ĐỒ LẠNH!)
  {id:uid('r'),name:'Gói bánh quy bơ / Bánh gạo giòn rụm',cost:50,category:'Bánh & Món ngon',icon:'🍪',rule:'Ăn xế chiều ấm bụng, thơm ngon'},
  {id:uid('r'),name:'1 Hộp sữa lúa mạch ấm / Sữa hạt dinh dưỡng',cost:80,category:'Bánh & Món ngon',icon:'🥛',rule:'Uống ấm buổi sáng hoặc trước khi ngủ'},
  {id:uid('r'),name:'Hộp bánh que Pocky / Bánh gấu sôcôla',cost:100,category:'Bánh & Món ngon',icon:'🥨',rule:'Thưởng món bánh thơm ngọt dịp cuối tuần'},
  {id:uid('r'),name:'Bố mẹ nấu bữa tối món con yêu thích',cost:150,category:'Bánh & Món ngon',icon:'🍲',rule:'Con được tự chọn thực đơn bữa ăn'},
  {id:uid('r'),name:'Bữa tiệc gà rán / Pizza nhỏ ấm nóng cả nhà',cost:350,category:'Bánh & Món ngon',icon:'🍕',rule:'Liên hoan cùng gia đình dịp cuối tuần'},

  // 🎁 QUÀ & ĐỒ CHƠI SÁNG TẠO
  {id:uid('r'),name:'Tấm sticker dán hình công chúa / siêu nhân',cost:30,category:'Quà & Đồ chơi',icon:'✨',rule:'Trang trí tập vở hoặc góc học tập'},
  {id:uid('r'),name:'Bộ đất nặn không dính tay 12 màu sáng tạo',cost:100,category:'Quà & Đồ chơi',icon:'🧸',rule:'Rèn luyện đôi bàn tay khéo léo'},
  {id:uid('r'),name:'Bộ đồ chơi xếp hình Lego mini trí tuệ',cost:200,category:'Quà & Đồ chơi',icon:'🧩',rule:'Phát triển tư duy không gian & logic'},
  {id:uid('r'),name:'Thú bông nhỏ xinh / Búp bê dễ thương',cost:350,category:'Quà & Đồ chơi',icon:'🎀',rule:'Đặt tại góc học tập của con'},
  {id:uid('r'),name:'Món quà lớn theo nguyện vọng ước mơ',cost:1000,category:'Quà & Đồ chơi',icon:'🎁',rule:'Phần thưởng tích lũy nỗ lực cả tháng'},

  // 🎡 ĐI CHƠI & DÃ NGOẠI
  {id:uid('r'),name:'Đi công viên dạo chơi, chạy nhảy cuối tuần',cost:100,category:'Đi chơi & Dã ngoại',icon:'🌳',rule:'Vận động thể thao ngoài trời mát mẻ'},
  {id:uid('r'),name:'Đi nhà sách Fahasa đọc truyện & dạo chơi',cost:250,category:'Đi chơi & Dã ngoại',icon:'📖',rule:'Dịp cuối tuần cùng bố mẹ'},
  {id:uid('r'),name:'Đi siêu thị GO dạo chơi & chọn quà nhỏ',cost:350,category:'Đi chơi & Dã ngoại',icon:'🛒',rule:'Tham quan & tự chọn món yêu thích'},
  {id:uid('r'),name:'Vé khu vui chơi trẻ em (tiNiWorld / Kidzooona)',cost:500,category:'Đi chơi & Dã ngoại',icon:'🎡',rule:'Thưởng khi hoàn thành mục tiêu học tập'},
  {id:uid('r'),name:'Chuyến đi dã ngoại xa cùng cả gia đình',cost:1000,category:'Đi chơi & Dã ngoại',icon:'🏖️',rule:'Dịp nghỉ lễ hoặc cuối tháng'}
];

// 🎒 DANH MỤC MÔN HỌC CHUẨN LỚP 1A4
const GRADE1_SUBJECTS = [
  { name: 'Tiếng Việt', icon: '📖', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', textColor: '#6d28d9' },
  { name: 'Toán', icon: '📐', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', textColor: '#1d4ed8' },
  { name: 'SHDC', icon: '🚩', color: '#ef4444', bg: '#fef2f2', border: '#fecaca', textColor: '#b91c1c' },
  { name: 'TVTC', icon: '✍️', color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff', textColor: '#7e22ce' },
  { name: 'TTC', icon: '🧮', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', textColor: '#1d4ed8' },
  { name: 'Tiếng Anh', icon: '🇬🇧', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', textColor: '#b45309' },
  { name: 'TNXH', icon: '🔬', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', textColor: '#047857' },
  { name: 'GDTC', icon: '⚽', color: '#14b8a6', bg: '#f0fdfa', border: '#99f6e4', textColor: '#0f766e' },
  { name: 'Mĩ thuật', icon: '🎨', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', textColor: '#c2410c' },
  { name: 'Âm nhạc', icon: '🎵', color: '#06b6d4', bg: '#ecfeff', border: '#a5f3fc', textColor: '#0e7490' },
  { name: 'Đạo đức', icon: '💖', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', textColor: '#be185d' },
  { name: 'HĐTN', icon: '🌟', color: '#eab308', bg: '#fefce8', border: '#fef08a', textColor: '#a16207' },
  { name: 'KNS', icon: '🤝', color: '#84cc16', bg: '#f7fee7', border: '#d9f99d', textColor: '#4d7c0f' },
  { name: 'STEM', icon: '🚀', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', textColor: '#4338ca' },
  { name: 'ATGT', icon: '🚦', color: '#f43f5e', bg: '#fff1f2', border: '#fecdd3', textColor: '#be123c' },
  { name: 'Nghỉ', icon: '😴', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', textColor: '#475569' }
];

// 🎒 MẪU THỜI KHÓA BIỂU LỚP 1A4 (ÁP DỤNG TỪ NGÀY 07/09/2026)
const DEFAULT_GRADE1_TIMETABLE = {
  // Thứ 2
  "2_1": { subject: "SHDC", note: "Sinh hoạt dưới cờ" },
  "2_2": { subject: "Toán", note: "Toán" },
  "2_3": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "2_4": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "2_5": { subject: "TVTC", note: "Tiếng Việt tăng cường" },
  "2_6": { subject: "Đạo đức", note: "Đạo đức" },
  "2_7": { subject: "Tiếng Việt", note: "Tiếng Việt" },

  // Thứ 3
  "3_1": { subject: "Toán", note: "Toán" },
  "3_2": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "3_3": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "3_4": { subject: "TNXH", note: "Tự nhiên và Xã hội" },
  "3_5": { subject: "Âm nhạc", note: "Âm nhạc" },
  "3_6": { subject: "HĐTN", note: "Hoạt động trải nghiệm" },
  "3_7": { subject: "TNXH", note: "Tự nhiên và Xã hội" },

  // Thứ 4 (Lưu ý: Mặc áo thể dục)
  "4_1": { subject: "GDTC", note: "Thể dục (Mặc áo thể dục)" },
  "4_2": { subject: "Mĩ thuật", note: "Mĩ thuật" },
  "4_3": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "4_4": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "4_5": { subject: "Tiếng Anh", note: "Tiếng Anh" },
  "4_6": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "4_7": { subject: "TTC", note: "Toán tăng cường" },

  // Thứ 5 (Lưu ý: Mặc áo thể dục)
  "5_1": { subject: "GDTC", note: "Thể dục (Mặc áo thể dục)" },
  "5_2": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "5_3": { subject: "Tiếng Anh", note: "Tiếng Anh" },
  "5_4": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "5_5": { subject: "KNS", note: "Kĩ năng sống" },
  "5_6": { subject: "STEM", note: "Bài học STEM" },
  "5_7": { subject: "ATGT", note: "An toàn giao thông" },

  // Thứ 6
  "6_1": { subject: "Toán", note: "Toán" },
  "6_2": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "6_3": { subject: "Tiếng Việt", note: "Tiếng Việt" },
  "6_4": { subject: "HĐTN", note: "Hoạt động trải nghiệm" },
  "6_5": { subject: "Nghỉ", note: "Chiều Thứ 6 nghỉ" },
  "6_6": { subject: "Nghỉ", note: "Chiều Thứ 6 nghỉ" },
  "6_7": { subject: "Nghỉ", note: "Chiều Thứ 6 nghỉ" }
};

// 🎒 HƯỚNG DẪN CÁCH SOẠN SÁCH VỞ THEO THỜI KHÓA BIỂU (LỚP 1A4)
const GRADE1_BAG_GUIDE = {
  "2": {
    dayLabel: "Thứ Hai",
    themeColor: "#ef4444",
    themeBg: "#fef2f2",
    themeBorder: "#fecaca",
    uniform: null,
    books: [
      { name: "Sách Toán", icon: "📘" },
      { name: "Sách Tiếng Việt", icon: "📖" },
      { name: "Sách Đạo đức", icon: "💖" }
    ],
    notebooks: [
      { name: "Vở màu xanh", color: "#3b82f6", label: "Vở xanh" },
      { name: "Vở màu đỏ", color: "#ef4444", label: "Vở đỏ" },
      { name: "Vở màu vàng", color: "#eab308", label: "Vở vàng" }
    ],
    supplies: [
      { name: "Màu sáp", icon: "🖍️" }
    ],
    note: "Chào cờ đầu tuần (SHDC) - Đi học đúng giờ"
  },
  "3": {
    dayLabel: "Thứ Ba",
    themeColor: "#f97316",
    themeBg: "#fff7ed",
    themeBorder: "#fed7aa",
    uniform: null,
    books: [
      { name: "Sách Tiếng Việt", icon: "📖" },
      { name: "Sách Toán", icon: "📘" },
      { name: "Sách TN XH", icon: "🔬" },
      { name: "Sách Âm nhạc", icon: "🎵" },
      { name: "Sách HĐTN", icon: "🌟" }
    ],
    notebooks: [
      { name: "Vở Tập Viết", color: "#8b5cf6", label: "Vở Tập Viết" },
      { name: "Vở màu xanh", color: "#3b82f6", label: "Vở xanh" },
      { name: "Vở màu đỏ", color: "#ef4444", label: "Vở đỏ" },
      { name: "Vở màu vàng", color: "#eab308", label: "Vở vàng" }
    ],
    supplies: [
      { name: "Màu sáp", icon: "🖍️" },
      { name: "Thanh phách", icon: "🥁" }
    ],
    note: "Có tiết Âm nhạc & TNXH"
  },
  "4": {
    dayLabel: "Thứ Tư",
    themeColor: "#10b981",
    themeBg: "#ecfdf5",
    themeBorder: "#a7f3d0",
    uniform: "Áo thể dục (Học môn GDTC)",
    books: [
      { name: "Sách Mĩ thuật", icon: "🎨" },
      { name: "VBT Mĩ Thuật", icon: "📑" },
      { name: "Sách Tiếng Việt & VBT Tiếng Việt", icon: "📖" },
      { name: "Sách Tiếng Anh", icon: "🇬🇧" },
      { name: "VBT Tiếng Anh", icon: "📑" },
      { name: "VBT Toán", icon: "📐" }
    ],
    notebooks: [
      { name: "Vở màu vàng", color: "#eab308", label: "Vở vàng" },
      { name: "Vở màu xanh", color: "#3b82f6", label: "Vở xanh" },
      { name: "Vở màu đỏ", color: "#ef4444", label: "Vở đỏ" },
      { name: "Vở màu hồng", color: "#ec4899", label: "Vở hồng" }
    ],
    supplies: [
      { name: "Màu sáp, giấy màu, Đất nặn", icon: "🎨" }
    ],
    note: "LƯU Ý: Có GDTC ➔ HS mặc Áo thể dục!"
  },
  "5": {
    dayLabel: "Thứ Năm",
    themeColor: "#0ea5e9",
    themeBg: "#f0f9ff",
    themeBorder: "#bae6fd",
    uniform: "Áo thể dục (Học môn GDTC)",
    books: [
      { name: "Sách Tiếng Việt", icon: "📖" },
      { name: "VBT Tiếng Việt", icon: "📑" },
      { name: "Sách Tiếng Anh", icon: "🇬🇧" },
      { name: "VBT Tiếng Anh", icon: "📑" }
    ],
    notebooks: [
      { name: "Vở màu xanh", color: "#3b82f6", label: "Vở xanh" },
      { name: "Vở màu vàng", color: "#eab308", label: "Vở vàng" },
      { name: "Vở màu hồng", color: "#ec4899", label: "Vở hồng" },
      { name: "Vở Tập Viết", color: "#8b5cf6", label: "Vở Tập Viết" }
    ],
    supplies: [
      { name: "Màu sáp", icon: "🖍️" }
    ],
    note: "LƯU Ý: Có GDTC ➔ HS mặc Áo thể dục!"
  },
  "6": {
    dayLabel: "Thứ Sáu",
    themeColor: "#6366f1",
    themeBg: "#eef2ff",
    themeBorder: "#c7d2fe",
    uniform: null,
    books: [
      { name: "Sách Toán", icon: "📘" },
      { name: "Sách Tiếng Việt", icon: "📖" },
      { name: "Sách HĐTN", icon: "🌟" }
    ],
    notebooks: [
      { name: "Vở màu xanh", color: "#3b82f6", label: "Vở xanh" },
      { name: "Vở màu đỏ", color: "#ef4444", label: "Vở đỏ" },
      { name: "Vở màu vàng", color: "#eab308", label: "Vở vàng" }
    ],
    supplies: [],
    note: "Chiều Thứ Sáu NGHỈ - Hoàn thành bài tập tuần"
  }
};


/* ============================================================
   🌟 ĐỊNH NGHĨA 3 NHÓM HÔM NAY: HỌC Ở NHÀ - TRÊN LỚP - PHỤ BỐ MẸ
   DỄ CỘNG & CÓ ĐIỂM TRỪ NHẬP ĐƯỢC
   ============================================================ */
const TODAY_CATEGORIES = {
  home_study: {
    id: 'home_study',
    name: 'Học ở nhà (5 Môn Chính)',
    icon: '🏠',
    color: '#10b981',
    bgColor: '#ecfdf5',
    praises: [
      { name: 'Học Toán tư duy', points: 15, icon: '🧮', core: true },
      { name: 'Luyện Đàn 15–20 phút', points: 15, icon: '🎹', core: true },
      { name: 'Học Tiếng Anh Little Fox', points: 15, icon: '🇬🇧', core: true },
      { name: 'Học Tiếng Trung (Pinyin)', points: 15, icon: '🐼', core: true },
      { name: 'Nghe truyện kể Vĩ nhân', points: 15, icon: '👑', core: true },
      // Các nội dung khác (sẽ được thu gọn)
      { name: 'Xong bài tập cô giao', points: 10, icon: '✍️', core: false },
      { name: 'Luyện viết chữ đẹp', points: 10, icon: '📝', core: false },
      { name: 'Đọc sách 15 phút', points: 10, icon: '📖', core: false },
      { name: 'Tập trung 15p (Con Ong)', points: 5, icon: '🐝', core: false }
    ],
    penalties: [
      { name: 'Chưa hoàn thành bài học / Lười tập đàn', points: -5, icon: '⚠️' },
      { name: 'Học thiếu tập trung', points: -3, icon: '✏️' }
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
        {id:uid('study'),type:'study',subject:'Toán tư duy',topic:'Giải đúng bộ câu đố quy luật Toán tư duy',amount:15,note:'Tư duy nhanh và chính xác!',reason:'[Toán tư duy] Giải đúng bộ câu đố quy luật Toán tư duy — Tư duy nhanh và chính xác!',at:new Date().toISOString()},
        {id:uid('study'),type:'study',subject:'Tiếng Anh',topic:'Hoàn thành thẻ từ & nói câu Little Fox',amount:15,note:'Phát âm rất chuẩn',reason:'[Tiếng Anh] Hoàn thành thẻ từ & nói câu Little Fox — Phát âm rất chuẩn',at:new Date().toISOString()}
      ],
      rewards:structuredClone(DEFAULT_REWARDS),
      achievements:[],
      earnedAchievements:[]
    }],
    subjects:['Toán tư duy','Học Đàn','Tiếng Anh','Tiếng Trung','Truyện kể Vĩ nhân','Tiếng Việt','Kỹ năng sống'],
    studyTools:structuredClone(DEFAULT_STUDY_TOOLS),
    parentPassword:'1234',
    exchangeRate:{stars:100,vnd:10000}
  };
}
const defaultData=seedBaoNhi();


/* ============================================================
   🐷 HỆ THỐNG TRANG TRẠI & CHĂM HEO ĐẤT THÔNG MINH (PIGGY PET)
   ============================================================ */
const PIGGY_LEVELS = [
  { level: 1, name: 'Heo Sơ Sinh Đeo Nơ', minExp: 0, nextExp: 60, icon: '🐽', badge: 'Cấp 1 • Heo Sơ Sinh 🎀' },
  { level: 2, name: 'Heo Nhí Mầm Non', minExp: 60, nextExp: 180, icon: '🐷', badge: 'Cấp 2 • Heo Mầm Non 🌱' },
  { level: 3, name: 'Heo Béo Học Giỏi', minExp: 180, nextExp: 380, icon: '🐖', badge: 'Cấp 3 • Heo Học Giỏi 🎓' },
  { level: 4, name: 'Heo Vàng Hoàng Gia', minExp: 380, nextExp: 700, icon: '👑', badge: 'Cấp 4 • Vương Miện Vàng 👑' },
  { level: 5, name: 'Heo Thần Tài Phú Quý', minExp: 700, nextExp: 1200, icon: '🏆', badge: 'Cấp 5 • Heo Thần Tài 🏆' },
  { level: 6, name: 'Heo Thiên Thần Kim Cương', minExp: 1200, nextExp: 99999, icon: '💎', badge: 'Cấp 6 • Thiên Thần Kim Cương 👼' }
];

// 🍽️ THỰC ĐƠN 12 MÓN ĂN PHONG PHÚ CHO HEO ĐẤT ỤT ỊT
const PIGGY_FOOD_MENU = [
  // Nhóm 1: Quà vặt & Rau củ (2⭐ - 8⭐)
  { id: 'snack_corn', cat: 'snack', emoji: '🌽', name: 'Bắp ngô ngọt', stars: 2, exp: 10, fullness: 20, weight: 0.1, vnd: 200 },
  { id: 'snack_carrot', cat: 'snack', emoji: '🥕', name: 'Cà rốt non giòn', stars: 3, exp: 16, fullness: 25, weight: 0.15, vnd: 300 },
  { id: 'snack_watermelon', cat: 'snack', emoji: '🍉', name: 'Dưa hấu đỏ mát', stars: 5, exp: 28, fullness: 35, weight: 0.25, vnd: 500 },
  { id: 'snack_apple', cat: 'snack', emoji: '🍎', name: 'Táo đỏ mật ong', stars: 8, exp: 45, fullness: 45, weight: 0.4, vnd: 800 },
  // Nhóm 2: Món ngon yêu thích (10⭐ - 20⭐)
  { id: 'meal_milk', cat: 'meal', emoji: '🥛', name: 'Sữa tươi trân châu', stars: 10, exp: 60, fullness: 55, weight: 0.55, vnd: 1000 },
  { id: 'meal_strawberry', cat: 'meal', emoji: '🍓', name: 'Dâu tây Đà Lạt', stars: 12, exp: 75, fullness: 65, weight: 0.7, vnd: 1200 },
  { id: 'meal_donut', cat: 'meal', emoji: '🍩', name: 'Bánh Donut Socola', stars: 15, exp: 95, fullness: 75, weight: 0.9, vnd: 1500 },
  { id: 'meal_pizza', cat: 'meal', emoji: '🍕', name: 'Pizza Phô Mai', stars: 20, exp: 130, fullness: 90, weight: 1.2, vnd: 2000 },
  // Nhóm 3: Đại tiệc & Kho báu (30⭐ - 150⭐)
  { id: 'feast_icecream', cat: 'feast', emoji: '🍦', name: 'Tháp Kem Cầu Vồng', stars: 30, exp: 200, fullness: 100, weight: 1.8, vnd: 3000 },
  { id: 'feast_cake', cat: 'feast', emoji: '🎂', name: 'Bánh Kem Sinh Nhật', stars: 50, exp: 340, fullness: 100, weight: 3.2, vnd: 5000 },
  { id: 'feast_royal', cat: 'feast', emoji: '🍱', name: 'Đại Tiệc Hoàng Gia', stars: 80, exp: 560, fullness: 100, weight: 5.5, vnd: 8000 },
  { id: 'feast_diamond', cat: 'feast', emoji: '💎', name: 'Kim Cương Sao', stars: 150, exp: 1100, fullness: 100, weight: 10.0, vnd: 15000 }
];

let activePiggyFoodTab = 'all';
let piggyCustomSpeech = '';

function setPiggyFoodTab(tab) {
  activePiggyFoodTab = tab;
  renderPiggyPet();
}

function updatePiggyLevel(p) {
  let lvl = 1;
  for (let i = PIGGY_LEVELS.length - 1; i >= 0; i--) {
    if (p.exp >= PIGGY_LEVELS[i].minExp) {
      lvl = PIGGY_LEVELS[i].level;
      break;
    }
  }
  p.level = lvl;
}

function ensurePiggyPet(c) {
  if (!c) return null;
  const today = todayISO();
  if (!c.piggyPet || typeof c.piggyPet !== 'object') {
    c.piggyPet = {
      name: 'Heo Đất Ụt Ịt',
      level: 1,
      exp: 20,
      weightKg: 1.2,
      coinsVND: 5000,
      fullness: 100,
      lastFedDate: today,
      lastInteractedDate: today,
      totalFeedCount: 1,
      totalStarsEaten: 0,
      streakDays: 1,
      mood: 'happy',
      lastPatDate: '',
      lastBathDate: '',
      lastMusicDate: ''
    };
  }

  const p = c.piggyPet;
  if (!p.name) p.name = 'Heo Đất Ụt Ịt';
  if (typeof p.weightKg !== 'number' || p.weightKg < 0.5) p.weightKg = 1.2;
  if (typeof p.coinsVND !== 'number') p.coinsVND = 0;
  if (typeof p.exp !== 'number') p.exp = 0;
  if (typeof p.fullness !== 'number') p.fullness = 80;
  if (!p.status) p.status = 'active';
  if (!p.generation) p.generation = 1;
  if (typeof p.harvestedAmount !== 'number') p.harvestedAmount = 0;
  if (typeof p.totalHarvestedAllTime !== 'number') p.totalHarvestedAllTime = 0;
  if (typeof p.harvestCount !== 'number') p.harvestCount = 0;

  const lastDate = (p.lastInteractedDate || p.lastFedDate || today).slice(0, 10);
  let diffDays = 0;
  try {
    const d1 = new Date(today + 'T00:00:00');
    const d2 = new Date(lastDate + 'T00:00:00');
    diffDays = Math.max(0, Math.floor((d1 - d2) / 86400000));
  } catch(e) { diffDays = 0; }

  p.daysWithoutCare = diffDays;

  if (diffDays >= 2) {
    p.fullness = 0;
    p.mood = 'starving';
  } else if (diffDays === 1) {
    p.fullness = Math.max(0, Math.min(p.fullness, 20));
    p.mood = 'hungry';
  } else {
    if (p.fullness <= 20) p.mood = 'hungry';
    else if (p.fullness <= 50) p.mood = 'neutral';
    else p.mood = 'happy';
  }

  updatePiggyLevel(p);
  return p;
}

function playPiggyOinkSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(510, ctx.currentTime + 0.09);
    osc.frequency.exponentialRampToValueAtTime(270, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch(e) {}
}

function showPiggyFloatingFX(text) {
  const layer = document.getElementById('piggyFxLayer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'piggy-floating-fx';
  el.innerHTML = text;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// 🌟 Mỗi buổi làm tốt 1 việc là giúp heo lớn hơn
function boostPiggyOnGoodDeed(c, reasonText, expBoost = 15, weightBoost = 0.1) {
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p) return;
  if (p.status === 'harvested') return;
  const oldLevel = p.level;

  p.exp += expBoost;
  p.weightKg = Math.round((p.weightKg + weightBoost) * 100) / 100;
  p.fullness = Math.min(100, p.fullness + 25);
  p.lastInteractedDate = todayISO();
  p.daysWithoutCare = 0;
  p.mood = 'happy';
  updatePiggyLevel(p);

  if (p.level > oldLevel) {
    playChime('success');
    triggerConfetti();
    showToast('🎉 TUYỆT VỜI: Heo Đất Ụt Ịt đã TIẾN HÓA lên Cấp ' + p.level + ' (' + PIGGY_LEVELS[p.level - 1].name + ')! 🐷👑');
  }
}

// 🍽️ Cho Heo Đất Ụt Ịt ăn 1 trong 12 món trong thực đơn
function feedPiggyFoodItem(foodId) {
  const c = child();
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p) return;

  if (p.status === 'harvested') {
    return alert('Bé vừa mổ heo rồi, chuồng đang trống! Bé hãy mua heo giống mới (10.000đ / 100 ⭐) để bắt đầu lứa mới nhé!');
  }

  const food = PIGGY_FOOD_MENU.find(f => f.id === foodId) || PIGGY_FOOD_MENU[0];
  if (!food) return;

  if (c.score < food.stars) {
    playChime('error');
    piggyCustomSpeech = `Ụt ịt... Món "${food.name}" cần ${food.stars} ⭐ mà bé đang có ${c.score} ⭐ thôi. Bé làm thêm việc tốt để kiếm sao cho heo ăn nhé! 🥺`;
    renderPiggyPet();
    return showToast(`⚠️ Cần ${food.stars} ⭐ để mua ${food.emoji} ${food.name} (Bé đang có ${c.score} ⭐)`);
  }

  const executeFeed = () => {
    c.score -= food.stars;
    logPoint(c, 'reward', -food.stars, `Cho Heo Đất Ụt Ịt ăn: ${food.emoji} ${food.name}`);
    p.exp += food.exp;
    p.weightKg = Math.round((p.weightKg + food.weight) * 100) / 100;
    p.fullness = Math.min(100, p.fullness + food.fullness);
    p.coinsVND = (p.coinsVND || 0) + food.vnd;
    p.totalStarsEaten = (p.totalStarsEaten || 0) + food.stars;
    p.totalFeedCount = (p.totalFeedCount || 0) + 1;
    p.lastFedDate = todayISO();
    p.lastInteractedDate = todayISO();
    p.mood = 'happy';
    p.daysWithoutCare = 0;

    const oldLevel = p.level;
    updatePiggyLevel(p);

    piggyCustomSpeech = `Nhoằm nhoằm! ${food.emoji} "${food.name}" ngon tuyệt cú mèo! Bụng heo tăng +${food.weight}kg và tích thêm +${food.vnd.toLocaleString('vi-VN')}đ! Yêu bé ${c.name} nhất! 🥰`;

    playPiggyOinkSound();
    triggerConfetti();
    save();
    render();

    setTimeout(() => {
      const fig = document.getElementById('piggyPetFigure');
      if (fig) fig.classList.add('jumping');
      showPiggyFloatingFX(`${food.emoji} +${food.weight}kg • +${food.vnd.toLocaleString('vi-VN')}đ 💖`);
    }, 60);

    if (p.level > oldLevel) {
      showToast(`🎉 OA! Heo Đất Ụt Ịt ăn no và đã LÊN CẤP ${p.level} (${PIGGY_LEVELS[p.level - 1].name})! 👑`);
    } else {
      showToast(`🥰 Ụt ịt! Heo vừa măm "${food.emoji} ${food.name}", béo thêm +${food.weight}kg và tích +${food.vnd.toLocaleString('vi-VN')}đ!`);
    }
  };

  // Các món dưới 30 sao thì cho ăn ngay 1 chạm cực mượt, món đại tiệc >= 30 sao thì hỏi xác nhận
  if (food.stars >= 30) {
    askConfirm(
      `Đãi Heo Đất Ụt Ịt món ${food.emoji} ${food.name}`,
      `Bé muốn dùng ${food.stars} ⭐ đãi Heo món "${food.name}"?\n\n• Heo lớn thêm: +${food.weight} kg (+${food.exp} EXP)\n• Tích vào bụng heo: +${food.vnd.toLocaleString('vi-VN')} đ\n• Sao còn lại của bé: ${c.score - food.stars} ⭐`,
      executeFeed,
      { yesText: `Cho ăn ngay (${food.stars} ⭐)`, icon: food.emoji }
    );
  } else {
    executeFeed();
  }
}

// Giữ tương thích hàm cũ feedPiggyWithStars
function feedPiggyWithStars(tier) {
  const map = { snack: 'snack_corn', meal: 'snack_watermelon', feast: 'meal_milk' };
  feedPiggyFoodItem(map[tier] || 'snack_corn');
}

// 💕 Vuốt ve xoa bụng cưng nựng heo
function patPiggyPet() {
  const c = child();
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p || p.status === 'harvested') return;

  const today = todayISO();
  playPiggyOinkSound();

  if (p.lastPatDate !== today) {
    p.lastPatDate = today;
    p.lastInteractedDate = today;
    p.exp += 5;
    p.fullness = Math.min(100, p.fullness + 10);
    p.mood = 'happy';
    p.daysWithoutCare = 0;
    updatePiggyLevel(p);
    piggyCustomSpeech = `Hí hí nhột quá! Bé ${c.name} xoa bụng làm Heo Đất Ụt Ịt sướng rơn người! (+5 EXP) 💖`;
    save();
    render();
    showToast('💖 Heo Đất Ụt Ịt cười tít mắt: "Bé xoa bụng thích quá! (+5 EXP)"');
  } else {
    piggyCustomSpeech = `Ụt ịt! Bụng heo tròn xoe ấm áp nhờ bé ${c.name} chăm sóc mỗi ngày đó! 🥰`;
    renderPiggyPet();
  }

  setTimeout(() => {
    const fig = document.getElementById('piggyPetFigure');
    if (fig) fig.classList.add('jumping');
    showPiggyFloatingFX('💕 Ụt ịt! Hí hí! 💖');
  }, 50);
}

// 🛁 Tắm bọt xà phòng thơm phức cho heo
function bathPiggyPet() {
  const c = child();
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p || p.status === 'harvested') return;

  const today = todayISO();
  playPiggyOinkSound();

  if (p.lastBathDate !== today) {
    p.lastBathDate = today;
    p.lastInteractedDate = today;
    p.exp += 5;
    p.mood = 'happy';
    p.daysWithoutCare = 0;
    updatePiggyLevel(p);
    piggyCustomSpeech = `Oa mát quá! Bọt xà phòng thơm phức, Heo Đất Ụt Ịt sạch bong sáng bóng rồi! (+5 EXP) 🛁🫧`;
    save();
    render();
    showToast('🛁 Đã tắm mát kỳ cọ cho Heo Đất Ụt Ịt thơm phức! (+5 EXP)');
  } else {
    piggyCustomSpeech = `Heo tắm sạch thơm mùi dâu tây rồi nè cô chủ nhỏ ${c.name} ơi! 🛁✨`;
    renderPiggyPet();
  }

  setTimeout(() => {
    const fig = document.getElementById('piggyPetFigure');
    if (fig) fig.classList.add('jumping');
    showPiggyFloatingFX('🛁 🫧 Sạch thơm quá! ✨');
  }, 50);
}

// 🎵 Bật nhạc cho heo nhảy múa
function musicPiggyPet() {
  const c = child();
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p || p.status === 'harvested') return;

  const today = todayISO();
  playChime('success');

  if (p.lastMusicDate !== today) {
    p.lastMusicDate = today;
    p.lastInteractedDate = today;
    p.exp += 5;
    p.mood = 'happy';
    p.daysWithoutCare = 0;
    updatePiggyLevel(p);
    piggyCustomSpeech = `Là lá la! 🎵 Tiếng nhạc vui quá, Heo Đất Ụt Ịt lắc cái mông nhảy múa cùng bé ${c.name} nè! (+5 EXP) 🎶`;
    save();
    render();
    showToast('🎵 Heo Đất Ụt Ịt nhảy múa theo điệu nhạc vui nhộn! (+5 EXP)');
  } else {
    piggyCustomSpeech = `🎵 Ụt ịt theo điệu nhạc! Chúc bé ${c.name} học thật vui nha! 🎶💃`;
    renderPiggyPet();
  }

  setTimeout(() => {
    const fig = document.getElementById('piggyPetFigure');
    if (fig) fig.classList.add('jumping');
    showPiggyFloatingFX('🎵 🎶 Lắc lư ụt ịt! 💃');
  }, 50);
}

// 🔨 Thu hoạch tiền tiết kiệm từ bụng heo
function harvestPiggyCoins() {
  const c = child();
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p) return;

  if (p.status === 'harvested') {
    return alert('Bé vừa mổ heo rồi! Hãy mua heo giống mới (10.000 đ hoặc 100 ⭐) để bắt đầu lứa nuôi tiếp theo nhé!');
  }

  const coins = p.coinsVND || 0;
  if (coins < 10000) {
    return alert('Bụng Heo Đất Ụt Ịt đang có ' + coins.toLocaleString('vi-VN') + ' đ. Bé hãy cho heo ăn thêm để tích lũy đủ tối thiểu 10.000 đ rồi mới mổ heo nhé!');
  }

  const nextGen = (p.generation || 1) + 1;
  const remainingProfit = Math.max(0, coins - 10000);

  askConfirm(
    'Mổ Heo Đất Thu Hoạch',
    'Bụng Heo Đất Lứa ' + (p.generation || 1) + ' đang có ' + coins.toLocaleString('vi-VN') + ' đ!\n\n💡 BÀI HỌC TÀI CHÍNH CHO BÉ:\n• Tổng tiền thu hoạch: ' + coins.toLocaleString('vi-VN') + ' đ\n• Mua heo giống mới (Lứa ' + nextGen + '): Cần 10.000 đ\n• Tiền lãi thực nhận bỏ túi: ' + remainingProfit.toLocaleString('vi-VN') + ' đ\n\nCon có chắc chắn muốn mổ heo hôm nay không?',
    () => {
      const harvested = coins;
      p.status = 'harvested';
      p.harvestedAmount = harvested;
      p.totalHarvestedAllTime = (p.totalHarvestedAllTime || 0) + harvested;
      p.harvestCount = (p.harvestCount || 0) + 1;
      p.coinsVND = 0;

      if (!Array.isArray(c.giftHistory)) c.giftHistory = [];
      c.giftHistory.unshift({
        id: uid('g'),
        rewardId: 'piggy_harvest',
        name: 'Mổ Heo Đất Lứa ' + (p.generation || 1) + ' (Thu hoạch ' + harvested.toLocaleString('vi-VN') + ' đ)',
        cost: 0,
        moneyVND: harvested,
        date: todayISO(),
        status: 'pending'
      });

      playChime('success');
      triggerConfetti();
      save();
      render();
      showToast('🎉 Đã mổ heo thành công! Bé thu hoạch ' + harvested.toLocaleString('vi-VN') + ' đ!');
    },
    { yesText: 'Mổ heo ngay 🔨', icon: '💰' }
  );
}

// 🛒 Mua heo giống mới (Cần 10.000 đ hoặc 100 ⭐)
function buyNewPiggyBreed(method) {
  const c = child();
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p) return;

  const nextGen = (p.generation || 1) + 1;
  const inp = document.getElementById('newPiggyNameInput');
  const chosenName = (inp && inp.value.trim()) ? inp.value.trim() : ('Heo Đất Ụt Ịt Lứa ' + nextGen);

  if (method === 'stars') {
    if (c.score < 100) {
      playChime('error');
      return alert('Bé cần 100 ⭐ để mua heo giống mới (Bé hiện đang có ' + c.score + ' ⭐).');
    }

    askConfirm(
      'Mua Heo Giống Bằng Sao',
      'Bé có muốn dùng 100 ⭐ để rước chú "' + chosenName + '" về chuồng nuôi tiếp không?',
      () => {
        c.score -= 100;
        logPoint(c, 'reward', -100, 'Mua heo giống mới (100 ⭐) - Lứa ' + nextGen);
        initNewPiggyPet(p, chosenName, nextGen);
        save();
        render();
        playPiggyOinkSound();
        triggerConfetti();
        showToast('🎉 Chúc mừng bé! Đã rước chú "' + chosenName + '" về chuồng thành công! 🐷❤️');
      },
      { yesText: 'Mua bằng 100 ⭐', icon: '⭐' }
    );
  } else {
    askConfirm(
      'Mua Heo Giống Bằng Tiền Mặt',
      'Bé có muốn trích 10.000 đ (từ tiền mổ heo vừa nhận) để rước chú "' + chosenName + '" về chuồng nuôi tiếp không?',
      () => {
        if (!Array.isArray(c.giftHistory)) c.giftHistory = [];
        c.giftHistory.unshift({
          id: uid('g'),
          rewardId: 'piggy_breed_purchase',
          name: 'Mua heo giống mới Lứa ' + nextGen + ' (10.000 đ)',
          cost: 0,
          moneyVND: -10000,
          date: todayISO(),
          status: 'fulfilled'
        });
        initNewPiggyPet(p, chosenName, nextGen);
        save();
        render();
        playPiggyOinkSound();
        triggerConfetti();
        showToast('🎉 Tuyệt vời! Bé đã rước "' + chosenName + '" về chuồng thành công! 🐷❤️');
      },
      { yesText: 'Trích 10.000 đ mua', icon: '💵' }
    );
  }
}

function initNewPiggyPet(p, name, nextGen) {
  p.status = 'active';
  p.name = name;
  p.generation = nextGen;
  p.level = 1;
  p.exp = 0;
  p.weightKg = 1.0;
  p.coinsVND = 0;
  p.fullness = 100;
  p.mood = 'happy';
  p.lastFedDate = todayISO();
  p.lastInteractedDate = todayISO();
  p.daysWithoutCare = 0;
  p.lastPatDate = '';
  p.lastBathDate = '';
  p.lastMusicDate = '';
}

function toggleSimulatePiggyHunger() {
  const c = child();
  if (!c) return;
  const p = ensurePiggyPet(c);
  if (!p) return;

  if (p.daysWithoutCare >= 1) {
    p.lastInteractedDate = todayISO();
    p.lastFedDate = todayISO();
    p.fullness = 95;
    p.mood = 'happy';
    p.daysWithoutCare = 0;
    piggyCustomSpeech = 'Ụt ịt! Bụng heo đã no căng và vui vẻ trở lại rồi nè! 🥰';
    showToast('✨ Đã phục hồi: Heo Đất no căng bụng và vui vẻ trở lại!');
  } else {
    const yesterday = new Date(Date.now() - 86400000 * 1.5).toISOString().slice(0, 10);
    p.lastInteractedDate = yesterday;
    p.lastFedDate = yesterday;
    p.fullness = 12;
    p.mood = 'hungry';
    p.daysWithoutCare = 1;
    piggyCustomSpeech = 'Ụt ịt... Bụng heo đói kêu ùng ục rồi, cô chủ nhỏ cho heo ăn bắp ngọt hay dâu tây với! 🥺';
    showToast('⚠️ Đã bật chế độ mô phỏng: Heo Đất đang đói bụng!');
  }
  save();
  render();
}

// 🎨 VẼ ĐỒ HỌA SVG CHÚ HEO ĐẤT ỤT ỊT KAWAII SIÊU DỄ THƯƠNG
function getCutePiggySVG(level, isHungry) {
  // Phụ kiện trên đầu theo cấp độ
  let accessorySVG = '';
  if (level === 1) {
    // Nơ hồng xinh xắn bên tai
    accessorySVG = `
      <g transform="translate(52, 26) rotate(-15)">
        <ellipse cx="-10" cy="0" rx="10" ry="7" fill="#ec4899"/>
        <ellipse cx="10" cy="0" rx="10" ry="7" fill="#ec4899"/>
        <circle cx="0" cy="0" r="4.5" fill="#fbcfe8"/>
      </g>
    `;
  } else if (level === 2) {
    // Mầm non xanh biếc trên đỉnh đầu
    accessorySVG = `
      <g transform="translate(90, 22)">
        <path d="M0,12 Q0,0 -12,-6 Q-4,-12 0,2 Q4,-12 12,-6 Q0,0 0,12" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      </g>
    `;
  } else if (level === 3) {
    // Mũ học giả + Kính tri thức
    accessorySVG = `
      <g transform="translate(90, 20)">
        <polygon points="0,-8 -26,4 0,14 26,4" fill="#1e293b"/>
        <rect x="-14" y="8" width="28" height="7" rx="3" fill="#334155"/>
        <path d="M20,6 L24,20" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    `;
  } else if (level === 4) {
    // Vương miện Hoàng gia Vàng
    accessorySVG = `
      <g transform="translate(90, 20)">
        <polygon points="-22,12 -26,-8 -10,2 0,-12 10,2 26,-8 22,12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
        <circle cx="0" cy="-4" r="3" fill="#ef4444"/>
        <circle cx="-14" cy="2" r="2.5" fill="#3b82f6"/>
        <circle cx="14" cy="2" r="2.5" fill="#10b981"/>
      </g>
    `;
  } else if (level >= 5) {
    // Vương miện Thần Tài Kim Cương & Đôi cánh thiên thần
    accessorySVG = `
      <g>
        <path d="M26,75 Q4,52 12,84 Q4,96 28,98" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M154,75 Q176,52 168,84 Q176,96 152,98" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <g transform="translate(90, 18)">
          <polygon points="-24,14 -28,-10 -12,2 0,-15 12,2 28,-10 24,14" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
          <polygon points="0,-9 -5,-1 0,7 5,-1" fill="#38bdf8"/>
        </g>
      </g>
    `;
  }

  // Biểu cảm mắt & miệng
  const eyesSVG = isHungry ? `
    <g>
      <circle cx="64" cy="78" r="8.5" fill="#1e293b"/>
      <circle cx="61" cy="75" r="3.2" fill="#ffffff"/>
      <circle cx="67" cy="81" r="1.8" fill="#38bdf8"/>
      <circle cx="116" cy="78" r="8.5" fill="#1e293b"/>
      <circle cx="113" cy="75" r="3.2" fill="#ffffff"/>
      <circle cx="119" cy="81" r="1.8" fill="#38bdf8"/>
      <path d="M55,66 Q64,70 71,67" stroke="#831843" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M125,66 Q116,70 109,67" stroke="#831843" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </g>
  ` : `
    <g class="piggy-svg-eyes-blink">
      <circle cx="64" cy="78" r="8.5" fill="#1e293b"/>
      <circle cx="61" cy="74.5" r="3.5" fill="#ffffff"/>
      <circle cx="67" cy="80.5" r="1.6" fill="#ffffff"/>
      <circle cx="116" cy="78" r="8.5" fill="#1e293b"/>
      <circle cx="113" cy="74.5" r="3.5" fill="#ffffff"/>
      <circle cx="119" cy="80.5" r="1.6" fill="#ffffff"/>
    </g>
  `;

  const mouthSVG = isHungry
    ? `<path d="M82,118 Q90,111 98,118" stroke="#9d174d" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M78,113 Q90,125 102,113" stroke="#9d174d" stroke-width="3.2" fill="#f43f5e" stroke-linecap="round"/>`;

  return `
    <svg width="175" height="155" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pigBodyGrad" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stop-color="#ffdde8"/>
          <stop offset="55%" stop-color="#f9a8d4"/>
          <stop offset="100%" stop-color="#f472b6"/>
        </radialGradient>
        <linearGradient id="pigBellyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff1f2"/>
          <stop offset="100%" stop-color="#fbcfe8"/>
        </linearGradient>
      </defs>

      <!-- Bóng đổ dưới chân -->
      <ellipse cx="90" cy="148" rx="52" ry="8" fill="rgba(15, 23, 42, 0.12)"/>

      <!-- Đuôi xoắn xinh xắn -->
      <path d="M148,96 Q165,88 160,78 Q154,72 158,84 Q163,92 170,84" stroke="#ec4899" stroke-width="4" stroke-linecap="round" fill="none"/>

      <!-- 4 Chân mũm mĩm -->
      <rect x="52" y="122" width="16" height="22" rx="8" fill="#ec4899"/>
      <rect x="72" y="125" width="15" height="21" rx="7.5" fill="#f472b6"/>
      <rect x="94" y="125" width="15" height="21" rx="7.5" fill="#f472b6"/>
      <rect x="112" y="122" width="16" height="22" rx="8" fill="#ec4899"/>

      <!-- Tai trái & Tai phải vẫy -->
      <g class="piggy-svg-ear-left">
        <path d="M54,48 Q30,22 36,56 Q40,66 56,60 Z" fill="#f472b6" stroke="#ec4899" stroke-width="2"/>
        <path d="M50,50 Q36,32 40,53 Z" fill="#fda4af"/>
      </g>
      <g class="piggy-svg-ear-right">
        <path d="M126,48 Q150,22 144,56 Q140,66 124,60 Z" fill="#f472b6" stroke="#ec4899" stroke-width="2"/>
        <path d="M130,50 Q144,32 140,53 Z" fill="#fda4af"/>
      </g>

      <!-- Thân heo tròn mũm mĩm -->
      <ellipse cx="90" cy="88" rx="60" ry="50" fill="url(#pigBodyGrad)" stroke="#ec4899" stroke-width="2.5"/>

      <!-- Bụng hồng phấn -->
      <ellipse cx="90" cy="108" rx="38" ry="24" fill="url(#pigBellyGrad)" opacity="0.75"/>

      <!-- Khe bỏ tiền vàng trên lưng + Đồng xu lấp lánh -->
      <rect x="74" y="39" width="32" height="5.5" rx="2.75" fill="#831843"/>
      <circle cx="90" cy="34" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <text x="90" y="37.5" text-anchor="middle" font-size="10" font-weight="900" fill="#854d0e">⭐</text>

      <!-- Hai má hồng phúng phính -->
      <ellipse cx="48" cy="92" rx="10" ry="6.5" fill="#fb7185" opacity="0.65"/>
      <ellipse cx="132" cy="92" rx="10" ry="6.5" fill="#fb7185" opacity="0.65"/>

      <!-- Đôi mắt long lanh -->
      ${eyesSVG}

      <!-- Miệng cười / mếu -->
      ${mouthSVG}

      <!-- Chiếc mũi Heo Đất Ụt Ịt nhấp nhô -->
      <g class="piggy-svg-snout">
        <ellipse cx="90" cy="94" rx="19" ry="13.5" fill="#fb7185" stroke="#e11d48" stroke-width="2"/>
        <ellipse cx="83.5" cy="94" rx="3.8" ry="5.5" fill="#881337"/>
        <ellipse cx="96.5" cy="94" rx="3.8" ry="5.5" fill="#881337"/>
      </g>

      <!-- Phụ kiện cấp độ -->
      ${accessorySVG}
    </svg>
  `;
}

// 🎨 Render Ngôi Nhà Thú Cưng: Heo Đất Ụt Ịt
function renderPiggyPet() {
  const c = child();
  const todayBox = document.getElementById('todayPiggyWidget');
  const farmBox = document.getElementById('momoPiggyFarmInteractive');

  if (!c) {
    if (todayBox) todayBox.innerHTML = '';
    if (farmBox) farmBox.innerHTML = '';
    return;
  }

  const p = ensurePiggyPet(c);
  const nextGen = (p.generation || 1) + 1;

  // TRƯỜNG HỢP 1: ĐÃ MỔ HEO (CHUỒNG ĐANG TRỐNG CHỜ MUA HEO GIỐNG 10.000Đ / 100⭐)
  if (p.status === 'harvested') {
    const emptyPenMarkup = `
      <div class="piggy-care-widget empty-pen">
        <div class="piggy-empty-pen-head">
          <span style="font-size:32px">🧺🏚️</span>
          <div style="flex:1">
            <div style="font-size:15px;font-weight:900;color:#b45309">🎉 Đã Mổ Heo Thành Công!</div>
            <div style="font-size:12px;color:#78350f">
              Lứa ${p.generation || 1} đã thu hoạch <b>${(p.harvestedAmount || 0).toLocaleString('vi-VN')} đ</b>!
            </div>
          </div>
          <span class="piggy-level-pill" style="background:#fef3c7;color:#b45309;border-color:#fde68a">Lứa ${p.generation || 1}</span>
        </div>

        <div style="background:#ffffff;border-radius:14px;padding:12px;margin:10px 0;border:1.5px solid #fde68a">
          <div style="font-size:13px;font-weight:800;color:#92400e;margin-bottom:4px">
            🛒 Mua Heo Giống Mới (Lứa ${nextGen}) — Cần 10.000 đ hoặc 100 ⭐
          </div>
          <div style="margin-bottom:10px">
            <input type="text" id="newPiggyNameInput" value="Heo Đất Ụt Ịt Lứa ${nextGen}" style="width:100%;padding:8px 10px;border-radius:8px;border:1.5px solid #fcd34d;font-size:12.5px;font-weight:700;box-sizing:border-box">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button type="button" class="today-cat-pill" style="justify-content:center;padding:9px;background:#fef3c7;border-color:#f59e0b;font-size:12px;font-weight:800;color:#b45309" onclick="buyNewPiggyBreed('money')">
              💵 Trích 10.000 đ
            </button>
            <button type="button" class="today-cat-pill" style="justify-content:center;padding:9px;background:#fce7f3;border-color:#ec4899;font-size:12px;font-weight:800;color:#be185d" onclick="buyNewPiggyBreed('stars')">
              ⭐ Dùng 100 ⭐ (Có ${c.score}⭐)
            </button>
          </div>
        </div>
      </div>
    `;

    if (todayBox) todayBox.innerHTML = emptyPenMarkup;
    if (farmBox) farmBox.innerHTML = emptyPenMarkup;
    return;
  }

  // TRƯỜNG HỢP 2: ĐANG NUÔI HEO ĐẤT ỤT ỊT
  const lvlInfo = PIGGY_LEVELS[Math.min(p.level, PIGGY_LEVELS.length) - 1] || PIGGY_LEVELS[0];
  const nextExp = lvlInfo.nextExp;
  const expPercent = Math.min(100, Math.round((p.exp / nextExp) * 100));
  const isHungry = (p.mood === 'hungry' || p.mood === 'starving' || p.daysWithoutCare >= 1);
  const canHarvest = (p.coinsVND || 0) >= 10000;

  let defaultSpeech = `Ụt ịt! Chào cô chủ nhỏ ${safe(c.name)}! Hôm nay bé cho Heo Đất ăn món gì ngon nè? 💕`;
  if (isHungry) {
    defaultSpeech = `Ụt ịt... Bụng heo đang đói meo (${p.fullness}%), bé chọn món ngon bên dưới bón cho heo ăn với nha! 🥺`;
  }
  const speechText = piggyCustomSpeech || defaultSpeech;

  const filteredFoods = activePiggyFoodTab === 'all'
    ? PIGGY_FOOD_MENU
    : PIGGY_FOOD_MENU.filter(f => f.cat === activePiggyFoodTab);

  const foodCardsHtml = filteredFoods.map(f => {
    const canAfford = c.score >= f.stars;
    return `
      <div class="piggy-food-card ${canAfford ? '' : 'locked'}" onclick="feedPiggyFoodItem('${f.id}')" title="Bấm để bón ${f.name} cho Heo Đất Ụt Ịt">
        <div class="piggy-food-emoji">${f.emoji}</div>
        <div class="piggy-food-name">${f.name}</div>
        <div class="piggy-food-perk">+${f.weight}kg • +${f.vnd.toLocaleString('vi-VN')}đ</div>
        <div class="piggy-food-price">⭐ ${f.stars} sao</div>
      </div>
    `;
  }).join('');

  if (todayBox) {
    todayBox.innerHTML = `
      <div class="piggy-pet-paradise">
        <!-- Header Ngôi nhà Heo Đất Ụt Ịt -->
        <div class="piggy-paradise-header">
          <div class="piggy-paradise-title">
            <span style="font-size:26px">🏡🐷</span>
            <div>
              <h3>${safe(p.name)}</h3>
              <div style="font-size:12px;color:#be185d;font-weight:700">${lvlInfo.name} • Chạm vào người heo để cưng nựng!</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span class="piggy-gen-badge">${lvlInfo.badge} • Lứa ${p.generation || 1}</span>
            <button type="button" onclick="toggleSimulatePiggyHunger()" style="border:1px solid #fbcfe8;background:#fff;border-radius:999px;padding:4px 9px;font-size:11px;color:#9d174d;cursor:pointer;font-weight:700" title="Thử nghiệm trạng thái đói/no">⚙️ Thử đói</button>
          </div>
        </div>

        <!-- Sân khấu đồng cỏ & Nhân vật Heo Đất Ụt Ịt SVG Động -->
        <div class="piggy-pasture-stage">
          <div class="piggy-sky-decor">
            <span class="piggy-cloud-float">☁️✨</span>
            <span>☀️🌈</span>
            <span class="piggy-cloud-float">🦋☁️</span>
          </div>

          <div class="piggy-fx-layer" id="piggyFxLayer"></div>

          <div class="piggy-speech-bubble" id="piggySpeechBubble">
            ${speechText}
          </div>

          <div class="piggy-pet-figure" id="piggyPetFigure" onclick="patPiggyPet()" title="Chạm để xoa bụng nựng Heo Đất Ụt Ịt!">
            ${getCutePiggySVG(p.level, isHungry)}
          </div>

          <div style="display:flex;gap:14px;font-size:18px;margin-top:-4px;opacity:0.9">
            <span>🌷</span><span>🌱</span><span>🌻</span><span>🍀</span><span>🌼</span>
          </div>
        </div>

        <!-- 4 Chỉ số quan trọng của Heo Đất Ụt Ịt -->
        <div class="piggy-vitals-grid">
          <div class="piggy-vital-card">
            <div class="piggy-vital-label"><span>⚖️ Cân nặng</span><span>Lứa ${p.generation || 1}</span></div>
            <div class="piggy-vital-val">${p.weightKg.toFixed(2)} kg</div>
          </div>

          <div class="piggy-vital-card">
            <div class="piggy-vital-label"><span>💰 Ống tiết kiệm</span><span>${canHarvest ? 'Mổ được!' : 'Tích lũy'}</span></div>
            <div class="piggy-vital-val" style="color:#059669">${(p.coinsVND || 0).toLocaleString('vi-VN')} đ</div>
          </div>

          <div class="piggy-vital-card">
            <div class="piggy-vital-label">
              <span>🥣 Độ no bụng</span>
              <span style="color:${isHungry ? '#ef4444' : '#059669'}">${p.fullness}%</span>
            </div>
            <div class="piggy-meter-bar" style="margin-top:3px">
              <div class="piggy-meter-fill fullness ${isHungry ? 'hungry' : ''}" style="width:${p.fullness}%"></div>
            </div>
          </div>

          <div class="piggy-vital-card">
            <div class="piggy-vital-label">
              <span>⭐ Kinh nghiệm</span>
              <span>${p.exp}/${nextExp}</span>
            </div>
            <div class="piggy-meter-bar" style="margin-top:3px">
              <div class="piggy-meter-fill exp" style="width:${expPercent}%"></div>
            </div>
          </div>
        </div>

        <!-- Thanh công cụ Chăm sóc Heo Đất mỗi ngày -->
        <div class="piggy-care-toolbar">
          <button type="button" class="piggy-care-tool-btn" onclick="patPiggyPet()">
            <span style="font-size:18px">💕</span>
            <span>Xoa bụng (+5 EXP)</span>
          </button>
          <button type="button" class="piggy-care-tool-btn" onclick="bathPiggyPet()">
            <span style="font-size:18px">🛁</span>
            <span>Tắm thơm (+5 EXP)</span>
          </button>
          <button type="button" class="piggy-care-tool-btn" onclick="musicPiggyPet()">
            <span style="font-size:18px">🎵</span>
            <span>Bật nhạc (+5 EXP)</span>
          </button>
          <button type="button" class="piggy-care-tool-btn" style="${canHarvest ? 'background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-color:#059669' : ''}" onclick="harvestPiggyCoins()">
            <span style="font-size:18px">🔨</span>
            <span>Mổ heo (${(p.coinsVND || 0).toLocaleString('vi-VN')}đ)</span>
          </button>
        </div>

        <!-- Tiệm Đồ Ăn 12 Món Cho Heo Đất Ụt Ịt -->
        <div class="piggy-kitchen-box">
          <div class="piggy-kitchen-head">
            <div>
              <div style="font-weight:900;font-size:15px;color:#831843">🍽️ Thực Đơn 12 Món Ngon Cho Heo Đất Ụt Ịt</div>
              <div style="font-size:11.5px;color:#64748b">Bé đang có <b style="color:#d97706">${c.score} ⭐</b> — Chạm vào món ăn để đút cho heo măm ngay!</div>
            </div>
            <div class="piggy-food-tabs">
              <button type="button" class="piggy-food-tab ${activePiggyFoodTab==='all'?'active':''}" onclick="setPiggyFoodTab('all')">🌟 Tất cả (12)</button>
              <button type="button" class="piggy-food-tab ${activePiggyFoodTab==='snack'?'active':''}" onclick="setPiggyFoodTab('snack')">🌽 Quà vặt (2-8⭐)</button>
              <button type="button" class="piggy-food-tab ${activePiggyFoodTab==='meal'?'active':''}" onclick="setPiggyFoodTab('meal')">🍕 Món ngon (10-20⭐)</button>
              <button type="button" class="piggy-food-tab ${activePiggyFoodTab==='feast'?'active':''}" onclick="setPiggyFoodTab('feast')">🎂 Đại tiệc (30-150⭐)</button>
            </div>
          </div>

          <div class="piggy-food-shop-grid">
            ${foodCardsHtml}
          </div>
        </div>
      </div>
    `;
  }

  // 2. Render trên Tab Đổi Quà
  if (farmBox) {
    farmBox.innerHTML = `
      <div class="piggy-farm-full-card">
        <div class="piggy-farm-headline">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:28px">🐷</span>
            <div>
              <div style="font-weight:900;font-size:14.5px;color:#9d174d">${safe(p.name)} (${lvlInfo.name})</div>
              <div style="font-size:11.5px;color:#64748b">Lứa ${p.generation || 1} • Cân nặng: ${p.weightKg.toFixed(2)}kg • Đã ăn ${p.totalStarsEaten || 0} ⭐</div>
            </div>
          </div>
          ${canHarvest ? `
            <button type="button" class="piggy-harvest-btn" onclick="harvestPiggyCoins()">
              <span>🔨</span> <span>Mổ heo (${(p.coinsVND||0).toLocaleString('vi-VN')}đ)</span>
            </button>
          ` : `
            <div style="text-align:right">
              <div style="font-size:12px;font-weight:900;color:#059669">💰 ${(p.coinsVND||0).toLocaleString('vi-VN')} đ</div>
              <div style="font-size:10px;color:#94a3b8">Tối thiểu 10.000đ để mổ</div>
            </div>
          `}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button type="button" class="today-cat-pill" style="flex:1;justify-content:center;padding:6px 8px;font-size:11.5px" onclick="feedPiggyFoodItem('snack_corn')">
            🌽 Bắp ngọt (2⭐)
          </button>
          <button type="button" class="today-cat-pill" style="flex:1;justify-content:center;padding:6px 8px;font-size:11.5px" onclick="feedPiggyFoodItem('snack_watermelon')">
            🍉 Dưa hấu (5⭐)
          </button>
          <button type="button" class="today-cat-pill" style="flex:1;justify-content:center;padding:6px 8px;font-size:11.5px" onclick="feedPiggyFoodItem('meal_milk')">
            🥛 Sữa tươi (10⭐)
          </button>
          <button type="button" class="today-cat-pill" style="flex:1;justify-content:center;padding:6px 8px;font-size:11.5px" onclick="feedPiggyFoodItem('meal_pizza')">
            🍕 Pizza (20⭐)
          </button>
        </div>
      </div>
    `;
  }
}

function loadData(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY) || localStorage.getItem('nhiemvu_sieubiet_public_clean_v1');
    if(!raw) return structuredClone(defaultData);
    const d=JSON.parse(raw);
    if(!Array.isArray(d.children)) d.children=[];
    if(!Array.isArray(d.subjects)) d.subjects=[];
    // Đảm bảo 5 môn chính luôn nằm ở đầu danh sách môn học của con
    const mergedSubj=[...CORE_STUDY_SUBJECTS];
    d.subjects.forEach(s=>{ if(s && !mergedSubj.includes(s)) mergedSubj.push(s); });
    d.subjects=mergedSubj;

    if(!Array.isArray(d.customSubjects)) d.customSubjects=[];
    if(!d.rideReminder) d.rideReminder={enabled:true,leadMinutes:10,morningTime:'07:15',afternoonTime:'13:30',pickupTime:'16:30',enableSound:true,enableSpeech:true,enableNotification:true};
    if(!Array.isArray(d.studyTools)||!d.studyTools.length){
      d.studyTools=structuredClone(DEFAULT_STUDY_TOOLS);
    }else{
      // Đồng bộ các công cụ của 5 môn học chính nếu dữ liệu cũ chưa có
      const mapById=new Map(DEFAULT_STUDY_TOOLS.map(t=>[t.id,t]));
      const existingIds=new Set(d.studyTools.map(t=>t.id));
      d.studyTools=d.studyTools.map(t=>mapById.has(t.id)?{...t,...mapById.get(t.id)}:t);
      DEFAULT_STUDY_TOOLS.forEach(defTool=>{
        if(!existingIds.has(defTool.id)) d.studyTools.unshift(structuredClone(defTool));
      });
    }
    if(!d.parentPassword) d.parentPassword='1234';
    if(!d.exchangeRate||!(Number(d.exchangeRate.stars)>0)||!(Number(d.exchangeRate.vnd)>0)||d.exchangeRate.vnd===5000) d.exchangeRate={stars:100,vnd:10000};

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
      if(!Array.isArray(c.rewards)||!c.rewards.length||c.rewards.some(r=>(r.name||'').includes('kem')||r.category==='Thời gian & Đặc quyền')){
        c.rewards=structuredClone(DEFAULT_REWARDS);
      } else {
        c.rewards=c.rewards.filter(r=>{
          const n=(r.name||'').toLowerCase();
          return !n.includes('kem') && !n.includes('trà sữa') && !n.includes('nước ngọt');
        });
      }
      if(!Array.isArray(c.achievements))c.achievements=oldAchievements.map(a=>({...a,id:a.id||uid('a')}));
      if(!Array.isArray(c.earnedAchievements))c.earnedAchievements=[];
      if(!c.timetable || typeof c.timetable !== 'object' || !Object.keys(c.timetable).length || c.timetableVersion !== '1a4_2026') {
        c.timetable=structuredClone(DEFAULT_GRADE1_TIMETABLE);
        c.timetableVersion='1a4_2026';
      }
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
  const targetSec = document.getElementById(name+'Section');
  if(!targetSec){
    const pageMap = {
      today: 'today.html',
      schedule: 'schedule.html',
      tools: 'tools.html',
      flashcards: 'tools.html?section=flashcards',
      achievements: 'achievements.html',
      rewards: 'rewards.html'
    };
    if (pageMap[name]) {
      window.location.href = pageMap[name];
      return;
    }
  }
  currentSection=name;
  document.querySelectorAll('.app-section').forEach(s=>s.classList.remove('active'));
  targetSec?.classList.add('active');
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
  renderPiggyPet();
  renderStudyPraise();
  renderQuickPraise();
  renderTargetGoalCards();
  renderStudyTools();
  if(typeof renderFlashcards==='function') renderFlashcards();
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
  if(typeof syncCfg!=='undefined' && syncCfg && syncCfg.url && (syncCfg.provider==='sheets' || syncCfg.code)){
    pill.classList.add('synced');
    if(syncCfg.provider==='sheets' || String(syncCfg.url).includes('script.google.com')){
      txt.textContent='📊 Google Trang tính';
    } else {
      txt.textContent='☁️ Đám mây ('+(syncCfg.code||'Supabase')+')';
    }
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
  if(!document.getElementById("todaySection")) return;
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

  const coreTasks = ensureCoreTodayTasks(c);
  const done = coreTasks.filter(t=>t.done).length;

  if(avatarEl) avatarEl.textContent=childIcon(c);
  if(helloEl) helloEl.textContent='Chào '+childIcon(c)+' '+c.name+' 👋';
  if(scoreEl) scoreEl.textContent=c.score;
  if(countEl) countEl.textContent=done+'/'+coreTasks.length;
  if(barEl) barEl.style.width=(coreTasks.length?done/coreTasks.length*100:0)+'%';
  if(moneyEl) moneyEl.textContent=fmtVND(starsToVND(c.score));
  if(goalNameEl) goalNameEl.textContent=childIcon(c)+' '+c.name;

  const ct=currentTitle(c);
  if(ht){
    ht.textContent=ct?('🏅 '+ct.title):'🌱 Chưa có danh hiệu — từ 100 ⭐';
  }

  renderTodayCategories();
}

const CORE_TODAY_REMINDERS = [
  { key: 'core_en', icon: '🇬🇧', name: 'Tiếng Anh', subject: 'Tiếng Anh', defaultPoints: 10 },
  { key: 'core_zh', icon: '🐼', name: 'Tiếng Trung', subject: 'Tiếng Trung', defaultPoints: 10 },
  { key: 'core_old', icon: '📖', name: 'Học bài cũ', subject: 'Học bài cũ', defaultPoints: 10 }
];

function ensureCoreTodayTasks(c){
  if(!c) return [];
  if(!Array.isArray(c.tasks)) c.tasks = [];
  const today = todayISO();
  let changed = false;
  const result = CORE_TODAY_REMINDERS.map(def => {
    let t = c.tasks.find(x => x.date === today && (x.coreKey === def.key || x.name === def.name));
    if(!t){
      t = {
        id: uid('t'),
        coreKey: def.key,
        seriesId: null,
        name: def.name,
        subject: def.subject,
        category: 'home_study',
        date: today,
        points: def.defaultPoints,
        duration: '',
        link: '',
        instruction: '',
        done: false,
        awardedPoints: 0,
        completedAt: null
      };
      c.tasks.push(t);
      changed = true;
    } else if(!t.coreKey) {
      t.coreKey = def.key;
    }
    return t;
  });
  if(changed) save();
  return result;
}

function completeCoreTodayTask(taskId, mode = 'add'){
  const c = child();
  if(!c) return;
  const t = c.tasks.find(x => x.id === taskId);
  if(!t || t.done) return;
  const inp = document.getElementById('coreTaskPts_' + taskId);
  const rawPts = Math.max(1, Math.min(500, Math.round(Number(inp?.value || t.points || 10))));
  const delta = mode === 'sub' ? -rawPts : rawPts;

  t.done = true;
  t.awardedPoints = delta;
  t.completedAt = new Date().toISOString();
  c.score = Math.max(0, (c.score || 0) + delta);
  if(delta > 0) c.highestScore = Math.max(c.highestScore || 0, c.score);

  logPoint(c, delta >= 0 ? 'task' : 'penalty', delta, (delta >= 0 ? 'Hoàn thành: ' : 'Nhắc nhở: ') + t.name);
  if(delta > 0) boostPiggyOnGoodDeed(c, 'Hoàn thành: ' + t.name, 15, 0.1);
  updateEarnedAchievements(c);
  save();
  render();

  if(delta > 0){
    playChime('success');
    triggerConfetti();
    showToast(`🎉 Đã cộng +${delta} ⭐ mục "${t.name}"!`);
  } else {
    playPenaltySound();
    showToast(`⚠️ Đã trừ ${delta} ⭐ mục "${t.name}"!`);
  }
}

function undoCoreTodayTask(taskId){
  const c = child();
  if(!c) return;
  const t = c.tasks.find(x => x.id === taskId);
  if(!t || !t.done) return;
  const back = Number(t.awardedPoints ?? t.points ?? 0);
  c.score = Math.max(0, (c.score || 0) - back);
  logPoint(c, 'undo-task', -back, 'Hoàn tác: ' + t.name);
  t.done = false;
  t.awardedPoints = 0;
  t.completedAt = null;
  save();
  render();
  showToast(`↩ Đã hoàn tác mục "${t.name}"!`);
}

function submitTodayManualTask(mode = 'add'){
  const c = child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  const nameInp = document.getElementById('todayManualTaskInput');
  const ptsInp = document.getElementById('todayManualPointsInput');
  const rawName = (nameInp ? nameInp.value : '').trim();
  const pts = Math.max(1, Math.min(500, Math.round(Number(ptsInp?.value || 10))));
  const isSub = (mode === 'sub');
  const delta = isSub ? -pts : pts;
  const reason = rawName || (isSub ? 'Trừ điểm nhắc nhở' : 'Cộng điểm thưởng');

  c.score = Math.max(0, (c.score || 0) + delta);
  if(delta > 0) c.highestScore = Math.max(c.highestScore || 0, c.score);
  logPoint(c, isSub ? 'penalty' : 'bonus', delta, reason);
  if(delta > 0) boostPiggyOnGoodDeed(c, reason, 15, 0.1);
  updateEarnedAchievements(c);

  if(nameInp) nameInp.value = '';
  save();
  render();
  if(delta > 0){
    playChime('success');
    triggerConfetti();
    showToast(`🎉 Đã cộng +${pts} ⭐ (${reason})!`);
  } else {
    playPenaltySound();
    showToast(`⚠️ Đã trừ -${pts} ⭐ (${reason})!`);
  }
}

function renderTodayCategories(){
  const container = document.getElementById('todayCategoriesContainer');
  if(!container) return;
  const c = child();
  if(!c) {
    container.innerHTML = '<div class="empty">Chưa có hồ sơ bé nào.</div>';
    return;
  }

  const coreTasks = ensureCoreTodayTasks(c);
  const doneCount = coreTasks.filter(t => t.done).length;

  const badgeEl = document.getElementById('todayMinimalTaskCountBadge');
  if(badgeEl) {
    badgeEl.textContent = `${doneCount}/${coreTasks.length} đã xong`;
  }

  container.innerHTML = '';
  const listWrap = document.createElement('div');
  listWrap.className = 'today-minimal-list';

  coreTasks.forEach((t, idx) => {
    const def = CORE_TODAY_REMINDERS[idx] || { icon: '📘', name: t.name };
    const row = document.createElement('div');
    row.className = 'today-minimal-row ' + (t.done ? 'is-done' : '');

    let actionHtml = '';
    if(t.done) {
      const awarded = Number(t.awardedPoints ?? t.points ?? 0);
      const isPos = awarded >= 0;
      actionHtml = `
        <div class="today-minimal-done-group">
          <span class="today-minimal-pts-done" style="color:${isPos ? '#059669' : '#dc2626'}">${isPos ? '+' + awarded : awarded} ⭐</span>
          <button type="button" class="today-minimal-undo-btn" title="Hoàn tác" onclick="undoCoreTodayTask('${t.id}')">↩</button>
        </div>
      `;
    } else {
      actionHtml = `
        <div class="today-core-Controls">
          <div class="today-manual-pts-group" style="padding:2px 6px">
            <input id="coreTaskPts_${t.id}" type="number" min="1" max="500" value="${Math.abs(t.points || 10)}" title="Số điểm">
            <span class="pts-unit">⭐</span>
          </div>
          <button type="button" class="today-core-btn add" onclick="completeCoreTodayTask('${t.id}', 'add')" title="Cộng điểm hoàn thành">+ Cộng</button>
          <button type="button" class="today-core-btn sub" onclick="completeCoreTodayTask('${t.id}', 'sub')" title="Trừ điểm nhắc nhở">- Trừ</button>
        </div>
      `;
    }

    row.innerHTML = `
      <div class="today-minimal-left">
        <span class="today-minimal-check">${t.done ? '✅' : def.icon}</span>
        <span class="today-minimal-title">${safe(def.name)}</span>
      </div>
      <div class="today-minimal-right">${actionHtml}</div>
    `;
    listWrap.appendChild(row);
  });

  container.appendChild(listWrap);
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
  if (!isPenalty && delta > 0) boostPiggyOnGoodDeed(c, name, 15, 0.1);
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
  // Chuyển toàn bộ việc Cộng / Trừ điểm vào Khu vực Phụ huynh đơn giản hóa (có mã PIN bảo vệ)
  openParentModal('points');
  return;
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
  if (!isPenalty && delta > 0) boostPiggyOnGoodDeed(c, reason, 15, 0.1);
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
  boostPiggyOnGoodDeed(c, pendingPraise.name, 15, 0.1);
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
  boostPiggyOnGoodDeed(c, reason, 15, 0.1);
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

  // Điền dropdown môn học (Đưa 5 môn học chính lên đầu tiên)
  const subjSelect=document.getElementById('studyScoreSubject');
  subjSelect.innerHTML='';
  const allSubjects=Array.from(new Set([...CORE_STUDY_SUBJECTS,...(data.subjects||[]),'Tiếng Việt','Kỹ năng sống']));
  allSubjects.forEach(s=>{
    const opt=document.createElement('option');
    const isCore=CORE_STUDY_SUBJECTS.includes(s);
    opt.value=s;opt.textContent=(isCore?'🌟 ':'📘 ')+s;
    subjSelect.appendChild(opt);
  });
  const optOther=document.createElement('option');
  optOther.value='other';optOther.textContent='✏️ Môn học khác...';
  subjSelect.appendChild(optOther);

  document.getElementById('customSubjectWrap').style.display='none';
  document.getElementById('studyScoreCustomSubject').value='';

  // Điền danh sách chip chọn nhanh (5 môn chính hiển thị luôn, các tiêu chí khác thu gọn)
  const chipBox=document.getElementById('studyScoreChips');
  chipBox.innerHTML='';
  const corePresets=STUDY_PRESETS.filter(p=>p.core!==false);
  const otherPresets=STUDY_PRESETS.filter(p=>p.core===false);

  corePresets.forEach(p=>{
    const chip=document.createElement('button');
    chip.type='button';
    chip.className='study-chip'+(presetIdOrObj===p.id?' active':'');
    chip.innerHTML=`<span>${p.icon}</span><span>${safe(p.name)}</span><b style="color:#4338ca">+${p.points}⭐</b>`;
    chip.onclick=()=>selectStudyPreset(p.id);
    chipBox.appendChild(chip);
  });

  if(otherPresets.length){
    const details=document.createElement('details');
    details.className='study-other-chips-details';
    if(otherPresets.some(p=>p.id===presetIdOrObj)) details.open=true;
    const summary=document.createElement('summary');
    summary.textContent='📂 Các môn & tiêu chí bổ sung khác (Thu gọn — bấm để mở)';
    const inner=document.createElement('div');
    inner.className='study-chip-list';
    inner.style.marginTop='6px';
    otherPresets.forEach(p=>{
      const chip=document.createElement('button');
      chip.type='button';
      chip.className='study-chip'+(presetIdOrObj===p.id?' active':'');
      chip.innerHTML=`<span>${p.icon}</span><span>${safe(p.name)}</span><b style="color:#4338ca">+${p.points}⭐</b>`;
      chip.onclick=()=>selectStudyPreset(p.id);
      inner.appendChild(chip);
    });
    details.append(summary,inner);
    chipBox.appendChild(details);
  }

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

// 💡 Góc học tập (Ưu tiên 5 môn chính của con & thu gọn các nội dung khác)
function isCoreStudyTool(t){
  if(!t) return false;
  if(t.core===true) return true;
  if(t.core===false) return false;
  const cat=String(t.category||'');
  return CORE_STUDY_SUBJECTS.some(s=>cat===s || cat.includes(s));
}

function createStudyToolCard(t){
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
      <a class="tool-btn-open" style="width:100%;text-align:center" href="${safe(t.url)}" target="_blank" rel="noopener">Mở học ngay ↗</a>
    </div>
  `;
  return card;
}

function filterStudyTools(cat,btn){
  selectedToolCategory=cat;
  document.querySelectorAll('.tools-filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderStudyTools();
}

function renderStudyTools(){
  if(!document.getElementById("toolsSection")) return;
  const c=child();
  const childNameEl=document.getElementById('studyHubChildName');
  if(childNameEl) childNameEl.textContent=c?(childIcon(c)+' '+c.name):'Con';

  if(typeof renderCoreInteractiveHub==='function') renderCoreInteractiveHub();

  const box=document.getElementById('studyToolsGrid');
  const otherBox=document.getElementById('otherStudyToolsGrid');
  const otherQuickBox=document.getElementById('otherStudyQuickButtons');
  if(!box)return;
  box.innerHTML='';

  const tools=Array.isArray(data.studyTools)&&data.studyTools.length?data.studyTools:DEFAULT_STUDY_TOOLS;
  const coreTools=tools.filter(t=>isCoreStudyTool(t));
  const otherTools=tools.filter(t=>!isCoreStudyTool(t));

  const filtered=(selectedToolCategory==='all')
    ? coreTools
    : coreTools.filter(t=>t.category===selectedToolCategory || String(t.category||'').includes(selectedToolCategory));

  if(!filtered.length){
    box.innerHTML='<div class="empty" style="grid-column:1/-1">Chưa có liên kết web nào trong môn này. Phụ huynh có thể thêm ở Khu vực phụ huynh.</div>';
  }else{
    filtered.forEach(t=>box.appendChild(createStudyToolCard(t)));
  }

  if(otherBox){
    otherBox.innerHTML='';
    if(!otherTools.length){
      otherBox.innerHTML='<div class="empty" style="grid-column:1/-1">Không có nguồn học bổ sung nào khác.</div>';
    }else{
      otherTools.forEach(t=>otherBox.appendChild(createStudyToolCard(t)));
    }
  }

  if(otherQuickBox){
    otherQuickBox.innerHTML='';
    const extraPresets=STUDY_PRESETS.filter(p=>p.core===false);
    extraPresets.forEach(p=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='today-preset-pill preset-praise';
      b.innerHTML=`<span>${p.icon}</span> <span>${safe(p.name)}</span> <b>+${p.points}⭐</b>`;
      b.onclick=()=>openStudyScoreModal(p.id);
      otherQuickBox.appendChild(b);
    });
  }
}

function assignTaskFromTool(toolId){
  const tools=Array.isArray(data.studyTools)&&data.studyTools.length?data.studyTools:DEFAULT_STUDY_TOOLS;
  const tool=tools.find(t=>t.id===toolId);
  if(!tool)return;
  openParentModal('tasks');
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
  const cat=String(tool.category||'');
  if(CORE_STUDY_SUBJECTS.includes(cat) && data.subjects.includes(cat)) subjSel.value=cat;
  else if(cat.includes('Toán')&&data.subjects.includes('Toán tư duy')) subjSel.value='Toán tư duy';
  else if(cat.includes('Đàn')&&data.subjects.includes('Học Đàn')) subjSel.value='Học Đàn';
  else if(cat.includes('Tiếng Anh')&&data.subjects.includes('Tiếng Anh')) subjSel.value='Tiếng Anh';
  else if(cat.includes('Tiếng Trung')&&data.subjects.includes('Tiếng Trung')) subjSel.value='Tiếng Trung';
  else if(cat.includes('Vĩ nhân')&&data.subjects.includes('Truyện kể Vĩ nhân')) subjSel.value='Truyện kể Vĩ nhân';
  else if(cat.includes('Tiếng Việt')&&data.subjects.includes('Tiếng Việt')) subjSel.value='Tiếng Việt';
  else if(cat.includes('Lập trình')&&data.subjects.includes('Kỹ năng sống')) subjSel.value='Kỹ năng sống';
}

function toggleTaskCompletion(childId,taskId){
  const c=data.children.find(x=>x.id===childId);if(!c)return;
  const t=c.tasks.find(x=>x.id===taskId);if(!t)return;
  if(!t.done){
    askConfirm('Xác nhận hoàn thành',`Con chắc chắn đã hoàn thành nhiệm vụ "${t.name}" chưa?`,()=>{
      t.done=true;t.awardedPoints=Number(t.points||0);t.completedAt=new Date().toISOString();
      boostPiggyOnGoodDeed(c, 'Hoàn thành: ' + t.name, 15, 0.1);
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
  if(!document.getElementById("achievementsSection")) return;
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
  return {stars:100,vnd:10000};
}
function fmtVND(n){return Math.floor(Number(n||0)).toLocaleString('vi-VN')+' đ'}
function starsToVND(stars){
  const r=exchangeRate(),s=Number(stars||0);
  if(!(s>0)) return 0;
  return Math.round(s*Number(r.vnd)/Number(r.stars));
}

// 🐷 Tỷ giá đổi tiền mặt bỏ ống Heo Đất: 150 ⭐ = 10.000đ (Đổi tiền khó hơn đổi quà)
function starsToCashVND(stars){
  const s=Number(stars||0);
  if(s<150) return 0;
  return Math.floor((s / 150) * 10000);
}

// 🐷 Modal Đổi sao nuôi Heo Đất tiết kiệm (Đổi tiền khó hơn đổi quà)
function openFlexibleMoneyModal(){
  const c=child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  const r=exchangeRate();
  const rateInfo=document.getElementById('moneyModalRateInfo');
  if(rateInfo){
    rateInfo.innerHTML=`Tỷ giá quà: <b>100 ⭐ = ${fmtVND(r.vnd)}</b> • Nuôi heo đất: <b style="color:#dc2626">150 ⭐ = 10.000đ</b>`;
  }
  const curStars=document.getElementById('moneyModalCurrentStars');
  if(curStars){
    curStars.textContent=`${c.score} ⭐ (Đổi được ${fmtVND(starsToCashVND(c.score))} tiền mặt)`;
  }

  const inp=document.getElementById('customMoneyStars');
  if(inp){
    inp.value=c.score>=150?150:(c.score||'');
  }
  updateCustomMoneyCalc();
  document.getElementById('flexibleMoneyModal').classList.add('show');
}

function closeFlexibleMoneyModal(){
  document.getElementById('flexibleMoneyModal').classList.remove('show');
}

function selectQuickMoney(stars){
  const inp=document.getElementById('customMoneyStars');
  if(inp){
    inp.value=stars;
    updateCustomMoneyCalc();
  }
}

function updateCustomMoneyCalc(){
  const stars=Number(document.getElementById('customMoneyStars')?.value||0);
  const vnd=starsToCashVND(stars);
  const resEl=document.getElementById('customMoneyVndResult');
  if(resEl) resEl.textContent=fmtVND(vnd);

  const hintEl=document.getElementById('moneyModalMinHint');
  if(hintEl){
    if(stars<150){
      hintEl.innerHTML='<span style="color:#dc2626;font-weight:700">⚠️ Đổi tiền khó hơn đổi quà: Cần tối thiểu 150 ⭐ để đổi mốc 10.000đ đầu tiên!</span>';
    }else{
      hintEl.innerHTML=`<span style="color:#059669;font-weight:700">✓ Hợp lệ: ${stars.toLocaleString('vi-VN')} ⭐ quy đổi thành ${fmtVND(vnd)} tiền mặt bỏ heo đất.</span>`;
    }
  }
}

function confirmFlexibleMoneyRedeem(){
  const c=child();
  if(!c) return;
  const stars=Number(document.getElementById('customMoneyStars')?.value||0);
  if(stars<150){
    return alert('Đổi tiền mặt nuôi heo đất khó hơn đổi quà: Bé cần tích lũy tối thiểu 150 ⭐ để đổi mốc 10.000đ đầu tiên nhé!');
  }
  if(c.score<stars){
    document.getElementById('missingPoints').textContent=(stars-c.score).toLocaleString('vi-VN');
    closeFlexibleMoneyModal();
    document.getElementById('encourageModal').classList.add('show');
    return;
  }
  const vnd=starsToCashVND(stars);
  const giftName='Tiền nuôi Heo Đất '+fmtVND(vnd);

  askConfirm('Xác nhận đổi tiền bỏ heo', `Con chắc chắn muốn đổi ${stars.toLocaleString('vi-VN')} ⭐ thành ${fmtVND(vnd)} tiền mặt bỏ ống heo tiết kiệm?`, ()=>{
    if(!Array.isArray(c.giftHistory))c.giftHistory=[];
    if(!Array.isArray(c.pointHistory))c.pointHistory=[];
    c.giftHistory.push({
      id:uid('g'),rewardId:'piggy_bank_'+stars,name:giftName,cost:stars,
      status:'pending',receivedAt:new Date().toISOString()
    });
    c.score-=stars;
    logPoint(c,'reward',-stars,'Nuôi Heo Đất: '+giftName);
    save();render();
    closeFlexibleMoneyModal();
    playChime('success');
    triggerConfetti();
    document.getElementById('successGiftName').textContent=giftName;
    document.getElementById('successGiftPoints').textContent=stars.toLocaleString('vi-VN');
    document.getElementById('rewardSuccessModal').classList.add('show');
  },{yesText:'Có, bỏ heo tiết kiệm',icon:'🐷'});
}

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

function scrollToRewardSection(elemId){
  const el = document.getElementById(elemId);
  if(el){
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function quickRedeemPiggy(stars, vnd, pkgName){
  const c = child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  if(c.score < stars){
    document.getElementById('missingPoints').textContent = (stars - c.score).toLocaleString('vi-VN');
    document.getElementById('encourageModal').classList.add('show');
    return;
  }
  const giftName = 'Tiền Nuôi Heo Đất ' + fmtVND(vnd) + ' (' + pkgName + ')';
  askConfirm('Nuôi Heo Đất Tiết Kiệm', 'Con chắc chắn muốn đổi ' + stars.toLocaleString('vi-VN') + ' ⭐ lấy ' + fmtVND(vnd) + ' tiền mặt bỏ ống heo tiết kiệm?', () => {
    if(!Array.isArray(c.giftHistory)) c.giftHistory = [];
    if(!Array.isArray(c.pointHistory)) c.pointHistory = [];
    c.giftHistory.push({
      id: uid('g'),
      rewardId: 'piggy_' + stars,
      name: giftName,
      cost: stars,
      status: 'pending',
      receivedAt: new Date().toISOString()
    });
    c.score -= stars;
    logPoint(c, 'reward', -stars, 'Nuôi Heo Đất: ' + giftName);
    save();
    render();
    playChime('success');
    triggerConfetti();
    document.getElementById('successGiftName').textContent = giftName;
    document.getElementById('successGiftPoints').textContent = stars.toLocaleString('vi-VN');
    document.getElementById('rewardSuccessModal').classList.add('show');
  }, { yesText: 'Có, bỏ heo tiết kiệm', icon: '🐷' });
}

function renderRewards(){
  if(!document.getElementById("rewardsSection")) return;
  const c = child();
  const curScore = c ? Number(c.score || 0) : 0;
  const curVnd = starsToVND(curScore);

  // Cập nhật Header Ví MoMo
  const nameEl = document.getElementById('rewardNameChild');
  if(nameEl) nameEl.textContent = c ? (childIcon(c) + ' ' + c.name) : 'bé';
  const scoreEl = document.getElementById('rewardCurrentScore');
  if(scoreEl) scoreEl.textContent = curScore.toLocaleString('vi-VN') + ' ⭐';
  const vndEquivEl = document.getElementById('momoVndEquiv');
  if(vndEquivEl) vndEquivEl.textContent = '≈ ' + fmtVND(curVnd);

  // Cập nhật trạng thái các nút Heo Đất nhanh
  [150, 300, 750, 1500].forEach(st => {
    const btn = document.getElementById('piggyBtn' + st);
    if(btn){
      if(curScore >= st){
        btn.textContent = 'Đổi ngay 🐷';
        btn.style.background = '#10b981';
      } else {
        btn.textContent = 'Thiếu ' + (st - curScore) + ' ⭐';
        btn.style.background = '#e2e8f0';
        btn.style.color = '#64748b';
      }
    }
  });

  const boxToday = document.getElementById('rewardShopToday');
  const boxMain = document.getElementById('rewardShopStandalone');
  if(boxToday) boxToday.innerHTML = '';
  if(boxMain) boxMain.innerHTML = '';

  const rewards = currentRewards();
  if(!rewards.length){
    if(boxMain) boxMain.innerHTML = '<div class="empty">Chưa có phần quà nào được thiết lập cho bé.</div>';
    renderPendingGifts();
    return;
  }

  // 1. Render trên Tab Hôm nay (Lưới MoMo Mini: Icon trên, chữ nhỏ dưới)
  if(boxToday){
    const sorted = [...rewards].sort((a,b) => {
      const aAfford = curScore >= a.cost ? 0 : 1;
      const bAfford = curScore >= b.cost ? 0 : 1;
      if(aAfford !== bAfford) return aAfford - bAfford;
      return a.cost - b.cost;
    });

    const grid = document.createElement('div');
    grid.className = 'momo-gifts-grid';
    grid.style.marginTop = '4px';

    sorted.slice(0, 4).forEach(r => {
      const canAfford = (curScore >= r.cost);
      const pct = Math.min(100, Math.round((curScore / r.cost) * 100));
      const diff = Math.max(0, r.cost - curScore);
      const vndVal = fmtVND(starsToVND(r.cost));

      const item = document.createElement('div');
      item.className = 'momo-gift-item ' + (canAfford ? 'can-afford' : '');
      item.innerHTML = `
        <div class="momo-gift-icon-bubble">${r.icon || '🎁'}</div>
        <div class="momo-gift-title">${safe(r.name)}</div>
        <div class="momo-gift-price-row">
          <span class="momo-gift-pts">${r.cost} ⭐</span>
          <span class="momo-gift-vnd">${vndVal}</span>
        </div>
        <div class="momo-gift-progress-track">
          <div class="momo-gift-progress-fill ${canAfford ? 'ready' : ''}" style="width:${pct}%"></div>
        </div>
        <div class="momo-gift-progress-text">${canAfford ? '🎉 Đủ đổi ngay!' : 'Thiếu ' + diff + ' ⭐'}</div>
        <div class="momo-gift-actions">
          <button type="button" class="momo-gift-btn ${canAfford ? 'redeem-ready' : 'redeem-locked'}" onclick="redeemById('${r.id}')">
            ${canAfford ? 'Đổi quà 🎁' : 'Xem quà'}
          </button>
        </div>
      `;
      grid.appendChild(item);
    });
    boxToday.appendChild(grid);
  }

  // 2. Render trên Trang Đổi quà chính (Chia các khối MoMo Sections: Icon trên, chữ nhỏ dưới)
  if(boxMain){
    const CATEGORIES = [
      { key: 'Đồ dùng học tập', icon: '✏️', title: 'Đồ Dùng Học Tập (Ưu Tiên Số 1)', desc: 'Dụng cụ học tập, tập vở, sách truyện rèn luyện tri thức' },
      { key: 'Bánh & Món ngon', icon: '🍪', title: 'Bánh & Món Ngon Ấm Bụng', desc: 'Món ngon ăn xế, sữa hạt ấm (Tuyệt đối không dùng đồ lạnh)' },
      { key: 'Quà & Đồ chơi', icon: '🎁', title: 'Quà & Đồ Chơi Sáng Tạo', desc: 'Đất nặn, Lego mini, sticker, gấu bông & quà ước mơ' },
      { key: 'Đi chơi & Dã ngoại', icon: '🎡', title: 'Đi Chơi & Dã Ngoại Cuối Tuần', desc: 'Công viên, nhà sách Fahasa, tiNiWorld & dã ngoại gia đình' }
    ];

    CATEGORIES.forEach(cat => {
      if(selectedRewardCategory !== 'all' && selectedRewardCategory !== cat.key && selectedRewardCategory !== 'Nuôi Heo Đất') return;
      if(selectedRewardCategory === 'Nuôi Heo Đất') return; // Sẽ hiển thị ở khối Heo Đất phía dưới

      const catRewards = rewards.filter(r => r.category === cat.key);
      if(!catRewards.length) return;

      const block = document.createElement('div');
      block.className = 'momo-section-card';

      // Header khối
      const head = document.createElement('div');
      head.className = 'momo-section-head';
      head.innerHTML = `
        <div class="momo-section-title-wrap">
          <span class="momo-section-icon">${cat.icon}</span>
          <div>
            <div class="momo-section-title">${cat.title}</div>
            <div class="momo-section-desc">${cat.desc}</div>
          </div>
        </div>
        <span class="momo-section-badge">${catRewards.length} món</span>
      `;
      block.appendChild(head);

      // Grid các món quà (Icon lớn ở trên, chữ nhỏ ở dưới)
      const grid = document.createElement('div');
      grid.className = 'momo-gifts-grid';

      catRewards.forEach(r => {
        const isTarget = c && c.targetRewardId === r.id;
        const canAfford = (curScore >= r.cost);
        const pct = Math.min(100, Math.round((curScore / r.cost) * 100));
        const diff = Math.max(0, r.cost - curScore);
        const vndVal = fmtVND(starsToVND(r.cost));

        const item = document.createElement('div');
        item.className = 'momo-gift-item ' + (canAfford ? 'can-afford' : '');
        item.innerHTML = `
          <div class="momo-gift-icon-bubble">${r.icon || '🎁'}</div>
          <div class="momo-gift-title">${safe(r.name)}</div>
          <div class="momo-gift-price-row">
            <span class="momo-gift-pts">${r.cost} ⭐</span>
            <span class="momo-gift-vnd">${vndVal}</span>
          </div>
          <div class="momo-gift-progress-track">
            <div class="momo-gift-progress-fill ${canAfford ? 'ready' : ''}" style="width:${pct}%"></div>
          </div>
          <div class="momo-gift-progress-text">${canAfford ? '🎉 Đã đủ sao để đổi!' : 'Đã đạt ' + pct + '% (Thiếu ' + diff + ' ⭐)'}</div>
          <div class="momo-gift-actions">
            <button type="button" class="momo-gift-btn goal-btn ${isTarget ? 'active' : ''}" onclick="setTargetGoal('${r.id}')" title="${isTarget ? 'Đang là mục tiêu' : 'Đặt làm mục tiêu'}">
              🎯
            </button>
            <button type="button" class="momo-gift-btn ${canAfford ? 'redeem-ready' : 'redeem-locked'}" onclick="redeemById('${r.id}')">
              ${canAfford ? 'Đổi quà 🎁' : 'Thiếu ' + diff + ' ⭐'}
            </button>
          </div>
        `;
        grid.appendChild(item);
      });

      block.appendChild(grid);
      boxMain.appendChild(block);
    });

    // Ẩn/Hiện khối Heo Đất theo bộ lọc
    const piggyBlock = document.getElementById('momoPiggySectionBlock');
    if(piggyBlock){
      if(selectedRewardCategory === 'all' || selectedRewardCategory === 'Nuôi Heo Đất'){
        piggyBlock.style.display = 'block';
      } else {
        piggyBlock.style.display = 'none';
      }
    }
  }

  renderPendingGifts();
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
  if(!document.getElementById("calendarGrid")) return;
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

let activeParentTab = 'points'; // 'points' | 'tasks' | 'settings'
let isParentSessionUnlocked = false;

function openParentModal(defaultTab = 'points'){
  if (defaultTab && ['points', 'tasks', 'settings'].includes(defaultTab)) {
    activeParentTab = defaultTab;
  }
  const modal = document.getElementById('parentModal');
  if (!modal) return;
  modal.classList.add('show');

  if (isParentSessionUnlocked) {
    document.getElementById('parentLogin').style.display = 'none';
    document.getElementById('parentArea').style.display = 'block';
    renderManagers();
  } else {
    setTimeout(() => {
      document.getElementById('parentPasswordInput')?.focus();
    }, 80);
  }
}

function closeParentModal(){
  document.getElementById('parentModal').classList.remove('show');
}

function lockParentSession(){
  isParentSessionUnlocked = false;
  document.getElementById('parentArea').style.display='none';
  document.getElementById('parentLogin').style.display='block';
  document.getElementById('parentPasswordInput').value='';
  closeParentModal();
  showToast('🔒 Đã khóa lại Khu vực phụ huynh!');
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
  isParentSessionUnlocked = true;
  document.getElementById('parentLogin').style.display='none';
  document.getElementById('parentArea').style.display='block';
  input.value='';
  renderManagers();
}

function switchParentSimpleTab(tabId){
  activeParentTab = tabId;
  renderParentSimplifiedHub();
}

// ⚡ CỘNG / TRỪ ĐIỂM 1 CHẠM TRONG KHU VỰC PHỤ HUYNH
function parentOneTapScore(points, reason, categoryLabel = 'Phụ huynh'){
  const c = child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  const delta = Number(points || 0);
  if(!delta) return;

  c.score = Math.max(0, (c.score || 0) + delta);
  if(delta > 0) c.highestScore = Math.max(c.highestScore || 0, c.score);

  logPoint(c, delta > 0 ? 'bonus' : 'penalty', delta, `[${categoryLabel}] ${reason}`);
  if(delta > 0) boostPiggyOnGoodDeed(c, reason, 15, 0.1);
  updateEarnedAchievements(c);
  save();
  render();

  if(delta > 0){
    playChime('success');
    triggerConfetti();
    showToast(`🎉 Đã cộng +${delta} ⭐ cho ${c.name}: ${reason}`);
  } else {
    playPenaltySound();
    showToast(`⚠️ Đã trừ ${delta} ⭐ của ${c.name}: ${reason}`);
  }
}

function parentCustomQuickSubmit(mode){
  const ptsEl = document.getElementById('parentQuickPtsInput');
  const reasonEl = document.getElementById('parentQuickReasonInput');
  const pts = Math.abs(Number(ptsEl?.value || 10));
  if(!pts || pts <= 0) return alert('Vui lòng nhập số sao lớn hơn 0.');
  const rawReason = (reasonEl?.value || '').trim();
  const reason = rawReason || (mode === 'penalty' ? 'Nhắc nhở rèn luyện' : 'Bố mẹ khen thưởng');
  const delta = mode === 'penalty' ? -pts : pts;
  parentOneTapScore(delta, reason, mode === 'penalty' ? 'Nhắc nhở' : 'Khen thưởng');
  if(reasonEl) reasonEl.value = '';
}

function undoParentPointEntry(entryId){
  const c = child();
  if(!c || !Array.isArray(c.pointHistory)) return;
  const idx = c.pointHistory.findIndex(h => h.id === entryId);
  if(idx < 0) return;
  const entry = c.pointHistory[idx];
  const amt = Number(entry.amount || 0);
  c.score = Math.max(0, (c.score || 0) - amt);
  c.pointHistory.splice(idx, 1);
  save();
  render();
  showToast('↩ Đã hoàn tác mục điểm vừa chọn!');
}

// 📝 GIAO NHANH 1 CHẠM VIỆC HÔM NAY CHO BÉ
function parentQuickAssignTodayTask(name, subject, category, points, duration = '15 phút'){
  const c = child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  const today = todayISO();
  c.tasks.push({
    id: uid('t'),
    seriesId: null,
    name,
    subject,
    category,
    date: today,
    points: Number(points || 10),
    duration,
    link: '',
    instruction: '',
    done: false,
    awardedPoints: 0,
    completedAt: null
  });
  save();
  render();
  playChime('success');
  showToast(`📝 Đã thêm "${name}" (+${points}⭐) vào việc hôm nay của ${c.name}!`);
}

function renderParentSimplifiedHub(){
  const parentArea = document.getElementById('parentArea');
  if(!parentArea) return;

  // Khởi tạo container đơn giản hóa ở đầu #parentArea nếu chưa có
  let hubWrap = document.getElementById('parentSimplifiedContainer');
  if(!hubWrap){
    hubWrap = document.createElement('div');
    hubWrap.id = 'parentSimplifiedContainer';
    parentArea.insertBefore(hubWrap, parentArea.firstChild);
  }

  const c = child();
  const childSwitchPills = data.children.map(ch => `
    <button type="button" class="today-cat-pill ${ch.id===currentChildId?'active':''}" onclick="currentChildId='${ch.id}';render()">
      ${childIcon(ch)} ${safe(ch.name)} (<b>${ch.score} ⭐</b>)
    </button>
  `).join('');

  // Lịch sử 5 lần cộng/trừ gần nhất của bé để dễ kiểm tra & hoàn tác
  const recentLogs = (c && Array.isArray(c.pointHistory)) ? c.pointHistory.slice(-5).reverse() : [];
  const recentHtml = recentLogs.length ? recentLogs.map(item => {
    const isPos = Number(item.amount) >= 0;
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;font-size:12px;gap:8px">
        <div style="flex:1">
          <b style="color:${isPos?'#059669':'#dc2626'}">${isPos?'+'+item.amount:item.amount} ⭐</b>
          <span style="color:#334155;margin-left:6px">${safe(item.reason || 'Cập nhật điểm')}</span>
        </div>
        <button type="button" onclick="undoParentPointEntry('${item.id}')" style="border:1px solid #cbd5e1;background:#f8fafc;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer;color:#475569">↩ Hoàn tác</button>
      </div>
    `;
  }).join('') : '<div class="note">Chưa có lịch sử cộng/trừ điểm gần đây.</div>';

  hubWrap.innerHTML = `
    <!-- Thanh chọn bé & nút Khóa lại -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;background:#f8fafc;padding:10px 12px;border-radius:14px;border:1px solid #e2e8f0">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span style="font-size:12px;font-weight:800;color:#475569">Đang chọn bé:</span>
        ${childSwitchPills}
      </div>
      <button type="button" class="btn delete" style="padding:6px 12px;font-size:12px" onclick="lockParentSession()">🔒 Khóa phụ huynh</button>
    </div>

    <!-- 3 Tab Phụ Huynh Gọn Gàng -->
    <div class="parent-simple-tabs">
      <button type="button" class="parent-tab-btn ${activeParentTab==='points'?'active':''}" onclick="switchParentSimpleTab('points')">
        <span>⭐</span> <span>1. Cộng / Trừ Điểm (1 Chạm)</span>
      </button>
      <button type="button" class="parent-tab-btn ${activeParentTab==='tasks'?'active':''}" onclick="switchParentSimpleTab('tasks')">
        <span>📝</span> <span>2. Giao &amp; Sửa Việc</span>
      </button>
      <button type="button" class="parent-tab-btn ${activeParentTab==='settings'?'active':''}" onclick="switchParentSimpleTab('settings')">
        <span>⚙️</span> <span>3. Cài Đặt &amp; Đồng Bộ</span>
      </button>
    </div>

    ${activeParentTab === 'points' ? `
      <div class="parent-quick-score-hub">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
          <div>
            <h3 style="margin:0;font-size:17px;color:#065f46">⚡ Chạm 1 Lần Cộng / Trừ Sao Ngay Cho ${c ? safe(c.name) : 'Bé'}</h3>
            <div class="note">Bấm vào từng mục bên dưới để thưởng hoặc trừ sao tức thì, không cần điền nhiều ô!</div>
          </div>
          <div style="background:#ffffff;border:2px solid #10b981;border-radius:14px;padding:6px 14px;font-weight:900;color:#065f46;font-size:16px">
            ⭐ Hiện có: ${c ? c.score : 0} sao
          </div>
        </div>

        <!-- Nhóm 1: Học tập -->
        <div style="font-size:12.5px;font-weight:900;color:#047857;margin-top:8px">🌟 Khen thưởng Học tập &amp; Tự giác (1 chạm):</div>
        <div class="parent-one-tap-grid">
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(15, 'Học Toán tư duy chăm chỉ', 'Học tập')">
            <span>🧮 Toán tư duy</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(15, 'Luyện Đàn đúng nhịp', 'Học tập')">
            <span>🎹 Tập Đàn</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(15, 'Học Tiếng Anh Little Fox', 'Học tập')">
            <span>🇬🇧 Tiếng Anh</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(15, 'Học Tiếng Trung Pinyin', 'Học tập')">
            <span>🐼 Tiếng Trung</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(15, 'Nghe truyện kể Vĩ nhân', 'Học tập')">
            <span>👑 Truyện Vĩ nhân</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(20, 'Đạt Điểm 10 ở trường', 'Trên lớp')">
            <span>💯 Điểm 10 ở lớp</span> <b>+20 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(15, 'Được cô giáo khen ngợi', 'Trên lớp')">
            <span>🌸 Cô giáo khen</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(10, 'Tự giác ngồi vào bàn học', 'Tự giác')">
            <span>✍️ Tự giác học</span> <b>+10 ⭐</b>
          </button>
        </div>

        <!-- Nhóm 2: Việc nhà & Ngoan ngoãn -->
        <div style="font-size:12.5px;font-weight:900;color:#0369a1;margin-top:14px">🧹 Khen thưởng Phụ bố mẹ &amp; Nếp sống ngoan (1 chạm):</div>
        <div class="parent-one-tap-grid">
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(10, 'Phụ bố mẹ làm việc nhà', 'Phụ bố mẹ')">
            <span>🧹 Phụ việc nhà</span> <b>+10 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(5, 'Tự dọn gọn đồ chơi & sách vở', 'Phụ bố mẹ')">
            <span>🧸 Dọn đồ chơi/sách</span> <b>+5 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(5, 'Ăn giỏi, đi ngủ đúng giờ', 'Nếp sống')">
            <span>🍚 Ăn ngoan ngủ sớm</span> <b>+5 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentOneTapScore(10, 'Biết vâng lời, lễ phép với ông bà bố mẹ', 'Nếp sống')">
            <span>💖 Ngoan &amp; lễ phép</span> <b>+10 ⭐</b>
          </button>
        </div>

        <!-- Nhóm 3: Trừ điểm nhắc nhở -->
        <div style="font-size:12.5px;font-weight:900;color:#b91c1c;margin-top:14px">⚠️ Trừ sao nhắc nhở vi phạm (1 chạm):</div>
        <div class="parent-one-tap-grid">
          <button type="button" class="parent-tap-btn penalty" onclick="parentOneTapScore(-10, 'Xem TV / Điện thoại quá giờ quy định', 'Nhắc nhở')">
            <span>📺 Xem TV/ĐT quá giờ</span> <b>-10 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn penalty" onclick="parentOneTapScore(-5, 'Chậm trễ, để bố mẹ nhắc nhiều lần', 'Nhắc nhở')">
            <span>🐢 Nhắc nhiều lần</span> <b>-5 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn penalty" onclick="parentOneTapScore(-10, 'Mè nheo, chưa vâng lời bố mẹ', 'Nhắc nhở')">
            <span>😤 Chưa vâng lời</span> <b>-10 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn penalty" onclick="parentOneTapScore(-5, 'Quên dọn đồ chơi / sách vở bừa bộn', 'Nhắc nhở')">
            <span>🧸 Không dọn đồ</span> <b>-5 ⭐</b>
          </button>
        </div>

        <!-- Nhóm 4: Cộng / Trừ Tùy Ý Gọn Trên 1 Khung -->
        <div style="background:#ffffff;border:1.5px solid #cbd5e1;border-radius:14px;padding:12px;margin-top:16px">
          <div style="font-size:12.5px;font-weight:900;color:#1e293b;margin-bottom:8px">✏️ Hoặc nhập số sao &amp; lý do tùy ý:</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
            ${[5, 10, 15, 20, 30, 50].map(n => `<button type="button" class="btn open" style="padding:5px 10px;font-size:12px" onclick="document.getElementById('parentQuickPtsInput').value=${n}">${n} ⭐</button>`).join('')}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <input id="parentQuickPtsInput" type="number" min="1" value="10" style="width:90px;font-weight:900;font-size:15px" placeholder="Số sao">
            <input id="parentQuickReasonInput" placeholder="Nhập lý do (VD: Tự giác gấp quần áo, Điểm 10...)" style="flex:1;min-width:180px">
            <button type="button" class="primary" style="background:linear-gradient(135deg,#10b981,#059669);padding:9px 16px" onclick="parentCustomQuickSubmit('praise')">➕ Cộng Sao</button>
            <button type="button" class="btn delete" style="padding:9px 16px" onclick="parentCustomQuickSubmit('penalty')">➖ Trừ Sao</button>
          </div>
        </div>

        <!-- Lịch sử 5 lần gần nhất + Hoàn tác -->
        <div style="margin-top:14px">
          <div style="font-size:12px;font-weight:800;color:#64748b;margin-bottom:6px">🕒 5 lần cộng/trừ gần nhất (Bấm Hoàn tác nếu chọn nhầm):</div>
          <div style="display:flex;flex-direction:column;gap:5px">${recentHtml}</div>
        </div>
      </div>
    ` : ''}

    ${activeParentTab === 'tasks' ? `
      <div class="parent-quick-score-hub" style="background:linear-gradient(135deg,#eff6ff,#f8fafc);border-color:#93c5fd">
        <h3 style="margin:0 0 4px;font-size:16px;color:#1e3a8a">⚡ Chạm 1 Lần Giao Nhanh Việc Hôm Nay Cho ${c ? safe(c.name) : 'Bé'}</h3>
        <div class="note" style="margin-bottom:8px">Bấm vào mẫu dưới đây để thêm ngay vào danh sách Nhắc việc hôm nay của bé:</div>
        <div class="parent-one-tap-grid">
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Học Toán tư duy (15 phút)', 'Toán tư duy', 'home_study', 15, '15 phút')">
            <span>🧮 Học Toán tư duy</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Luyện Đàn chăm chỉ (20 phút)', 'Học Đàn', 'home_study', 15, '20 phút')">
            <span>🎹 Luyện Đàn 20p</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Học Tiếng Anh Little Fox', 'Tiếng Anh', 'home_study', 15, '15 phút')">
            <span>🇬🇧 Tiếng Anh Little Fox</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Học Tiếng Trung Pinyin', 'Tiếng Trung', 'home_study', 15, '15 phút')">
            <span>🐼 Tiếng Trung Pinyin</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Nghe truyện kể Vĩ nhân', 'Truyện kể Vĩ nhân', 'home_study', 15, '15 phút')">
            <span>👑 Nghe truyện Vĩ nhân</span> <b>+15 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Soạn sách vở & đồ dùng mai đi học', 'Kỹ năng sống', 'home_study', 10, '10 phút')">
            <span>🎒 Soạn cặp sách</span> <b>+10 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Phụ bố mẹ dọn bàn ăn / việc nhà', 'Kỹ năng sống', 'parent_help', 10, '15 phút')">
            <span>🧹 Phụ việc nhà</span> <b>+10 ⭐</b>
          </button>
          <button type="button" class="parent-tap-btn" onclick="parentQuickAssignTodayTask('Dọn gọn đồ chơi & góc học tập', 'Kỹ năng sống', 'parent_help', 5, '10 phút')">
            <span>🧸 Dọn đồ chơi</span> <b>+5 ⭐</b>
          </button>
        </div>
      </div>
    ` : ''}
  `;

  // Ẩn/hiện các .parent-section cũ theo đúng tab để giao diện cực gọn
  const sections = parentArea.querySelectorAll('.parent-section');
  sections.forEach(sec => {
    const h3Text = (sec.querySelector('h3')?.textContent || '').toLowerCase();
    const isOldScoreSec = h3Text.includes('chấm điểm') || h3Text.includes('thưởng điểm') || h3Text.includes('điểm phạt');
    const isTaskSec = h3Text.includes('giao nhiệm vụ') || h3Text.includes('chỉnh sửa nhiệm vụ');

    if (activeParentTab === 'points') {
      sec.style.display = 'none';
    } else if (activeParentTab === 'tasks') {
      sec.style.display = isTaskSec ? 'block' : 'none';
    } else {
      // settings tab: hiển thị các cài đặt (trừ 3 mục điểm cũ và 2 mục nhiệm vụ)
      sec.style.display = (!isOldScoreSec && !isTaskSec) ? 'block' : 'none';
    }
  });
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
  renderParentSimplifiedHub();
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
    c.score+=pts;logPoint(c,'bonus',pts,reason);boostPiggyOnGoodDeed(c, reason || 'Thưởng sao', 15, 0.1);updateEarnedAchievements(c);save();render();
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

  function calcDepart(timeStr, leadMins){
    if(!timeStr) return '07:05';
    const parts = timeStr.split(':').map(Number);
    const total = (parts[0]||0)*60 + (parts[1]||0) - Number(leadMins||10);
    return formatMinutesToHHMM(total);
  }

  const lead = Number(cfg.leadMinutes||10);
  const mSchool = cfg.morningTime||'07:15';
  const mDepart = calcDepart(mSchool, lead);
  const aSchool = cfg.afternoonTime||'13:30';
  const aDepart = calcDepart(aSchool, lead);
  const pSchool = cfg.pickupTime||'16:30';
  const pDepart = calcDepart(pSchool, lead);

  const html=`
    <div class="ride-card-inner" style="flex-direction:column;align-items:stretch;gap:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div class="ride-card-left">
          <div class="ride-icon-bubble">🛵</div>
          <div>
            <div class="ride-info-title">
              <span>Lịch Chở &amp; Rước ${childName}</span>
              <span class="ride-badge">${ev?ev.label:'Hôm nay'}</span>
              <span class="note" style="color:#b45309">Nhắc trước <b>${lead} phút</b></span>
            </div>
            <div class="ride-countdown" style="margin-top:3px">${cdText}</div>
          </div>
        </div>
        <div class="ride-card-actions">
          <button type="button" class="ride-btn ride-btn-test" onclick="testSchoolRideAlert()">🔊 Thử chuông</button>
          <button type="button" class="ride-btn ride-btn-cfg" onclick="openRideReminderModal()">⚙️ Giờ chở &amp; rước</button>
        </div>
      </div>

      <div class="ride-schedule-grid">
        <div class="ride-slot-card ${ev&&ev.type==='morning'?'active-slot':''}">
          <span class="ride-slot-icon">🌅🛵</span>
          <div>
            <div style="font-size:12px;font-weight:900;color:#78350f">Chở đi học Sáng</div>
            <div style="font-size:12px;color:#92400e">Đi: <b style="color:#dc2626">${mDepart}</b> • Vào lớp: <b>${mSchool}</b></div>
          </div>
        </div>

        <div class="ride-slot-card ${ev&&ev.type==='afternoon'?'active-slot':''}">
          <span class="ride-slot-icon">☀️🛵</span>
          <div>
            <div style="font-size:12px;font-weight:900;color:#78350f">Chở đi học Chiều</div>
            <div style="font-size:12px;color:#92400e">Đi: <b style="color:#dc2626">${aDepart}</b> • Vào lớp: <b>${aSchool}</b></div>
          </div>
        </div>

        <div class="ride-slot-card ${ev&&ev.type==='pickup'?'active-slot':''}">
          <span class="ride-slot-icon">🏠🎒</span>
          <div>
            <div style="font-size:12px;font-weight:900;color:#065f46">Rước con tan trường</div>
            <div style="font-size:12px;color:#047857">Đi rước: <b style="color:#dc2626">${pDepart}</b> • Tan học: <b>${pSchool}</b></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const todayEl = document.getElementById('todayRideReminderCard');
  if(todayEl){
    todayEl.innerHTML = html;
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
  const tabs=['bag','timetable','guide','bee','calendar'];
  tabs.forEach(t=>{
    const btn=document.getElementById('ttView' + t.charAt(0).toUpperCase() + t.slice(1) + 'Btn');
    const wrap=document.getElementById('tt' + t.charAt(0).toUpperCase() + t.slice(1) + 'TabWrap');
    if(btn) btn.classList.toggle('active', t===tabName);
    if(wrap) wrap.style.display=(t===tabName)?'block':'none';
  });
  if(tabName==='bag' && typeof renderSchoolBagChecklist==='function'){
    renderSchoolBagChecklist();
  }
  if(tabName==='timetable' && typeof renderTimetableTable==='function'){
    renderTimetablePalette();
    renderTimetableTable();
  }
  if(tabName==='guide' && typeof renderBagGuideTable==='function'){
    renderBagGuideTable();
  }
  if(tabName==='bee' && typeof renderBeeTimer==='function'){
    renderBeeTimer();
  }
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
  if(!document.getElementById("scheduleSection")) return;
  const c=child();
  const nameEl=document.getElementById('scheduleName');
  if(nameEl) nameEl.textContent=c?(childIcon(c)+' '+c.name):'bé';

  renderTimetablePalette();
  renderTimetableTable();
  if(typeof renderBagGuideTable==='function') renderBagGuideTable();
}

function loadGrade1DefaultTimetable(){
  const c=child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  askConfirm('Nạp Thời khóa biểu Lớp 1A4 chuẩn', 'Bạn muốn nạp Mẫu Thời khóa biểu Lớp 1A4 chuẩn (áp dụng từ 07/09/2026) cho bé? (Các tiết học hiện tại sẽ được cập nhật đồng bộ)', ()=>{
    c.timetable=structuredClone(DEFAULT_GRADE1_TIMETABLE);
    c.timetableVersion='1a4_2026';
    save();
    renderTimetable();
    renderSchoolBagChecklist();
    if(typeof renderBagGuideTable==='function') renderBagGuideTable();
    playChime('success');
    showToast('🎉 Đã nạp thành công Thời khóa biểu Lớp 1A4 chuẩn!');
  },{yesText:'Nạp TKB Lớp 1A4'});
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
  // Nếu là Thứ 7 (6) hoặc Chủ Nhật (0) -> Chuẩn bị cho Thứ Hai (2)
  if(day===0 || day===6) return '2';
  return String(day+1);
}

function renderSchoolBagChecklist(){
  const todayContainer = document.getElementById('todaySchoolBagCard');
  const scheduleContainer = document.getElementById('scheduleSchoolBagCard');
  if(!todayContainer && !scheduleContainer) return;

  const c=child();
  const targetDay=getTomorrowDayNumber();
  const dayLabels={'2':'Thứ 2','3':'Thứ 3','4':'Thứ 4','5':'Thứ 5','6':'Thứ 6','7':'Thứ 7'};
  const dayName=dayLabels[targetDay]||'Ngày mai';

  const guide=GRADE1_BAG_GUIDE[targetDay];
  const items=[];

  // 1. Áo thể dục / Đồng phục
  if(guide && guide.uniform){
    items.push({
      id: 'uniform_' + targetDay,
      icon: '👕',
      text: '<b>ĐỒNG PHỤC:</b> ' + guide.uniform,
      isUniform: true
    });
  }

  // 2. Sách giáo khoa & Vở bài tập theo ngày
  if(guide && Array.isArray(guide.books)){
    guide.books.forEach((b, idx)=>{
      items.push({
        id: 'book_' + targetDay + '_' + idx,
        icon: b.icon || '📖',
        text: b.name
      });
    });
  }

  // 3. Vở theo màu sắc
  if(guide && Array.isArray(guide.notebooks)){
    guide.notebooks.forEach((nb, idx)=>{
      items.push({
        id: 'nb_' + targetDay + '_' + idx,
        icon: '📓',
        text: nb.name + (nb.label ? ' (' + nb.label + ')' : ''),
        color: nb.color
      });
    });
  }

  // 4. Dụng cụ theo ngày
  if(guide && Array.isArray(guide.supplies)){
    guide.supplies.forEach((sp, idx)=>{
      items.push({
        id: 'sp_' + targetDay + '_' + idx,
        icon: sp.icon || '🎨',
        text: sp.name
      });
    });
  }

  // 5. Đồ dùng học tập mang theo mỗi ngày
  items.push(
    { id: 'daily_pencil_case', icon: '✏️', text: 'Hộp bút: Bút chì (chuốt sẵn 3 cây), gôm tẩy, chuốt bút, thước kẻ 20cm' },
    { id: 'daily_slate', icon: '📋', text: 'Bảng con + phấn + đồ lau bảng' },
    { id: 'daily_water', icon: '💧', text: 'Bình nước cá nhân & Khăn tay sạch' },
    { id: 'daily_hat_badge', icon: '🧢', text: 'Mũ che nắng & Thẻ học sinh đeo cổ' }
  );

  const storageKey='bag_' + (c?.id||'c') + '_' + todayISO();
  if(!bagCheckedItems[storageKey]) bagCheckedItems[storageKey]={};
  const checkedMap=bagCheckedItems[storageKey];

  let checkedCount=0;
  items.forEach(it=>{ if(checkedMap[it.id]) checkedCount++; });
  const pct=items.length?Math.round((checkedCount/items.length)*100):0;
  const isAllDone=(items.length>0 && checkedCount===items.length);

  // Môn trong TKB thực tế của ngày đó
  const tt=c?.timetable||{};
  const subjectsInDay=new Set();
  [1,2,3,4,5,6,7].forEach(p=>{
    const entry=tt[targetDay + '_' + p];
    if(entry && entry.subject && entry.subject!=='Nghỉ' && entry.subject!=='Bán trú / Nghỉ'){
      subjectsInDay.add(entry.subject);
    }
  });
  const subjectArr=Array.from(subjectsInDay);
  const subjectBadges=subjectArr.length
    ? subjectArr.map(s=>'<span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:12px;font-size:11.5px;font-weight:800;margin-right:4px">' + s + '</span>').join('')
    : '<span style="color:#64748b;font-size:12px">Lớp 1A4</span>';

  let checklistHtml=items.map(it=>{
    const checked=!!checkedMap[it.id];
    const swatchHtml = it.color ? '<span class="nb-swatch" style="background:' + it.color + ';margin-right:6px"></span>' : '';
    const uniformStyle = it.isUniform ? 'style="border-color:#10b981;background:#ecfdf5"' : '';
    return '<div class="bag-item ' + (checked?'checked':'') + '" ' + uniformStyle + ' onclick="toggleBagItem(\'' + storageKey + '\',\'' + it.id + '\')">'
      + '<div class="bag-check-circle">' + (checked?'✓':'') + '</div>'
      + '<div class="bag-item-text" style="display:flex;align-items:center;gap:4px">'
      + swatchHtml
      + '<span>' + (it.icon ? it.icon + ' ' : '') + it.text + '</span>'
      + '</div></div>';
  }).join('');

  const uniformAlertHtml = (guide && guide.uniform)
    ? '<div class="uniform-tomorrow-alert"><span>👕</span><span><b>LƯU Ý ĐỒNG PHỤC (' + dayName + '):</b> Ngày mai có môn GDTC, bé nhớ mặc <b>ÁO THỂ DỤC</b> nhé!</span></div>'
    : '';

  const html=`
    <div class="bag-card-head">
      <div>
        <div class="bag-title">
          <span>🎒</span>
          <span>Soạn cặp sách đến trường (${dayName})</span>
          <span class="bag-reward-pill">+5 ⭐ Thưởng tự giác</span>
        </div>
        <div style="font-size:12.5px;color:#047857;margin-top:2px">
          Các môn Lớp 1A4 trong ngày: ${subjectBadges}
        </div>
      </div>
      <div class="bag-progress-wrap">
        <span>Tiến độ: <b>${checkedCount}/${items.length}</b> (${pct}%)</span>
        <div class="bag-progress-bar"><i style="width:${pct}%"></i></div>
      </div>
    </div>
    ${uniformAlertHtml}
    <div class="bag-checklist">${checklistHtml}</div>
    <div style="margin-top:10px;font-size:12px;color:#64748b;line-height:1.4">
      💡 <b>Lời dặn cô giáo:</b> Bộ ghép chữ, bảng con sẽ để lại lớp cho gọn, nhẹ. Bút mực sẽ đem theo khi có thông báo của GV.
    </div>
    ${isAllDone ? '<div style="margin-top:12px;background:#d1fae5;border:1.5px dashed #10b981;border-radius:var(--radius-sm);padding:10px 14px;text-align:center;font-weight:800;color:#065f46">🎉 Hoan hô bé đã soạn cặp sách đầy đủ và ngăn nắp! Cặp sách đã sẵn sàng cho ngày mai rồi!</div>' : ''}
  `;

  if(todayContainer) todayContainer.innerHTML=html;
  if(scheduleContainer) scheduleContainer.innerHTML=html;
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

// 📖 BẢNG HƯỚNG DẪN SOẠN SÁCH VỞ THEO TỪNG NGÀY (LỚP 1A4)
function renderBagGuideTable(){
  const container=document.getElementById('scheduleBagGuideContainer');
  if(!container) return;

  const days=['2','3','4','5','6'];
  let colsHtml='';

  days.forEach(d=>{
    const g=GRADE1_BAG_GUIDE[d];
    if(!g) return;

    let booksHtml='';
    g.books.forEach(b=>{
      booksHtml+='<li><span>' + (b.icon||'📖') + '</span><span>' + safe(b.name) + '</span></li>';
    });

    let notebooksHtml='';
    g.notebooks.forEach(nb=>{
      notebooksHtml+='<li><span class="nb-swatch" style="background:' + nb.color + '"></span><span>' + safe(nb.name) + '</span></li>';
    });

    let suppliesHtml='';
    if(g.supplies && g.supplies.length){
      g.supplies.forEach(sp=>{
        suppliesHtml+='<li><span>' + (sp.icon||'🎨') + '</span><span>' + safe(sp.name) + '</span></li>';
      });
    }

    colsHtml+=`
      <div class="guide-day-col" style="border-top:4px solid ${g.themeColor}">
        <div class="guide-day-head" style="background:${g.themeColor}">
          <div>${g.dayLabel}</div>
          ${g.uniform ? '<span class="guide-uniform-badge">👕 Áo thể dục</span>' : ''}
        </div>
        <div class="guide-day-body">
          <div>
            <div class="guide-section-label">📚 Sách &amp; VBT</div>
            <ul class="guide-item-list">${booksHtml}</ul>
          </div>
          <div>
            <div class="guide-section-label">📓 Vở theo màu</div>
            <ul class="guide-item-list">${notebooksHtml}</ul>
          </div>
          ${suppliesHtml ? `
            <div>
              <div class="guide-section-label">🎨 Dụng cụ</div>
              <ul class="guide-item-list">${suppliesHtml}</ul>
            </div>
          ` : ''}
        </div>
        <div class="guide-day-footer">💡 ${safe(g.note)}</div>
      </div>
    `;
  });

  const fullHtml=`
    <div class="bag-guide-card">
      <div class="bag-guide-header">
        <div class="bag-guide-title">
          <span style="font-size:26px">🌈🎒</span>
          <div>
            <h3>HƯỚNG DẪN CÁCH SOẠN SÁCH VỞ THEO THỜI KHÓA BIỂU</h3>
            <div class="note" style="margin-top:2px;color:#475569">Áp dụng cho học sinh Lớp 1A4 • Chuẩn bảng dặn dò của cô giáo</div>
          </div>
        </div>
        <button class="btn" style="padding:8px 12px;font-size:13px;background:#f8fafc;border:1px solid var(--line)" onclick="window.print()">
          <span>🖨️</span>
          <span>In Bảng Hướng Dẫn</span>
        </button>
      </div>

      <div class="bag-guide-grid">
        ${colsHtml}
      </div>

      <div class="guide-notes-banner">
        <div style="font-size:14.5px;font-weight:900;margin-bottom:6px;display:flex;align-items:center;gap:6px">
          <span>📌</span> <span>LƯU Ý CHUNG CHO HỌC SINH LỚP 1A4:</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px;font-size:13px">
          <div>• 👕 <b>Thứ Tư và Thứ Năm:</b> Có tiết GDTC (Giáo dục thể chất), học sinh mặc <b>đồng phục thể dục (áo thể dục)</b>.</div>
          <div>• 🎒 <b>Dụng cụ học tập luôn mang theo:</b> Bảng con + phấn + đồ lau, bút chì (đã gọt nhọn 3 cây), cục tẩy, đồ chuốt, thước kẻ 20cm... <i>(Riêng bút mực, sẽ đem theo khi có thông báo của GV)</i>.</div>
          <div>• 🏫 <b>Đồ để lại lớp:</b> Bộ ghép chữ, bảng con sẽ để lại lớp cho gọn, nhẹ.</div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML=fullHtml;
}

// 5. 🐝 ĐỒNG HỒ CON ONG 15 PHÚT TẬP TRUNG (KIDS FOCUS TIMER)
let beeTimerSeconds = 15 * 60;
let beeTimerTotalSeconds = 15 * 60;
let beeTimerInterval = null;
let beeTimerRunning = false;

function openBeeTimerModal(autoStart = false){
  const modal = document.getElementById('beeTimerModal');
  if(modal) modal.classList.add('show');
  updateBeeTimerUI();
  if(autoStart && !beeTimerRunning){
    toggleBeeTimer();
  }
}

function closeBeeTimerModal(){
  const modal = document.getElementById('beeTimerModal');
  if(modal) modal.classList.remove('show');
}

function setBeeTimerMinutes(mins){
  const wasRunning = beeTimerRunning;
  if(beeTimerRunning){
    clearInterval(beeTimerInterval);
    beeTimerInterval = null;
    beeTimerRunning = false;
  }
  beeTimerSeconds = mins * 60;
  beeTimerTotalSeconds = mins * 60;
  updateBeeTimerUI();
  playPopSound();
  if(wasRunning){
    toggleBeeTimer();
  }
}

function toggleBeeTimer(){
  if(beeTimerRunning){
    clearInterval(beeTimerInterval);
    beeTimerInterval = null;
    beeTimerRunning = false;
    updateBeeTimerUI();
    showToast('⏸️ Đã tạm dừng đồng hồ Con Ong.');
  } else {
    if(beeTimerSeconds <= 0){
      beeTimerSeconds = beeTimerTotalSeconds;
    }
    beeTimerRunning = true;
    if(beeTimerInterval) clearInterval(beeTimerInterval);

    playPopSound();
    updateBeeTimerUI();

    beeTimerInterval = setInterval(()=>{
      beeTimerSeconds--;
      updateBeeTimerDisplay();

      if(beeTimerSeconds <= 0){
        clearInterval(beeTimerInterval);
        beeTimerInterval = null;
        beeTimerRunning = false;
        updateBeeTimerUI();
        onBeeTimerFinished();
      }
    }, 1000);

    showToast('🚀 Đồng hồ Con Ong đã bắt đầu đếm ngược!');
  }
}

function resetBeeTimer(){
  if(beeTimerInterval){
    clearInterval(beeTimerInterval);
    beeTimerInterval = null;
  }
  beeTimerRunning = false;
  beeTimerSeconds = beeTimerTotalSeconds;
  updateBeeTimerUI();
  showToast('🔄 Đã cài lại thời gian: ' + Math.floor(beeTimerTotalSeconds/60) + ' phút.');
}

function updateBeeTimerDisplay(){
  const m = Math.floor(beeTimerSeconds / 60);
  const s = beeTimerSeconds % 60;
  const str = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');

  const elModal = document.getElementById('beeTimerDisplayModal');
  if(elModal) elModal.textContent = str;

  const elInline = document.getElementById('beeTimerDisplayInline');
  if(elInline) elInline.textContent = str;

  const total = beeTimerTotalSeconds || 900;
  const elapsed = total - beeTimerSeconds;
  const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

  const barModal = document.getElementById('beeProgressFillModal');
  if(barModal) barModal.style.width = pct + '%';

  const barInline = document.getElementById('beeProgressFillInline');
  if(barInline) barInline.style.width = pct + '%';
}

function updateBeeTimerUI(){
  updateBeeTimerDisplay();

  const total = beeTimerTotalSeconds || 900;
  const text = beeTimerRunning ? '⏸️ Tạm dừng' : (beeTimerSeconds < total ? '▶️ Tiếp tục' : '🚀 Bắt đầu ngay');
  const btnModal = document.getElementById('beeStartBtnModal');
  if(btnModal) btnModal.innerHTML = text;

  const btnInline = document.getElementById('beeStartBtnInline');
  if(btnInline) btnInline.innerHTML = text;

  let statusHtml = '';
  if(beeTimerRunning){
    statusHtml = '<span style="color:#059669;font-weight:900">🟢 ĐANG ĐẾM NGƯỢC... 🐝</span>';
  } else if(beeTimerSeconds < total){
    statusHtml = '<span style="color:#d97706;font-weight:800">⏸️ ĐÃ TẠM DỪNG</span>';
  } else {
    statusHtml = '<span style="color:#854d0e;font-weight:800">⏱️ SẴN SÀNG (' + Math.floor(total/60) + ' PHÚT)</span>';
  }

  const statusModal = document.getElementById('beeStatusModal');
  if(statusModal) statusModal.innerHTML = statusHtml;

  const statusInline = document.getElementById('beeStatusInline');
  if(statusInline) statusInline.innerHTML = statusHtml;

  ['10','15','20'].forEach(min => {
    const isAct = (total === Number(min)*60);
    document.querySelectorAll('.bee-preset-' + min).forEach(btn => btn.classList.toggle('active', isAct));
  });
}

function onBeeTimerFinished(){
  playSchoolBell();
  triggerConfetti();
  const c = child();
  if(c){
    c.score += 5;
    if(!Array.isArray(c.pointHistory)) c.pointHistory = [];
    c.pointHistory.push({
      id: uid('bee'),
      type: 'study',
      subject: 'Kỹ năng sống',
      topic: 'Hoàn thành 15 phút tập trung học tập (Đồng hồ Con Ong)',
      amount: 5,
      note: 'Tập trung ngồi học nghiêm túc, không phân tâm!',
      reason: '[Kỹ năng sống] 15 phút tập trung học ngoan (+5 ⭐)',
      at: new Date().toISOString()
    });
    updateEarnedAchievements(c);
    save();
    render();
  }
  speakVietnamese('Hoan hô bé ' + (c ? c.name : 'con') + '! Đã hoàn thành 15 phút tập trung học tập rất ngoan! Con đứng dậy vươn vai và uống một cốc nước nhé!');
  showToast('🎉 XUẤT SẮC! Hoàn thành 15 phút tập trung! +5 ⭐');
}

function renderBeeTimer(){
  const wrap = document.getElementById('scheduleBeeTimerCard');
  if(!wrap) return;

  const m = Math.floor(beeTimerSeconds / 60);
  const s = beeTimerSeconds % 60;
  const str = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  const total = beeTimerTotalSeconds || 900;
  const elapsed = total - beeTimerSeconds;
  const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

  wrap.innerHTML = `
    <div style="font-size:18px;font-weight:900;color:#854d0e;display:flex;align-items:center;justify-content:center;gap:8px">
      <span class="flying-bee-icon" style="font-size:26px">🐝</span>
      <span>Đồng hồ Con Ong 15 Phút Tập Trung</span>
    </div>
    <div style="font-size:13px;color:#a16207;margin-top:4px">Dành riêng cho học sinh Lớp 1: Rèn luyện tính tự giác ngồi học tập trung từng đợt ngắn 15 phút!</div>
    
    <div id="beeStatusInline" style="margin-top:8px;font-size:13px">
      ${beeTimerRunning ? '<span style="color:#059669;font-weight:900">🟢 ĐANG ĐẾM NGƯỢC... 🐝</span>' : (beeTimerSeconds < total ? '<span style="color:#d97706;font-weight:800">⏸️ ĐÃ TẠM DỪNG</span>' : '<span style="color:#854d0e;font-weight:800">⏱️ SẴN SÀNG (' + Math.floor(total/60) + ' PHÚT)</span>')}
    </div>

    <div class="bee-timer-display" id="beeTimerDisplayInline">${str}</div>

    <div style="max-width:320px;margin:0 auto 12px;height:8px;background:#fef08a;border-radius:10px;overflow:hidden">
      <div id="beeProgressFillInline" style="height:100%;width:${pct}%;background:linear-gradient(90deg,#eab308,#ca8a04);transition:width 0.3s ease;border-radius:10px"></div>
    </div>

    <div style="display:flex;justify-content:center;gap:6px;margin-bottom:12px">
      <button class="tt-day-pill bee-preset-10 ${total===600?'active':''}" onclick="setBeeTimerMinutes(10)">10 phút</button>
      <button class="tt-day-pill bee-preset-15 ${total===900?'active':''}" onclick="setBeeTimerMinutes(15)">15 phút (Chuẩn)</button>
      <button class="tt-day-pill bee-preset-20 ${total===1200?'active':''}" onclick="setBeeTimerMinutes(20)">20 phút</button>
    </div>

    <div class="bee-timer-actions">
      <button class="bee-btn primary" id="beeStartBtnInline" onclick="toggleBeeTimer()">${beeTimerRunning ? '⏸️ Tạm dừng' : (beeTimerSeconds < total ? '▶️ Tiếp tục' : '🚀 Bắt đầu ngay')}</button>
      <button class="bee-btn secondary" onclick="resetBeeTimer()">🔄 Cài lại</button>
      <button class="bee-btn secondary" onclick="openBeeTimerModal(false)">🔍 Phóng to</button>
    </div>
    <div class="note" style="margin-top:10px;color:#a16207">Hoàn thành 15 phút sẽ thưởng ngay **+5 ⭐** và nhắc bé uống nước, vươn vai nghỉ ngơi!</div>
  `;
}

// Bắt đầu nhịp tick đếm ngược cho Nhắc báo giờ chở con đi học (mỗi 1 giây)
setInterval(updateRideReminderTick, 1000);

/* ============================================================
   🌟 TRUNG TÂM TƯƠNG TÁC 5 MÔN HỌC CHÍNH CỦA CON
   1. 👑 Truyện kể cho bé về Vĩ nhân
   2. 🧮 Toán tư duy
   3. 🎹 Học Đàn (Metronome & Bản nhạc)
   4. 🇬🇧 Tiếng Anh Little Fox
   5. 🐼 Tiếng Trung (Thẻ Pinyin & Phát âm)
   ============================================================ */

let activeCoreStudyTab = 'great_figures';
let activeGreatFigureIdx = 0;
let activeMathPuzzleIdx = 0;
let mathPuzzleAnswered = false;
let activeChineseTopic = 'all';
let activePianoBpm = 80;
let pianoMetronomeTimer = null;
let pianoMetronomeBeat = 0;

// 1. 👑 KHO TRUYỆN KỂ CHO BÉ VỀ VĨ NHÂN (VIỆT NAM & THẾ GIỚI)
const GREAT_FIGURES_STORIES = [
  {
    id: 'gf_luongthevinh',
    name: 'Lương Thế Vinh (Trạng Lường)',
    title: 'Cậu bé thông minh cân voi bằng thuyền',
    era: 'Danh nhân Việt Nam • Toán học & Trí tuệ',
    icon: '🐘⚖️',
    badgeColor: '#7c3aed',
    story: 'Ngày xưa có cậu bé Lương Thế Vinh rất ham học và thích suy nghĩ tìm tòi. Một lần, sứ thần nước ngoài mang sang một con voi khổng lồ và thách đố các quan trong triều làm sao cân được xem con voi nặng bao nhiêu mà không có chiếc cân nào đủ lớn. Ai nấy đều bối rối. Ông Lương Thế Vinh liền mỉm cười, cho dắt voi xuống một chiếc thuyền lớn rồi đánh dấu vạch nước mớm trên mạn thuyền. Sau đó, ông cho dắt voi lên bờ, rồi xếp từng tảng đá xuống thuyền cho đến khi thuyền chìm xuống đúng vạch dấu cũ. Cuối cùng, chỉ cần cân từng tảng đá rồi cộng lại là biết chính xác cân nặng của con voi! Ông còn viết cuốn "Đại thành Toán pháp" dạy trẻ em Việt Nam tính toán và đo đạc.',
    lesson: 'Khi gặp bài toán khó, đừng vội nản lòng! Hãy quan sát kỹ và suy nghĩ sáng tạo (tư duy thông minh), việc khó mấy cũng tìm ra cách giải.',
    question: 'Đố con: Vì sao ông Lương Thế Vinh không cân con voi trực tiếp mà lại dùng chiếc thuyền và những tảng đá?'
  },
  {
    id: 'gf_nguyenhien',
    name: 'Trạng nguyên Nguyễn Hiền',
    title: 'Cậu bé bắt đom đóm bỏ vào vỏ trứng để học bài',
    era: 'Danh nhân Việt Nam • Trạng nguyên 12 tuổi',
    icon: '✨🥚',
    badgeColor: '#059669',
    story: 'Nguyễn Hiền sinh ra trong một gia đình nghèo khó, không đủ tiền đi học hay mua dầu thắp đèn. Hàng ngày, cậu bé đi chăn trâu, đứng ngoài cửa lớp nghe thầy giảng bài rồi lấy nhánh cây viết chữ lên nền đất và trên lưng trâu. Buổi tối trời tối mịt, không có đèn dầu, Nguyễn Hiền liền đi bắt những con đom đóm phát sáng ngoài bờ cỏ, bỏ vào trong vỏ trứng gà rỗng để lấy ánh sáng đọc sách. Nhờ sự kiên trì và lòng hiếu học phi thường, năm mới 12 tuổi, Nguyễn Hiền đã thi đỗ Trạng nguyên — vị Trạng nguyên nhỏ tuổi nhất lịch sử nước ta!',
    lesson: 'Hoàn cảnh khó khăn không ngăn được người chăm học. Chỉ cần con tự giác và yêu thích việc học mỗi ngày, con sẽ tỏa sáng như ánh đom đóm của Trạng nguyên Nguyễn Hiền.',
    question: 'Đố con: Khi không có vở và không có đèn dầu, cậu bé Nguyễn Hiền đã làm cách nào để tập viết và đọc sách?'
  },
  {
    id: 'gf_macdinhchi',
    name: 'Lưỡng quốc Trạng nguyên Mạc Đĩnh Chi',
    title: 'Bông sen ngọc tỏa hương trong giếng vàng',
    era: 'Danh nhân Việt Nam • Nghị lực & Tự tin',
    icon: '🪷👑',
    badgeColor: '#db2777',
    story: 'Mạc Đĩnh Chi từ nhỏ nhà nghèo, dáng người thấp bé và khuôn mặt không được khôi ngô, nhưng cậu lại có trí nhớ siêu phàm và tấm lòng trong sáng. Hàng ngày kiếm củi giúp mẹ xong, cậu đều miệt mài ôn luyện kinh sử. Khi đi thi và đỗ đầu bảng (Trạng nguyên), nhà vua ban đầu thấy tướng mạo ông kém sắc nên còn ngần ngại. Mạc Đĩnh Chi liền làm bài phú "Bông sen trong giếng ngọc" để nói rằng: Giá trị thật sự của một con người nằm ở trí tuệ, đạo đức và tài năng tỏa hương thơm ngát chứ không phải ở vẻ bề ngoài. Về sau khi đi sứ, ông làm cả triều đình phương Bắc khâm phục và phong ông là "Lưỡng quốc Trạng nguyên" (Trạng nguyên của hai nước).',
    lesson: 'Vẻ đẹp đáng quý nhất của mỗi người là sự thông minh, lễ phép, chăm chỉ và tấm lòng nhân hậu bên trong.',
    question: 'Đố con: Qua hình ảnh "Bông sen trong giếng ngọc", ông Mạc Đĩnh Chi muốn nhắn nhủ điều gì đáng quý nhất ở một con người?'
  },
  {
    id: 'gf_edison',
    name: 'Nhà phát minh Thomas Edison',
    title: '10.000 lần kiên trì thắp sáng bóng đèn điện',
    era: 'Vĩ nhân Thế giới • Kiên trì không bỏ cuộc',
    icon: '💡🔬',
    badgeColor: '#d97706',
    story: 'Thuở nhỏ, Thomas Edison là một cậu bé vô cùng tò mò, lúc nào cũng hỏi "Tại sao?". Khi lớn lên, ông quyết tâm chế tạo ra chiếc bóng đèn điện có thể chiếu sáng lâu bền để mọi gia đình không còn phải sống trong bóng tối. Ông đã thử hàng nghìn chất liệu khác nhau làm dây tóc bóng đèn nhưng đều bị cháy đứt. Đến lần thử thứ 9.999 vẫn chưa thành công, có người hỏi ông: "Ông đã thất bại gần một vạn lần, sao không bỏ cuộc?". Edison mỉm cười đáp: "Tôi đâu có thất bại! Tôi đã khám phá ra 9.999 chất liệu chưa phù hợp đấy chứ!". Và rồi nhờ sự kiên trì ấy, chiếc bóng đèn điện rực sáng đã ra đời, thay đổi cả thế giới!',
    lesson: 'Làm sai một bài toán hay đánh đàn vấp một nốt nhạc không phải là thất bại, mà là một bước để con giỏi hơn ở lần thử tiếp theo!',
    question: 'Đố con: Khi làm bài khó hoặc tập đàn chưa quen tay, con sẽ học tập tinh thần gì của ông Thomas Edison?'
  },
  {
    id: 'gf_mozart',
    name: 'Thần đồng âm nhạc Mozart',
    title: 'Đôi bàn tay nhỏ chăm chỉ trên phím đàn Piano',
    era: 'Vĩ nhân Thế giới • Âm nhạc & Khổ luyện',
    icon: '🎹🎼',
    badgeColor: '#0284c7',
    story: 'Wolfgang Amadeus Mozart được cả thế giới gọi là "Thần đồng âm nhạc". Ngay từ khi mới 3–4 tuổi, cậu bé Mozart đã say mê lắng nghe từng nốt nhạc khi chị gái tập đàn và tự mình tìm ra những hợp âm vui tươi. Đến năm 5 tuổi, Mozart đã tự sáng tác được những bản nhạc nhỏ đầu tiên! Nhưng ít ai biết rằng, để đánh đàn hay như vậy, cậu bé Mozart đã luyện ngón trên phím đàn mỗi ngày với niềm vui và sự tập trung cao độ, ngay cả những buổi tối mùa đông lạnh giá. Ông từng nói: "Người ta tưởng nghệ thuật của tôi đến dễ dàng, nhưng không ai thấy tôi đã chăm chỉ luyện tập từng nốt nhạc như thế nào".',
    lesson: 'Năng khiếu chỉ là hạt giống nhỏ, chính sự chăm chỉ luyện đàn mỗi ngày mới giúp tiếng đàn của con ngân vang tuyệt vời!',
    question: 'Đố con: Điều gì đã giúp cậu bé Mozart trở thành nhà soạn nhạc vĩ đại được cả thế giới yêu mến?'
  },
  {
    id: 'gf_beethoven',
    name: 'Nhà soạn nhạc Ludwig van Beethoven',
    title: 'Lắng nghe âm nhạc bằng cả trái tim dũng cảm',
    era: 'Vĩ nhân Thế giới • Nghị lực phi thường',
    icon: '🎵❤️',
    badgeColor: '#4f46e5',
    story: 'Beethoven là một trong những nhà soạn nhạc vĩ đại nhất lịch sử nhân loại, tác giả của giai điệu "Khúc nhạc vui" (Ode to Joy) mà trẻ em khắp thế giới đều tập trên đàn Piano. Thế nhưng, một thử thách vô cùng lớn đã ập đến: đôi tai của ông nghe kém dần rồi không còn nghe thấy âm thanh nữa! Với một người nhạc sĩ, không nghe được là nỗi buồn khổng lồ. Nhưng Beethoven không đầu hàng số phận. Ông cưa ngắn chân đàn Piano xuống sàn gỗ, áp tai và cảm nhận độ rung của từng nốt nhạc truyền qua sàn nhà và qua trái tim mình để viết nên Bản giao hưởng số 9 bất hủ!',
    lesson: 'Dù gặp bất kỳ khó khăn nào, chỉ cần có ý chí mạnh mẽ và tình yêu thương trong trái tim, con đều có thể tạo nên điều kỳ diệu.',
    question: 'Đố con: Khi đôi tai không còn nghe rõ, ông Beethoven đã làm cách nào để tiếp tục sáng tác âm nhạc?'
  },
  {
    id: 'gf_mariecurie',
    name: 'Nhà bác học nữ Marie Curie',
    title: 'Cô gái nhỏ ham đọc sách và hai giải Nobel danh giá',
    era: 'Vĩ nhân Thế giới • Khoa học & Lòng nhân ái',
    icon: '🧪🏅',
    badgeColor: '#0d9488',
    story: 'Từ khi còn là cô bé nhỏ ở Ba Lan, Marie đã mê đọc sách đến mức khi ngồi vào bàn học là tập trung hoàn toàn, quên cả tiếng ồn xung quanh. Lớn lên, dù điều kiện học tập vô cùng thiếu thốn trong căn phòng áp mái mùa đông giá rét, bà vẫn miệt mài nghiên cứu Vật lý và Hóa học. Bà đã tìm ra hai nguyên tố mới là Polonium và Radium giúp ích to lớn cho việc chữa bệnh cứu người. Đặc biệt, bà không giữ bản quyền phát minh để làm giàu cho riêng mình mà tặng lại cho toàn nhân loại. Marie Curie trở thành người phụ nữ đầu tiên trên thế giới giành được hai giải Nobel ở hai lĩnh vực khoa học khác nhau!',
    lesson: 'Sự tập trung cao độ khi ngồi vào bàn học và tấm lòng nhân hậu biết sẻ chia sẽ giúp con trở thành người tài giỏi, có ích cho đời.',
    question: 'Đố con: Thói quen tốt nào từ thuở nhỏ đã giúp bà Marie Curie học giỏi và khám phá ra nhiều điều kỳ diệu?'
  },
  {
    id: 'gf_einstein',
    name: 'Nhà bác học Albert Einstein',
    title: 'Chiếc la bàn nhỏ và trí tưởng tượng bay xa',
    era: 'Vĩ nhân Thế giới • Tư duy & Trí tưởng tượng',
    icon: '🧭🌌',
    badgeColor: '#2563eb',
    story: 'Hồi còn nhỏ, Albert Einstein chậm nói hơn các bạn cùng trang lứa, nhưng cậu lại có đôi mắt luôn chăm chú quan sát mọi vật. Năm cậu 5 tuổi, khi bị ốm nằm trên giường, bố tặng cậu một chiếc la bàn nhỏ. Cậu bé Albert vô cùng kinh ngạc: "Vì sao kim la bàn dù xoay hướng nào cũng luôn chỉ về một phía? Chắc chắn có một lực vô hình kỳ diệu trong không gian!". Chính sự tò mò và thói quen tự suy nghĩ tìm quy luật ấy đã nuôi dưỡng trí tuệ của Einstein, giúp ông trở thành nhà vật lý vĩ đại nhất thế kỷ 20. Ông luôn khuyên các bạn nhỏ: "Trí tưởng tượng và việc đặt câu hỏi quan trọng hơn cả việc học thuộc lòng!".',
    lesson: 'Khi học Toán tư duy hay khám phá thế giới, con hãy luôn mạnh dạn đặt câu hỏi "Vì sao?" và dùng trí tưởng tượng của mình nhé!',
    question: 'Đố con: Món quà nào của bố đã khơi dậy trí tò mò khoa học của cậu bé Albert Einstein lúc 5 tuổi?'
  }
];

// 2. 🧮 BỘ CÂU ĐỐ TOÁN TƯ DUY TƯƠNG TÁC NHANH CHO BÉ
const MATH_LOGIC_PUZZLES = [
  {
    id: 'mp_1',
    title: 'Câu đố 1: Quy luật dãy số nhảy cóc 🐸',
    question: 'Chú ếch xanh nhảy trên các lá sen theo quy luật: 2 ➔ 4 ➔ 6 ➔ 8 ➔ [ ? ]. Đố con số tiếp theo trên lá sen là số mấy?',
    options: ['Số 9', 'Số 10', 'Số 11', 'Số 12'],
    correctIdx: 1,
    explanation: 'Chính xác! Mỗi lần chú ếch nhảy tăng thêm +2 đơn vị (số chẵn liên tiếp): 8 + 2 = 10!'
  },
  {
    id: 'mp_2',
    title: 'Câu đố 2: Quy luật hình học vui nhộn 🔺🔵',
    question: 'Con hãy nhìn chuỗi hạt của công chúa: 🍎 Táo — 🍌 Chuối — 🍎 Táo — 🍌 Chuối — 🍎 Táo — [ ? ]. Quả tiếp theo là quả gì?',
    options: ['🍎 Quả Táo', '🍌 Quả Chuối', '🍇 Chùm Nho', '🍉 Dưa Hấu'],
    correctIdx: 1,
    explanation: 'Giỏi lắm! Quy luật lặp lại xen kẽ 1 Táo rồi đến 1 Chuối. Sau quả Táo chắc chắn là 🍌 Quả Chuối!'
  },
  {
    id: 'mp_3',
    title: 'Câu đố 3: Toán tư duy đếm chân con vật 🐥🐰',
    question: 'Trong sân có 2 chú gà con 🐥🐥 và 1 chú thỏ trắng 🐰. Đố con có tất cả bao nhiêu cái chân đang chạy nhảy?',
    options: ['6 cái chân', '8 cái chân', '10 cái chân', '4 cái chân'],
    correctIdx: 1,
    explanation: 'Xuất sắc! Mỗi chú gà có 2 chân (2 + 2 = 4 chân), chú thỏ có 4 chân. Tổng cộng: 4 + 4 = 8 cái chân!'
  },
  {
    id: 'mp_4',
    title: 'Câu đố 4: Cân thăng bằng thông minh ⚖️',
    question: 'Biết 1 quả Dưa hấu 🍉 nặng bằng 2 quả Dứa 🍍🍍, mà 1 quả Dứa 🍍 lại nặng bằng 3 quả Táo 🍎🍎🍎. Hỏi 1 quả Dưa hấu nặng bằng mấy quả Táo?',
    options: ['4 quả Táo', '5 quả Táo', '6 quả Táo', '7 quả Táo'],
    correctIdx: 2,
    explanation: 'Tư duy siêu đỉnh! 1 quả Dứa = 3 quả Táo, vậy 2 quả Dứa sẽ bằng 3 + 3 = 6 quả Táo!'
  },
  {
    id: 'mp_5',
    title: 'Câu đố 5: Xếp hàng thông minh 👧👦',
    question: 'Bảo Nhi xếp hàng vào lớp: Đếm từ đầu hàng xuống thì Bảo Nhi đứng thứ 3, phía sau Bảo Nhi còn 2 bạn nữa. Hỏi hàng đó có tất cả mấy bạn?',
    options: ['4 bạn', '5 bạn', '6 bạn', '7 bạn'],
    correctIdx: 1,
    explanation: 'Tuyệt vời! Từ đầu hàng đến Bảo Nhi là 3 bạn, cộng thêm 2 bạn đứng sau: 3 + 2 = 5 bạn!'
  },
  {
    id: 'mp_6',
    title: 'Câu đố 6: Dãy số bậc thang tăng dần 🚀',
    question: 'Tìm số còn thiếu trong dãy số bí mật: 1 ➔ 2 ➔ 4 ➔ 7 ➔ 11 ➔ [ ? ] (Gợi ý: Khoảng cách tăng +1, +2, +3, +4...)',
    options: ['Số 14', 'Số 15', 'Số 16', 'Số 17'],
    correctIdx: 2,
    explanation: 'Quá thông minh! Quy luật cộng tăng dần: +1, +2, +3, +4, và bước tiếp theo là +5: 11 + 5 = 16!'
  }
];

// 3. 🎹 DANH SÁCH BÀI TẬP ĐÀN & GIAI ĐIỆU MẪU CHO BÉ
const PIANO_PRACTICE_SONGS = [
  {
    id: 'ps_hanon',
    name: 'Bài 1: Luyện ngón tròn đều (Đô - Rê - Mi - Fa - Sol)',
    notes: 'C4 - D4 - E4 - F4 - G4 - F4 - E4 - D4 - C4',
    freqs: [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66, 261.63],
    tip: 'Giữ cổ tay mềm mại, cong tròn 5 đầu ngón tay như đang cầm quả bóng nhỏ.'
  },
  {
    id: 'ps_twinkle',
    name: 'Bài 2: Ngôi sao nhỏ lấp lánh (Twinkle Twinkle Little Star)',
    notes: 'Đô Đô Sol Sol La La Sol — Fa Fa Mi Mi Rê Rê Đô',
    freqs: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63],
    tip: 'Đánh đều nhịp, ngân đủ 2 phách ở nốt Sol và nốt Đô cuối câu nhé!'
  },
  {
    id: 'ps_ode',
    name: 'Bài 3: Khúc nhạc vui (Ode to Joy — Beethoven)',
    notes: 'Mi Mi Fa Sol — Sol Fa Mi Rê — Đô Đô Rê Mi — Mi Rê Rê',
    freqs: [329.63, 329.63, 349.23, 392.00, 392.00, 349.23, 329.63, 293.66, 261.63, 261.63, 293.66, 329.63, 329.63, 293.66, 293.66],
    tip: 'Bản nhạc nổi tiếng của vĩ nhân Beethoven! Con bắt đầu bằng ngón giữa (ngón số 3) ở nốt Mi.'
  },
  {
    id: 'ps_jingle',
    name: 'Bài 4: Tiếng chuông ngân vang (Jingle Bells)',
    notes: 'Mi Mi Mi — Mi Mi Mi — Mi Sol Đô Rê Mi',
    freqs: [329.63, 329.63, 329.63, 329.63, 329.63, 329.63, 329.63, 392.00, 261.63, 293.66, 329.63],
    tip: 'Giữ nhịp vui tươi, rộn ràng và kết hợp tay trái đệm hợp âm Đô trưởng (C).'
  }
];

// 4. 🐼 BỘ THẺ TIẾNG TRUNG (PINYIN + HÁN TỰ + CÂU NGẮN CHO BÉ)
const CHINESE_KIDS_CARDS = [
  { id: 'cn_1', topic: 'Chào hỏi', hanzi: '你好', pinyin: 'Nǐ hǎo', vi: 'Xin chào', emoji: '👋', sentenceHz: '老师，你好！', sentencePy: 'Lǎoshī, nǐ hǎo!', sentenceVi: 'Em chào cô giáo ạ!' },
  { id: 'cn_2', topic: 'Chào hỏi', hanzi: '谢谢', pinyin: 'Xièxie', vi: 'Cảm ơn', emoji: '🙏', sentenceHz: '谢谢妈妈！', sentencePy: 'Xièxie māma!', sentenceVi: 'Con cảm ơn mẹ ạ!' },
  { id: 'cn_3', topic: 'Chào hỏi', hanzi: '再见', pinyin: 'Zàijiàn', vi: 'Tạm biệt', emoji: '😊', sentenceHz: '明天见，再见！', sentencePy: 'Míngtiān jiàn, zàijiàn!', sentenceVi: 'Hẹn gặp ngày mai, tạm biệt!' },
  { id: 'cn_4', topic: 'Gia đình', hanzi: '爸爸', pinyin: 'Bàba', vi: 'Bố / Ba', emoji: '👨', sentenceHz: '我爱爸爸。', sentencePy: 'Wǒ ài bàba.', sentenceVi: 'Con yêu bố.' },
  { id: 'cn_5', topic: 'Gia đình', hanzi: '妈妈', pinyin: 'Māma', vi: 'Mẹ / Má', emoji: '👩', sentenceHz: '妈妈很漂亮。', sentencePy: 'Māma hěn piàoliang.', sentenceVi: 'Mẹ rất xinh đẹp.' },
  { id: 'cn_6', topic: 'Số đếm', hanzi: '一 二 三', pinyin: 'Yī èr sān', vi: 'Một, Hai, Ba', emoji: '🔢', sentenceHz: '一二三，我们一起读！', sentencePy: 'Yī èr sān, wǒmen yìqǐ dú!', sentenceVi: 'Một hai ba, chúng mình cùng đọc!' },
  { id: 'cn_7', topic: 'Động vật', hanzi: '大熊猫', pinyin: 'Dà xióngmāo', vi: 'Gấu trúc lớn', emoji: '🐼', sentenceHz: '大熊猫喜欢吃竹子。', sentencePy: 'Dà xióngmāo xǐhuan chī zhúzi.', sentenceVi: 'Gấu trúc thích ăn trúc.' },
  { id: 'cn_8', topic: 'Động vật', hanzi: '小猫', pinyin: 'Xiǎo māo', vi: 'Mèo con', emoji: '🐱', sentenceHz: '这只小猫很可爱。', sentencePy: 'Zhè zhī xiǎo māo hěn kě\'ài.', sentenceVi: 'Chú mèo con này rất đáng yêu.' },
  { id: 'cn_9', topic: 'Đồ ăn', hanzi: '苹果', pinyin: 'Píngguǒ', vi: 'Quả táo', emoji: '🍎', sentenceHz: '我喜欢吃红苹果。', sentencePy: 'Wǒ xǐhuan chī hóng píngguǒ.', sentenceVi: 'Con thích ăn táo đỏ.' },
  { id: 'cn_10', topic: 'Đồ ăn', hanzi: '牛奶', pinyin: 'Niúnǎi', vi: 'Sữa tươi', emoji: '🥛', sentenceHz: '我每天喝牛奶。', sentencePy: 'Wǒ měitiān hē niúnǎi.', sentenceVi: 'Mỗi ngày con đều uống sữa.' }
];

function switchCoreStudyTab(tabId){
  activeCoreStudyTab = tabId;
  document.querySelectorAll('.core-subj-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-core-tab') === tabId);
  });
  renderCoreInteractiveHub();
}

function quickAwardCoreStudy(subject, topic, points){
  const c = child();
  if(!c) return alert('Chưa có hồ sơ bé.');
  const pts = Number(points || 15);
  c.score += pts;
  c.highestScore = Math.max(c.highestScore || 0, c.score);
  if(!Array.isArray(c.pointHistory)) c.pointHistory = [];
  c.pointHistory.push({
    id: uid('study'),
    type: 'study',
    subject: subject,
    topic: topic,
    amount: pts,
    note: 'Hoàn thành bài học trong Góc học tập 5 môn chính',
    reason: `[${subject}] ${topic} (+${pts} ⭐)`,
    at: new Date().toISOString()
  });
  updateEarnedAchievements(c);
  save();
  render();
  playChime('success');
  triggerConfetti();
  showToast(`🎉 Tuyệt vời! Đã thưởng +${pts} ⭐ môn ${subject} cho ${c.name}!`);
}

function selectGreatFigureStory(idx){
  activeGreatFigureIdx = idx;
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  renderCoreInteractiveHub();
}

function speakGreatFigureStory(idx){
  const st = GREAT_FIGURES_STORIES[idx] || GREAT_FIGURES_STORIES[0];
  if(!st) return;
  const fullText = `Câu chuyện về ${st.name}: ${st.title}. ${st.story} Bài học rút ra cho con là: ${st.lesson}`;
  speakVietnamese(fullText);
  showToast(`🔊 Đang đọc truyện: ${st.name}...`);
}

function stopGreatFigureSpeech(){
  try{
    if('speechSynthesis' in window) window.speechSynthesis.cancel();
    showToast('⏹ Đã dừng đọc truyện.');
  }catch(e){}
}

function selectMathPuzzle(idx){
  activeMathPuzzleIdx = idx;
  mathPuzzleAnswered = false;
  renderCoreInteractiveHub();
}

function answerMathPuzzle(optionIdx){
  const pz = MATH_LOGIC_PUZZLES[activeMathPuzzleIdx] || MATH_LOGIC_PUZZLES[0];
  const fb = document.getElementById('coreMathFeedback');
  if(!pz || !fb) return;

  if(optionIdx === pz.correctIdx){
    playChime('success');
    fb.style.display = 'block';
    fb.style.background = '#ecfdf5';
    fb.style.borderColor = '#6ee7b7';
    fb.style.color = '#065f46';
    fb.innerHTML = `🎉 <b>Chính xác!</b> ${safe(pz.explanation)} <button type="button" class="primary" style="margin-left:8px;padding:4px 10px;font-size:12px" onclick="quickAwardCoreStudy('Toán tư duy','Giải đúng: ${safe(pz.title)}',10)">+10 ⭐ Nhận thưởng ngay</button>`;
  } else {
    playPenaltySound();
    fb.style.display = 'block';
    fb.style.background = '#fef2f2';
    fb.style.borderColor = '#fecaca';
    fb.style.color = '#991b1b';
    fb.innerHTML = `💡 <b>Chưa đúng rồi!</b> Con thử suy nghĩ lại quy luật và chọn đáp án khác nhé!`;
  }
}

function playPianoMelodyDemo(songIdx){
  const song = PIANO_PRACTICE_SONGS[songIdx];
  if(!song || !Array.isArray(song.freqs)) return;
  try{
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if(!AudioCtx) return;
    const ctx = new AudioCtx();
    song.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const start = ctx.currentTime + i * 0.32;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.24, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.30);
    });
    showToast(`🎹 Đang phát giai điệu mẫu: ${song.name}`);
  }catch(e){}
}

function setPianoMetronomeBpm(bpm){
  activePianoBpm = bpm;
  if(pianoMetronomeTimer){
    togglePianoMetronome();
    togglePianoMetronome();
  }else{
    renderCoreInteractiveHub();
  }
}

function togglePianoMetronome(){
  if(pianoMetronomeTimer){
    clearInterval(pianoMetronomeTimer);
    pianoMetronomeTimer = null;
    renderCoreInteractiveHub();
    showToast('⏹ Đã tắt nhịp gõ đàn Metronome.');
    return;
  }
  pianoMetronomeBeat = 0;
  const intervalMs = Math.round(60000 / (activePianoBpm || 80));
  const tick = () => {
    try{
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if(AudioCtx){
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const isFirst = (pianoMetronomeBeat % 4 === 0);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isFirst ? 980 : 660, ctx.currentTime);
        gain.gain.setValueAtTime(isFirst ? 0.28 : 0.16, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      }
      const dot = document.getElementById('pianoBeatIndicator');
      if(dot){
        dot.textContent = `Nhịp ${(pianoMetronomeBeat % 4) + 1} / 4`;
        dot.style.transform = (pianoMetronomeBeat % 4 === 0) ? 'scale(1.12)' : 'scale(1)';
      }
      pianoMetronomeBeat++;
    }catch(e){}
  };
  tick();
  pianoMetronomeTimer = setInterval(tick, intervalMs);
  renderCoreInteractiveHub();
}

function speakChineseText(text, rate = 0.85){
  try{
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.startsWith('zh') || v.lang.includes('CN'));
    if(zhVoice) u.voice = zhVoice;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

function setChineseTopicFilter(topic){
  activeChineseTopic = topic;
  renderCoreInteractiveHub();
}

function renderCoreInteractiveHub(){
  const box = document.getElementById('coreInteractiveContainer');
  if(!box) return;

  if(activeCoreStudyTab === 'great_figures'){
    const st = GREAT_FIGURES_STORIES[activeGreatFigureIdx] || GREAT_FIGURES_STORIES[0];
    const pillsHtml = GREAT_FIGURES_STORIES.map((item, idx) => `
      <button type="button" class="gf-story-pill ${idx===activeGreatFigureIdx?'active':''}" onclick="selectGreatFigureStory(${idx})">
        <span>${item.icon}</span>
        <span>${safe(item.name)}</span>
      </button>
    `).join('');

    box.innerHTML = `
      <div class="gf-reader-card">
        <div class="gf-story-selector">${pillsHtml}</div>
        <div class="gf-story-main">
          <div class="gf-story-header">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="gf-story-avatar">${st.icon}</div>
              <div>
                <span class="study-badge" style="background:${st.badgeColor}">${safe(st.era)}</span>
                <h3 style="margin:4px 0 2px;font-size:19px;color:#1e1b4b">${safe(st.name)} — ${safe(st.title)}</h3>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="primary" style="padding:8px 14px;font-size:13px;background:linear-gradient(135deg,#7c3aed,#4f46e5)" onclick="speakGreatFigureStory(${activeGreatFigureIdx})">
                🔊 Đọc truyện cho bé nghe
              </button>
              <button type="button" class="secondary" style="padding:8px 12px;font-size:12.5px" onclick="stopGreatFigureSpeech()">
                ⏹ Dừng đọc
              </button>
            </div>
          </div>

          <div class="gf-story-content">${safe(st.story)}</div>

          <div class="gf-lesson-box">
            <div><b>💡 Bài học tấm gương cho con:</b> ${safe(st.lesson)}</div>
            <div style="margin-top:6px;color:#4338ca"><b>❓ Câu hỏi cùng con suy ngẫm:</b> ${safe(st.question)}</div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:12px">
            <div style="display:flex;gap:8px">
              <button type="button" class="secondary" style="padding:7px 12px;font-size:12.5px" onclick="selectGreatFigureStory(${(activeGreatFigureIdx - 1 + GREAT_FIGURES_STORIES.length) % GREAT_FIGURES_STORIES.length})">◀ Truyện trước</button>
              <button type="button" class="secondary" style="padding:7px 12px;font-size:12.5px" onclick="selectGreatFigureStory(${(activeGreatFigureIdx + 1) % GREAT_FIGURES_STORIES.length})">Truyện tiếp theo ▶</button>
            </div>
            <button type="button" class="primary" style="padding:9px 18px;font-size:13.5px;background:linear-gradient(135deg,#10b981,#059669)" onclick="quickAwardCoreStudy('Truyện kể Vĩ nhân','Nghe & hiểu truyện: ${safe(st.name)}',15)">
              🌟 Con đã nghe &amp; hiểu bài học (+15 ⭐)
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if(activeCoreStudyTab === 'math_logic'){
    const pz = MATH_LOGIC_PUZZLES[activeMathPuzzleIdx] || MATH_LOGIC_PUZZLES[0];
    const tabsHtml = MATH_LOGIC_PUZZLES.map((item, idx) => `
      <button type="button" class="gf-story-pill ${idx===activeMathPuzzleIdx?'active':''}" onclick="selectMathPuzzle(${idx})">
        🧮 Câu ${idx + 1}
      </button>
    `).join('');

    const optsHtml = pz.options.map((opt, oIdx) => `
      <button type="button" class="core-math-opt-btn" onclick="answerMathPuzzle(${oIdx})">
        <b>${String.fromCharCode(65 + oIdx)}.</b> ${safe(opt)}
      </button>
    `).join('');

    box.innerHTML = `
      <div class="gf-reader-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
          <div class="gf-story-selector" style="margin-bottom:0">${tabsHtml}</div>
          <button type="button" class="primary" style="padding:8px 14px;font-size:13px;background:linear-gradient(135deg,#10b981,#059669)" onclick="quickAwardCoreStudy('Toán tư duy','Hoàn thành bài luyện Toán tư duy hôm nay',15)">
            ⭐ Cộng +15 ⭐ Hoàn thành Toán tư duy
          </button>
        </div>

        <div class="gf-story-main">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <h3 style="margin:0;font-size:17px;color:#1e3a8a">🧩 ${safe(pz.title)}</h3>
            <button type="button" class="secondary" style="padding:6px 12px;font-size:12px" onclick="speakVietnamese('${safe(pz.question)}')">🔊 Đọc đề bài cho bé</button>
          </div>
          <div class="gf-story-content" style="font-size:15.5px;font-weight:700;margin-top:8px">${safe(pz.question)}</div>
          <div class="core-math-options-grid">${optsHtml}</div>
          <div id="coreMathFeedback" style="display:none;margin-top:12px;padding:10px 14px;border-radius:12px;border:1.5px solid"></div>
        </div>
      </div>
    `;
    return;
  }

  if(activeCoreStudyTab === 'piano_music'){
    const songsHtml = PIANO_PRACTICE_SONGS.map((s, idx) => `
      <div class="piano-song-card">
        <div>
          <div style="font-weight:800;font-size:14.5px;color:#1e293b">🎼 ${safe(s.name)}</div>
          <div style="font-size:13px;font-weight:800;color:#0284c7;margin:4px 0">🎹 Nốt nhạc: ${safe(s.notes)}</div>
          <div class="note">💡 ${safe(s.tip)}</div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          <button type="button" class="secondary" style="padding:7px 12px;font-size:12px" onclick="playPianoMelodyDemo(${idx})">🔊 Nghe giai điệu mẫu</button>
          <button type="button" class="primary" style="padding:7px 12px;font-size:12px;background:linear-gradient(135deg,#10b981,#059669)" onclick="quickAwardCoreStudy('Học Đàn','Luyện đàn bài: ${safe(s.name)}',15)">+15 ⭐ Đã tập xong</button>
        </div>
      </div>
    `).join('');

    box.innerHTML = `
      <div class="gf-reader-card">
        <div class="piano-metronome-bar">
          <div>
            <div style="font-weight:900;font-size:15px;color:#0f172a">🎹 Máy gõ nhịp Đàn (Metronome) &amp; Nhật ký luyện ngón</div>
            <div class="note">Bật máy gõ nhịp để con tập đàn đều tay, đúng tiết tấu</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <button type="button" class="gf-story-pill ${activePianoBpm===60?'active':''}" onclick="setPianoMetronomeBpm(60)">🐢 60 BPM (Chậm)</button>
            <button type="button" class="gf-story-pill ${activePianoBpm===80?'active':''}" onclick="setPianoMetronomeBpm(80)">🚶 80 BPM (Vừa)</button>
            <button type="button" class="gf-story-pill ${activePianoBpm===100?'active':''}" onclick="setPianoMetronomeBpm(100)">🐇 100 BPM (Nhanh)</button>
            <button type="button" class="primary" style="padding:8px 14px;font-size:13px;background:${pianoMetronomeTimer?'#ef4444':'#0284c7'}" onclick="togglePianoMetronome()">
              ${pianoMetronomeTimer ? '⏹ Dừng gõ nhịp' : '▶ Bật nhịp gõ Đàn'}
            </button>
            <span id="pianoBeatIndicator" style="font-weight:900;font-size:13px;color:#0284c7;padding:4px 10px;background:#e0f2fe;border-radius:10px;transition:transform 0.1s">Nhịp 1 / 4</span>
          </div>
        </div>
        <div class="piano-songs-list">${songsHtml}</div>
      </div>
    `;
    return;
  }

  if(activeCoreStudyTab === 'english_lf'){
    const allCards = typeof getAllFlashcards === 'function' ? getAllFlashcards() : [];
    const previewCard = allCards[fcCurrentIdx] || allCards[0] || {
      level: 1, series: 'Bat and Friends', topic: '🐾 Động vật', word: 'Elephant', pos: 'noun', ipa: '/ˈel.ɪ.fənt/', meaning: 'Con voi', emoji: '🐘',
      step1En: 'It is an elephant.', step1Vi: 'Đó là một con voi.',
      step2En: 'The big elephant has long ears.', step2Vi: 'Con voi to lớn có đôi tai dài.',
      step3En: 'I see a friendly elephant drinking water.', step3Vi: 'Con thấy một chú voi thân thiện đang uống nước.',
      passageEn: 'Look at the big elephant by the river! It has two large ears and a long trunk. The friendly elephant sprays cool water and plays with its friends.'
    };
    const sceneSvg = typeof buildLittleFoxSceneSVG === 'function'
      ? buildLittleFoxSceneSVG(previewCard, 1)
      : `<div style="font-size:64px;text-align:center">${previewCard.emoji || '🦊'}</div>`;

    box.innerHTML = `
      <div class="gf-reader-card" style="background:linear-gradient(135deg,#fff7ed 0%,#eff6ff 60%,#ecfdf5 100%)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px;margin-bottom:14px">
          <div style="max-width:640px">
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
              <span class="study-badge" style="background:linear-gradient(135deg,#ea580c,#f59e0b)">🦊 LITTLE FOX ENGLISH</span>
              <span class="study-badge" style="background:linear-gradient(135deg,#0284c7,#4f46e5)">CHUẨN LEVEL 1 → LEVEL 4</span>
              <span class="study-badge" style="background:linear-gradient(135deg,#059669,#10b981)">🔊 ÂM THANH BẢN XỨ &amp; TRANH ĐỌC</span>
            </div>
            <h3 style="margin:0 0 6px;font-size:19px;color:#1e293b">Bộ thẻ Hình Ảnh, Từng Ảnh Đọc &amp; Truyện Tranh Little Fox (Level 1–4)</h3>
            <p class="note" style="margin:0;font-size:13.5px;color:#334155">
              Con học chuẩn lộ trình <b>Little Fox Level 1–4</b>: Nhìn <b>tranh minh họa</b> ➔ Nghe <b>âm thanh chuẩn Mỹ/Anh</b> ➔ Đọc theo <b>4 bức ảnh tăng dần</b> (Từ đơn ➔ Câu ngắn ➔ Câu mở rộng ➔ Đoạn truyện ngắn có sáng chữ từng từ)!
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="primary" style="padding:11px 18px;font-size:14px;background:linear-gradient(135deg,#ea580c,#f59e0b)" onclick="showSection('flashcards')">
              🦊 Mở Toàn Bộ Thẻ Hình &amp; Từng Ảnh Đọc (${allCards.length} thẻ) ➔
            </button>
            <button type="button" class="secondary" style="padding:11px 15px;font-size:13.5px;font-weight:800;border-color:#fdba74;color:#c2410c;background:#fff" onclick="showSection('flashcards'); setFlashcardMode('guide')">
              📖 Mở Truyện Tranh Little Fox
            </button>
            <button type="button" class="primary" style="padding:11px 15px;font-size:13.5px;background:linear-gradient(135deg,#10b981,#059669)" onclick="quickAwardCoreStudy('Tiếng Anh','Hoàn thành bài học Tiếng Anh Little Fox',15)">
              ⭐ +15 ⭐ Đã học Tiếng Anh
            </button>
          </div>
        </div>

        <!-- Khung Học Nhanh Thẻ Hình & 4 Ảnh Đọc Ngay Tại Chỗ -->
        <div style="background:#fff;border:2px solid #fed7aa;border-radius:16px;padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px;align-items:center">
          <div style="border-radius:14px;overflow:hidden;border:1.5px solid #e2e8f0;height:165px;position:relative;cursor:pointer" onclick="speakEnglishText('${safe(previewCard.word)}', 0.9)">
            ${sceneSvg}
          </div>
          <div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px">
              <span class="lf-level-pill">🌱 Level ${previewCard.level || 1}</span>
              <span class="lf-series-pill">🦊 ${safe(previewCard.series || 'Little Fox')}</span>
              <span class="fc-topic-chip">${safe(previewCard.topic)}</span>
            </div>
            <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
              <span style="font-size:26px;font-weight:900;color:#1e1b4b">${safe(previewCard.word)}</span>
              <span style="font-size:14px;font-weight:700;color:#6366f1">${safe(previewCard.ipa || '')}</span>
              <span style="font-size:16px;font-weight:800;color:#059669">— ${safe(previewCard.meaning)}</span>
            </div>
            <div style="margin-top:8px;font-size:13.5px;line-height:1.55;background:#f8fafc;padding:9px 12px;border-radius:12px;border:1px solid #e2e8f0">
              <div>🖼️ <b>Ảnh 1:</b> ${safe(previewCard.step1En)} <span class="note">(${safe(previewCard.step1Vi)})</span></div>
              <div>🖼️ <b>Ảnh 2:</b> ${safe(previewCard.step2En)} <span class="note">(${safe(previewCard.step2Vi)})</span></div>
              <div>🖼️ <b>Ảnh 3:</b> ${safe(previewCard.step3En)} <span class="note">(${safe(previewCard.step3Vi)})</span></div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <button type="button" class="fc-speak-btn fc-speak-normal" onclick="speakEnglishText('${safe(previewCard.word)}', 0.9)">🔊 Đọc từ chuẩn</button>
              <button type="button" class="fc-speak-btn fc-speak-vi" onclick="speakEnglishText('${safe(previewCard.word)}. ${safe(previewCard.step1En)} ${safe(previewCard.step2En)} ${safe(previewCard.step3En)}', 0.85)">🎧 Nghe đọc cả 3 câu</button>
              <button type="button" class="secondary" style="padding:8px 14px;font-size:12.5px;font-weight:800" onclick="fcCurrentIdx = (fcCurrentIdx + 1) % ${Math.max(1, allCards.length)}; renderCoreStudyInteractive()">⏭ Đổi thẻ khác</button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if(activeCoreStudyTab === 'chinese_kids'){
    const topics = ['all', 'Chào hỏi', 'Gia đình', 'Số đếm', 'Động vật', 'Đồ ăn'];
    const topicBar = topics.map(tp => `
      <button type="button" class="gf-story-pill ${activeChineseTopic===tp?'active':''}" onclick="setChineseTopicFilter('${tp}')">
        ${tp === 'all' ? '🐼 Tất cả chủ đề' : tp}
      </button>
    `).join('');

    const cards = (activeChineseTopic === 'all')
      ? CHINESE_KIDS_CARDS
      : CHINESE_KIDS_CARDS.filter(c => c.topic === activeChineseTopic);

    const cardsHtml = cards.map(item => `
      <div class="cn-flashcard">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <span class="study-badge" style="background:#e11d48;font-size:10.5px">${safe(item.topic)}</span>
          <span style="font-size:28px">${item.emoji}</span>
        </div>
        <div class="cn-hanzi">${safe(item.hanzi)}</div>
        <div class="cn-pinyin">${safe(item.pinyin)}</div>
        <div class="cn-meaning">${safe(item.vi)}</div>
        <div class="cn-sentence-box">
          <div><b>💬 Câu mẫu:</b> ${safe(item.sentenceHz)}</div>
          <div style="color:#be123c;font-size:12px">${safe(item.sentencePy)}</div>
          <div class="note" style="font-size:11.5px">${safe(item.sentenceVi)}</div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button type="button" class="secondary" style="flex:1;padding:6px 8px;font-size:12px" onclick="speakChineseText('${safe(item.hanzi)}',0.85)">🔊 Đọc từ</button>
          <button type="button" class="secondary" style="flex:1;padding:6px 8px;font-size:12px" onclick="speakChineseText('${safe(item.sentenceHz)}',0.8)">🗣️ Đọc câu</button>
        </div>
      </div>
    `).join('');

    box.innerHTML = `
      <div class="gf-reader-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
          <div class="gf-story-selector" style="margin-bottom:0">${topicBar}</div>
          <button type="button" class="primary" style="padding:8px 14px;font-size:13px;background:linear-gradient(135deg,#e11d48,#f43f5e)" onclick="quickAwardCoreStudy('Tiếng Trung','Hoàn thành luyện từ & phát âm Tiếng Trung',15)">
            ⭐ Cộng +15 ⭐ Học Tiếng Trung
          </button>
        </div>
        <div class="cn-cards-grid">${cardsHtml}</div>
      </div>
    `;
    return;
  }

  if(activeCoreStudyTab === 'study_games'){
    box.innerHTML = '<div id="gameArenaContainer"></div>';
    if(window.EduGames && typeof window.EduGames.mountToContainer === 'function'){
      window.EduGames.mountToContainer('gameArenaContainer');
    }
    return;
  }
}

/* ============================================================
   🦊 BỘ THẺ TIẾNG ANH CHUẨN LITTLE FOX (LEVEL 1 → LEVEL 4)
   HỆ THỐNG TRANH MINH HỌA TRỰC QUAN, TỪNG ẢNH ĐỌC & ÂM THANH BẢN XỨ
   ============================================================ */
const LITTLE_FOX_LEVELS = [
  {
    id: 1,
    name: 'Level 1',
    badge: '🌱 Level 1: Khởi đầu (Phonics & Câu 3–5 từ)',
    shortTitle: '🌱 Level 1 — Khởi đầu',
    seriesList: 'Bat and Friends • Tire Town School • Dino Buddies • Sam and Lucky',
    color: '#10b981',
    pattern: 'It is a... / I see a... / This is my... / The [noun] can...',
    guide: 'Chuẩn Little Fox Level 1 (Pre-A1): Giúp bé nhận diện từ qua tranh lớn, phát âm chuẩn Phonics và nói câu đơn 3–5 từ.'
  },
  {
    id: 2,
    name: 'Level 2',
    badge: '🌿 Level 2: Cơ bản (Tính từ & Giao tiếp 5–8 từ)',
    shortTitle: '🌿 Level 2 — Cơ bản',
    seriesList: 'Bird and Kip • Meet the Animals • Space Patrol •Sally’s Silly Hair',
    color: '#0ea5e9',
    pattern: 'The [adj] [noun] is... / I like to... / Every morning, I...',
    guide: 'Chuẩn Little Fox Level 2 (A1): Mở rộng câu miêu tả màu sắc, cảm xúc, hành động hàng ngày và đọc đoạn truyện ngắn 3 câu.'
  },
  {
    id: 3,
    name: 'Level 3',
    badge: '🌳 Level 3: Mở rộng (Câu ghép & Kể chuyện 8–12 từ)',
    shortTitle: '🌳 Level 3 — Mở rộng',
    seriesList: 'Rocket Girl • The Carter Family • Sam’s Backpack • Princess Pigtoria',
    color: '#8b5cf6',
    pattern: 'When I..., I can... / Because..., we... / Let’s find out how...',
    guide: 'Chuẩn Little Fox Level 3 (A1+): Luyện đọc các câu chuyện phiêu lưu, câu ghép chỉ nguyên nhân - kết quả và thời gian.'
  },
  {
    id: 4,
    name: 'Level 4',
    badge: '👑 Level 4: Tự tin thuyết trình & Khoa học (12–16 từ)',
    shortTitle: '👑 Level 4 — Thuyết trình',
    seriesList: 'Great Inventors • Amazing Science • Sherlock Holmes • Journey to the West',
    color: '#f59e0b',
    pattern: 'Even though..., they never give up / Scientists discovered that...',
    guide: 'Chuẩn Little Fox Level 4 (A2): Đọc hiểu truyện khoa học, danh nhân thế giới, suy luận logic và thuyết trình đoạn văn dài.'
  }
];

const DEFAULT_FLASHCARDS = [
  // ======================== LEVEL 1 (8 THẺ CHUẨN LITTLE FOX) ========================
  {
    id: 'lf_1', level: 1, series: 'Meet the Animals', topic: '🐾 Động vật',
    word: 'Elephant', pos: 'noun', ipa: '/ˈel.ɪ.fənt/', meaning: 'Con voi', emoji: '🐘',
    sceneTheme: 'savanna',
    step1En: 'It is an elephant.', step1Vi: 'Đó là một chú voi.', step1Icons: ['🐘','🌿'],
    step2En: 'The big elephant has a long trunk.', step2Vi: 'Chú voi to lớn có một chiếc vòi dài.', step2Icons: ['🐘','💧','🌴'],
    step3En: 'I see a friendly elephant drinking cool water.', step3Vi: 'Con thấy một chú voi thân thiện đang uống nước mát.', step3Icons: ['🐘','💦','☀️','🐦'],
    passageTitle: 'The Friendly Elephant',
    passageEn: 'Look at the big elephant! It has two large ears and a long trunk. The elephant sprays cool water in the river. It is very happy and friendly.',
    passageVi: 'Hãy nhìn chú voi to lớn kìa! Chú có đôi tai to và chiếc vòi dài. Chú voi phun nước mát dưới dòng sông. Chú rất vui vẻ và thân thiện.',
    passageIcons: ['🐘','🌊','🌴','☀️']
  },
  {
    id: 'lf_2', level: 1, series: 'Bat and Friends', topic: '🐾 Động vật',
    word: 'Rabbit', pos: 'noun', ipa: '/ˈræb.ɪt/', meaning: 'Con thỏ', emoji: '🐰',
    sceneTheme: 'meadow',
    step1En: 'I see a rabbit.', step1Vi: 'Con thấy một chú thỏ.', step1Icons: ['🐰','🌱'],
    step2En: 'The white rabbit can hop very fast.', step2Vi: 'Chú thỏ trắng có thể nhảy rất nhanh.', step2Icons: ['🐰','💨','🌼'],
    step3En: 'The cute white rabbit likes eating crunchy carrots.', step3Vi: 'Chú thỏ trắng đáng yêu thích ăn cà rốt giòn.', step3Icons: ['🐰','🥕','🥕','🌷'],
    passageTitle: 'Hop, Little Rabbit!',
    passageEn: 'Here comes a little white rabbit. It has two long pink ears. Hop, hop, hop! The rabbit jumps across the green grass to find a sweet carrot.',
    passageVi: 'Một chú thỏ trắng nhỏ đang tới kìa. Chú có đôi tai dài màu hồng. Nhảy, nhảy, nhảy! Chú thỏ nhảy qua bãi cỏ xanh để tìm củ cà rốt ngọt.',
    passageIcons: ['🐰','🥕','🌿','🌸']
  },
  {
    id: 'lf_3', level: 1, series: 'Bat and Friends', topic: '🍎 Đồ ăn & Quả',
    word: 'Apple', pos: 'noun', ipa: '/ˈæp.əl/', meaning: 'Quả táo', emoji: '🍎',
    sceneTheme: 'orchard',
    step1En: 'This is an apple.', step1Vi: 'Đây là một quả táo.', step1Icons: ['🍎','🍃'],
    step2En: 'It is a sweet and shiny red apple.', step2Vi: 'Đó là một quả táo đỏ bóng và ngọt ngào.', step2Icons: ['🍎','✨','🌳'],
    step3En: 'I eat a crunchy red apple every morning.', step3Vi: 'Con ăn một quả táo đỏ giòn mỗi buổi sáng.', step3Icons: ['👧','🍎','☀️','🥣'],
    passageTitle: 'The Red Apple on the Tree',
    passageEn: 'A red apple grows high on the green tree. Farmer Cow picks the shiny apple. Crunch, crunch! Sharing the sweet apple with friends is so much fun.',
    passageVi: 'Một quả táo đỏ mọc trên cây xanh cao. Bác Bò hái quả táo bóng loáng. Rộp, rộp! Chia sẻ quả táo ngọt với bạn bè thật là vui.',
    passageIcons: ['🌳','🍎','🐮','🐦']
  },
  {
    id: 'lf_4', level: 1, series: 'Sam and Lucky', topic: '👨‍👩‍👧 Gia đình',
    word: 'Mother', pos: 'noun', ipa: '/ˈmʌð.ər/', meaning: 'Mẹ', emoji: '👩',
    sceneTheme: 'home',
    step1En: 'She is my mother.', step1Vi: 'Cô ấy là mẹ của con.', step1Icons: ['👩','💖'],
    step2En: 'My mother has a warm and gentle smile.', step2Vi: 'Mẹ của con có nụ cười ấm áp và dịu dàng.', step2Icons: ['👩','😊','🌸'],
    step3En: 'I love my mother and help her every day.', step3Vi: 'Con yêu mẹ và phụ giúp mẹ mỗi ngày.', step3Icons: ['👩','👧','🏠','💕'],
    passageTitle: 'My Kind Mother',
    passageEn: 'My mother wakes me up every morning with a warm hug. She makes yummy breakfast for our family. After school, I help my mother clean the table.',
    passageVi: 'Mẹ đánh thức con dậy mỗi sáng bằng một cái ôm ấm áp. Mẹ nấu bữa sáng ngon lành cho cả nhà. Sau giờ học, con giúp mẹ lau dọn bàn ăn.',
    passageIcons: ['👩','👧','🍳','🏡']
  },
  {
    id: 'lf_5', level: 1, series: 'Tire Town School', topic: '🏫 Trường học',
    word: 'School', pos: 'noun', ipa: '/skuːl/', meaning: 'Trường học', emoji: '🏫',
    sceneTheme: 'school',
    step1En: 'I go to school.', step1Vi: 'Con đi đến trường học.', step1Icons: ['🏫','🎒'],
    step2En: 'My school is big, bright, and happy.', step2Vi: 'Trường học của con rộng lớn, tươi sáng và vui vẻ.', step2Icons: ['🏫','🚌','☀️'],
    step3En: 'I learn new things with my friends at school.', step3Vi: 'Con học nhiều điều mới cùng bạn bè ở trường.', step3Icons: ['🏫','👧','👦','📚'],
    passageTitle: 'Fun at Tire Town School',
    passageEn: 'Ding-dong! The school bell rings. Eddy and his friends go into the classroom. They sing songs, draw pictures, and read fun books at school.',
    passageVi: 'Kính coong! Chuông trường reo vang. Eddy và các bạn bước vào lớp học. Các bạn hát vang, vẽ tranh và đọc những cuốn sách thú vị ở trường.',
    passageIcons: ['🏫','🔔','📚','🎨']
  },
  {
    id: 'lf_6', level: 1, series: 'Sam and Lucky', topic: '🐾 Động vật',
    word: 'Puppy', pos: 'noun', ipa: '/ˈpʌp.i/', meaning: 'Chú cún con', emoji: '🐶',
    sceneTheme: 'meadow',
    step1En: 'This is my puppy.', step1Vi: 'Đây là chú cún con của con.', step1Icons: ['🐶','🦴'],
    step2En: 'The little puppy wags its tail happily.', step2Vi: 'Chú cún nhỏ vẫy đuôi một cách vui vẻ.', step2Icons: ['🐶','🐾','🎾'],
    step3En: 'Sam plays catch with his clever puppy in the park.', step3Vi: 'Sam chơi ném bóng với chú cún thông minh trong công viên.', step3Icons: ['👦','🐶','🎾','🌳'],
    passageTitle: 'Lucky the Clever Puppy',
    passageEn: 'Sam has a brown puppy named Lucky. Woof, woof! Lucky loves running after the yellow ball. When Sam comes home, Lucky runs to greet him at the door.',
    passageVi: 'Sam có một chú cún màu nâu tên là Lucky. Gâu, gâu! Lucky rất thích chạy đuổi theo quả bóng vàng. Khi Sam về nhà, Lucky chạy ra cửa đón cậu.',
    passageIcons: ['🐶','👦','🎾','🏡']
  },
  {
    id: 'lf_7', level: 1, series: 'Dino Buddies', topic: '🍎 Đồ ăn & Quả',
    word: 'Banana', pos: 'noun', ipa: '/bəˈnæn.ə/', meaning: 'Quả chuối', emoji: '🍌',
    sceneTheme: 'orchard',
    step1En: 'I like bananas.', step1Vi: 'Con thích những quả chuối.', step1Icons: ['🍌','😋'],
    step2En: 'The ripe banana is yellow and soft.', step2Vi: 'Quả chuối chín có màu vàng và mềm thơm.', step2Icons: ['🍌','🐒','🌴'],
    step3En: 'Little Monkey peels a sweet yellow banana for lunch.', step3Vi: 'Khỉ nhỏ bóc một quả chuối vàng ngọt ngào cho bữa trưa.', step3Icons: ['🐵','🍌','🧺','☀️'],
    passageTitle: 'Yellow Bananas for Lunch',
    passageEn: 'Look at the bunch of yellow bananas! Peel the banana one, two, three. It tastes soft and sweet. Eating bananas gives us energy to play all day.',
    passageVi: 'Hãy nhìn nải chuối vàng ươm kìa! Bóc vỏ chuối một, hai, ba. Chuối mềm và ngọt lịm. Ăn chuối giúp chúng mình có nhiều năng lượng vui chơi cả ngày.',
    passageIcons: ['🍌','🐵','🌴','✨']
  },
  {
    id: 'lf_8', level: 1, series: 'Mrs. Kelly’s Class', topic: '🌈 Thiên nhiên',
    word: 'Flower', pos: 'noun', ipa: '/ˈflaʊ.ər/', meaning: 'Bông hoa', emoji: '🌸',
    sceneTheme: 'meadow',
    step1En: 'Look at the flower.', step1Vi: 'Hãy nhìn bông hoa kìa.', step1Icons: ['🌸','🌱'],
    step2En: 'The pink flower smells very sweet.', step2Vi: 'Bông hoa màu hồng có hương thơm ngát.', step2Icons: ['🌸','🐝','☀️'],
    step3En: 'Many colorful flowers bloom in our spring garden.', step3Vi: 'Nhiều bông hoa rực rỡ nở rộ trong khu vườn mùa xuân.', step3Icons: ['🌸','🌷','🌻','🦋'],
    passageTitle: 'Flowers in the Garden',
    passageEn: 'Spring is here! Red, yellow, and pink flowers open their petals in the sun. Little bees and butterflies fly around the pretty flowers all morning.',
    passageVi: 'Mùa xuân đến rồi! Hoa đỏ, hoa vàng và hoa hồng bung nở dưới ánh nắng. Những chú ong nhỏ và bướm xinh bay lượn quanh những bông hoa suốt buổi sáng.',
    passageIcons: ['🌸','🌻','🦋','🐝']
  },

  // ======================== LEVEL 2 (8 THẺ CHUẨN LITTLE FOX) ========================
  {
    id: 'lf_9', level: 2, series: 'Sam’s Backpack', topic: '🏫 Trường học',
    word: 'Backpack', pos: 'noun', ipa: '/ˈbæk.pæk/', meaning: 'Cặp sách / Ba lô', emoji: '🎒',
    sceneTheme: 'school',
    step1En: 'I have a backpack.', step1Vi: 'Con có một chiếc cặp sách.', step1Icons: ['🎒','📘'],
    step2En: 'My blue backpack is always neat and clean.', step2Vi: 'Chiếc cặp màu xanh của con luôn gọn gàng sạch sẽ.', step2Icons: ['🎒','✏️','📏'],
    step3En: 'I pack my books and pencil case into my backpack every night.', step3Vi: 'Con xếp sách vở và hộp bút vào cặp mỗi tối trước khi đi ngủ.', step3Icons: ['🎒','📚','✏️','🌙'],
    passageTitle: 'Getting Ready for School',
    passageEn: 'Every evening, I check my school timetable carefully. I put my notebooks, textbooks, and ruler into my blue backpack. In the morning, I am ready for school!',
    passageVi: 'Mỗi buổi tối, con đều kiểm tra thời khóa biểu cẩn thận. Con xếp vở, sách giáo khoa và thước kẻ vào chiếc ba lô xanh. Sáng hôm sau, con đã sẵn sàng đến trường!',
    passageIcons: ['🎒','📚','✏️','🏫']
  },
  {
    id: 'lf_10', level: 2, series: 'Bird and Kip', topic: '🎹 Âm nhạc & Đàn',
    word: 'Piano', pos: 'noun', ipa: '/piˈæn.əʊ/', meaning: 'Đàn dương cầm (Piano)', emoji: '🎹',
    sceneTheme: 'music',
    step1En: 'I play the piano.', step1Vi: 'Con chơi đàn Piano.', step1Icons: ['🎹','🎵'],
    step2En: 'I practice playing the piano every evening.', step2Vi: 'Con luyện tập đàn Piano vào mỗi buổi tối.', step2Icons: ['🎹','🎶','👧'],
    step3En: 'Playing gentle songs on the piano makes my whole family happy.', step3Vi: 'Đánh những bản nhạc êm dịu trên đàn Piano làm cả nhà con vui vẻ.', step3Icons: ['🎹','🎶','👨‍👩‍👧','🌟'],
    passageTitle: 'Sweet Piano Melody',
    passageEn: 'I sit straight at the piano and place my fingers on the black and white keys. Do, Re, Mi, Fa, Sol! When I practice with patience, the melody sounds clear and beautiful.',
    passageVi: 'Con ngồi thẳng lưng bên cây đàn Piano và đặt ngón tay lên những phím đen trắng. Đô, Rê, Mi, Pha, Son! Khi con kiên trì luyện tập, giai điệu vang lên thật trong trẻo và tuyệt đẹp.',
    passageIcons: ['🎹','🎼','🎵','👏']
  },
  {
    id: 'lf_11', level: 2, series: 'Bird and Kip', topic: '🌈 Thiên nhiên',
    word: 'Rainbow', pos: 'noun', ipa: '/ˈreɪn.bəʊ/', meaning: 'Cầu vồng', emoji: '🌈',
    sceneTheme: 'sky',
    step1En: 'Look at the rainbow!', step1Vi: 'Hãy nhìn cầu vồng kìa!', step1Icons: ['🌈','☁️'],
    step2En: 'The giant rainbow has seven bright colors.', step2Vi: 'Chiếc cầu vồng khổng lồ có bảy sắc màu rực rỡ.', step2Icons: ['🌈','☀️','🌤️'],
    step3En: 'A beautiful rainbow appears in the blue sky after the summer rain.', step3Vi: 'Một chiếc cầu vồng tuyệt đẹp hiện lên trên bầu trời xanh sau cơn mưa mùa hè.', step3Icons: ['🌈','🌦️','🐦','🌳'],
    passageTitle: 'Colors After the Rain',
    passageEn: 'Pitter-patter! The rain stops falling, and the warm sun comes out again. Bird looks up at the sky and shouts, "Look, Kip! A bright rainbow is shining above our tree!"',
    passageVi: 'Lộp độp! Cơn mưa vừa tạnh và mặt trời ấm áp lại ló rạng. Chim nhỏ ngước nhìn bầu trời và reo lên: "Nhìn kìa Kip! Một chiếc cầu vồng rực rỡ đang tỏa sáng trên ngọn cây của chúng mình!"',
    passageIcons: ['🌈','☀️','🐦','🐿️']
  },
  {
    id: 'lf_12', level: 2, series: 'Meet the Animals', topic: '🐾 Động vật',
    word: 'Dolphin', pos: 'noun', ipa: '/ˈdɒl.fɪn/', meaning: 'Cá heo', emoji: '🐬',
    sceneTheme: 'ocean',
    step1En: 'The dolphin can swim.', step1Vi: 'Cá heo có thể bơi lội.', step1Icons: ['🐬','🌊'],
    step2En: 'The smart dolphin jumps high above the waves.', step2Vi: 'Chú cá heo thông minh nhảy vọt cao trên những con sóng.', step2Icons: ['🐬','💦','☀️'],
    step3En: 'Friendly dolphins swim together and talk with clicking sounds.', step3Vi: 'Những chú cá heo thân thiện bơi cùng nhau và trò chuyện bằng âm thanh lách cách.', step3Icons: ['🐬','🐬','🌊','🐚'],
    passageTitle: 'Dancers of the Ocean',
    passageEn: 'Dolphins live in the deep blue ocean. They are very smart and playful animals. Splash! They leap into the air and dive back into the sparkling water together.',
    passageVi: 'Cá heo sống trong đại dương xanh thẳm. Chúng là loài động vật rất thông minh và tinh nghịch. Tõm! Chúng tung mình lên không trung rồi cùng nhau lặn xuống làn nước lấp lánh.',
    passageIcons: ['🐬','🌊','☀️','🐠']
  },
  {
    id: 'lf_13', level: 2, series: 'Sam and Lucky', topic: '🍎 Đồ ăn & Quả',
    word: 'Breakfast', pos: 'noun', ipa: '/ˈbrek.fəst/', meaning: 'Bữa ăn sáng', emoji: '🍳',
    sceneTheme: 'home',
    step1En: 'I eat my breakfast.', step1Vi: 'Con ăn bữa sáng của mình.', step1Icons: ['🍳','🥛'],
    step2En: 'We have warm bread, eggs, and milk for breakfast.', step2Vi: 'Chúng con ăn bánh mì ấm, trứng và sữa cho bữa sáng.', step2Icons: ['🍞','🍳','🥛'],
    step3En: 'Eating a healthy breakfast gives me energy to study well at school.', step3Vi: 'Ăn bữa sáng lành mạnh giúp con có nhiều năng lượng để học tốt ở trường.', step3Icons: ['👧','🍳','🥛','💪'],
    passageTitle: 'A Healthy Morning Breakfast',
    passageEn: 'Good morning! Something smells delicious in the kitchen. Dad made scrambled eggs, toast, and a glass of warm milk. I finish my breakfast with a big smile before school.',
    passageVi: 'Chào buổi sáng! Có mùi gì thơm phức trong bếp thế nhỉ. Bố đã làm trứng chiên, bánh mì nướng và một ly sữa ấm. Con ăn hết bữa sáng với nụ cười thật tươi trước giờ đi học.',
    passageIcons: ['🍳','🍞','🥛','☀️']
  },
  {
    id: 'lf_14', level: 2, series: 'Tire Town School', topic: '🚀 Hành động',
    word: 'Share', pos: 'verb', ipa: '/ʃeər/', meaning: 'Chia sẻ', emoji: '🤝',
    sceneTheme: 'school',
    step1En: 'I share with friends.', step1Vi: 'Con chia sẻ với bạn bè.', step1Icons: ['🤝','🧸'],
    step2En: 'I like to share my crayons and storybooks.', step2Vi: 'Con thích chia sẻ bút màu và sách truyện của mình.', step2Icons: ['🖍️','📖','👫'],
    step3En: 'When we share our toys and snacks, everyone feels happy.', step3Vi: 'Khi chúng mình chia sẻ đồ chơi và bánh kẹo, ai cũng cảm thấy vui vẻ.', step3Icons: ['👧','👦','🍪','💖'],
    passageTitle: 'Sharing Makes Us Happy',
    passageEn: 'Poppy forgot her colored pencils today. "Here, you can use mine!" says Eddy with a smile. Sharing with classmates makes drawing time twice as fun!',
    passageVi: 'Hôm nay Poppy quên mang hộp chì màu. "Nè, bạn dùng chung với mình nhé!" Eddy mỉm cười nói. Biết sẻ chia với bạn cùng lớp làm giờ học vẽ vui gấp đôi!',
    passageIcons: ['🤝','🖍️','🎨','😊']
  },
  {
    id: 'lf_15', level: 2, series: 'Space Patrol', topic: '🚀 Hành động',
    word: 'Listen', pos: 'verb', ipa: '/ˈlɪs.ən/', meaning: 'Lắng nghe', emoji: '👂',
    sceneTheme: 'school',
    step1En: 'Listen to the teacher.', step1Vi: 'Hãy lắng nghe cô giáo.', step1Icons: ['👂','👩‍🏫'],
    step2En: 'I listen carefully to every English story.', step2Vi: 'Con lắng nghe chăm chú từng câu chuyện Tiếng Anh.', step2Icons: ['🎧','📖','🦊'],
    step3En: 'When I listen closely and repeat aloud, my pronunciation gets better.', step3Vi: 'Khi con nghe kỹ và đọc to theo, phát âm của con ngày càng chuẩn hơn.', step3Icons: ['🎧','🗣️','🌟','🏆'],
    passageTitle: 'Listening with Both Ears',
    passageEn: 'In class, we sit quietly and listen to our teacher tell a story. Outside, we listen to the birds singing in the trees. Good listeners learn new things every single day!',
    passageVi: 'Trong lớp học, chúng con ngồi ngay ngắn và lắng nghe cô giáo kể chuyện. Ngoài sân, chúng con lắng nghe tiếng chim hót trên cành. Người biết lắng nghe tốt sẽ học được điều mới mỗi ngày!',
    passageIcons: ['👂','👩‍🏫','🐦','🎶']
  },
  {
    id: 'lf_16', level: 2, series: 'Meet the Animals', topic: '🌈 Thiên nhiên',
    word: 'Butterfly', pos: 'noun', ipa: '/ˈbʌt.ə.flaɪ/', meaning: 'Con bướm', emoji: '🦋',
    sceneTheme: 'meadow',
    step1En: 'It is a butterfly.', step1Vi: 'Đó là một chú bướm.', step1Icons: ['🦋','🌸'],
    step2En: 'The colorful butterfly has orange and black wings.', step2Vi: 'Chú bướm sặc sỡ có đôi cánh màu cam và đen.', step2Icons: ['🦋','🌺','✨'],
    step3En: 'A graceful butterfly dances from flower to flower in the sunny garden.', step3Vi: 'Một chú bướm duyên dáng bay lượn từ bông hoa này sang bông hoa khác trong vườn nắng.', step3Icons: ['🦋','🌻','🌷','☀️'],
    passageTitle: 'Wings in the Sunshine',
    passageEn: 'Flutter, flutter! A bright butterfly lands softly on a yellow sunflower. It drinks sweet nectar and spreads its colorful wings in the warm morning sunshine.',
    passageVi: 'Chập chờn, chập chờn! Một chú bướm rực rỡ đậu nhẹ nhàng lên bông hoa hướng dương vàng. Chú hút mật ngọt và sải đôi cánh sặc sỡ dưới ánh nắng mai ấm áp.',
    passageIcons: ['🦋','🌻','☀️','🌿']
  },

  // ======================== LEVEL 3 (8 THẺ CHUẨN LITTLE FOX) ========================
  {
    id: 'lf_17', level: 3, series: 'Rocket Girl', topic: '🚀 Hành động',
    word: 'Explore', pos: 'verb', ipa: '/ɪkˈsplɔːr/', meaning: 'Khám phá, thám hiểm', emoji: '🧭',
    sceneTheme: 'space',
    step1En: 'Let us explore together!', step1Vi: 'Chúng mình cùng nhau khám phá nào!', step1Icons: ['🧭','🗺️'],
    step2En: 'We love to explore new books and science museums.', step2Vi: 'Chúng con thích khám phá những cuốn sách mới và bảo tàng khoa học.', step2Icons: ['🧭','📚','🔭'],
    step3En: 'When I read English stories, I can explore the wonderful world around me.', step3Vi: 'Khi đọc truyện Tiếng Anh, con có thể khám phá thế giới kỳ diệu quanh mình.', step3Icons: ['👧','📖','🌍','🚀'],
    passageTitle: 'Exploring New Worlds',
    passageEn: 'Put on your backpack and grab your compass! Whether we walk through a green forest or read a book about outer space, there is always something exciting to explore.',
    passageVi: 'Hãy đeo ba lô lên và cầm lấy chiếc la bàn nào! Dù chúng ta đi dạo qua khu rừng xanh hay đọc một cuốn sách về vũ trụ, luôn có những điều kỳ thú đang chờ đón ta khám phá.',
    passageIcons: ['🧭','🌍','🚀','🔭']
  },
  {
    id: 'lf_18', level: 3, series: 'The Carter Family', topic: '💖 Cảm xúc & Tính cách',
    word: 'Patient', pos: 'adj', ipa: '/ˈpeɪ.ʃənt/', meaning: 'Kiên nhẫn, bền bỉ', emoji: '🌱',
    sceneTheme: 'music',
    step1En: 'I am always patient.', step1Vi: 'Con luôn là người kiên nhẫn.', step1Icons: ['🌱','⏳'],
    step2En: 'Be patient and calm when solving difficult math puzzles.', step2Vi: 'Hãy kiên nhẫn và bình tĩnh khi giải các câu đố Toán khó.', step2Icons: ['🧮','🌱','💡'],
    step3En: 'Because I am patient, I can master new songs on the piano step by step.', step3Vi: 'Vì kiên nhẫn nên con có thể tập thành thạo từng bước những bản nhạc Piano mới.', step3Icons: ['🎹','🌱','🌟','🏆'],
    passageTitle: 'The Power of Patience',
    passageEn: 'At first, Oliver could not tie his shoelaces or play the new piano song. His dad smiled and said, "Take a deep breath and be patient." After practicing slowly, Oliver did it!',
    passageVi: 'Lúc đầu, Oliver chưa biết buộc dây giày hay đánh bản nhạc Piano mới. Bố mỉm cười bảo: "Con hãy hít thở sâu và kiên nhẫn nhé." Sau khi tập chậm rãi từng bước, Oliver đã làm được!',
    passageIcons: ['🌱','🎹','👦','🌟']
  },
  {
    id: 'lf_19', level: 3, series: 'Rocket Girl', topic: '💖 Cảm xúc & Tính cách',
    word: 'Brave', pos: 'adj', ipa: '/breɪv/', meaning: 'Dũng cảm, gan dạ', emoji: '🦁',
    sceneTheme: 'space',
    step1En: 'Roxy is very brave.', step1Vi: 'Roxy rất dũng cảm.', step1Icons: ['🦸‍♀️','🦁'],
    step2En: 'A brave child is not afraid to try new things.', step2Vi: 'Một em bé dũng cảm không ngại thử sức với những điều mới mẻ.', step2Icons: ['🦁','👧','🌟'],
    step3En: 'Rocket Girl flies into the sky because she is brave and ready to help everyone.', step3Vi: 'Cô bé Tên Lửa bay vút lên bầu trời vì cô ấy dũng cảm và sẵn sàng giúp đỡ mọi người.', step3Icons: ['🦸‍♀️','🚀','🌆','✨'],
    passageTitle: 'Rocket Girl to the Rescue!',
    passageEn: 'Whenever Metro City is in trouble, Roxy puts on her cape and becomes Rocket Girl. Even when the challenge looks big, she stays brave, thinks smart, and saves the day!',
    passageVi: 'Bất cứ khi nào thành phố Metro gặp rắc rối, Roxy lại khoác áo choàng và hóa thân thành Cô bé Tên Lửa. Dù thử thách có lớn đến đâu, cô bé vẫn dũng cảm, nhanh trí và giải cứu mọi người!',
    passageIcons: ['🦸‍♀️','🚀','🌟','🏙️']
  },
  {
    id: 'lf_20', level: 3, series: 'The Carter Family', topic: '🏫 Trường học',
    word: 'Library', pos: 'noun', ipa: '/ˈlaɪ.brər.i/', meaning: 'Thư viện', emoji: '📚',
    sceneTheme: 'school',
    step1En: 'We visit the library.', step1Vi: 'Chúng con đến thăm thư viện.', step1Icons: ['📚','🏛️'],
    step2En: 'The quiet library has thousands of interesting storybooks.', step2Vi: 'Thư viện yên tĩnh có hàng ngàn cuốn truyện thú vị.', step2Icons: ['📚','📖','🤫'],
    step3En: 'Every Saturday afternoon, Emmy borrows adventure books from the town library.', step3Vi: 'Mỗi chiều thứ Bảy, Emmy đều mượn sách phiêu lưu từ thư viện thị trấn.', step3Icons: ['👧','📚','🏛️','☀️'],
    passageTitle: 'Treasure in the Library',
    passageEn: 'The town library is Emmy’s favorite place. Tall bookshelves are filled with fairy tales, science books, and comics. She chooses two books and reads quietly by the sunny window.',
    passageVi: 'Thư viện thị trấn là nơi yêu thích nhất của Emmy. Những kệ sách cao đầy ắp truyện cổ tích, sách khoa học và truyện tranh. Cô bé chọn hai cuốn và ngồi đọc yên lặng bên khung cửa sổ ngập nắng.',
    passageIcons: ['🏛️','📚','👧','🪟']
  },
  {
    id: 'lf_21', level: 3, series: 'The Carter Family', topic: '🌈 Thiên nhiên',
    word: 'Mountain', pos: 'noun', ipa: '/ˈmaʊn.tɪn/', meaning: 'Ngọn núi', emoji: '⛰️',
    sceneTheme: 'savanna',
    step1En: 'The mountain is high.', step1Vi: 'Ngọn núi thật là cao.', step1Icons: ['⛰️','☁️'],
    step2En: 'White clouds float around the green mountain peak.', step2Vi: 'Những đám mây trắng trôi bồng bềnh quanh đỉnh núi xanh.', step2Icons: ['⛰️','☁️','🌲'],
    step3En: 'Our family hiked up the mountain trail and enjoyed the fresh morning air.', step3Vi: 'Gia đình con đã leo theo đường mòn lên núi và tận hưởng không khí trong lành buổi sớm.', step3Icons: ['⛰️','🥾','👨‍👩‍👧','☀️'],
    passageTitle: 'Hiking Up the Mountain',
    passageEn: 'Step by step, the Carter family climbs the winding mountain path. Tall pine trees smell fresh and cool. At the top of the mountain, they can see the whole valley below!',
    passageVi: 'Từng bước một, gia đình nhà Carter leo lên con đường mòn uốn lượn trên núi. Những hàng thông cao tỏa hương thơm mát. Đứng trên đỉnh núi, cả nhà có thể ngắm nhìn toàn bộ thung lũng bên dưới!',
    passageIcons: ['⛰️','🌲','🥾','🌅']
  },
  {
    id: 'lf_22', level: 3, series: 'Princess Pigtoria', topic: '🎹 Âm nhạc & Đàn',
    word: 'Melody', pos: 'noun', ipa: '/ˈmel.ə.di/', meaning: 'Giai điệu', emoji: '🎶',
    sceneTheme: 'music',
    step1En: 'What a sweet melody!', step1Vi: 'Thật là một giai điệu ngọt ngào!', step1Icons: ['🎶','🎵'],
    step2En: 'The cheerful melody makes everyone want to dance.', step2Vi: 'Giai điệu vui tươi khiến ai cũng muốn nhún nhảy.', step2Icons: ['🎶','🎻','💃'],
    step3En: 'When I play my favorite melody on the piano, my heart feels peaceful.', step3Vi: 'Khi con tấu lên giai điệu yêu thích trên đàn Piano, lòng con cảm thấy thật bình yên.', step3Icons: ['🎹','🎶','💖','✨'],
    passageTitle: 'The Magic Melody',
    passageEn: 'A soft melody floats through the castle hall. Notes rise and fall like gentle waves on the sea. Everyone stops talking to listen to the wonderful music.',
    passageVi: 'Một giai điệu êm dịu ngân vang khắp sảnh lâu đài. Từng nốt nhạc trầm bổng như những làn sóng dịu êm trên biển. Mọi người đều ngừng trò chuyện để lắng nghe bản nhạc tuyệt vời ấy.',
    passageIcons: ['🎶','🎹','🏰','✨']
  },
  {
    id: 'lf_23', level: 3, series: 'Sam’s Backpack', topic: '🚀 Hành động',
    word: 'Practice', pos: 'verb', ipa: '/ˈpræk.tɪs/', meaning: 'Luyện tập, thực hành', emoji: '🎯',
    sceneTheme: 'school',
    step1En: 'I practice every day.', step1Vi: 'Con luyện tập mỗi ngày.', step1Icons: ['🎯','📅'],
    step2En: 'We practice speaking English with clear voices.', step2Vi: 'Chúng con luyện nói Tiếng Anh với giọng đọc to rõ.', step2Icons: ['🗣️','🇬🇧','🌟'],
    step3En: 'If you practice a little bit every day, you will become great at any skill.', step3Vi: 'Nếu con luyện tập từng chút mỗi ngày, con sẽ trở nên xuất sắc ở bất kỳ kỹ năng nào.', step3Icons: ['🎯','🎹','📚','🏆'],
    passageTitle: 'Practice Makes Progress',
    passageEn: 'Nobody is an expert on the very first day. Whether you are learning English, math, or the piano, daily practice is the secret key that unlocks your talent!',
    passageVi: 'Không ai trở thành chuyên gia ngay từ ngày đầu tiên cả. Dù con đang học Tiếng Anh, Toán tư duy hay đàn Piano, sự luyện tập mỗi ngày chính là chiếc chìa khóa mở ra tài năng của con!',
    passageIcons: ['🎯','🔑','🌟','🏆']
  },
  {
    id: 'lf_24', level: 3, series: 'The Carter Family', topic: '👨‍👩‍👧 Gia đình',
    word: 'Together', pos: 'adv', ipa: '/təˈɡeð.ər/', meaning: 'Cùng nhau', emoji: '👨‍👩‍👧‍👦',
    sceneTheme: 'home',
    step1En: 'We play together.', step1Vi: 'Chúng con chơi đùa cùng nhau.', step1Icons: ['👫','🎈'],
    step2En: 'Our family cooks dinner and reads stories together.', step2Vi: 'Gia đình con cùng nhau nấu bữa tối và đọc truyện.', step2Icons: ['👨‍👩‍👧','🍲','📖'],
    step3En: 'Working together as a team helps us finish hard tasks quickly and happily.', step3Vi: 'Cùng nhau hợp sức làm việc nhóm giúp chúng con hoàn thành việc khó thật nhanh và vui vẻ.', step3Icons: ['🤝','👨‍👩‍👧','🏡','🌟'],
    passageTitle: 'Better Together',
    passageEn: 'Cleaning the living room alone takes a long time. But when Mom, Dad, and the children work together, the house sparkles in just ten minutes! Everything is better together.',
    passageVi: 'Dọn dẹp phòng khách một mình sẽ mất rất nhiều thời gian. Nhưng khi Bố, Mẹ và các con cùng chung tay làm việc, ngôi nhà đã sạch bóng chỉ trong mười phút! Mọi việc đều tuyệt hơn khi làm cùng nhau.',
    passageIcons: ['👨‍👩‍👧','🏡','✨','💖']
  },

  // ======================== LEVEL 4 (8 THẺ CHUẨN LITTLE FOX) ========================
  {
    id: 'lf_25', level: 4, series: 'Great Inventors', topic: '👑 Vĩ nhân & Ước mơ',
    word: 'Inventor', pos: 'noun', ipa: '/ɪnˈven.tər/', meaning: 'Nhà phát minh', emoji: '💡',
    sceneTheme: 'science',
    step1En: 'He is a great inventor.', step1Vi: 'Ông ấy là một nhà phát minh vĩ đại.', step1Icons: ['💡','👨‍🔬'],
    step2En: 'Thomas Edison was a hardworking inventor who created the light bulb.', step2Vi: 'Thomas Edison là nhà phát minh chăm chỉ đã tạo ra bóng đèn điện.', step2Icons: ['💡','⚡','🔬'],
    step3En: 'Like great inventors, I never give up when I face difficult challenges.', step3Vi: 'Giống như các nhà phát minh vĩ đại, con không bao giờ bỏ cuộc khi gặp thử thách khó khăn.', step3Icons: ['💡','🚀','🌟','🏆'],
    passageTitle: 'The Boy Who Asked "Why?"',
    passageEn: 'An inventor looks at problems and imagines creative solutions. Thomas Edison failed over a thousand times before his electric light bulb finally glowed. His curiosity changed the world forever!',
    passageVi: 'Một nhà phát minh luôn nhìn vào các vấn đề và tưởng tượng ra giải pháp sáng tạo. Thomas Edison đã thất bại hơn một ngàn lần trước khi bóng đèn điện thực sự phát sáng. Trí tò mò của ông đã thay đổi thế giới mãi mãi!',
    passageIcons: ['💡','🔬','⚡','🌍']
  },
  {
    id: 'lf_26', level: 4, series: 'Amazing Science', topic: '💖 Cảm xúc & Tính cách',
    word: 'Curious', pos: 'adj', ipa: '/ˈkjʊə.ri.əs/', meaning: 'Ham học hỏi, tò mò khám phá', emoji: '🔍',
    sceneTheme: 'science',
    step1En: 'I am a curious learner.', step1Vi: 'Con là một người học ham tìm tòi.', step1Icons: ['🔍','👧'],
    step2En: 'Curious children always ask smart questions about nature.', step2Vi: 'Những đứa trẻ ham học hỏi luôn đặt ra những câu hỏi thông minh về thiên nhiên.', step2Icons: ['🔍','🌿','🦋'],
    step3En: 'Being curious helps scientists discover how stars shine and how plants grow.', step3Vi: 'Sự ham học hỏi giúp các nhà khoa học khám phá vì sao các vì sao tỏa sáng và cây cối lớn lên.', step3Icons: ['🔭','🌱','⭐','🔬'],
    passageTitle: 'Keep Asking Questions!',
    passageEn: 'Why is the sky blue? How do birds fly across the ocean? Being curious is the beginning of all wisdom. Every time you ask "Why?" and search for the answer, your brain grows stronger!',
    passageVi: 'Tại sao bầu trời lại màu xanh? Làm thế nào chim có thể bay qua đại dương? Lòng ham học hỏi là khởi nguồn của mọi tri thức. Mỗi khi con đặt câu hỏi "Tại sao?" và tìm câu trả lời, trí tuệ của con lại thêm tỏa sáng!',
    passageIcons: ['🔍','🔭','🌍','🧠']
  },
  {
    id: 'lf_27', level: 4, series: 'Sherlock Holmes', topic: '🚀 Hành động',
    word: 'Discover', pos: 'verb', ipa: '/dɪˈskʌv.ər/', meaning: 'Khám phá, phát hiện ra', emoji: '🔭',
    sceneTheme: 'space',
    step1En: 'What did you discover?', step1Vi: 'Bạn đã phát hiện ra điều gì thế?', step1Icons: ['🔭','✨'],
    step2En: 'Astronomers use telescopes to discover distant planets.', step2Vi: 'Các nhà thiên văn học dùng kính thiên văn để phát hiện những hành tinh xa xôi.', step2Icons: ['🔭','🪐','🌌'],
    step3En: 'When we observe carefully, we can discover amazing secrets hidden in nature.', step3Vi: 'Khi quan sát tỉ mỉ, chúng ta có thể phát hiện ra những bí mật kỳ diệu ẩn giấu trong tự nhiên.', step3Icons: ['🔍','🌿','🐞','🌟'],
    passageTitle: 'Secrets of the Night Sky',
    passageEn: 'Through a powerful telescope, tiny dots of light turn into giant planets with shining rings. There are still millions of wonders in the universe waiting for young minds to discover!',
    passageVi: 'Qua chiếc kính thiên văn mạnh mẽ, những chấm sáng nhỏ li ti hiện ra thành các hành tinh khổng lồ với vành đai lấp lánh. Vẫn còn hàng triệu điều kỳ diệu trong vũ trụ đang chờ các trí óc trẻ thơ khám phá!',
    passageIcons: ['🔭','🪐','🌟','🚀']
  },
  {
    id: 'lf_28', level: 4, series: 'Journey to the West', topic: '💖 Cảm xúc & Tính cách',
    word: 'Courage', pos: 'noun', ipa: '/ˈkʌr.ɪdʒ/', meaning: 'Lòng dũng cảm, nghị lực', emoji: '🛡️',
    sceneTheme: 'savanna',
    step1En: 'Have courage and be kind.', step1Vi: 'Hãy có lòng dũng cảm và sự tử tế.', step1Icons: ['🛡️','💖'],
    step2En: 'It takes courage to speak in front of the whole class.', step2Vi: 'Cần có lòng dũng cảm để tự tin thuyết trình trước cả lớp.', step2Icons: ['🎙️','👧','👏'],
    step3En: 'With wisdom and courage, the travelers overcame every obstacle on their long journey.', step3Vi: 'Bằng trí tuệ và lòng dũng cảm, đoàn lữ hành đã vượt qua mọi thử thách trên chặng đường dài.', step3Icons: ['🛡️','⛰️','☀️','🏆'],
    passageTitle: 'True Courage Inside You',
    passageEn: 'Courage does not mean you never feel scared. True courage means taking a step forward and doing the right thing even when your heart is beating fast!',
    passageVi: 'Lòng dũng cảm không có nghĩa là con chẳng bao giờ thấy lo sợ. Dũng cảm thực sự là dám bước tới phía trước và làm điều đúng đắn ngay cả khi tim mình đang đập rộn ràng!',
    passageIcons: ['🛡️','🦁','🌟','🏆']
  },
  {
    id: 'lf_29', level: 4, series: 'Amazing Science', topic: '🌈 Thiên nhiên',
    word: 'Environment', pos: 'noun', ipa: '/ɪnˈvaɪ.rən.mənt/', meaning: 'Môi trường thiên nhiên', emoji: '🌍',
    sceneTheme: 'meadow',
    step1En: 'Protect our environment.', step1Vi: 'Hãy bảo vệ môi trường của chúng ta.', step1Icons: ['🌍','🌱'],
    step2En: 'Planting trees and recycling help keep the environment clean.', step2Vi: 'Trồng cây và tái chế giúp giữ gìn môi trường xanh sạch.', step2Icons: ['🌳','♻️','🌍'],
    step3En: 'Every small action we take today protects the environment for animals and people.', step3Vi: 'Mỗi hành động nhỏ chúng ta làm hôm nay đều góp phần bảo vệ môi trường cho muôn loài và con người.', step3Icons: ['🌍','🐘','🐬','💚'],
    passageTitle: 'Guardians of Planet Earth',
    passageEn: 'Earth is our shared home. When we turn off unused lights, save water, and plant green trees, we keep the air fresh and the oceans clean. Together, we can protect our environment!',
    passageVi: 'Trái Đất là ngôi nhà chung của chúng ta. Khi tắt đèn khi không sử dụng, tiết kiệm nước và trồng thêm cây xanh, chúng ta giữ cho bầu không khí trong lành và đại dương sạch đẹp. Cùng nhau, chúng mình bảo vệ môi trường nhé!',
    passageIcons: ['🌍','🌳','♻️','💧']
  },
  {
    id: 'lf_30', level: 4, series: 'Great Inventors', topic: '👑 Vĩ nhân & Ước mơ',
    word: 'Knowledge', pos: 'noun', ipa: '/ˈnɒl.ɪdʒ/', meaning: 'Tri thức, kiến thức', emoji: '🎓',
    sceneTheme: 'school',
    step1En: 'Knowledge is a treasure.', step1Vi: 'Tri thức là một kho báu.', step1Icons: ['🎓','💎'],
    step2En: 'Reading good books every day builds deep knowledge.', step2Vi: 'Đọc những cuốn sách hay mỗi ngày giúp bồi đắp tri thức sâu rộng.', step2Icons: ['📚','🧠','✨'],
    step3En: 'When we combine knowledge with kindness, we can help make the world a better place.', step3Vi: 'Khi kết hợp tri thức với lòng nhân ái, chúng ta có thể giúp thế giới trở nên tốt đẹp hơn.', step3Icons: ['🎓','🌍','🤝','🌟'],
    passageTitle: 'The Treasure That Grows',
    passageEn: 'Money can be spent, but knowledge stays with you forever. The more you read, listen, and share what you learn with others, the brighter your knowledge shines!',
    passageVi: 'Tiền bạc có thể tiêu hết, nhưng tri thức sẽ ở bên con mãi mãi. Con càng chăm đọc sách, lắng nghe và chia sẻ điều mình học được với mọi người, kho báu tri thức của con càng tỏa sáng rực rỡ!',
    passageIcons: ['🎓','📚','💡','🌟']
  },
  {
    id: 'lf_31', level: 4, series: 'Olympic Champions', topic: '👑 Vĩ nhân & Ước mơ',
    word: 'Persevere', pos: 'verb', ipa: '/ˌpɜː.sɪˈvɪər/', meaning: 'Kiên trì vượt khó đến cùng', emoji: '🏔️',
    sceneTheme: 'savanna',
    step1En: 'We must persevere!', step1Vi: 'Chúng ta phải kiên trì đến cùng!', step1Icons: ['🏔️','💪'],
    step2En: 'Great athletes persevere through rain, wind, and tired days.', step2Vi: 'Những vận động viên xuất sắc luôn bền bỉ vượt qua mưa gió và những ngày mệt mỏi.', step2Icons: ['🏃‍♀️','🌧️','🏅'],
    step3En: 'Even when a lesson feels difficult at first, I persevere until I understand it completely.', step3Vi: 'Ngay cả khi bài học ban đầu có vẻ khó, con vẫn kiên trì cho đến khi hiểu thật thấu đáo.', step3Icons: ['👧','📚','🏔️','🏆'],
    passageTitle: 'Step by Step to the Top',
    passageEn: 'Climbing a high mountain is never easy. Sometimes your legs feel tired, and the top looks far away. But if you persevere and take one brave step at a time, you will reach the summit!',
    passageVi: 'Chinh phục một ngọn núi cao chưa bao giờ là điều dễ dàng. Đôi khi chân con thấy mỏi và đỉnh núi trông thật xa. Nhưng nếu con kiên trì bền bỉ bước từng bước vững vàng, chắc chắn con sẽ chạm tới đỉnh vinh quang!',
    passageIcons: ['🏔️','🥾','🌅','🏆']
  },
  {
    id: 'lf_32', level: 4, series: 'Great Inventors', topic: '👑 Vĩ nhân & Ước mơ',
    word: 'Imagination', pos: 'noun', ipa: '/ɪˌmædʒ.ɪˈneɪ.ʃən/', meaning: 'Trí tưởng tượng sáng tạo', emoji: '🚀',
    sceneTheme: 'space',
    step1En: 'Use your imagination!', step1Vi: 'Hãy phát huy trí tưởng tượng của con!', step1Icons: ['🚀','🎨'],
    step2En: 'Stories and music fill our imagination with wonderful ideas.', step2Vi: 'Những câu chuyện và âm nhạc lấp đầy trí tưởng tượng của chúng ta bằng bao ý tưởng tuyệt vời.', step2Icons: ['📖','🎶','🌈'],
    step3En: 'Albert Einstein said that imagination is one of the greatest powers in the universe.', step3Vi: 'Nhà bác học Albert Einstein từng nói rằng trí tưởng tượng là một trong những sức mạnh vĩ đại nhất vũ trụ.', step3Icons: ['🚀','🌌','💡','👑'],
    passageTitle: 'Wings of Imagination',
    passageEn: 'Before airplanes could fly in the sky, the Wright brothers saw them flying in their imagination. Dream big, draw your ideas, and let your imagination soar beyond the stars!',
    passageVi: 'Trước khi máy bay có thể bay lượn trên bầu trời, hai anh em nhà Wright đã nhìn thấy chúng cất cánh trong chính trí tưởng tượng của mình. Hãy ước mơ lớn, vẽ ra ý tưởng và để trí tưởng tượng của con bay cao hơn cả những vì sao!',
    passageIcons: ['🚀','✈️','🌟','🌌']
  }
];

/* ============================================================
   📖 KHO TRUYỆN TRANH ĐỌC THEO TỪNG ẢNH CHUẨN LITTLE FOX (LEVEL 1–4)
   ============================================================ */
const LITTLE_FOX_STORYBOOKS = [
  {
    id: 'story_l1_bat',
    level: 1,
    series: 'Bat and Friends',
    title: 'Bat and the Red Apple (Dơi Nhỏ và Quả Táo Đỏ)',
    emoji: '🦇',
    summary: 'Truyện tranh Level 1: Dơi nhỏ tìm thấy một quả táo đỏ trên cây và cùng chia sẻ với các bạn ở nông trại.',
    scenes: [
      {
        sceneNo: 1,
        title: 'Ảnh 1: Quả táo trên cành cao',
        theme: 'orchard',
        icons: ['🦇','🍎','🌳','☀️'],
        en: 'Bat flies in the blue sky. He sees a shiny red apple on a tall tree.',
        vi: 'Dơi nhỏ bay trên bầu trời xanh. Cậu nhìn thấy một quả táo đỏ bóng loáng trên cây cao.',
        vocab: 'apple (quả táo) • tall tree (cây cao)'
      },
      {
        sceneNo: 2,
        title: 'Ảnh 2: Quả táo rơi xuống cỏ',
        theme: 'meadow',
        icons: ['🍎','💨','🌿','🐮'],
        en: 'The wind blows! Plop! The red apple falls down onto the soft green grass.',
        vi: 'Gió thổi qua! Bịch! Quả táo đỏ rơi xuống thảm cỏ xanh mềm mại.',
        vocab: 'wind blows (gió thổi) • green grass (cỏ xanh)'
      },
      {
        sceneNo: 3,
        title: 'Ảnh 3: Các bạn cùng chạy tới',
        theme: 'meadow',
        icons: ['🐮','🐷','🐶','🍎'],
        en: 'Cow, Pig, and Dog run to the tree. "Look at the big red apple!" says Pig.',
        vi: 'Bò, Heo và Cún cùng chạy tới gốc cây. "Nhìn quả táo đỏ to kìa!" Heo reo lên.',
        vocab: 'run (chạy) • big red apple (quả táo đỏ to)'
      },
      {
        sceneNo: 4,
        title: 'Ảnh 4: Niềm vui sẻ chia',
        theme: 'orchard',
        icons: ['🦇','🐮','🐷','🍎'],
        en: 'Bat shares the sweet apple with his friends. Crunch, crunch! Everyone is happy.',
        vi: 'Dơi nhỏ chia sẻ quả táo ngọt ngào với các bạn. Rộp, rộp! Ai nấy đều vui vẻ.',
        vocab: 'share (chia sẻ) • sweet (ngọt ngào)'
      }
    ]
  },
  {
    id: 'story_l1_tire',
    level: 1,
    series: 'Tire Town School',
    title: 'Eddy’s First Day at School (Ngày Đầu Đi Học Của Eddy)',
    emoji: '🚗',
    summary: 'Truyện tranh Level 1: Xe nhỏ Eddy háo hức đeo cặp sách đến trường học Thị trấn Lốp Xe.',
    scenes: [
      {
        sceneNo: 1,
        title: 'Ảnh 1: Buổi sáng đến trường',
        theme: 'school',
        icons: ['🚗','🎒','🏫','☀️'],
        en: 'Good morning! Eddy puts on his blue backpack and goes to Tire Town School.',
        vi: 'Chào buổi sáng! Eddy đeo chiếc cặp sách màu xanh và đi đến trường Thị trấn Lốp Xe.',
        vocab: 'backpack (cặp sách) • school (trường học)'
      },
      {
        sceneNo: 2,
        title: 'Ảnh 2: Gặp gỡ bạn mới',
        theme: 'school',
        icons: ['🚗','🚌','🚒','👋'],
        en: 'At the school gate, Eddy waves his hand. "Hello! My name is Eddy," he says with a smile.',
        vi: 'Ở cổng trường, Eddy vẫy tay. "Xin chào! Tên mình là Eddy," cậu mỉm cười nói.',
        vocab: 'school gate (cổng trường) • smile (nụ cười)'
      },
      {
        sceneNo: 3,
        title: 'Ảnh 3: Giờ học vui nhộn',
        theme: 'school',
        icons: ['👩‍🏫','📖','🎨','🎶'],
        en: 'In the classroom, the teacher reads a picture book. The students sing and draw together.',
        vi: 'Trong lớp học, cô giáo đọc một cuốn truyện tranh. Các bạn học sinh cùng nhau hát và vẽ tranh.',
        vocab: 'classroom (lớp học) • picture book (sách tranh)'
      },
      {
        sceneNo: 4,
        title: 'Ảnh 4: Hẹn gặp lại ngày mai',
        theme: 'home',
        icons: ['🚗','🌟','🏡','💖'],
        en: '"I love my school!" says Eddy. He cannot wait to see his friends again tomorrow.',
        vi: '"Con rất yêu trường của con!" Eddy nói. Cậu háo hức chờ đến ngày mai để lại gặp các bạn.',
        vocab: 'love (yêu quý) • tomorrow (ngày mai)'
      }
    ]
  },
  {
    id: 'story_l2_bird',
    level: 2,
    series: 'Bird and Kip',
    title: 'The Rainbow Concert (Buổi Hòa Nhạc Dưới Cầu Vồng)',
    emoji: '🐦',
    summary: 'Truyện tranh Level 2: Chim nhỏ Bird và Sóc Kip cùng chơi đàn và hát vang sau cơn mưa mùa hè.',
    scenes: [
      {
        sceneNo: 1,
        title: 'Ảnh 1: Cơn mưa mùa hè tạnh',
        theme: 'sky',
        icons: ['🌦️','☀️','🐦','🐿️'],
        en: 'After a short summer rain, the dark clouds go away. The golden sun shines brightly again.',
        vi: 'Sau cơn mưa rào mùa hè, những đám mây đen tan biến. Mặt trời vàng óng lại tỏa nắng rực rỡ.',
        vocab: 'summer rain (mưa mùa hè) • shine brightly (tỏa sáng rực rỡ)'
      },
      {
        sceneNo: 2,
        title: 'Ảnh 2: Cầu vồng bảy sắc',
        theme: 'sky',
        icons: ['🌈','🌳','🐦','✨'],
        en: 'Bird looks up and claps her wings. A giant rainbow with seven bright colors arches across the sky!',
        vi: 'Chim nhỏ ngước nhìn lên và vỗ cánh reo vui. Một chiếc cầu vồng khổng lồ bảy sắc màu vắt ngang bầu trời!',
        vocab: 'giant rainbow (cầu vồng khổng lồ) • seven colors (bảy sắc màu)'
      },
      {
        sceneNo: 3,
        title: 'Ảnh 3: Giai điệu bên cây đàn',
        theme: 'music',
        icons: ['🎹','🐿️','🐦','🎶'],
        en: 'Kip brings out his little piano. As Kip plays a cheerful melody, Bird sings a sweet song.',
        vi: 'Kip mang chiếc đàn Piano nhỏ ra. Khi Kip đàn một giai điệu vui tươi, Chim nhỏ cất tiếng hát ngọt ngào.',
        vocab: 'cheerful melody (giai điệu vui tươi) • sweet song (bài hát ngọt ngào)'
      },
      {
        sceneNo: 4,
        title: 'Ảnh 4: Khán giả rừng xanh',
        theme: 'meadow',
        icons: ['🐰','🦋','🎶','👏'],
        en: 'Rabbits and butterflies gather around the tree to listen. The forest is filled with music and joy!',
        vi: 'Những chú thỏ và bướm xinh tụ hội quanh gốc cây để lắng nghe. Khu rừng tràn ngập âm nhạc và niềm vui!',
        vocab: 'gather around (tụ tập quanh) • music and joy (âm nhạc và niềm vui)'
      }
    ]
  },
  {
    id: 'story_l3_rocket',
    level: 3,
    series: 'Rocket Girl',
    title: 'Rocket Girl and the Lost Puppy (Cô Bé Tên Lửa Cứu Chú Cún Lạc)',
    emoji: '🦸‍♀️',
    summary: 'Truyện tranh Level 3: Roxy dùng lòng dũng cảm và sự kiên nhẫn để giúp chú cún nhỏ tìm lại chủ nhân.',
    scenes: [
      {
        sceneNo: 1,
        title: 'Ảnh 1: Tiếng gọi trong công viên',
        theme: 'meadow',
        icons: ['🦸‍♀️','🐶','🌳','🔍'],
        en: 'While walking home from school, Roxy heard a soft whimper behind the green bushes in the park.',
        vi: 'Khi đang đi bộ từ trường về nhà, Roxy nghe thấy tiếng kêu khe khẽ phía sau bụi cây xanh trong công viên.',
        vocab: 'behind the bushes (sau bụi cây) • heard (nghe thấy)'
      },
      {
        sceneNo: 2,
        title: 'Ảnh 2: Làm bạn với chú cún nhỏ',
        theme: 'meadow',
        icons: ['👧','🐶','💧','💖'],
        en: 'She found a scared little puppy. Because Roxy was gentle and patient, the puppy wagged its tail and came closer.',
        vi: 'Cô bé tìm thấy một chú cún nhỏ đang sợ hãi. Vì Roxy rất dịu dàng và kiên nhẫn nên chú cún đã vẫy đuôi bước lại gần.',
        vocab: 'gentle and patient (dịu dàng và kiên nhẫn) • wagged its tail (vẫy đuôi)'
      },
      {
        sceneNo: 3,
        title: 'Ảnh 3: Bay lên quan sát từ trên cao',
        theme: 'space',
        icons: ['🦸‍♀️','🚀','🏙️','👦'],
        en: 'Rocket Girl flew high into the sky to look around Metro City. Soon, she spotted a boy looking for his lost pet!',
        vi: 'Cô bé Tên Lửa bay vút lên bầu trời để quan sát khắp thành phố Metro. Chẳng mấy chốc, cô nhìn thấy một cậu bé đang tìm thú cưng bị lạc!',
        vocab: 'flew high (bay lên cao) • spotted (nhìn thấy, phát hiện)'
      },
      {
        sceneNo: 4,
        title: 'Ảnh 4: Cuộc đoàn tụ hạnh phúc',
        theme: 'home',
        icons: ['👦','🐶','🦸‍♀️','🌟'],
        en: 'When the boy hugged his puppy tightly, he thanked Rocket Girl with a big smile. Helping others is the best superpower!',
        vi: 'Khi cậu bé ôm chặt chú cún vào lòng, cậu cảm ơn Cô bé Tên Lửa với nụ cười thật tươi. Giúp đỡ mọi người chính là siêu năng lực tuyệt vời nhất!',
        vocab: 'hugged tightly (ôm chặt) • superpower (siêu năng lực)'
      }
    ]
  },
  {
    id: 'story_l4_edison',
    level: 4,
    series: 'Great Inventors',
    title: 'Thomas Edison and the Shining Light (Nhà Phát Minh Edison & Ánh Sáng Kỳ Diệu)',
    emoji: '💡',
    summary: 'Truyện tranh Level 4: Câu chuyện truyền cảm hứng về lòng ham học hỏi và sự kiên trì không bỏ cuộc của Thomas Edison.',
    scenes: [
      {
        sceneNo: 1,
        title: 'Ảnh 1: Cậu bé luôn đặt câu hỏi "Tại sao?"',
        theme: 'science',
        icons: ['👦','🔍','📚','❓'],
        en: 'When Thomas Edison was a young boy, he was deeply curious about how things worked. He read science books every single day.',
        vi: 'Khi Thomas Edison còn là một cậu bé nhỏ, ông vô cùng ham tìm tòi về cách vạn vật vận hành. Ông đọc sách khoa học mỗi ngày.',
        vocab: 'deeply curious (vô cùng tò mò/ham học) • how things worked (cách mọi thứ hoạt động)'
      },
      {
        sceneNo: 2,
        title: 'Ảnh 2: Ước mơ thắp sáng màn đêm',
        theme: 'science',
        icons: ['🕯️','🌙','👨‍🔬','💡'],
        en: 'In those days, people used candles and oil lamps in the dark. Edison dreamed of inventing a safe electric light bulb for every home.',
        vi: 'Vào thời đó, mọi người phải dùng nến và đèn dầu trong bóng tối. Edison ước mơ phát minh ra bóng đèn điện an toàn cho mọi gia đình.',
        vocab: 'candles (những ngọn nến) • electric light bulb (bóng đèn điện)'
      },
      {
        sceneNo: 3,
        title: 'Ảnh 3: Kiên trì qua hàng ngàn thử nghiệm',
        theme: 'science',
        icons: ['🔬','⚡','⏳','💪'],
        en: 'Even though his experiments failed more than a thousand times, Edison did not give up. He said each failure taught him something new.',
        vi: 'Mặc dù các thí nghiệm thất bại hơn một ngàn lần, Edison vẫn không bỏ cuộc. Ông nói rằng mỗi lần thất bại đều dạy cho ông một bài học mới.',
        vocab: 'experiments (các thí nghiệm) • did not give up (không bỏ cuộc)'
      },
      {
        sceneNo: 4,
        title: 'Ảnh 4: Ánh sáng làm thay đổi thế giới',
        theme: 'space',
        icons: ['💡','✨','🌍','🏆'],
        en: 'Finally, a warm golden light glowed inside the glass bulb! Because Edison persevered with courage and imagination, he brightened the whole world.',
        vi: 'Cuối cùng, một luồng sáng vàng ấm áp đã tỏa rạng bên trong bóng thủy tinh! Nhờ kiên trì với lòng dũng cảm và trí tưởng tượng, ông đã thắp sáng cả thế giới.',
        vocab: 'glowed (phát sáng) • persevered (kiên trì đến cùng)'
      }
    ]
  }
];

let fcCurrentLevel = 'all';
let fcCurrentTopic = 'all';
let fcCurrentFilter = 'all';
let fcCurrentMode = 'card';
let fcCurrentIdx = 0;
let fcAccent = 'en-US';
let fcSpeechRate = 0.92;
let fcAutoSpeak = true;
let fcAutoPlayTimer = null;
let fcLadderSequenceTimer = null;
let fcWordHighlightTimers = [];
let fcActiveStoryId = 'story_l1_bat';
let fcStoryAutoTimer = null;
let fcQuizTarget = null;
let fcQuizStreak = 0;
let fcCurrentAudioObj = null;
const fcDictAudioCache = {};

function getAllFlashcards(){
  const custom = Array.isArray(data.customFlashcards) ? data.customFlashcards : [];
  return [...DEFAULT_FLASHCARDS, ...custom];
}

function getMasteredSet(){
  const c = child();
  if(!c) return new Set();
  if(!Array.isArray(c.masteredFlashcards)) c.masteredFlashcards = [];
  return new Set(c.masteredFlashcards);
}

function getFilteredFlashcards(){
  const all = getAllFlashcards();
  const mastered = getMasteredSet();
  return all.filter(item => {
    if(fcCurrentLevel !== 'all' && Number(item.level || 1) !== Number(fcCurrentLevel)) return false;
    if(fcCurrentTopic !== 'all' && item.topic !== fcCurrentTopic) return false;
    if(fcCurrentFilter === 'mastered' && !mastered.has(item.id)) return false;
    if(fcCurrentFilter === 'learning' && mastered.has(item.id)) return false;
    return true;
  });
}

/* ============================================================
   🎨 BỘ VẼ TRANH MINH HỌA TRỰC QUAN CHUẨN LITTLE FOX (SVG SCENE)
   ============================================================ */
function buildLittleFoxSceneSVG(card, stepIndex = 1){
  if(!card) return '';
  if(card.imageUrl && stepIndex === 1){
    return `
      <img src="${safe(card.imageUrl)}" alt="${safe(card.word)}" onerror="this.style.display='none'">
      <span class="lf-illus-scene-label">🖼️ ${safe(card.word)}</span>
      <span class="lf-illus-sound-tag">🔊 Chạm để nghe</span>
    `;
  }

  const palettes = {
    savanna: { sky1: '#fef3c7', sky2: '#fde68a', hill1: '#86efac', hill2: '#4ade80', sun: '#f59e0b', accent: '#ea580c' },
    meadow:  { sky1: '#e0f2fe', sky2: '#bae6fd', hill1: '#bbf7d0', hill2: '#4ade80', sun: '#facc15', accent: '#16a34a' },
    orchard: { sky1: '#fff7ed', sky2: '#ffedd5', hill1: '#86efac', hill2: '#22c55e', sun: '#fb923c', accent: '#dc2626' },
    home:    { sky1: '#fdf2f8', sky2: '#fce7f3', hill1: '#fde68a', hill2: '#fcd34d', sun: '#f472b6', accent: '#db2777' },
    school:  { sky1: '#eff6ff', sky2: '#dbeafe', hill1: '#a7f3d0', hill2: '#34d399', sun: '#38bdf8', accent: '#2563eb' },
    music:   { sky1: '#f5f3ff', sky2: '#ede9fe', hill1: '#ddd6fe', hill2: '#c4b5fd', sun: '#a855f7', accent: '#7c3aed' },
    sky:     { sky1: '#e0f2fe', sky2: '#fef9c3', hill1: '#a7f3d0', hill2: '#6ee7b7', sun: '#f59e0b', accent: '#0284c7' },
    ocean:   { sky1: '#cffafe', sky2: '#a5f3fc', hill1: '#38bdf8', hill2: '#0284c7', sun: '#facc15', accent: '#0369a1' },
    space:   { sky1: '#1e1b4b', sky2: '#312e81', hill1: '#4338ca', hill2: '#3730a3', sun: '#fde047', accent: '#f59e0b' },
    science: { sky1: '#ecfeff', sky2: '#e0e7ff', hill1: '#c7d2fe', hill2: '#a5b4fc', sun: '#f59e0b', accent: '#4f46e5' }
  };

  const themeKey = card.sceneTheme || card.theme || (card.level === 4 ? 'science' : (card.level === 3 ? 'space' : (card.level === 2 ? 'sky' : 'meadow')));
  const pal = palettes[themeKey] || palettes.meadow;
  const isDark = themeKey === 'space';

  let icons = [card.emoji || '🦊'];
  if(stepIndex === 1 && Array.isArray(card.step1Icons)) icons = card.step1Icons;
  else if(stepIndex === 2 && Array.isArray(card.step2Icons)) icons = card.step2Icons;
  else if(stepIndex === 3 && Array.isArray(card.step3Icons)) icons = card.step3Icons;
  else if(stepIndex === 4 && Array.isArray(card.passageIcons)) icons = card.passageIcons;
  else if(Array.isArray(card.icons)) icons = card.icons;

  const mainIcon = icons[0] || card.emoji || '🦊';
  const subIcon1 = icons[1] || '✨';
  const subIcon2 = icons[2] || '🌿';
  const subIcon3 = icons[3] || '';

  const stepLabels = {
    1: 'Ảnh 1 • Từ & Câu ngắn',
    2: 'Ảnh 2 • Mở rộng miêu tả',
    3: 'Ảnh 3 • Tình huống truyện',
    4: 'Ảnh 4 • Đoạn đọc Little Fox'
  };
  const topLabel = card.sceneNo ? `Ảnh ${card.sceneNo}` : (stepLabels[stepIndex] || 'Tranh minh họa');
  const wordLabel = card.word ? `${card.word}` : (card.title || 'Little Fox');
  const uidGrad = `lfGrad_${(card.id || 's')}_${stepIndex}_${Math.floor(Math.random()*999)}`;

  return `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="${uidGrad}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${pal.sky1}"/>
          <stop offset="100%" stop-color="${pal.sky2}"/>
        </linearGradient>
      </defs>
      <!-- Bầu trời nền -->
      <rect width="400" height="180" fill="url(#${uidGrad})"/>
      <!-- Mặt trời / Mặt trăng & Sao -->
      <circle cx="${340 - (stepIndex * 18)}" cy="42" r="24" fill="${pal.sun}" opacity="0.88"/>
      <circle cx="${340 - (stepIndex * 18)}" cy="42" r="32" fill="${pal.sun}" opacity="0.22"/>
      ${isDark ? `
        <circle cx="55" cy="34" r="2.2" fill="#fff" opacity="0.9"/>
        <circle cx="115" cy="24" r="1.8" fill="#fde047" opacity="0.8"/>
        <circle cx="245" cy="30" r="2.5" fill="#fff" opacity="0.85"/>
        <circle cx="85" cy="65" r="1.6" fill="#fff" opacity="0.7"/>
      ` : `
        <ellipse cx="78" cy="40" rx="28" ry="12" fill="#ffffff" opacity="0.75"/>
        <ellipse cx="96" cy="36" rx="22" ry="14" fill="#ffffff" opacity="0.85"/>
        <ellipse cx="255" cy="52" rx="24" ry="10" fill="#ffffff" opacity="0.65"/>
      `}
      <!-- Đồi cỏ / Sóng nền -->
      <path d="M-20 140 Q 95 102 220 136 T 420 126 L 420 190 L -20 190 Z" fill="${pal.hill1}"/>
      <path d="M-20 154 Q 150 122 290 148 T 420 142 L 420 190 L -20 190 Z" fill="${pal.hill2}"/>
      <!-- Vòng tròn sáng trung tâm nổi bật nhân vật -->
      <circle cx="200" cy="94" r="52" fill="#ffffff" opacity="${isDark ? '0.16' : '0.68'}"/>
      <circle cx="200" cy="94" r="44" fill="#ffffff" opacity="${isDark ? '0.22' : '0.82'}"/>
      <!-- Các biểu tượng phụ tạo bối cảnh sinh động -->
      <text x="86" y="118" font-size="34" text-anchor="middle">${subIcon1}</text>
      <text x="312" y="114" font-size="34" text-anchor="middle">${subIcon2}</text>
      ${subIcon3 ? `<text x="272" y="58" font-size="26" text-anchor="middle">${subIcon3}</text>` : ''}
      <!-- Nhân vật / Hình ảnh chính -->
      <text x="200" y="114" font-size="64" text-anchor="middle">${mainIcon}</text>
    </svg>
    <span class="lf-illus-scene-label">🖼️ ${safe(topLabel)}</span>
    <span class="lf-illus-sound-tag">🔊 ${safe(wordLabel)}</span>
  `;
}

/* ============================================================
   🔊 HỆ THỐNG ÂM THANH CHUẨN BẢN XỨ ĐA TẦNG (US/UK + KARAOKE TỪNG TỪ)
   ============================================================ */
function initLittleFoxVoices(){
  try{
    if('speechSynthesis' in window){
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }catch(e){}
}
initLittleFoxVoices();

function pickBestEnglishVoice(preferredLang = 'en-US'){
  try{
    if(!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if(!voices.length) return null;
    const isUK = preferredLang === 'en-GB';
    const langPrefix = isUK ? 'en-gb' : 'en-us';

    const enVoices = voices.filter(v => {
      const l = (v.lang || '').toLowerCase().replace('_', '-');
      return l.startsWith('en');
    });
    if(!enVoices.length) return null;

    const scoreVoice = (v) => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      let score = 0;
      if(lang === langPrefix) score += 50;
      else if(isUK && (lang.includes('gb') || lang.includes('uk') || name.includes('uk') || name.includes('british'))) score += 45;
      else if(!isUK && (lang.includes('us') || name.includes('us') || name.includes('united states'))) score += 45;
      if(name.includes('natural') || name.includes('neural') || name.includes('online')) score += 40;
      if(name.includes('aria') || name.includes('jenny') || name.includes('guy') || name.includes('sonia') || name.includes('libby')) score += 35;
      if(name.includes('google us english') || name.includes('google uk english')) score += 32;
      if(name.includes('samantha') || name.includes('alex') || name.includes('daniel') || name.includes('karen') || name.includes('moira')) score += 28;
      return score;
    };

    enVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return enVoices[0] || null;
  }catch(e){
    return null;
  }
}

function clearWordHighlights(){
  fcWordHighlightTimers.forEach(t => clearTimeout(t));
  fcWordHighlightTimers = [];
  document.querySelectorAll('.lf-word-token.is-speaking').forEach(el => el.classList.remove('is-speaking'));
  const badge = document.getElementById('fcAudioStatusBadge');
  if(badge){
    badge.classList.remove('speaking');
    badge.innerHTML = `🔊 Giọng chuẩn ${fcAccent === 'en-GB' ? 'Anh (UK)' : 'Mỹ (US)'} sẵn sàng`;
  }
}

function stopCurrentEnglishAudio(){
  clearWordHighlights();
  if(fcCurrentAudioObj){
    try{
      fcCurrentAudioObj.pause();
      fcCurrentAudioObj.src = '';
    }catch(e){}
    fcCurrentAudioObj = null;
  }
  try{
    if('speechSynthesis' in window) window.speechSynthesis.cancel();
  }catch(e){}
}

function scheduleWordKaraokeHighlight(text, rate = 0.9, containerSelector = null){
  clearWordHighlights();
  const badge = document.getElementById('fcAudioStatusBadge');
  if(badge){
    badge.classList.add('speaking');
    badge.innerHTML = `🔊 Đang phát âm chuẩn (${fcAccent === 'en-GB' ? 'UK 🇬🇧' : 'US 🇺🇸'})...`;
  }

  const scope = containerSelector ? document.querySelector(containerSelector) : document;
  if(!scope) return;
  const tokens = Array.from(scope.querySelectorAll('.lf-word-token'));
  if(!tokens.length) return;

  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if(!words.length) return;

  let cumulativeMs = 60;
  const speedFactor = Math.max(0.45, Math.min(1.3, rate || 0.9));

  tokens.forEach((tokenEl, idx) => {
    const w = tokenEl.textContent || words[idx] || '';
    const baseMs = Math.max(210, Math.min(620, w.length * 58));
    const hasPause = /[,.;!?]$/.test(w);
    const durMs = Math.round((baseMs + (hasPause ? 190 : 0)) / speedFactor);

    const tStart = setTimeout(() => {
      document.querySelectorAll('.lf-word-token.is-speaking').forEach(el => el.classList.remove('is-speaking'));
      tokenEl.classList.add('is-speaking');
    }, cumulativeMs);
    fcWordHighlightTimers.push(tStart);
    cumulativeMs += durMs;
  });

  const tEnd = setTimeout(() => {
    clearWordHighlights();
  }, cumulativeMs + 250);
  fcWordHighlightTimers.push(tEnd);
}

async function resolveDictionaryHumanMp3(word, accent = 'en-US'){
  const cleanWord = String(word || '').trim().toLowerCase().replace(/[^a-z-]/g, '');
  if(!cleanWord || cleanWord.includes(' ')) return null;
  const cacheKey = `${cleanWord}_${accent}`;
  if(fcDictAudioCache[cacheKey] !== undefined) return fcDictAudioCache[cacheKey];

  try{
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1400);
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, { signal: controller.signal });
    clearTimeout(timer);
    if(!res.ok){
      fcDictAudioCache[cacheKey] = null;
      return null;
    }
    const json = await res.json();
    const phonetics = [];
    if(Array.isArray(json)){
      json.forEach(entry => {
        if(Array.isArray(entry.phonetics)) phonetics.push(...entry.phonetics);
      });
    }
    const audioUrls = phonetics.map(p => p && p.audio ? String(p.audio).trim() : '').filter(Boolean);
    if(!audioUrls.length){
      fcDictAudioCache[cacheKey] = null;
      return null;
    }
    const preferTag = accent === 'en-GB' ? '-uk' : '-us';
    const matched = audioUrls.find(u => u.toLowerCase().includes(preferTag)) || audioUrls[0];
    fcDictAudioCache[cacheKey] = matched;
    return matched;
  }catch(e){
    fcDictAudioCache[cacheKey] = null;
    return null;
  }
}

function speakWithWebSpeechFallback(cleanText, effectiveRate, onFinish){
  try{
    if(!('speechSynthesis' in window)){
      if(typeof onFinish === 'function') onFinish();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = fcAccent || 'en-US';
    u.rate = Math.max(0.5, Math.min(1.2, effectiveRate));
    u.pitch = 1.02;
    const bestVoice = pickBestEnglishVoice(fcAccent);
    if(bestVoice) u.voice = bestVoice;
    u.onend = () => {
      clearWordHighlights();
      if(typeof onFinish === 'function') onFinish();
    };
    u.onerror = () => {
      clearWordHighlights();
      if(typeof onFinish === 'function') onFinish();
    };
    window.speechSynthesis.speak(u);
  }catch(e){
    clearWordHighlights();
    if(typeof onFinish === 'function') onFinish();
  }
}

async function speakEnglishText(text, rate = null, opts = {}){
  const cleanText = String(text || '').replace(/\s+/g, ' ').trim();
  if(!cleanText) return;
  const effectiveRate = rate !== null ? rate : (fcSpeechRate || 0.92);
  stopCurrentEnglishAudio();

  scheduleWordKaraokeHighlight(cleanText, effectiveRate, opts.containerSelector || null);

  const isSingleWord = !cleanText.includes(' ') && cleanText.length <= 24;
  const youdaoType = fcAccent === 'en-GB' ? 1 : 2;
  const cloudVoiceUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&type=${youdaoType}`;

  let primaryUrl = cloudVoiceUrl;
  if(isSingleWord){
    const dictMp3 = await resolveDictionaryHumanMp3(cleanText, fcAccent);
    if(dictMp3) primaryUrl = dictMp3;
  }

  let finished = false;
  const finishOnce = () => {
    if(finished) return;
    finished = true;
    clearWordHighlights();
    if(typeof opts.onEnd === 'function') opts.onEnd();
  };

  try{
    const audio = new Audio();
    audio.referrerPolicy = 'no-referrer';
    audio.preload = 'auto';
    audio.src = primaryUrl;
    fcCurrentAudioObj = audio;

    const applyPlaybackRate = () => {
      try{
        const mappedRate = Math.max(0.55, Math.min(1.15, effectiveRate / 0.92));
        if('preservesPitch' in audio) audio.preservesPitch = true;
        if('mozPreservesPitch' in audio) audio.mozPreservesPitch = true;
        if('webkitPreservesPitch' in audio) audio.webkitPreservesPitch = true;
        audio.playbackRate = mappedRate;
      }catch(e){}
    };

    audio.onloadedmetadata = applyPlaybackRate;
    audio.onplay = applyPlaybackRate;
    audio.onended = finishOnce;

    let fallbackTriggered = false;
    const triggerFallback = () => {
      if(fallbackTriggered || finished) return;
      fallbackTriggered = true;
      if(primaryUrl !== cloudVoiceUrl){
        try{
          audio.src = cloudVoiceUrl;
          audio.play().catch(() => speakWithWebSpeechFallback(cleanText, effectiveRate, finishOnce));
          return;
        }catch(e){}
      }
      speakWithWebSpeechFallback(cleanText, effectiveRate, finishOnce);
    };

    audio.onerror = triggerFallback;
    const playPromise = audio.play();
    if(playPromise && typeof playPromise.catch === 'function'){
      playPromise.catch(triggerFallback);
    }
  }catch(e){
    speakWithWebSpeechFallback(cleanText, effectiveRate, finishOnce);
  }
}

function speakSingleWordToken(rawWord){
  const cleaned = String(rawWord || '').replace(/^[^a-zA-Z0-9']+|[^a-zA-Z0-9']+$/g, '');
  if(!cleaned) return;
  speakEnglishText(cleaned, 0.88);
  showToast(`🔊 Phát âm từ: "${cleaned}"`);
}

function renderInteractiveEnglishTokens(sentence, targetWord = ''){
  const words = String(sentence || '').trim().split(/\s+/).filter(Boolean);
  const normTarget = String(targetWord || '').toLowerCase().replace(/[^a-z]/g, '');
  return words.map((w, idx) => {
    const cleanW = w.toLowerCase().replace(/[^a-z]/g, '');
    const isTarget = normTarget && (cleanW === normTarget || cleanW.startsWith(normTarget));
    const escapedWord = safe(w).replace(/'/g, "\\'");
    return `<span class="lf-word-token ${isTarget ? 'target-word' : ''}" data-word-idx="${idx}" title="Chạm để nghe phát âm từ này" onclick="event.stopPropagation(); speakSingleWordToken('${escapedWord}')">${safe(w)}</span>`;
  }).join(' ');
}

function setFlashcardLevel(lv){
  stopFlashcardSequences();
  fcCurrentLevel = lv;
  fcCurrentIdx = 0;
  renderFlashcards();
}

function setFlashcardTopic(tp){
  stopFlashcardSequences();
  fcCurrentTopic = tp;
  fcCurrentIdx = 0;
  renderFlashcards();
}

function setFlashcardFilter(flt){
  stopFlashcardSequences();
  fcCurrentFilter = flt;
  fcCurrentIdx = 0;
  document.querySelectorAll('.fc-subfilter-btn').forEach(b => b.classList.remove('active'));
  const btnId = flt === 'mastered' ? 'fcFilterMastered' : (flt === 'learning' ? 'fcFilterLearning' : 'fcFilterAll');
  document.getElementById(btnId)?.classList.add('active');
  renderFlashcards();
}

function setFlashcardMode(mode){
  stopFlashcardSequences();
  fcCurrentMode = mode;
  ['card','grid','quiz','guide'].forEach(m => {
    const btn = document.getElementById('fcMode' + m.charAt(0).toUpperCase() + m.slice(1) + 'Btn');
    const view = document.getElementById('fc' + m.charAt(0).toUpperCase() + m.slice(1) + 'View');
    if(btn) btn.classList.toggle('active', m === mode);
    if(view) view.style.display = (m === mode) ? 'block' : 'none';
  });
  if(mode === 'quiz') nextFlashcardQuizQuestion();
  renderFlashcards();
}

function setFlashcardAccent(acc){
  fcAccent = acc;
  document.getElementById('fcAccentUS')?.classList.toggle('active', acc === 'en-US');
  document.getElementById('fcAccentUK')?.classList.toggle('active', acc === 'en-GB');
  clearWordHighlights();
  speakCurrentWord(fcSpeechRate);
}

function setFlashcardSpeed(spd){
  fcSpeechRate = Number(spd) || 0.92;
  document.getElementById('fcSpeedNormal')?.classList.toggle('active', fcSpeechRate >= 0.88);
  document.getElementById('fcSpeedMedium')?.classList.toggle('active', fcSpeechRate >= 0.7 && fcSpeechRate < 0.88);
  document.getElementById('fcSpeedSlow')?.classList.toggle('active', fcSpeechRate < 0.7);
  showToast(`🔊 Đã chọn tốc độ đọc: ${fcSpeechRate >= 0.88 ? '1.0x Chuẩn' : (fcSpeechRate >= 0.7 ? '0.8x Vừa' : '🐢 Chậm rõ từng từ')}`);
}

function toggleFlashcardAutoSpeak(checked){
  fcAutoSpeak = !!checked;
}

function flipCurrentFlashcard(){
  const card3d = document.getElementById('fcCard3D');
  if(card3d) card3d.classList.toggle('is-flipped');
}

function stopFlashcardSequences(){
  if(fcLadderSequenceTimer){
    clearTimeout(fcLadderSequenceTimer);
    fcLadderSequenceTimer = null;
  }
  if(fcStoryAutoTimer){
    clearTimeout(fcStoryAutoTimer);
    fcStoryAutoTimer = null;
  }
  document.querySelectorAll('.lf-pic-read-card.active-reading, .lf-story-scene-item.active-reading').forEach(el => el.classList.remove('active-reading'));
  const playAllBtn = document.getElementById('fcPlayAllPicturesBtn');
  if(playAllBtn) playAllBtn.innerHTML = '<span>▶️</span><span>Đọc lần lượt cả 4 ảnh</span>';
  stopCurrentEnglishAudio();
}

function prevFlashcard(){
  stopFlashcardSequences();
  const deck = getFilteredFlashcards();
  if(!deck.length) return;
  fcCurrentIdx = (fcCurrentIdx - 1 + deck.length) % deck.length;
  document.getElementById('fcCard3D')?.classList.remove('is-flipped');
  renderFlashcards();
  if(fcAutoSpeak) speakCurrentWord(fcSpeechRate);
}

function nextFlashcard(){
  stopFlashcardSequences();
  const deck = getFilteredFlashcards();
  if(!deck.length) return;
  fcCurrentIdx = (fcCurrentIdx + 1) % deck.length;
  document.getElementById('fcCard3D')?.classList.remove('is-flipped');
  renderFlashcards();
  if(fcAutoSpeak) speakCurrentWord(fcSpeechRate);
}

function shuffleFlashcards(){
  stopFlashcardSequences();
  const deck = getFilteredFlashcards();
  if(deck.length > 1){
    fcCurrentIdx = Math.floor(Math.random() * deck.length);
    renderFlashcards();
    if(fcAutoSpeak) speakCurrentWord(fcSpeechRate);
    showToast('🔀 Đã chọn thẻ ngẫu nhiên!');
  }
}

function toggleFlashcardAutoPlay(){
  const btn = document.getElementById('fcAutoPlayBtn');
  if(fcAutoPlayTimer){
    clearInterval(fcAutoPlayTimer);
    fcAutoPlayTimer = null;
    if(btn){
      btn.classList.remove('playing');
      btn.textContent = '▶️ Tự động đọc cả chủ đề';
    }
    stopFlashcardSequences();
    return;
  }
  if(btn){
    btn.classList.add('playing');
    btn.textContent = '⏹ Dừng tự động đọc';
  }
  speakCurrentWord(fcSpeechRate);
  fcAutoPlayTimer = setInterval(() => {
    nextFlashcard();
  }, 4800);
}

function speakCurrentWord(rate = null){
  const deck = getFilteredFlashcards();
  const card = deck[fcCurrentIdx] || deck[0];
  if(card) speakEnglishText(card.word, rate || fcSpeechRate);
}

function speakCurrentExample(){
  const deck = getFilteredFlashcards();
  const card = deck[fcCurrentIdx] || deck[0];
  if(card) speakEnglishText(card.step2En || card.step1En, fcSpeechRate, { containerSelector: '#lfPicCard_2' });
}

function speakCurrentLadderStep(stepNum, customRate = null, onDone = null){
  const deck = getFilteredFlashcards();
  const card = deck[fcCurrentIdx] || deck[0];
  if(!card) return;
  document.querySelectorAll('.lf-pic-read-card.active-reading').forEach(el => el.classList.remove('active-reading'));
  const cardEl = document.getElementById(`lfPicCard_${stepNum}`);
  if(cardEl){
    cardEl.classList.add('active-reading');
  }
  const passageText = card.passageEn || `${card.step1En} ${card.step2En} ${card.step3En}`;
  const txt = stepNum === 1 ? card.step1En : (stepNum === 2 ? card.step2En : (stepNum === 3 ? card.step3En : passageText));
  speakEnglishText(txt, customRate || fcSpeechRate, {
    containerSelector: `#lfPicCard_${stepNum}`,
    onEnd: () => {
      if(cardEl && !fcLadderSequenceTimer) cardEl.classList.remove('active-reading');
      if(typeof onDone === 'function') onDone();
    }
  });
}

function speakAllLadderSteps(customRate = null){
  if(fcLadderSequenceTimer){
    stopFlashcardSequences();
    return;
  }
  const deck = getFilteredFlashcards();
  const card = deck[fcCurrentIdx] || deck[0];
  if(!card) return;

  const playAllBtn = document.getElementById('fcPlayAllPicturesBtn');
  if(playAllBtn) playAllBtn.innerHTML = '<span>⏹</span><span>Dừng đọc 4 ảnh</span>';

  const rateToUse = customRate || fcSpeechRate;
  const steps = [1, 2, 3, 4];
  let idx = 0;

  const playNextStep = () => {
    if(idx >= steps.length){
      stopFlashcardSequences();
      showToast(`🌟 Đã đọc xong cả 4 bức ảnh của từ "${card.word}"!`);
      return;
    }
    const stepNo = steps[idx++];
    const panelEl = document.getElementById(`lfPicCard_${stepNo}`);
    if(panelEl){
      panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    fcLadderSequenceTimer = setTimeout(() => {
      speakCurrentLadderStep(stepNo, rateToUse, () => {
        if(!fcLadderSequenceTimer) return;
        fcLadderSequenceTimer = setTimeout(playNextStep, 550);
      });
    }, 120);
  };

  speakEnglishText(card.word, rateToUse, {
    onEnd: () => {
      fcLadderSequenceTimer = setTimeout(playNextStep, 400);
    }
  });
}

function toggleCurrentCardMastered(cardId = null){
  const c = child();
  if(!c) return;
  const all = getAllFlashcards();
  const deck = getFilteredFlashcards();
  const card = cardId ? all.find(x => x.id === cardId) : (deck[fcCurrentIdx] || deck[0]);
  if(!card) return;
  if(!Array.isArray(c.masteredFlashcards)) c.masteredFlashcards = [];
  const idx = c.masteredFlashcards.indexOf(card.id);
  if(idx >= 0){
    c.masteredFlashcards.splice(idx, 1);
    showToast(`Đã chuyển "${card.word}" về danh sách Đang học`);
  }else{
    c.masteredFlashcards.push(card.id);
    c.score += 2;
    logPoint(c, 'study', 2, `[Tiếng Anh] Thuộc thẻ từ Little Fox: ${card.word}`);
    playChime('success');
    showToast(`🌟 Thuộc từ "${card.word}"! Thưởng +2 ⭐`);
  }
  save();
  renderFlashcards();
}

function startVoicePractice(stepNum = 0){
  const deck = getFilteredFlashcards();
  const card = deck[fcCurrentIdx] || deck[0];
  if(!card) return;

  const targetText = stepNum === 1 ? card.step1En
    : (stepNum === 2 ? card.step2En
    : (stepNum === 3 ? card.step3En
    : (stepNum === 4 ? (card.passageEn || card.step3En) : `${card.word}. ${card.step1En}`)));

  const statusEl = document.getElementById('fcSpeakStatus');
  const micBtn = document.getElementById('fcMicPracticeBtn');
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(SpeechRec){
    try{
      stopCurrentEnglishAudio();
      const rec = new SpeechRec();
      rec.lang = fcAccent || 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      if(micBtn) micBtn.classList.add('listening');
      if(statusEl){
        statusEl.innerHTML = `🎙️ <b style="color:#dc2626">Máy đang lắng nghe bé đọc...</b> Con hãy đọc to: <b style="color:#1e1b4b">"${safe(targetText)}"</b>`;
      }

      rec.onresult = (event) => {
        if(micBtn) micBtn.classList.remove('listening');
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        const cleanSpoken = transcript.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        const cleanTarget = targetText.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        const targetWords = cleanTarget.split(/\s+/).filter(Boolean);
        const spokenWords = cleanSpoken.split(/\s+/).filter(Boolean);
        let matched = 0;
        targetWords.forEach(tw => {
          if(spokenWords.includes(tw)) matched++;
        });
        const accuracy = targetWords.length ? Math.min(100, Math.round((matched / targetWords.length) * 100)) : 85;

        if(accuracy >= 50){
          playChime('success');
          if(statusEl){
            statusEl.innerHTML = `🎉 <b>Tuyệt vời (${accuracy}% chuẩn)!</b> Bé vừa đọc: <i>"${safe(transcript)}"</i> — Đã thưởng nóng <b>+2 ⭐</b>!`;
          }
          rewardChildSpeakingPractice();
        }else{
          if(statusEl){
            statusEl.innerHTML = `💡 Bé vừa đọc: <i>"${safe(transcript)}"</i>. Hãy nghe lại mẫu và đọc to rõ hơn nhé, hoặc bố mẹ bấm nút khen thưởng bên phải!`;
          }
          speakEnglishText(targetText, 0.8);
        }
      };

      rec.onerror = () => {
        if(micBtn) micBtn.classList.remove('listening');
        if(statusEl){
          statusEl.innerHTML = `🔊 <b>Hãy nghe mẫu và đọc theo:</b> <b style="color:#1e1b4b">"${safe(targetText)}"</b> — Đọc xong bấm nút <b>“👏 Con đã đọc to rõ (+2 ⭐)”</b> nhé!`;
        }
        speakEnglishText(targetText, 0.84);
      };

      rec.onend = () => {
        if(micBtn) micBtn.classList.remove('listening');
      };

      rec.start();
      return;
    }catch(e){}
  }

  if(statusEl){
    statusEl.innerHTML = `🎙️ <b>Con hãy nghe mẫu và đọc to:</b> <b style="color:#1e1b4b">"${safe(targetText)}"</b>. Sau khi đọc xong, bấm nút <b>“👏 Con đã đọc to rõ (+2 ⭐)”</b> bên cạnh!`;
  }
  if(stepNum >= 1 && stepNum <= 4){
    speakCurrentLadderStep(stepNum, 0.84);
  }else{
    speakAllLadderSteps(0.84);
  }
}

function rewardChildSpeakingPractice(){
  const deck = getFilteredFlashcards();
  const card = deck[fcCurrentIdx] || deck[0];
  quickAwardCoreStudy('Tiếng Anh', `Luyện đọc to rõ theo tranh Little Fox: "${card ? card.word : 'Little Fox'}"`, 2);
}

/* ============================================================
   📖 TRÌNH ĐỌC TRUYỆN TRANH THEO TỪNG ẢNH (STORYBOOK READER)
   ============================================================ */
function selectLittleFoxStory(storyId){
  stopFlashcardSequences();
  fcActiveStoryId = storyId;
  renderFlashcards();
}

function speakStoryScene(storyId, sceneIdx, rate = null){
  const story = LITTLE_FOX_STORYBOOKS.find(s => s.id === storyId) || LITTLE_FOX_STORYBOOKS[0];
  if(!story) return;
  const scene = story.scenes[sceneIdx];
  if(!scene) return;

  document.querySelectorAll('.lf-story-scene-item.active-reading').forEach(el => el.classList.remove('active-reading'));
  const sceneEl = document.getElementById(`lfStoryScene_${sceneIdx}`);
  if(sceneEl){
    sceneEl.classList.add('active-reading');
    sceneEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  speakEnglishText(scene.en, rate || fcSpeechRate, {
    containerSelector: `#lfStoryScene_${sceneIdx}`,
    onEnd: () => {
      if(sceneEl && !fcStoryAutoTimer) sceneEl.classList.remove('active-reading');
    }
  });
}

function togglePlayEntireStorybook(storyId){
  if(fcStoryAutoTimer){
    stopFlashcardSequences();
    renderFlashcards();
    return;
  }
  const story = LITTLE_FOX_STORYBOOKS.find(s => s.id === storyId) || LITTLE_FOX_STORYBOOKS[0];
  if(!story || !Array.isArray(story.scenes)) return;

  let idx = 0;
  const playNext = () => {
    if(idx >= story.scenes.length){
      stopFlashcardSequences();
      renderFlashcards();
      showToast(`🎉 Bé đã nghe xong truyện "${story.title}"!`);
      return;
    }
    const currentIdx = idx++;
    document.querySelectorAll('.lf-story-scene-item.active-reading').forEach(el => el.classList.remove('active-reading'));
    const sceneEl = document.getElementById(`lfStoryScene_${currentIdx}`);
    if(sceneEl){
      sceneEl.classList.add('active-reading');
      sceneEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    fcStoryAutoTimer = setTimeout(() => {
      speakEnglishText(story.scenes[currentIdx].en, fcSpeechRate, {
        containerSelector: `#lfStoryScene_${currentIdx}`,
        onEnd: () => {
          if(!fcStoryAutoTimer) return;
          fcStoryAutoTimer = setTimeout(playNext, 650);
        }
      });
    }, 150);
  };

  playNext();
}

function nextFlashcardQuizQuestion(){
  const deck = getFilteredFlashcards();
  const pool = deck.length >= 4 ? deck : getAllFlashcards();
  if(!pool.length) return;
  fcQuizTarget = pool[Math.floor(Math.random() * pool.length)];
  const emojiEl = document.getElementById('fcQuizEmoji');
  const viEl = document.getElementById('fcQuizVi');
  const ipaEl = document.getElementById('fcQuizIpa');
  const hintEl = document.getElementById('fcQuizSentenceHint');
  const optBox = document.getElementById('fcQuizOptions');
  const fb = document.getElementById('fcQuizFeedback');
  if(!emojiEl || !optBox) return;

  emojiEl.innerHTML = `<div style="max-width:340px;height:135px;margin:0 auto 8px;border-radius:16px;overflow:hidden;border:2px solid #e0e7ff;position:relative">${buildLittleFoxSceneSVG(fcQuizTarget, 1)}</div>`;
  if(viEl) viEl.textContent = `${fcQuizTarget.meaning} (Level ${fcQuizTarget.level || 1})`;
  if(ipaEl) ipaEl.textContent = `${fcQuizTarget.ipa || ''} • ${fcQuizTarget.series || 'Little Fox'}`;
  if(hintEl) hintEl.textContent = `🌱 Câu trong tranh: "${fcQuizTarget.step1En}"`;
  if(fb) fb.innerHTML = '';

  const all = getAllFlashcards();
  const others = all.filter(x => x.id !== fcQuizTarget.id).sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [fcQuizTarget, ...others].sort(() => Math.random() - 0.5);

  optBox.innerHTML = '';
  choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fc-quiz-opt';
    btn.innerHTML = `<div>${ch.emoji || '🌟'} <b>${safe(ch.word)}</b></div><div class="note" style="font-size:12px;margin-top:2px">${safe(ch.step1En)}</div>`;
    btn.onclick = () => {
      if(ch.id === fcQuizTarget.id){
        btn.classList.add('correct');
        fcQuizStreak++;
        playChime('success');
        speakEnglishText(`${ch.word}. ${ch.step1En}`, 0.9);
        document.getElementById('fcQuizProgressText').textContent = `${fcQuizStreak} / 5`;
        if(fb) fb.innerHTML = `<div style="color:#059669;font-weight:800;margin-top:8px">🎉 Chính xác! ${safe(ch.word)} — ${safe(ch.step1En)}</div>`;
        if(fcQuizStreak >= 5){
          fcQuizStreak = 0;
          document.getElementById('fcQuizProgressText').textContent = `0 / 5`;
          quickAwardCoreStudy('Tiếng Anh', 'Hoàn thành xuất sắc 5 câu đố Tiếng Anh Little Fox', 10);
        }
        setTimeout(nextFlashcardQuizQuestion, 1500);
      }else{
        btn.classList.add('wrong');
        playPenaltySound();
        if(fb) fb.innerHTML = `<div style="color:#dc2626;font-weight:800;margin-top:8px">💡 Chưa đúng rồi! Hãy bấm 🔊 Nghe phát âm chuẩn và thử lại nhé.</div>`;
      }
    };
    optBox.appendChild(btn);
  });
}

function speakQuizTarget(rate = 0.9){
  if(fcQuizTarget) speakEnglishText(fcQuizTarget.word, rate);
}

function speakQuizSentence(){
  if(fcQuizTarget) speakEnglishText(`${fcQuizTarget.step1En} ${fcQuizTarget.step2En}`, 0.85);
}

function openAddFlashcardModal(){
  const sel = document.getElementById('newFcTopic');
  if(sel){
    sel.innerHTML = '';
    ['🐾 Động vật','🍎 Đồ ăn & Quả','👨‍👩‍👧 Gia đình','🏫 Trường học','🎹 Âm nhạc & Đàn','🌈 Thiên nhiên','🚀 Hành động','💖 Cảm xúc & Tính cách','👑 Vĩ nhân & Ước mơ'].forEach(t => sel.add(new Option(t, t)));
  }
  document.getElementById('addFlashcardModal')?.classList.add('show');
}

function closeAddFlashcardModal(){
  document.getElementById('addFlashcardModal')?.classList.remove('show');
}

function submitNewFlashcard(){
  const word = document.getElementById('newFcWord')?.value.trim();
  const meaning = document.getElementById('newFcMeaning')?.value.trim();
  if(!word || !meaning) return alert('Vui lòng nhập Từ Tiếng Anh và Nghĩa Tiếng Việt.');
  const level = Number(document.getElementById('newFcLevel')?.value || 1);
  const topic = document.getElementById('newFcTopic')?.value || '🐾 Động vật';
  const emoji = document.getElementById('newFcEmoji')?.value.trim() || '🌟';
  const ipa = document.getElementById('newFcIpa')?.value.trim() || '';
  const step1En = document.getElementById('newFcStep1En')?.value.trim() || `It is a ${word.toLowerCase()}.`;
  const step2En = document.getElementById('newFcExampleEn')?.value.trim() || `I like this ${word.toLowerCase()}.`;
  const step3En = document.getElementById('newFcStep3En')?.value.trim() || `I can see a nice ${word.toLowerCase()} today.`;
  const stepVi = document.getElementById('newFcExampleVi')?.value.trim() || meaning;
  const passageEn = document.getElementById('newFcPassageEn')?.value.trim() || `${step1En} ${step2En} ${step3En}`;
  const imageUrl = document.getElementById('newFcImageUrl')?.value.trim() || '';

  if(!Array.isArray(data.customFlashcards)) data.customFlashcards = [];
  data.customFlashcards.push({
    id: uid('lf'), level, series: `Custom Level ${level}`, topic, word, pos: 'word', ipa, meaning, emoji,
    imageUrl,
    step1En, step1Vi: stepVi, step1Icons: [emoji, '🌱'],
    step2En, step2Vi: stepVi, step2Icons: [emoji, '🌿', '✨'],
    step3En, step3Vi: stepVi, step3Icons: [emoji, '🌳', '🌟'],
    passageTitle: `Story about ${word}`,
    passageEn, passageVi: stepVi, passageIcons: [emoji, '📖', '🌟']
  });
  save();
  closeAddFlashcardModal();
  renderFlashcards();
  showToast(`🎉 Đã thêm thẻ hình & nội dung đọc "${word}" vào bộ Little Fox!`);
}

function renderFlashcards(){
  const sec = document.getElementById('flashcardsSection');
  if(!sec) return;
  const c = child();
  const all = getAllFlashcards();
  const mastered = getMasteredSet();

  const nameEl = document.getElementById('fcChildName');
  if(nameEl) nameEl.textContent = c ? c.name : 'bé';

  const mCountEl = document.getElementById('fcMasteredCount');
  if(mCountEl) mCountEl.textContent = `${mastered.size}/${all.length}`;

  // Tính tổng sao thưởng Tiếng Anh của bé
  const earnedStarsEl = document.getElementById('fcEarnedStars');
  if(earnedStarsEl && c && Array.isArray(c.logs)){
    const enStars = c.logs
      .filter(l => (l.subject === 'Tiếng Anh' || (l.reason && l.reason.includes('Tiếng Anh'))) && Number(l.amount) > 0)
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);
    earnedStarsEl.textContent = `+${enStars} ⭐`;
  }

  const cAll = document.getElementById('fcCountAll');
  const cLearn = document.getElementById('fcCountLearning');
  const cMast = document.getElementById('fcCountMastered');
  if(cAll) cAll.textContent = all.length;
  if(cLearn) cLearn.textContent = Math.max(0, all.length - mastered.size);
  if(cMast) cMast.textContent = mastered.size;

  // 1. Thanh chọn Level Little Fox (Level 1 -> Level 4)
  const lvBar = document.getElementById('fcLevelBar');
  if(lvBar){
    const countByLv = (lvId) => all.filter(x => Number(x.level || 1) === lvId).length;
    let html = `
      <button type="button" class="lf-level-btn ${fcCurrentLevel==='all'?'active':''}" onclick="setFlashcardLevel('all')">
        <div class="lf-level-top">
          <span class="lf-level-title">🦊 Tất cả Level (1–4)</span>
          <span class="lf-level-badge">${all.length} thẻ</span>
        </div>
        <div class="lf-level-desc">Toàn bộ lộ trình hình ảnh &amp; bài đọc Little Fox</div>
      </button>
    `;
    LITTLE_FOX_LEVELS.forEach(lv => {
      const cnt = countByLv(lv.id);
      html += `
        <button type="button" class="lf-level-btn ${Number(fcCurrentLevel)===lv.id?'active':''}" onclick="setFlashcardLevel(${lv.id})">
          <div class="lf-level-top">
            <span class="lf-level-title">${lv.shortTitle}</span>
            <span class="lf-level-badge">${cnt} thẻ</span>
          </div>
          <div class="lf-level-desc">${safe(lv.seriesList)}</div>
        </button>
      `;
    });
    lvBar.innerHTML = html;
  }

  // Banner mô tả chi tiết Level đang chọn
  const lvBanner = document.getElementById('fcLevelBanner');
  if(lvBanner){
    const activeLvObj = LITTLE_FOX_LEVELS.find(l => l.id === Number(fcCurrentLevel));
    if(activeLvObj){
      lvBanner.innerHTML = `
        <div>
          <div style="font-weight:900;font-size:14.5px;color:#92400e">${activeLvObj.badge}</div>
          <div style="font-size:12.5px;color:#78350f;margin-top:2px">🎬 <b>Series Little Fox:</b> ${safe(activeLvObj.seriesList)} • <b>Mẫu câu:</b> <code>${safe(activeLvObj.pattern)}</code></div>
        </div>
        <span class="study-badge" style="background:${activeLvObj.color}">${safe(activeLvObj.name)}</span>
      `;
    }else{
      lvBanner.innerHTML = `
        <div>
          <div style="font-weight:900;font-size:14px;color:#92400e">🦊 Lộ trình Chuẩn Little Fox Level 1 → Level 4 (32+ Thẻ Tranh &amp; 8 Truyện Đọc Theo Ảnh)</div>
          <div style="font-size:12.5px;color:#78350f;margin-top:2px">Bấm chọn từng <b>Level 1, 2, 3, 4</b> phía trên để học từ câu ngắn 3 từ đến đoạn văn thuyết trình hoàn chỉnh!</div>
        </div>
        <button type="button" class="secondary" style="padding:6px 12px;font-size:12px;font-weight:800;background:#fff" onclick="setFlashcardMode('guide')">📖 Xem Truyện Tranh L1–L4</button>
      `;
    }
  }

  // 2. Thanh chọn Chủ đề (Topics)
  const tpBar = document.getElementById('fcTopicBar');
  if(tpBar){
    const topics = Array.from(new Set(all.map(x => x.topic)));
    let html = `<button type="button" class="fc-topic-btn ${fcCurrentTopic==='all'?'active':''}" onclick="setFlashcardTopic('all')"><span>📚 Tất cả chủ đề</span><span class="fc-topic-count">${all.length}</span></button>`;
    topics.forEach(tp => {
      const cnt = all.filter(x => x.topic === tp).length;
      html += `<button type="button" class="fc-topic-btn ${fcCurrentTopic===tp?'active':''}" onclick="setFlashcardTopic('${safe(tp)}')"><span>${safe(tp)}</span><span class="fc-topic-count">${cnt}</span></button>`;
    });
    tpBar.innerHTML = html;
  }

  const deck = getFilteredFlashcards();
  if(fcCurrentIdx >= deck.length) fcCurrentIdx = 0;
  const current = deck[fcCurrentIdx] || all[0];
  if(!current) return;

  const isMast = mastered.has(current.id);
  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setTxt('fcFrontLevel', `🌱 Level ${current.level || 1}`);
  setTxt('fcFrontSeries', `🦊 ${current.series || 'Little Fox'}`);
  setTxt('fcFrontTopic', current.topic);
  setTxt('fcFrontWord', current.word);
  setTxt('fcFrontPos', current.pos || 'noun');
  setTxt('fcFrontIpa', current.ipa || '');
  setTxt('fcFrontQuickVi', `🇻🇳 ${current.meaning}`);
  setTxt('fcBackTopic', `${current.topic} • ${current.series || 'Little Fox'}`);
  setTxt('fcBackWordMini', `${current.word} • ${current.ipa || ''}`);
  setTxt('fcBackEmoji', current.emoji || '🌟');
  setTxt('fcBackMeaning', current.meaning);
  setTxt('fcCurrentIndex', deck.length ? (fcCurrentIdx + 1) : 0);
  setTxt('fcTotalInDeck', deck.length);

  // Vẽ tranh minh họa trực quan trên mặt trước thẻ 3D
  const illusBox = document.getElementById('fcFrontIllustrationBox');
  if(illusBox){
    illusBox.innerHTML = buildLittleFoxSceneSVG(current, 1);
  }

  const starterEl = document.getElementById('fcFrontStarterSentence');
  if(starterEl){
    starterEl.innerHTML = `🌱 <b>Ảnh 1:</b> ${renderInteractiveEnglishTokens(current.step1En, current.word)}`;
  }

  const badgeEl = document.getElementById('fcFrontMasteredBadge');
  if(badgeEl) badgeEl.style.display = isMast ? 'inline-block' : 'none';

  const masterBtn = document.getElementById('fcMasterBtn');
  if(masterBtn){
    masterBtn.classList.toggle('mastered', isMast);
    masterBtn.innerHTML = isMast ? '✅ Đã thuộc (Bấm để học lại)' : '⭐ Đánh dấu Đã thuộc (+2 ⭐)';
  }

  const progBar = document.getElementById('fcDeckProgressBar');
  if(progBar) progBar.style.width = (deck.length ? Math.round(((fcCurrentIdx + 1) / deck.length) * 100) : 0) + '%';

  const passageText = current.passageEn || `${current.step1En} ${current.step2En} ${current.step3En}`;
  const passageViText = current.passageVi || `${current.step1Vi} ${current.step2Vi} ${current.step3Vi}`;

  const backPreview = document.getElementById('fcBackLadderPreview');
  if(backPreview){
    backPreview.innerHTML = `
      <div style="cursor:pointer" onclick="event.stopPropagation(); speakCurrentLadderStep(1)">🖼️ <b>Ảnh 1:</b> ${safe(current.step1En)} <i>(${safe(current.step1Vi)})</i></div>
      <div style="cursor:pointer" onclick="event.stopPropagation(); speakCurrentLadderStep(2)">🖼️ <b>Ảnh 2:</b> ${safe(current.step2En)} <i>(${safe(current.step2Vi)})</i></div>
      <div style="cursor:pointer" onclick="event.stopPropagation(); speakCurrentLadderStep(3)">🖼️ <b>Ảnh 3:</b> ${safe(current.step3En)} <i>(${safe(current.step3Vi)})</i></div>
      <div style="cursor:pointer;color:#b45309;margin-top:2px" onclick="event.stopPropagation(); speakCurrentLadderStep(4)">📖 <b>Ảnh 4 (Đoạn đọc):</b> ${safe(passageText)}</div>
    `;
  }

  // 3. Render 4 Bức Ảnh & Nội Dung Đọc Chuẩn Little Fox (Từng ảnh + Nội dung đọc + Âm thanh chuẩn)
  const ladderBox = document.getElementById('fcLadderStepsBox');
  if(ladderBox){
    const stepsData = [
      {
        step: 1,
        tagClass: 't1',
        tagLabel: '🖼️ ẢNH 1 • TỪ VỰNG & CÂU NGẮN (STARTER)',
        en: current.step1En,
        vi: current.step1Vi
      },
      {
        step: 2,
        tagClass: 't2',
        tagLabel: '🖼️ ẢNH 2 • MỞ RỘNG ĐẶC ĐIỂM & HÀNH ĐỘNG',
        en: current.step2En,
        vi: current.step2Vi
      },
      {
        step: 3,
        tagClass: 't3',
        tagLabel: '🖼️ ẢNH 3 • CÂU GIAO TIẾP TRONG TRUYỆN',
        en: current.step3En,
        vi: current.step3Vi
      },
      {
        step: 4,
        tagClass: 't1',
        tagLabel: `📖 ẢNH 4 • BÀI ĐỌC NGẮN LITTLE FOX: "${safe(current.passageTitle || current.word)}"`,
        en: passageText,
        vi: passageViText
      }
    ];

    ladderBox.innerHTML = stepsData.map(item => `
      <div class="lf-pic-read-card step-${item.step}" id="lfPicCard_${item.step}">
        <div class="lf-pic-visual" onclick="speakCurrentLadderStep(${item.step})" title="Chạm vào bức ảnh để nghe đọc nội dung">
          ${buildLittleFoxSceneSVG(current, item.step)}
        </div>
        <div class="lf-pic-body">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">
              <span class="lf-step-tag ${item.tagClass}">${item.tagLabel}</span>
              <span class="note" style="font-size:11px">👆 Chạm từng từ để nghe lẻ</span>
            </div>
            <div class="lf-interactive-sentence">
              ${renderInteractiveEnglishTokens(item.en, current.word)}
            </div>
            <div class="lf-step-vi" style="margin-top:5px">🇻🇳 ${safe(item.vi)}</div>
          </div>
          <div class="lf-step-actions" style="margin-top:6px">
            <button type="button" class="lf-step-btn primary-speak" onclick="speakCurrentLadderStep(${item.step})">
              🔊 Đọc chuẩn Ảnh ${item.step}
            </button>
            <button type="button" class="lf-step-btn slow-speak" onclick="speakCurrentLadderStep(${item.step}, 0.58)">
              🐢 Đọc chậm
            </button>
            <button type="button" class="lf-step-btn mic-speak" onclick="startVoicePractice(${item.step})">
              🎙️ Con tập đọc
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 4. Chế độ 2: Bảng tranh & Nghe nhanh (Grid View có tranh minh họa từng thẻ)
  const gridBox = document.getElementById('fcGridContainer');
  if(gridBox && fcCurrentMode === 'grid'){
    gridBox.innerHTML = deck.map((item, idx) => {
      const itemMastered = mastered.has(item.id);
      return `
        <div class="fc-mini-card ${itemMastered ? 'mastered' : ''}">
          <div>
            <div style="height:115px;border-radius:12px;overflow:hidden;position:relative;margin-bottom:8px;cursor:pointer;border:1px solid #e2e8f0" onclick="speakEnglishText('${safe(item.word)}. ${safe(item.step1En)}', fcSpeechRate)">
              ${buildLittleFoxSceneSVG(item, 1)}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:4px">
              <span class="lf-level-pill" style="font-size:10px">Level ${item.level}</span>
              <span class="note" style="font-size:11px;font-weight:700">${safe(item.series || item.topic)}</span>
            </div>
            <div class="fc-mini-word">${safe(item.word)} <span class="fc-mini-ipa">${safe(item.ipa || '')}</span></div>
            <div class="fc-mini-meaning">🇻🇳 ${safe(item.meaning)}</div>
            <div style="margin-top:6px;font-size:12.5px;line-height:1.45;color:#1e293b">
              <div>🖼️ <b>1:</b> ${safe(item.step1En)}</div>
              <div>🖼️ <b>2:</b> ${safe(item.step2En)}</div>
              <div>🖼️ <b>3:</b> ${safe(item.step3En)}</div>
            </div>
          </div>
          <div class="fc-mini-actions" style="flex-wrap:wrap">
            <button type="button" class="fc-mini-btn speak" onclick="speakEnglishText('${safe(item.word)}', fcSpeechRate)">🔊 Từ</button>
            <button type="button" class="fc-mini-btn speak" onclick="speakEnglishText('${safe(item.step1En)} ${safe(item.step2En)} ${safe(item.step3En)}', fcSpeechRate)">🎧 3 Câu</button>
            <button type="button" class="fc-mini-btn" onclick="fcCurrentIdx=${idx}; setFlashcardMode('card')">🖼️ Mở 4 ảnh</button>
            <button type="button" class="fc-mini-btn master ${itemMastered ? 'active' : ''}" onclick="toggleCurrentCardMastered('${item.id}')">${itemMastered ? '✅' : '⭐'}</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 5. Chế độ 4: Truyện tranh đọc theo từng ảnh chuẩn Little Fox (Level 1 -> Level 4)
  const guideBox = document.getElementById('fcGuideContainer');
  if(guideBox && fcCurrentMode === 'guide'){
    const activeStory = LITTLE_FOX_STORYBOOKS.find(s => s.id === fcActiveStoryId) || LITTLE_FOX_STORYBOOKS[0];
    const storyTabsHtml = LITTLE_FOX_STORYBOOKS.map(st => `
      <button type="button" class="lf-story-tab-btn ${st.id === activeStory.id ? 'active' : ''}" onclick="selectLittleFoxStory('${st.id}')">
        <span>${st.emoji}</span>
        <span><b>Level ${st.level}:</b> ${safe(st.series)}</span>
      </button>
    `).join('');

    const scenesHtml = activeStory.scenes.map((sc, sIdx) => `
      <div class="lf-story-scene-item" id="lfStoryScene_${sIdx}">
        <div class="lf-pic-visual" style="height:160px" onclick="speakStoryScene('${activeStory.id}', ${sIdx})">
          ${buildLittleFoxSceneSVG(sc, sIdx + 1)}
        </div>
        <div class="lf-pic-body">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:4px">
              <span class="lf-step-tag t2">${safe(sc.title)}</span>
              <span class="note" style="font-size:11px">🔑 ${safe(sc.vocab)}</span>
            </div>
            <div class="lf-interactive-sentence">
              ${renderInteractiveEnglishTokens(sc.en)}
            </div>
            <div class="lf-step-vi" style="margin-top:6px">🇻🇳 ${safe(sc.vi)}</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
            <button type="button" class="lf-step-btn primary-speak" onclick="speakStoryScene('${activeStory.id}', ${sIdx})">🔊 Nghe đọc Ảnh ${sc.sceneNo}</button>
            <button type="button" class="lf-step-btn slow-speak" onclick="speakStoryScene('${activeStory.id}', ${sIdx}, 0.6)">🐢 Đọc chậm</button>
          </div>
        </div>
      </div>
    `).join('');

    guideBox.innerHTML = `
      <div class="lf-method-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
          <div>
            <span class="study-badge" style="background:linear-gradient(135deg,#ea580c,#f59e0b)">📖 TRUYỆN TRANH ĐỌC THEO TỪNG ẢNH LITTLE FOX</span>
            <h3 style="margin:6px 0 2px;font-size:19px;color:#1e293b">Chọn bộ truyện theo Level ➔ Nhìn từng bức tranh &amp; Nghe giọng bản xứ đọc</h3>
            <div class="note">Mỗi câu chuyện gồm 4 bức tranh liên hoàn. Chạm vào từng từ để nghe phát âm lẻ hoặc bấm <b>“▶️ Tự động đọc cả truyện”</b>!</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="fc-speak-btn fc-speak-vi" onclick="togglePlayEntireStorybook('${activeStory.id}')">
              ${fcStoryAutoTimer ? '⏹ Dừng đọc truyện' : '▶️ Tự động đọc cả 4 ảnh truyện'}
            </button>
            <button type="button" class="primary" style="padding:9px 15px;font-size:13px;background:linear-gradient(135deg,#10b981,#059669)" onclick="quickAwardCoreStudy('Tiếng Anh','Hoàn thành đọc truyện tranh Little Fox: ${safe(activeStory.title)}',15)">
              ⭐ +15 ⭐ Đã đọc xong truyện
            </button>
          </div>
        </div>

        <div class="lf-story-tabs">${storyTabsHtml}</div>

        <div style="background:#fff;border:1.5px solid #fed7aa;border-radius:16px;padding:14px;margin-bottom:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
            <div>
              <span class="lf-level-pill">Level ${activeStory.level} • ${safe(activeStory.series)}</span>
              <h4 style="margin:4px 0 2px;font-size:17px;color:#0f172a">${activeStory.emoji} ${safe(activeStory.title)}</h4>
              <div class="note">${safe(activeStory.summary)}</div>
            </div>
          </div>
        </div>

        <div class="lf-story-scenes-list">${scenesHtml}</div>
      </div>
    `;
  }
}

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
  const coreTabParam = urlParams.get('coreTab');
  if (coreTabParam && typeof switchCoreStudyTab === 'function') {
    switchCoreStudyTab(coreTabParam);
  }
}
applyInitialHash();
window.addEventListener('hashchange', applyInitialHash);


/* ============================================================
   💾 SAO LƯU & ĐỒNG BỘ DỮ LIỆU FILE JSON TOÀN BỘ DỰ ÁN
   ============================================================ */
function exportProjectDataJSON() {
  try {
    const backupObj = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      appName: 'Vui Học Cùng Con - Bảo Nhi',
      data: data
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vuihoc_dulieu_${todayISO()}_baonhi.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('💾 Đã xuất file sao lưu dữ liệu toàn bộ dự án thành công!');
  } catch(e) {
    alert('Xuất dữ liệu thất bại: ' + e.message);
  }
}

function triggerImportProjectData() {
  const fileInp = document.getElementById('projectDataFileInput');
  if (fileInp) fileInp.click();
}

function handleImportProjectData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const importedData = parsed.data || parsed;
      if (!importedData || !Array.isArray(importedData.children)) {
        throw new Error('File không đúng cấu trúc dữ liệu dự án Vui Học Cùng Con.');
      }

      askConfirm(
        'Khôi phục dữ liệu toàn bộ dự án',
        `Bạn có chắc muốn nạp dữ liệu từ file "${file.name}" không?\n\nDữ liệu hiện tại trên máy sẽ được cập nhật đồng bộ với file này.`,
        () => {
          try {
            localStorage.setItem(STORAGE_KEY + '.backup_before_import', JSON.stringify(data));
          } catch(err) {}

          data = importedData;
          if (!data.exchangeRate || data.exchangeRate.vnd === 5000) data.exchangeRate = { stars: 100, vnd: 10000 };
          data.children.forEach(c => {
            if (typeof ensurePiggyPet === 'function') ensurePiggyPet(c);
            updateEarnedAchievements(c);
          });
          save();
          render();
          playChime('success');
          triggerConfetti();
          showToast('🎉 Đã đồng bộ và khôi phục toàn bộ dữ liệu dự án thành công!');
        },
        { yesText: 'Đồng ý nạp dữ liệu', icon: '📥' }
      );
    } catch(err) {
      alert('Đọc file sao lưu thất bại: ' + err.message);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}
