<?php
session_start();

/* โค้ดสำหรับส่งข้อมูลจาก PHP ไปยังเว็บไซต์ทำการประมูล */

// ปิดการแสดงข้อผิดพลาด
error_reporting(0);
ini_set('display_errors', 0);

// กำหนด Content-Type เป็น JSON
header('Content-Type: application/json');

// ชื่อไฟล์สำหรับเก็บข้อมูลสินค้าและผู้เข้าร่วม
$auction_product_file = 'auction_product.json';
$bidders_file = 'bidders.json';

// ฟังก์ชันสุ่มสินค้า
function getRandomProducts($count = 1)
{
    $file_path = 'products.json';

    if (!file_exists($file_path)) {
        echo json_encode(['status' => 'error', 'message' => 'File not found']);
        exit;
    }

    $json_data = file_get_contents($file_path);
    if ($json_data === false) {
        echo json_encode(['status' => 'error', 'message' => 'Unable to read file']);
        exit;
    }

    $products = json_decode($json_data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['status' => 'error', 'message' => 'JSON decode error: ' . json_last_error_msg()]);
        exit;
    }

    if (empty($products)) {
        return []; // หากไม่มีสินค้า ให้ส่งคืนอาเรย์ว่าง
    }

    if ($count > count($products)) {
        $count = count($products); // จำกัดจำนวนที่สุ่ม
    }

    $random_products = [];
    $keys = array_rand($products, $count);

    if (is_array($keys)) {
        foreach ($keys as $key) {
            $random_products[] = $products[$key];
        }
    } else {
        $random_products[] = $products[$keys];
    }

    return $random_products;
}

// ฟังก์ชันสำหรับการส่งข้อมูลสินค้าและข้อมูลผู้ใช้
function sendTradeInfo($status, $data = [], $user_data = [])
{
    $response = [

        'data' => $data, // ข้อมูลสินค้า

    ];

    // ส่งข้อมูลให้ผู้ใช้
    echo json_encode($response);
}

// ฟังก์ชันบันทึกข้อมูลสินค้าไปที่ไฟล์ JSON
function saveAuctionProduct($product)
{
    global $auction_product_file;
    // ลบไฟล์เก่าก่อนเขียนไฟล์ใหม่
    if (file_exists($auction_product_file)) {
        unlink($auction_product_file);
    }
    file_put_contents($auction_product_file, json_encode($product));
}

// ฟังก์ชันดึงข้อมูลสินค้าจากไฟล์ JSON
// ฟังก์ชันดึงข้อมูลสินค้าจากไฟล์ JSON พร้อมเพิ่มข้อมูลเริ่มต้นหากยังไม่มีไฟล์
function getAuctionProduct()
{
    global $auction_product_file;

    // ข้อมูลเริ่มต้นเมื่อยังไม่มีสินค้าในระบบ
    $default_product = [
        [
            "price" => 120,
            "sell" => 260,
            "description" => "ตุ๊กตาสุดนุ่มนิ่มจากสมัยสงครามโลกครั้งที่สอง ขุดพบในปี1995 ศิลปิน: ทะนงทวย",
            "name" => "ทูพีช",
            "image" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaa-5I-k9BnHSGdSNhTUBtaSbf3n9VM7_p1g&s"
        ]
    ];

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if (file_exists($auction_product_file)) {
        // อ่านข้อมูลจากไฟล์ JSON และแปลงเป็นอาเรย์
        $data = file_get_contents($auction_product_file);
        return json_decode($data, true);
    } else {
        // ถ้าไฟล์ไม่มีอยู่ ให้สร้างไฟล์และเขียนข้อมูลเริ่มต้นลงไป
        file_put_contents($auction_product_file, json_encode($default_product));
        return $default_product; // ส่งคืนข้อมูลเริ่มต้น
    }
}

// ฟังก์ชันบันทึกข้อมูลผู้เข้าร่วม
function saveBidder($email)
{
    global $bidders_file;
    $bidders = [];

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if (file_exists($bidders_file)) {
        // อ่านข้อมูลจากไฟล์ JSON และแปลงเป็นอาเรย์
        $bidders = json_decode(file_get_contents($bidders_file), true);
        if (!is_array($bidders)) {
            $bidders = []; // ตรวจสอบให้แน่ใจว่าเป็นอาเรย์
        }
    }

    // เพิ่มอีเมลลงในอาเรย์ถ้ายังไม่มีอยู่
    if (!in_array($email, $bidders)) {
        $bidders[] = $email;
    }

    // บันทึกข้อมูลผู้เข้าร่วมลงในไฟล์ JSON
    file_put_contents($bidders_file, json_encode($bidders));
}

// ตรวจสอบคำขอ POST สำหรับการสุ่มสินค้าใหม่
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ดึงข้อมูลจาก POST
    $status = $_POST['status'] ?? '';
    $user_email = $_POST['user_email'] ?? '';
    $user_money = $_POST['user_money'] ?? 0;
    $min_bid = $_POST['min_bid'] ?? 0;

    // เมื่อผู้ใช้เข้ามาที่หน้าเว็บ
    if (!isset($_SESSION['first_visit'])) {
        $products = getAuctionProduct();

        $products = getRandomProducts(1); // สุ่มผลิตภัณฑ์ 1 รายการ 
        saveAuctionProduct($products); // เก็บข้อมูลสินค้าที่สุ่มในไฟล์ JSON


        $_SESSION['first_visit'] = true; // ตั้งค่าให้รู้ว่าผู้ใช้ได้เข้าสู่ระบบแล้ว
        saveBidder($user_email); // เก็บอีเมลผู้เข้าร่วมในไฟล์ JSON

        // ส่งข้อมูลสินค้าไปยังผู้ใช้รวมถึงข้อมูลผู้ใช้
        sendTradeInfo('welcome', $products, [
            'user_email' => $user_email,
            'user_money' => $user_money,
            'min_bid' => $min_bid
        ]);
    } else {
        // ส่งสินค้าหมายเลขก่อนหน้าไปยังผู้ใช้
        sendTradeInfo('welcome_back', getAuctionProduct(), [
            'user_email' => $user_email,
            'user_money' => $user_money,
            'min_bid' => $min_bid
        ]);
    }

    // ตรวจสอบสถานะที่ส่งมา
    if ($status === 'red') {
        // สุ่มผลิตภัณฑ์ 1 รายการ
        $products = getRandomProducts(1);
        saveAuctionProduct($products); // เก็บข้อมูลสินค้าที่สุ่มในไฟล์ JSON

        // ส่งข้อมูลสินค้าไปยังผู้ใช้รวมถึงข้อมูลผู้ใช้ 
        sendTradeInfo('new_product', $products, [

            'user_email' => $user_email,
            'user_money' => $user_money,
            'min_bid' => $min_bid
        ]);
    } else {
        sendTradeInfo('error', [], ['message' => 'Invalid status']);
    }
    exit;
}
exit;
?>