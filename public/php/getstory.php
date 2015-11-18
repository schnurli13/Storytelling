<?php
/**
 * Created by PhpStorm.
 * User: Barbara
 * Date: 05.11.2015
 * Time: 11:00
 */

$functionName = filter_input(INPUT_GET, 'functionName');


if ($functionName == "drawLines") {
    drawLines();
}else if($functionName == "drawNodes"){
    drawNodes();
}else if($functionName == "reorderNodes"){
    reorderNodes();
}else if($functionName == "maxChildren"){
    maxChildren();
}

function maxChildren(){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect('localhost','root','','storytelling02');
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }


//$sql="SELECT * FROM story WHERE id = 0";
    $sql="SELECT nextNodeID4 FROM story WHERE ID = ".$ID;
    $result = mysqli_query($con,$sql);


    while($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);

    }


    mysqli_free_result($result);
    mysqli_close($con);
}

function drawLines(){
    $con = mysqli_connect('localhost','root','','storytelling02');
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }


//$sql="SELECT * FROM story WHERE id = 0";
    $sql="SELECT MAX(level) FROM story";
    $result = mysqli_query($con,$sql);


    while($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);

    }


    mysqli_free_result($result);
    mysqli_close($con);
}


function drawNodes(){
    $con = mysqli_connect('localhost','root','','storytelling02');
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }


//$sql="SELECT * FROM story WHERE id = 0";
    $sql="SELECT * FROM story ORDER BY level ASC";
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();


    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] = $row;
    }

    echo json_encode($indexedOnly);
    mysqli_free_result($result);
    mysqli_close($con);
}


function reorderNodes(){
    $ID01 = filter_input(INPUT_GET, 'ID01');
    $ID02 = filter_input(INPUT_GET, 'ID02');

       $con = mysqli_connect('localhost','root','','storytelling02');
        if (!$con) {
            die('Could not connect: ' . mysqli_error($con));
        }

        $sql="SELECT * FROM story WHERE ID IN($ID01,$ID02)";
        $result = mysqli_query($con,$sql);
        $indexedOnly = array();


        while($row = mysqli_fetch_assoc($result)) {
            $indexedOnly[$row['ID']] = $row;
        }

    foreach($indexedOnly[$ID01] as $key => $val) {
        if(is_null($val)){
            $indexedOnly[$ID01][$key] = "NULL";
        }
    }
    foreach($indexedOnly[$ID02] as $key => $val) {
        if(is_null($val)){
            $indexedOnly[$ID02][$key] = "NULL";
        }
    }


   $sql="UPDATE story SET level = CASE ID
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['level']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['level']."
                                    ELSE level
                                    END
                         , position = CASE ID
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['position']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['position']."
                                    ELSE position
                                    END
                         , nextNodeID1 = CASE ID
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['nextNodeID1']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['nextNodeID1']."
                                    ELSE nextNodeID1
                                    END
                        , nextNodeID2 = CASE ID
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['nextNodeID2']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['nextNodeID2']."
                                    ELSE nextNodeID2
                                    END
                         , nextNodeID3 = CASE ID
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['nextNodeID3']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['nextNodeID3']."
                                    ELSE nextNodeID3
                                    END
                         , nextNodeID4 = CASE ID
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['nextNodeID4']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['nextNodeID4']."
                                    ELSE nextNodeID4
                                    END
              WHERE ID IN($ID01,$ID02)";

        $result = mysqli_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
    echo "Updated data successfully\n";

    $sql="UPDATE story SET nextNodeID1 = CASE nextNodeID1
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE nextNodeID1
                                    END
                         ,nextNodeID2 = CASE nextNodeID2
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE nextNodeID2
                                    END
                        ,nextNodeID3 = CASE nextNodeID3
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE nextNodeID3
                                    END
                        ,nextNodeID4 = CASE nextNodeID4
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE nextNodeID4
                                    END
              WHERE nextNodeID1 IN($ID01,$ID02) OR nextNodeID2 IN($ID01,$ID02) OR nextNodeID3 IN($ID01,$ID02) OR nextNodeID4 IN($ID01,$ID02)";
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
        echo "Updated data successfully\n";
        mysqli_close($con);
}




