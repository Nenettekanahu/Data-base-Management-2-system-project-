<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["userID"])) {
    echo json_encode(["status" => "error", "message" => "userID missing"]);
    exit;
}

try {
    $userID = $data["userID"];

    $pdo->prepare("DELETE FROM Crew WHERE userID = :id")
        ->execute([":id" => $userID]);

    $pdo->prepare("DELETE FROM Users WHERE userID = :id")
        ->execute([":id" => $userID]);

    echo json_encode(["status" => "success", "message" => "Crew deleted"]);
}
catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
