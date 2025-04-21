<?php
// ตั้งค่า header เพื่อรองรับการส่งข้อมูล JSON
header('Content-Type: application/json');

// ตรวจสอบว่ามีข้อมูล POST หรือไม่
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // รับข้อมูล JSON ที่ส่งมาจาก JavaScript
    $jsonData = file_get_contents('php://input');

    // กำหนดเส้นทางของไฟล์ products.json
    $filePath = 'products.json'; // เปลี่ยนเป็นเส้นทางที่ถูกต้อง

    // อัปเดตไฟล์ JSON
    if (file_put_contents($filePath, $jsonData) !== false) {
        // ส่งการตอบกลับสำเร็จ
        echo json_encode(['message' => 'อัปเดต products.json สำเร็จ']);
    } else {
        // ส่งการตอบกลับไม่สำเร็จ
        http_response_code(500);
        echo json_encode(['message' => 'การอัปเดตไม่สำเร็จ']);
    }
} else {
    // หากไม่ใช่ POST ให้ส่งสถานะ 405 (Method Not Allowed)
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
