<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../config/db.php";

$sql = "
    SELECT 
        u.userID,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        c.job_title
    FROM Users u
    JOIN Crew c ON u.userID = c.userID
";

$stmt = $pdo->query($sql);
$data = $stmt->fetchAll();

echo json_encode([
    "status" => "success",
    "data" => $data
]);
