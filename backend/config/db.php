<?php
// ==============================
// Database configuration
// ==============================

$host = "localhost";
$db_name = "flight_database_management"; // le nom EXACT de ta DB
$username = "root";
$password = ""; // vide par défaut sur XAMPP
$charset = "utf8mb4";

// ==============================
// PDO connection
// ==============================

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $username, $password, $options);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed",
        "details" => $e->getMessage()
    ]);
    exit;
}
