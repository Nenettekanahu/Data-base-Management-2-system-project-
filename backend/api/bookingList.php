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
    SELECT 
        b.bookingID,
        b.total_amount,
        f.flight_number,
        a1.city AS origin,
        a2.city AS dest
    FROM Bookings b
    JOIN Flights f ON b.flightID = f.flightID
    JOIN Airports a1 ON f.origin_airportID = a1.airportID
    JOIN Airports a2 ON f.destination_airportID = a2.airportID
    JOIN Passengers p ON b.passengerID = p.passengerID
    WHERE p.userID = :userID
    ORDER BY b.bookingID DESC
";

$stmt = $pdo->prepare($sql);
$stmt->execute([":userID" => $userID]);

$list = $stmt->fetchAll();

echo json_encode([
    "status" => "success",
    "data" => $list
]);
