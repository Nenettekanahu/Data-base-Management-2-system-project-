<?php
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../lib/fpdf.php";

header("Content-Type: application/pdf");

// Validate input
if (!isset($_GET["paymentID"])) {
    die("Missing paymentID");
}

$paymentID = (int) $_GET["paymentID"];

// Fetch payment data
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
        a2.city AS dest,
        u.first_name,
        u.last_name
    FROM Payments pay
    JOIN Bookings b ON pay.bookingID = b.bookingID
    JOIN Flights f ON b.flightID = f.flightID
    JOIN Airports a1 ON f.origin_airportID = a1.airportID
    JOIN Airports a2 ON f.destination_airportID = a2.airportID
    JOIN Passengers p ON b.passengerID = p.passengerID
    JOIN Users u ON p.userID = u.userID
    WHERE pay.paymentID = :paymentID
    LIMIT 1
";

$stmt = $pdo->prepare($sql);
$stmt->execute([":paymentID" => $paymentID]);
$data = $stmt->fetch();

if (!$data) {
    die("Payment not found");
}

// Generate PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 22);

$pdf->Cell(0, 15, "Flynext - Payment Receipt", 0, 1, "L");
$pdf->Ln(5);

$pdf->SetFont('Arial', '', 14);
$pdf->Cell(0, 10, "Receipt #: " . $data["paymentID"], 0, 1);
$pdf->Cell(0, 10, "Passenger: " . $data["first_name"] . " " . $data["last_name"], 0, 1);
$pdf->Cell(0, 10, "Booking #: " . $data["bookingID"], 0, 1);
$pdf->Cell(0, 10, "Flight: " . $data["flight_number"], 0, 1);
$pdf->Cell(0, 10, "Route: " . $data["origin"] . " -> " . $data["dest"], 0, 1);

$pdf->Ln(5);
$pdf->SetFont('Arial', '', 14);
$pdf->Cell(0, 10, "Payment Method: " . $data["payment_method"], 0, 1);
$pdf->Cell(0, 10, "Status: " . $data["payment_status"], 0, 1);
$pdf->Cell(0, 10, "Amount: $" . $data["total_amount"], 0, 1);
$pdf->Cell(0, 10, "Date: " . $data["payment_date"], 0, 1);

$pdf->Ln(10);
$pdf->SetFont('Arial', 'I', 10);
$pdf->Cell(0, 10, "Thank you for choosing Flynext!", 0, 1);

$pdf->Output();
