<?php
/**
 * Created by PhpStorm.
 * User: Barbara
 * Date: 05.11.2015
 * Time: 11:00
 */

$functionName = filter_input(INPUT_GET, 'functionName');
$storyID = filter_input(INPUT_GET, 'storyID');

$localhost= "localhost";
$user = "root";
$pw = "";
$db = "storytelling_platform";

$storyID = findStoryID($localhost, $user, $pw,$db,$storyID);


if ($functionName == "drawLines") {
    drawLines($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "drawNodes"){
    drawNodes($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "reorderNodes"){
    reorderNodes($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "maxChildren"){
    maxChildren($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "addNewNode"){
    addNewNode($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "deleteNode"){
    deleteNode($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "isFirstNode"){
    isFirstNode($localhost, $user, $pw,$db,$storyID);
}

function isFirstNode($localhost, $user, $pw,$db,$storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT level FROM page WHERE story = ".$storyID." AND id = ".$ID;
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);

    }
    mysqli_free_result($result);
    mysqli_close($con);
}


function findStoryID($localhost, $user, $pw,$db,$storyID){
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT id FROM story WHERE name = '".$storyID."'";
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();
    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] =$row['id'];
    }
    return $indexedOnly[0];
    mysqli_free_result($result);
    mysqli_close($con);
}

function maxChildren($localhost, $user, $pw,$db,$storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT NextPageID4 FROM page WHERE story = ".$storyID." AND id = ".$ID;
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);

    }
    mysqli_free_result($result);
    mysqli_close($con);
}



function getChildren($parentNode,$hasChildren,$deleteString,$con,$storyID){
    $id =null;
    while($hasChildren) {
        if ($parentNode[0]['NextPageID1'] != 0 ) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID1'];
            $id = $parentNode[0]['NextPageID1'];
            $newParentNode = getPage($con, $id, array(), "",$storyID);
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID);
            $parentNode[0]['NextPageID1']=0;
        } else if ($parentNode[0]['NextPageID2'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID2'];
            $id = $parentNode[0]['NextPageID2'];
            $newParentNode = getPage($con, $id, array(), "",$storyID);
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID);
            $parentNode[0]['NextPageID2']=0;
        } else if ($parentNode[0]['NextPageID3'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID3'];
            $id = $parentNode[0]['NextPageID3'];
            $newParentNode = getPage($con, $id, array(), "",$storyID);
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID);
            $parentNode[0]['NextPageID3']=0;
        } else if ($parentNode[0]['NextPageID4'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID4'];
            $id = $parentNode[0]['NextPageID4'];
            $newParentNode = getPage($con, $id, array(), "",$storyID);
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID);
            $parentNode[0]['NextPageID4']=0;
        } else {
            return $deleteString;
        }
    }
    return null;
}

function getPage($con,$id,$indexedOnly,$additionalFields,$storyID){
    $sql="SELECT id,".$additionalFields."NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id =".$id." AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] =$row;
    }
    return $indexedOnly;
}



function drawLines($localhost, $user, $pw,$db,$storyID){

    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT MAX(level) FROM page WHERE story = ".$storyID;
    $result = mysqli_query($con,$sql);

    while($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);
    }
    mysqli_free_result($result);
    mysqli_close($con);
}


function drawNodes($localhost, $user, $pw,$db,$storyID){
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE story = ".$storyID." ORDER BY level,position ASC";
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();

    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] = $row;
    }

    echo json_encode($indexedOnly);
    mysqli_free_result($result);
    mysqli_close($con);
}


function reorderNodes($localhost, $user, $pw,$db,$storyID){
    $ID01 = filter_input(INPUT_GET, 'ID01');
    $ID02 = filter_input(INPUT_GET, 'ID02');

    $con = mysqli_connect($localhost,$user, $pw, $db );
        if (!$con) {
            die('Could not connect: ' . mysqli_error($con));
        }

        $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id IN($ID01,$ID02) AND story = ".$storyID;
        $result = mysqli_query($con,$sql);
        $indexedOnly = array();


        while($row = mysqli_fetch_assoc($result)) {
            $indexedOnly[$row['id']] = $row;
        }

    foreach($indexedOnly[$ID01] as $key => $val) {
        if(is_null($val)){
            $indexedOnly[$ID01][$key] = "0";
        }
    }
    foreach($indexedOnly[$ID02] as $key => $val) {
        if(is_null($val)){
            $indexedOnly[$ID02][$key] = "0";
        }
    }

  //  echo json_encode($indexedOnly);


   $sql="UPDATE page SET level = CASE id
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['level']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['level']."
                                    ELSE level
                                    END
                         , position = CASE id
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['position']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['position']."
                                    ELSE position
                                    END
                         , NextPageID1 = CASE id
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['NextPageID1']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['NextPageID1']."
                                    ELSE NextPageID1
                                    END
                        , NextPageID2 = CASE id
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['NextPageID2']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['NextPageID2']."
                                    ELSE NextPageID2
                                    END
                         , NextPageID3 = CASE id
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['NextPageID3']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['NextPageID3']."
                                    ELSE NextPageID3
                                    END
                         , NextPageID4 = CASE id
                                    WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['NextPageID4']."
                                    WHEN ".$ID02."   THEN ".$indexedOnly[$ID01]['NextPageID4']."
                                    ELSE NextPageID4
                                    END
              WHERE id IN($ID01,$ID02) AND story = ".$storyID;

        $result = mysqli_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
    echo "Updated data successfully\n";

    $sql="UPDATE page SET NextPageID1 = CASE NextPageID1
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE NextPageID1
                                    END
                         ,NextPageID2 = CASE NextPageID2
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE NextPageID2
                                    END
                        ,NextPageID3 = CASE NextPageID3
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE NextPageID3
                                    END
                        ,NextPageID4 = CASE NextPageID4
                                    WHEN ".$ID01."   THEN  ".$ID02."
                                    WHEN ".$ID02."   THEN  ".$ID01."
                                    ELSE NextPageID4
                                    END
              WHERE NextPageID1 IN($ID01,$ID02) OR NextPageID2 IN($ID01,$ID02) OR NextPageID3 IN($ID01,$ID02) OR NextPageID4 IN($ID01,$ID02) AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
        echo "Updated data successfully\n";
        mysqli_close($con);
}


function addNewNode($localhost, $user, $pw,$db,$storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT MAX(id) FROM page WHERE story = ".$storyID;
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();
    while($row = mysqli_fetch_assoc($result)) {

        $indexedOnly[] =$row;
    }
    $newID = $indexedOnly[0]['MAX(id)']+1;

    $indexedOnly =getPage($con,$ID,$indexedOnly,"level,position,",$storyID);

    $newLevel = $indexedOnly[1]['level']+1;

    $sql="SELECT position FROM page WHERE story = ".$storyID." AND id = ";

    if($indexedOnly[1]['NextPageID3'] != 0){
        $sql.=$indexedOnly[1]['NextPageID3'];
        $changeNN="NextPageID4";
        $first=null;
    }else if($indexedOnly[1]['NextPageID2'] != 0){
        $sql.=$indexedOnly[1]['NextPageID2'];
        $changeNN="NextPageID3";
        $first=null;
    }else if($indexedOnly[1]['NextPageID1'] != 0){
        $sql.=$indexedOnly[1]['NextPageID1'];
        $changeNN="NextPageID2";
        $first=null;
    }else{
        $changeNN="NextPageID1";
        $first = 1;
    }

    if($first != 1){
        $result = mysqli_query($con,$sql);
        while($row = mysqli_fetch_assoc($result)) {
            $indexedOnly[] =$row;
        }
        $newPos = $indexedOnly[2]['position']+1;
    }else{
        $newPos = 1;
    }

    $sql="UPDATE page SET ".$changeNN." = ".$newID." WHERE id = ".$ID." AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
    echo "Updated data successfully\n";

    $sql="INSERT INTO page (id,level, position, NextPageID1, NextPageID2, NextPageID3,NextPageID4,story,title,text,imageLink,OptionText1,OptionText2,OptionText3,OptionText4)
    VALUES (".$newID.",".$newLevel.",".$newPos.",0,0,0,0,".$storyID.",'Page".$newID."','Text".$newID."','Link".$newID."','Option".$newID."_1','Option".$newID."_2','Option".$newID."_3','Option".$newID."_4')";
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not insert data: '. mysqli_error());
    }
    echo "Inserted data successfully\n";

    //mysqli_free_result($result);
    mysqli_close($con);
}


function deleteNode($localhost, $user, $pw,$db,$storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $indexedOnly = array();
    $hasChildren = true;
    $indexedOnly = getPage($con,$ID,$indexedOnly,"",$storyID);
    $deleteString = "(".$indexedOnly[0]['id'];

    $deleteString = getChildren($indexedOnly,$hasChildren,$deleteString,$con,$storyID);
    $deleteString.=")";

    $sql = "DELETE FROM page WHERE story = ".$storyID." AND id IN".$deleteString;

    echo $sql."\n";
    if ($con->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error deleting record: " . $con->error;
    }


    $sql="UPDATE page SET NextPageID1 = CASE NextPageID1
                                    WHEN ".$ID."   THEN 0
                                    ELSE NextPageID1
                                    END
                         ,NextPageID2 = CASE NextPageID2
                                   WHEN ".$ID."   THEN 0
                                    ELSE NextPageID2
                                    END
                        ,NextPageID3 = CASE NextPageID3
                                    WHEN ".$ID."   THEN 0
                                    ELSE NextPageID3
                                    END
                        ,NextPageID4 = CASE NextPageID4
                                    WHEN ".$ID."   THEN 0
                                    ELSE NextPageID4
                                    END
              WHERE NextPageID1 = ".$ID."  OR NextPageID2 = ".$ID."  OR NextPageID3 = ".$ID."  OR NextPageID4 = ".$ID."  AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
    echo "Updated data successfully\n";

    $con->close();
}

