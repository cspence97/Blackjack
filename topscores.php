<?php
    $db = new mysqli('localhost', 'ukbtyyvdd756r', '3)]^1r121s$3') or die('Failed to connect: ' . mysql_error());
    $db->select_db('dbz9fyu5m3s252') or die('Failed to access database');

    $query = "SELECT * FROM Scores ORDER by score DESC, ts ASC LIMIT 10";
    
    $result = $db->query("$query");

    
    $my_result_string;

    $result_length = mysqli_num_rows($result);
 
    for($i = 0; $i < $result_length; $i++)
    {
        $row = mysqli_fetch_array($result);
        if($row['name'] == ""){
            $row['name'] = "Anonymous";
        }
        $my_result_string .= $row['name'] . "-$" . $row['score'] . "\n";
    }

    echo $my_result_string;

    $db->close();
?>