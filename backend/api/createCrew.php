<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { exit; }

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode(["status" => "error", "message" => "Method not allowed"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (
  !isset($data["username"]) ||
  !isset($data["first_name"]) ||
  !isset($data["last_name"]) ||
  !isset($data["email"]) ||
  !isset($data["password"]) ||
  !isset($data["job_title"])
) {
  echo json_encode(["status" => "error", "message" => "Missing fields"]);
  exit;
}

try {
  $sql = "INSERT INTO Users (username, first_name, last_name, email, password, role)
          VALUES (:username, :first_name, :last_name, :email, :password, 'crew')";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ":username" => $data["username"],
    ":first_name" => $data["first_name"],
    ":last_name" => $data["last_name"],
    ":email" => $data["email"],
    ":password" => $data["password"],
  ]);

  $userID = $pdo->lastInsertId();

  $sqlCrew = "INSERT INTO Crew (userID, job_title)
              VALUES (:userID, :job_title)";

  $stmt2 = $pdo->prepare($sqlCrew);
  $stmt2->execute([
    ":userID" => $userID,
    ":job_title" => $data["job_title"]
  ]);

  echo json_encode(["status" => "success", "message" => "Crew member created"]);
}
catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
