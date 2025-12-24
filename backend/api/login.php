<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

// Handle preflight requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["password"])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Email and password are required"
    ]);
    exit;
}

$email = $data["email"];
$password = $data["password"];

// ⚠️ Ici on suppose que les mots de passe sont en clair dans la table Users
// (comme dans ton DML). Pour un vrai système, il faudrait hasher les mots
// de passe avec password_hash/password_verify.
$sql = "
    SELECT userID, username, first_name, last_name, email, role
    FROM Users
    WHERE email = :email AND password = :password
    LIMIT 1
";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ":email" => $email,
    ":password" => $password
]);

$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid email or password"
    ]);
    exit;
}

echo json_encode([
    "status" => "success",
    "user" => $user
]);
