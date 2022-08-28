<?php
include "db.conn.php";

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>javascript project</title>
    <link rel="stylesheet" href="main.css">
</head>

<body style="position: relative">
    <h2><?php echo $table; ?></h2>
    <div style="position: relative">
        <div style="color: red">
            <srong>SELECTED CELL</srong>
        </div>
        <div>Row: <span class="row_info"></span></div>
        <div>Column: <span class="column_info"></span></div>
        <div>Column Name: <span class="column_name_info"></span></div>
        <div class="main_menu">
            <button>menu</button>
            <div class="main_menu_items hide">
                <input type="button" value="Main Menu">
                <input type="button" value="Reload Data" onclick="getData('api.php', {data_type:'read'});">
                <input type="button" value="Save Data" onclick="collect_data()">
                <input type="button" value="Add Row" class="add_row">
            </div>
        </div>
    </div>
    <table>
        <thead class="thead">
            <tr>
                <th>heading</th>
                <th>heading</th>
                <th>heading</th>
                <th>heading</th>
            </tr>
        </thead>
        <tbody class="tbody" ondblclick="edit(event)" style="position: relative">
            <tr>
                <td>heading</td>
                <td>heading</td>
                <td>heading</td>
                <td>heading</td>
            </tr>

        </tbody>
    </table>
    <div id="input_holder">
        <input type="text" id="input" onblur='update_cell(event)' style="display: none;width:90%">
    </div>

    <div class="sub_menu">
        <input type="button" value="edit" onclick="edit()">
        <input type="button" value="delete" onclick="delete_content()">
    </div>
    <script src="main.js"></script>
</body>

</html>