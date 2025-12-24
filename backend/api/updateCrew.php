<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["userID"]) ||
    !isset($data["first_name"]) ||
    !isset($data["last_name"]) ||
    !isset($data["email"]) ||
    !isset($data["job_title"])
) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

try {
    $sqlUser = "
        UPDATE Users 
        SET first_name = :first_name,
            last_name = :last_name,
            email = :email
        WHERE userID = :id
    ";

    $pdo->prepare($sqlUser)->execute([
        ":first_name" => $data["first_name"],
        ":last_name" => $data["last_name"],
        ":email" => $data["email"],
        ":id" => $data["userID"]
    ]);

    $sqlJob = "
        UPDATE Crew 
        SET job_title = :job 
        WHERE userID = :id
    ";

    $pdo->prepare($sqlJob)->execute([
        ":job" => $data["job_title"],
        ":id" => $data["userID"]
    ]);

    echo json_encode(["status" => "success", "message" => "Crew updated"]);
}
catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
