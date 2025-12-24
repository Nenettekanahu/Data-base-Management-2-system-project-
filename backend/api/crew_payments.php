<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/**************************************
 GET — ALL PAYMENTS
**************************************/
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $sql = "
        SELECT 
            pay.paymentID,
            pay.payment_date,
            pay.payment_method,
            pay.payment_status,
            b.bookingID,
            u.first_name,
            u.last_name,
            f.flight_number,
            b.total_amount
        FROM Payments pay
        JOIN Bookings b ON pay.bookingID = b.bookingID
        JOIN Passengers p ON b.passengerID = p.passengerID
        JOIN Users u ON p.userID = u.userID
        JOIN Flights f ON b.flightID = f.flightID
        ORDER BY pay.payment_date DESC
    ";

    $stmt = $pdo->query($sql);
    $result = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => $result
    ]);
    exit;
}


/**************************************
 PATCH — UPDATE PAYMENT STATUS
**************************************/
if ($_SERVER["REQUEST_METHOD"] === "PATCH") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["paymentID"]) || !isset($data["payment_status"])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Missing fields"
        ]);
        exit;
    }

    $sql = "
        UPDATE Payments
        SET payment_status = :status
        WHERE paymentID = :id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":status" => $data["payment_status"],
        ":id" => $data["paymentID"]
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Payment updated"
    ]);
    exit;
}
