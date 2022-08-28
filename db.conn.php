<?php

$table = 'customers';
$user = 'khalaf';
$database = 'mydata';
$password = 'royaldiva';
$host = 'localhost';

if (!$conn = mysqli_connect($host, $user, $password, $database)) {
    die('Couldn\'t connect to database...');
}
