<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

// Préflight (CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ============================
// GET — Fetch bookings
// ============================
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // On regarde si un userID est passé dans l'URL
    // ex: /bookings.php?userID=1
    $userID = isset($_GET["userID"]) ? (int) $_GET["userID"] : null;

    if ($userID) {
        // 🔒 Version filtrée : bookings pour un utilisateur précis
        $sql = "
            SELECT 
                b.bookingID,
                b.booking_date,
                b.total_amount,
                p.passport_number,
                f.flight_number
            FROM Bookings b
            JOIN Passengers p ON b.passengerID = p.passengerID
            JOIN Users u ON p.userID = u.userID
            JOIN Flights f ON b.flightID = f.flightID
            WHERE u.userID = :userID
            ORDER BY b.booking_date DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([":userID" => $userID]);
        $bookings = $stmt->fetchAll();
    } else {
        // 🌍 Version globale : tous les bookings (ex: admin, tests)
        $sql = "
            SELECT 
                b.bookingID,
                b.booking_date,
                b.total_amount,
                p.passport_number,
                f.flight_number
            FROM Bookings b
            JOIN Passengers p ON b.passengerID = p.passengerID
            JOIN Flights f ON b.flightID = f.flightID
            ORDER BY b.booking_date DESC
        ";

        $stmt = $pdo->query($sql);
        $bookings = $stmt->fetchAll();
    }

    echo json_encode([
        "status" => "success",
        "data" => $bookings
    ]);
    exit;
}

// ============================
// POST — Create booking
// ============================
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($data["passengerID"]) ||
        !isset($data["flightID"]) ||
        !isset($data["airportID"]) ||
        !isset($data["total_amount"])
    ) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $sql = "
        INSERT INTO Bookings 
        (passengerID, airportID, flightID, booking_date, total_amount)
        VALUES (:passengerID, :airportID, :flightID, NOW(), :total_amount)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":passengerID" => $data["passengerID"],
        ":airportID" => $data["airportID"],
        ":flightID" => $data["flightID"],
        ":total_amount" => $data["total_amount"]
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Booking created successfully"
    ]);
    exit;
}

// Si on arrive ici : méthode non gérée
http_response_code(405);
echo json_encode([
    "status" => "error",
    "message" => "Method not allowed"
]);
