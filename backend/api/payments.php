<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

// Preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ============================
// GET — Fetch payments for a user
// ============================
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (!isset($_GET["userID"])) {
        echo json_encode(["status" => "error", "message" => "userID required"]);
        exit;
    }

    $userID = (int) $_GET["userID"];

    $sql = "
        SELECT 
            pay.paymentID,
            pay.payment_date,
            pay.payment_method,
            pay.payment_status,
            b.bookingID,
            b.total_amount,
            f.flight_number,
            a1.city AS origin,
            a2.city AS dest
        FROM Payments pay
        JOIN Bookings b ON pay.bookingID = b.bookingID
        JOIN Flights f ON b.flightID = f.flightID
        JOIN Airports a1 ON f.origin_airportID = a1.airportID
        JOIN Airports a2 ON f.destination_airportID = a2.airportID
        JOIN Passengers p ON b.passengerID = p.passengerID
        WHERE p.userID = :userID
        ORDER BY pay.payment_date DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([":userID" => $userID]);

    $payments = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => $payments
    ]);
    exit;
}

// ============================
// POST — Create new payment
// ============================
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($data["bookingID"]) ||
        !isset($data["payment_method"]) ||
        !isset($data["payment_status"])
    ) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $sql = "
        INSERT INTO Payments 
        (bookingID, payment_date, payment_method, payment_status)
        VALUES (:bookingID, NOW(), :payment_method, :payment_status)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":bookingID" => $data["bookingID"],
        ":payment_method" => $data["payment_method"],
        ":payment_status" => $data["payment_status"]
    ]);

    echo json_encode(["status" => "success"]);
    exit;
}
