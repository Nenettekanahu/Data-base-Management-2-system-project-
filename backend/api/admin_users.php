<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/**************************************
 GET — all users
**************************************/
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "
        SELECT userID, username, first_name, last_name, email, role
        FROM Users
        ORDER BY role, first_name
    ";

    $stmt = $pdo->query($sql);
    $users = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => $users
    ]);
    exit;
}

/**************************************
 PATCH — update user role
**************************************/
if ($_SERVER["REQUEST_METHOD"] === "PATCH") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["userID"]) || !isset($data["role"])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $sql = "
        UPDATE Users 
        SET role = :role
        WHERE userID = :id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":role" => $data["role"],
        ":id" => $data["userID"]
    ]);

    echo json_encode(["status" => "success", "message" => "User updated"]);
    exit;
}
