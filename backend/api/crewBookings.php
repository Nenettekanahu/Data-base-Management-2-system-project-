<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

// Preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// GET — fetch all bookings
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "
        SELECT 
            b.bookingID,
            b.booking_date,
            b.total_amount,
            f.flight_number,
            a1.city AS origin,
            a2.city AS dest,
            u.first_name,
            u.last_name
        FROM Bookings b
        JOIN Flights f ON b.flightID = f.flightID
        JOIN Passengers p ON b.passengerID = p.passengerID
        JOIN Users u ON p.userID = u.userID
        JOIN Airports a1 ON f.origin_airportID = a1.airportID
        JOIN Airports a2 ON f.destination_airportID = a2.airportID
        ORDER BY b.bookingID DESC
    ";

    $stmt = $pdo->query($sql);
    $result = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => $result
    ]);
    exit;
}

// PUT — update booking (flightID + total + airport)
if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($data["bookingID"]) ||
        !isset($data["flightID"]) ||
        !isset($data["airportID"]) ||
        !isset($data["total_amount"])
    ) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $sql = "
        UPDATE Bookings
        SET flightID = :flightID, 
            airportID = :airportID, 
            total_amount = :total_amount
        WHERE bookingID = :bookingID
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":flightID" => $data["flightID"],
        ":airportID" => $data["airportID"],
        ":total_amount" => $data["total_amount"],
        ":bookingID" => $data["bookingID"]
    ]);

    echo json_encode(["status" => "success", "message" => "Booking updated"]);
    exit;
}

// DELETE — cancel booking
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $bookingID = $_GET["bookingID"] ?? null;

    if (!$bookingID) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "bookingID required"]);
        exit;
    }

    // First delete related payments
    $pdo->prepare("DELETE FROM Payments WHERE bookingID = ?")->execute([$bookingID]);

    // Then delete booking
    $pdo->prepare("DELETE FROM Bookings WHERE bookingID = ?")->execute([$bookingID]);

    echo json_encode(["status" => "success", "message" => "Booking removed"]);
    exit;
}
