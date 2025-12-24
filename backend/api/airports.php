<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../config/db.php";

$sql = "
    SELECT 
        airportID,
        airport_code,
        airport_name,
        city,
        country
    FROM Airports
    ORDER BY city, airport_name
";

$stmt = $pdo->query($sql);
$airports = $stmt->fetchAll();

echo json_encode([
    "status" => "success",
    "data" => $airports
]);
