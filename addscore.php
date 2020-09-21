<?php
    $db = new mysqli('localhost', 'ukbtyyvdd756r', '3)]^1r121s$3') or die('Failed to connect: ' . mysqli_error());
    $db->select_db('dbz9fyu5m3s252') or die('Failed to access database');

    /*$username = mysqli_real_escape_string($_GET['username'], $db);
    $score = mysqli_real_escape_string($_GET['score'], $db);  */

    $q = $_REQUEST["q"];
    list($username, $score) = explode('-', $q);

    $query = "INSERT INTO Scores
            SET name = '$username'
                , score = '$score'
                , ts = CURRENT_TIMESTAMP
            ON DUPLICATE KEY UPDATE
                ts = if('$score'>score,CURRENT_TIMESTAMP,ts), score = if ('$score'>score, '$score', score);";

    $db->query($query);

    $db->close();
?>