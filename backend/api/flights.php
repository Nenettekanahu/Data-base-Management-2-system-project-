<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

// Preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

$from = $_GET["from"] ?? null;   // origin_airportID
$to   = $_GET["to"] ?? null;     // destination_airportID
$date = $_GET["date"] ?? null;   // YYYY-MM-DD

$sql = "
    SELECT 
        f.flightID,
        f.flight_number,
        f.origin_airportID,
        f.destination_airportID,
        f.departure_time,
        f.arrival_time,
        f.price,
        a1.city AS origin_city,
        a1.airport_code AS origin_code,
        a2.city AS dest_city,
        a2.airport_code AS dest_code
    FROM Flights f
    JOIN Airports a1 ON f.origin_airportID = a1.airportID
    JOIN Airports a2 ON f.destination_airportID = a2.airportID
";

$conditions = [];
$params = [];

if ($from) {
    $conditions[] = "f.origin_airportID = :from";
    $params[":from"] = $from;
}

if ($to) {
    $conditions[] = "f.destination_airportID = :to";
    $params[":to"] = $to;
}

if ($date) {
    $conditions[] = "DATE(f.departure_time) = :dep_date";
    $params[":dep_date"] = $date;
}

if ($conditions) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$sql .= " ORDER BY f.departure_time ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$flights = $stmt->fetchAll();

echo json_encode([
    "status" => "success",
    "data" => $flights
]);
