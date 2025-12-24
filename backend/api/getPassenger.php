<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../config/db.php";

if (!isset($_GET["userID"])) {
    echo json_encode(["status" => "error", "message" => "userID required"]);
    exit;
}

$userID = (int) $_GET["userID"];

$sql = "
    SELECT passengerID, passport_number
    FROM Passengers
    WHERE userID = :userID
    LIMIT 1
";

$stmt = $pdo->prepare($sql);
$stmt->execute([":userID" => $userID]);

$passenger = $stmt->fetch();

if (!$passenger) {
    echo json_encode(["status" => "error", "message" => "Passenger not found"]);
    exit;
}

echo json_encode([
    "status" => "success",
    "data" => $passenger
]);
