/**
 * 🌟 GOOGLE APPS SCRIPT ĐỒNG BỘ DỰ ÁN VUI HỌC CÙNG CON VÀO GOOGLE TRANG TÍNH (GOOGLE SHEETS)
 * 
 * Hướng dẫn 3 bước cực kỳ đơn giản:
 * 1. Mở trang Google Trang tính mới tại: https://sheets.google.com -> Đặt tên bảng tính: "Vui Học Cùng Con"
 * 2. Trên thanh menu, bấm Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa sạch mã cũ, dán toàn bộ đoạn mã bên dưới vào và bấm biểu tượng Lưu (hoặc Ctrl + S).
 * 4. Bấm nút màu xanh "Triển khai" (Deploy) ở góc trên bên phải -> chọn "Triển khai dưới dạng ứng dụng web" (New deployment -> Web app):
 *    - Mô tả: "Đồng bộ điểm Bảo Nhi"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)
 * 5. Bấm "Triển khai" (Deploy), chọn tài khoản Google của bạn và bấm Cho phép (Allow).
 * 6. Copy đường link "URL ứng dụng web" (có dạng: https://script.google.com/macros/s/.../exec)
 *    rồi dán vào Web Vui Học Cùng Con mục: 🔒 Khu vực phụ huynh -> ☁️ Đồng bộ đa thiết bị.
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rawJson = sheet.getRange('A1').getValue();
  var updatedAt = sheet.getRange('B1').getValue();
  
  var result = {
    status: 'ok',
    data: rawJson ? JSON.parse(rawJson) : null,
    updated_at: updatedAt || new Date().toISOString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var now = new Date().toISOString();
    
    // 1. Lưu bản JSON đầy đủ ở ô A1 để ứng dụng web khôi phục 100% dữ liệu
    sheet.getRange('A1').setValue(JSON.stringify(body.data));
    sheet.getRange('B1').setValue(now);
    
    // 2. Ghi bảng tóm tắt trực quan vào Google Trang tính để bố mẹ mở điện thoại/máy tính xem được ngay
    var child = (body.data && body.data.children && body.data.children[0]) ? body.data.children[0] : null;
    if (child) {
      sheet.getRange('A3').setValue('THÔNG TIN BÉ:');
      sheet.getRange('B3').setValue(child.name || 'Bảo Nhi');
      sheet.getRange('A4').setValue('ĐIỂM SAO HIỆN CÓ:');
      sheet.getRange('B4').setValue((child.score || 0) + ' ⭐');
      sheet.getRange('A5').setValue('QUY ĐỔI TIỀN MẶT:');
      sheet.getRange('B5').setValue((((child.score || 0) / 100) * 10000).toLocaleString('vi-VN') + ' đ');
      
      var pig = child.piggyPet || {};
      sheet.getRange('A6').setValue('CÂN NẶNG HEO ĐẤT:');
      sheet.getRange('B6').setValue((pig.weightKg ? pig.weightKg.toFixed(1) : '1.2') + ' kg');
      sheet.getRange('A7').setValue('TIỀN TRONG BỤNG HEO:');
      sheet.getRange('B7').setValue((pig.coinsVND ? pig.coinsVND.toLocaleString('vi-VN') : '0') + ' đ');
      sheet.getRange('A8').setValue('CẬP NHẬT LẦN CUỐI:');
      sheet.getRange('B8').setValue(new Date().toLocaleString('vi-VN'));
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', updated_at: now }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
