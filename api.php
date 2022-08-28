<?php
require "db.conn.php";
$primary_key = get_primary_key($conn, $table);




$data = file_get_contents('php://input');

$OBJ = json_decode($data);

$arr = array();



if (is_object($OBJ)) {
    // echo json_encode($OBJ);
    $info = (object)[];
    $info->data_type = $OBJ->data_type;
    if ($OBJ->data_type == 'read') {
        $query = "select * from $table order by $primary_key";
        $result = mysqli_query($conn, $query);
        if ($result && mysqli_num_rows($result) > 0) {
            while ($user_data = mysqli_fetch_assoc($result)) {
                $arr[] = $user_data;
            }
            $info->data = $arr;
            echo json_encode($info);
        }
    } else if ($OBJ->data_type == 'save') {
        if (is_array($OBJ->data)) {
            foreach ($OBJ->data as $row) {
                $query = "update $table set ";
                $primary_key_value = '';
                foreach ($row as $key => $value) {
                    if ($key == $primary_key) {
                        $primary_key_value = $value;
                    } else {
                        $query .= "$key = '" . mysqli_real_escape_string($conn, $value) . "',";
                    }
                }
                $query  = trim($query, ',');
                $query .= " where $primary_key = '$primary_key_value' limit 1 ";
                mysqli_query($conn, $query);
                // print_r($query) . "<br>";
            }
            echo json_encode($info);
        }
    }
}

function get_primary_key($conn, $table)
{
    $query = "show columns from $table";
    $result = mysqli_query($conn, $query);
    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            foreach ($row as $key => $value) {
                if ($value == 'PRI') return $row['Field'];
            }
        }
    }
    return 'id';
}
