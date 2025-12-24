<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

// Preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

// Read body
$data = json_decode(file_get_contents("php://input"), true);

// Validate
if (
    !isset($data["username"]) ||
    !isset($data["first_name"]) ||
    !isset($data["last_name"]) ||
    !isset($data["email"]) ||
    !isset($data["password"]) ||
    !isset($data["passport_number"]) ||
    !isset($data["phone"]) ||
    !isset($data["gender"])
) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "All fields required"]);
    exit;
}

// Extract
$username = $data["username"];
$first_name = $data["first_name"];
$last_name = $data["last_name"];
$email = $data["email"];
$password = $data["password"];
$passport = $data["passport_number"];
$phone = $data["phone"];
$gender = $data["gender"];

try {

    // Check if email exists
    $check = $pdo->prepare("SELECT userID FROM Users WHERE email = :email");
    $check->execute([":email" => $email]);

    if ($check->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email already exists"]);
        exit;
    }

    // Insert into Users
    $sqlUser = "
        INSERT INTO Users (username, first_name, last_name, email, password, phone, gender, role)
        VALUES (:username, :first_name, :last_name, :email, :password, :phone, :gender, 'passenger')
    ";

    $stmtUser = $pdo->prepare($sqlUser);
    $stmtUser->execute([
        ":username" => $username,
        ":first_name" => $first_name,
        ":last_name" => $last_name,
        ":email" => $email,
        ":password" => $password,
        ":phone" => $phone,
        ":gender" => $gender
    ]);

    $userID = $pdo->lastInsertId();

    // Insert into Passengers
    $sqlPassenger = "
        INSERT INTO Passengers (userID, passport_number)
        VALUES (:userID, :passport)
    ";

    $stmtPass = $pdo->prepare($sqlPassenger);
    $stmtPass->execute([
        ":userID" => $userID,
        ":passport" => $passport
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Account created",
    ]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
