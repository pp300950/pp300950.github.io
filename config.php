<?php
$firebaseConfig = array(
    "apiKey" => "AIzaSyDN8Fp80rRWJ_vucMeh5bGVWfgE8Vj1zlc",
    "authDomain" => "myweb-840a2.firebaseapp.com",
    "projectId" => "myweb-840a2",
    "storageBucket" => "myweb-840a2.appspot.com",
    "messagingSenderId" => "177736263941",
    "appId" => "1:177736263941:web:f64638dffcc0ac1f2def6c",
    "measurementId" => "G-VV2HNMF0BT"
);

// ส่งข้อมูลในรูปแบบ JSON
header('Content-Type: application/json');
echo json_encode($firebaseConfig);
?>