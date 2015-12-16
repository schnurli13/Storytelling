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
}else if($functionName == "moveBranch"){
    moveBranch($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "reorderBranches"){
    reorderBranches($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "addNodeAsChild"){
    addNodeAsChild($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "addBranchAsChild"){
    addBranchAsChild($localhost, $user, $pw,$db,$storyID);
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

    $sql="SELECT NextPageID1,NextPageID4 FROM page WHERE story = ".$storyID." AND id = ".$ID;
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();
    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] = $row;

    }
    echo json_encode($indexedOnly);
    mysqli_free_result($result);
    mysqli_close($con);
}



function getChildren($parentNode,$hasChildren,$deleteString,$con,$storyID,$additionalFields){
    $id =null;
    while($hasChildren) {
        if ($parentNode[0]['NextPageID1'] != 0 ) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID1'];
            $id = $parentNode[0]['NextPageID1'];
            $newParentNode = getPage($con, $id, array(), $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID,$additionalFields);
            $parentNode[0]['NextPageID1']=0;
        } else if ($parentNode[0]['NextPageID2'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID2'];
            $id = $parentNode[0]['NextPageID2'];
            $newParentNode = getPage($con, $id, array(), $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID,$additionalFields);
            $parentNode[0]['NextPageID2']=0;
        } else if ($parentNode[0]['NextPageID3'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID3'];
            $id = $parentNode[0]['NextPageID3'];
            $newParentNode = getPage($con, $id, array(), $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID,$additionalFields);
            $parentNode[0]['NextPageID3']=0;
        } else if ($parentNode[0]['NextPageID4'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID4'];
            $id = $parentNode[0]['NextPageID4'];
            $newParentNode = getPage($con, $id, array(), $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$con,$storyID,$additionalFields);
            $parentNode[0]['NextPageID4']=0;
        } else {
            return $deleteString;
        }
    }
    return null;
}

function getPage($con,$id,$indexedOnly,$additionalFields,$storyID,$where){
    $sql="SELECT id,".$additionalFields."NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE ".$where.$id." AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] =$row;
    }
    return $indexedOnly;
}

function checkIFparent($stoppingID, $startingID, $found,$con,$storyID){
    while(!$found){
        $sql="SELECT id,level FROM page WHERE NextPageID1 = ".$startingID." OR NextPageID2 = ".$startingID." OR NextPageID3 = ".$startingID." OR NextPageID4 = ".$startingID." AND story = ".$storyID;

        $result = mysqli_query($con,$sql);
        $indexedOnly = array();
        while($row = mysqli_fetch_assoc($result)) {
            $indexedOnly[0] =$row['id'];
            $indexedOnly[1] =$row['level'];
        }
        if($indexedOnly[0] == $stoppingID){
            return true;
        }else if($indexedOnly[1] == 0){
            return false;
        }else{
            return checkIFparent($stoppingID, $indexedOnly[0], $found,$con,$storyID);
        }
    }
    return null;
}

function fixParentANDSiblings($con,$ID,$storyID){
    $indexedOnly = array();
    $sql="SELECT id,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE NextPageID1 = ".$ID." OR NextPageID2 = ".$ID.
        " OR NextPageID3 = ".$ID." OR NextPageID4 = ".$ID." AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] =$row;
    }

    if($indexedOnly[0]['NextPageID1'] == $ID){
        $indexedOnly[0]['NextPageID1'] = $indexedOnly[0]['NextPageID2'];
        $indexedOnly[0]['NextPageID2'] = $indexedOnly[0]['NextPageID3'];
        $indexedOnly[0]['NextPageID3'] = $indexedOnly[0]['NextPageID4'];
        $indexedOnly[0]['NextPageID4'] = 0;
    }
    if($indexedOnly[0]['NextPageID2'] == $ID){
        $indexedOnly[0]['NextPageID2'] = $indexedOnly[0]['NextPageID3'];
        $indexedOnly[0]['NextPageID3'] = $indexedOnly[0]['NextPageID4'];
        $indexedOnly[0]['NextPageID4'] = 0;
    }
    if($indexedOnly[0]['NextPageID3'] == $ID){
        $indexedOnly[0]['NextPageID3'] = $indexedOnly[0]['NextPageID4'];
        $indexedOnly[0]['NextPageID4'] = 0;
    }
    if($indexedOnly[0]['NextPageID4'] == $ID){
        $indexedOnly[0]['NextPageID4'] = 0;
    }

    echo json_encode($indexedOnly);

        $sql="UPDATE page SET NextPageID1 = ".$indexedOnly[0]['NextPageID1']." , NextPageID2 = ".$indexedOnly[0]['NextPageID2']." ,
        NextPageID3 = ".$indexedOnly[0]['NextPageID3']." , NextPageID4 = ".$indexedOnly[0]['NextPageID4']."
        WHERE id = ".$indexedOnly[0]['id']."  AND story = ".$storyID;

    echo json_encode($sql);

        //echo $sql."\n";
       $result = mysqli_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
        echo "Updated data successfully\n";

        if($indexedOnly[0]['NextPageID1'] != 0){
            $sql="UPDATE page SET position=1 WHERE id = ".$indexedOnly[0]['NextPageID1']." AND story = ".$storyID.";";
        }
        if($indexedOnly[0]['NextPageID2'] != 0){
            $sql.="UPDATE page SET position=2 WHERE id = ".$indexedOnly[0]['NextPageID2']." AND story = ".$storyID.";";
        }
        if($indexedOnly[0]['NextPageID3'] != 0){
            $sql.="UPDATE page SET position=3 WHERE id = ".$indexedOnly[0]['NextPageID3']." AND story = ".$storyID;
        }
        if($indexedOnly[0]['NextPageID4'] != 0){
            $sql.="UPDATE page SET position=4 WHERE id = ".$indexedOnly[0]['NextPageID4']." AND story = ".$storyID;
        }


    echo json_encode($sql);

    $result = mysqli_multi_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error($con));
    }
    echo "Updated data successfully\n";

        do {
         mysqli_store_result($con);
        } while (mysqli_next_result($con));
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

    mysqli_close($con);


    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    // Set autocommit to off
    //mysqli_autocommit($con,FALSE);

    //mysqli_begin_transaction($con,MYSQLI_TRANS_START_READ_WRITE);

    //begin($con); // transaction begins

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
              WHERE id IN($ID01,$ID02) AND story = ".$storyID.";";

      /*  $result = mysqli_query($con,$sql);
        if(!$result){
            rollback($con); // transaction rolls back
            echo "transaction rolled back";
            exit;
        }else{
            commit($con); // transaction is committed
            echo "Database transaction was successful";
        }*/

   /* if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
    echo "Updated data successfully\n";*/

    $sql.="UPDATE page SET NextPageID1 = CASE NextPageID1
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
    $result =mysqli_multi_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
        echo "Updated data successfully\n";

  /* $result = mysqli_multi_query($con,$sql);
    if(!$result){
        mysqli_rollback($con);// transaction rolls back
        echo "transactions rolled back";
        exit;
    }else{
       // mysqli_autocommit($con,TRUE);
        mysqli_commit($con); // transaction is committed
        echo "Updated data successfully\n";
    }*/

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

    $indexedOnly =getPage($con,$ID,$indexedOnly,"level,position,",$storyID,"id =");

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
    $indexedOnly = getPage($con,$ID,$indexedOnly,"",$storyID,"id =");

    $deleteString = "(".$indexedOnly[0]['id'];

     $deleteString = getChildren($indexedOnly,$hasChildren,$deleteString,$con,$storyID,"");
     $deleteString.=")";

    $sql = "DELETE FROM page WHERE story = ".$storyID." AND id IN".$deleteString;

     echo $sql."\n";
     if ($con->query($sql) === TRUE) {
         echo "Record deleted successfully";
     } else {
         echo "Error deleting record: " . $con->error;
     }


    fixParentANDSiblings($con,$ID,$storyID);

    $con->close();
}

function moveBranch($localhost, $user, $pw,$db,$storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $indexedOnly = array();
    $hasChildren = true;
    $indexedOnly = getPage($con,$ID,$indexedOnly,"",$storyID,"id =");
    $string = $indexedOnly[0]['id'];
    $string = getChildren($indexedOnly,$hasChildren,$string,$con,$storyID,"");
    echo json_encode($string);
}


function reorderBranches($localhost, $user, $pw,$db,$storyID){
    $x = filter_input(INPUT_GET, 'IDs');
    $movingIDs =explode(",",$x);
    $ID01 = $movingIDs[0];
    $ID02 = filter_input(INPUT_GET, 'ID');

      $con = mysqli_connect($localhost,$user, $pw, $db );
      if (!$con) {
          die('Could not connect: ' . mysqli_error($con));
      }

    $found = checkIFparent($ID02,$ID01,false,$con,$storyID);

    if($found){
        //get children of targetid
        $indexedOnly = array();
        $hasChildren = true;
        $indexedOnly = getPage($con,$ID02,$indexedOnly,"",$storyID,"id =");

        $string = $indexedOnly[0]['id'];

        $string = getChildren($indexedOnly,$hasChildren,$string,$con,$storyID,"");
        $targetIDs =explode(",",$string);


        $targetIDs = array_diff($targetIDs, $movingIDs);

        //get the infos of both main ids
        $sql="SELECT id,level,position FROM page WHERE id IN($ID01,$ID02) AND story = ".$storyID;
        $result = mysqli_query($con,$sql);
        $indexedOnly = array();

        while($row = mysqli_fetch_assoc($result)) {
            $indexedOnly[$row['id']] = $row;
        }

        $sql="SELECT id FROM page WHERE NextPageID1 = ".$ID02." OR NextPageID2 = ".$ID02." OR NextPageID3 = ".$ID02." OR NextPageID4 = ".$ID02." AND story = ".$storyID;

        $result = mysqli_query($con,$sql);
        $parentID = array();
        while($row = mysqli_fetch_assoc($result)) {
            $parentID[0] = $row['id'];
        }

        $sql="SELECT id,level FROM page WHERE id IN($x) AND story = ".$storyID;
        $result = mysqli_query($con,$sql);
        $i = array();
        while($row = mysqli_fetch_assoc($result)) {
            $i[] = $row;
        }

        $maxLevel =0 ;
        $maxNodeID = 0;
        for($a =01; $a < sizeof($i); $a++){
            if($i[$a]['level'] > $maxLevel){
                $maxLevel = $i[$a]['level'];
                $maxNodeID = $i[$a]['id'];
            }
        }

        $levelDiffmovingIDs = $indexedOnly[$ID02]['level']-$indexedOnly[$ID01]['level'];
        $levelDifftargetIDs = $maxLevel-$indexedOnly[$ID02]['level'];

        $sql="UPDATE page SET level = CASE id
                                             WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['level']."
                                             WHEN ".$ID02."   THEN ".$maxLevel."
                                             ELSE level
                                             END
                                  , position = CASE id
                                             WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['position']."
                                             WHEN ".$ID02."   THEN 1
                                             ELSE position
                                             END
                       WHERE id IN($ID01,$ID02) AND story = ".$storyID.";";

        //changing levels of childpages
        for($i = 1; $i < sizeof($movingIDs); $i++){
            $sql.="UPDATE page SET level = level+".$levelDiffmovingIDs." WHERE id = ".$movingIDs[$i]." AND story = ".$storyID.";";
        }

        if(sizeof($targetIDs) > 1){
            for($i = 1; $i < sizeof($targetIDs); $i++){
                $sql.="UPDATE page SET level = level+".$levelDifftargetIDs." WHERE id = ".$targetIDs[$i]." AND story = ".$storyID.";";
            }
        }

        $sql.="UPDATE page SET NextPageID1 = ".$ID02." WHERE id = ".$maxNodeID." AND story = ".$storyID.";";


        $sql.="UPDATE page SET NextPageID1 = CASE NextPageID1
                                                WHEN ".$ID01."   THEN  0
                                                ELSE NextPageID1
                                                END
                                     ,NextPageID2 = CASE NextPageID2
                                                WHEN ".$ID01."   THEN  0
                                                ELSE NextPageID2
                                                END
                                    ,NextPageID3 = CASE NextPageID3
                                                WHEN ".$ID01."   THEN  0
                                                ELSE NextPageID3
                                                END
                                    ,NextPageID4 = CASE NextPageID4
                                                WHEN ".$ID01."   THEN  0
                                                ELSE NextPageID4
                                                END
                          WHERE NextPageID1=".$ID01."  OR NextPageID2=".$ID01." OR NextPageID3=".$ID01." OR NextPageID4=".$ID01." AND story = ".$storyID.";";

        //austauschen der nextpage ids
        $sql.="UPDATE page SET NextPageID".$indexedOnly[$ID02]['position']." = ".$ID01." WHERE id = ".$parentID[0]." AND story = ".$storyID;

        echo json_encode($sql);   echo json_encode("NOT YET FINISHED");
/*
       $result = mysqli_multi_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
        echo "Updated data successfully\n";*/

    }else{
        $indexedOnly = array();
        $hasChildren = true;
        $indexedOnly = getPage($con,$ID02,$indexedOnly,"",$storyID,"id =");

        $string = $indexedOnly[0]['id'];

        $string = getChildren($indexedOnly,$hasChildren,$string,$con,$storyID,"");
        $targetIDs =explode(",",$string);


        $sql="SELECT id,level,position FROM page WHERE id IN($ID01,$ID02) AND story = ".$storyID;
        $result = mysqli_query($con,$sql);
        $indexedOnly = array();

        while($row = mysqli_fetch_assoc($result)) {
            $indexedOnly[$row['id']] = $row;
        }


        $levelDiffmovingIDs = $indexedOnly[$ID02]['level']-$indexedOnly[$ID01]['level'];
        $levelDifftargetIDs = $indexedOnly[$ID01]['level']-$indexedOnly[$ID02]['level'];
        //austauschen level und position von obersten nodes

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
                       WHERE id IN($ID01,$ID02) AND story = ".$storyID.";";

        //changing levels of childpages
        for($i = 1; $i < sizeof($movingIDs); $i++){
            $sql.="UPDATE page SET level = level+".$levelDiffmovingIDs." WHERE id = ".$movingIDs[$i]." AND story = ".$storyID.";";
        }

        if(sizeof($targetIDs) > 1){
            for($i = 1; $i < sizeof($targetIDs); $i++){
                $sql.="UPDATE page SET level = level+".$levelDifftargetIDs." WHERE id = ".$targetIDs[$i]." AND story = ".$storyID.";";
            }
        }

        //austauschen der nextpage ids
        $sql.="UPDATE page SET NextPageID1 = CASE NextPageID1
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
        $result = mysqli_multi_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
        echo "Updated data successfully\n";
    }
       mysqli_close($con);
}


function addNodeAsChild($localhost, $user, $pw,$db,$storyID){
    $parent = filter_input(INPUT_GET, 'ID01');
    $child = filter_input(INPUT_GET, 'ID02');

    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id IN($parent,$child) AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();


    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[$row['id']] = $row;
    }

    //echo json_encode($indexedOnly);

    $pos = null;

    if($indexedOnly[$parent]['NextPageID3'] != 0){
        $changeNN="NextPageID4";
        $pos = 4;
    }else if($indexedOnly[$parent]['NextPageID2'] != 0){
        $changeNN="NextPageID3";
        $pos = 3;
    }else if($indexedOnly[$parent]['NextPageID1'] != 0){
        $changeNN="NextPageID2";
        $pos = 2;
    }else{
        $changeNN="NextPageID1";
        $pos = 1;
    }


    fixParentANDSiblings($con,$child,$storyID);

    //update new parent node
    $sql="UPDATE page SET ".$changeNN." = ".$child." WHERE id = ".$parent." AND story = ".$storyID.";";
    //update new child node
    $sql.="UPDATE page SET level = 1+".$indexedOnly[$parent]['level'].", position = ".$pos." WHERE id = ".$child." AND story = ".$storyID;
    echo json_encode($sql);

   $result = mysqli_multi_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error($con));
    }
    echo "Updated data successfully\n";


    mysqli_close($con);
}


function addBranchAsChild($localhost, $user, $pw,$db,$storyID){
    $x = filter_input(INPUT_GET, 'IDs');
    $movingIDs =explode(",",$x);
    $child = $movingIDs[0];
    $parent = filter_input(INPUT_GET, 'ID');

    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id IN($parent,$child) AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();


    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[$row['id']] = $row;
    }
    $pos = null;

    if($indexedOnly[$parent]['NextPageID3'] != 0){
        $changeNN="NextPageID4";
        $pos = 4;
    }else if($indexedOnly[$parent]['NextPageID2'] != 0){
        $changeNN="NextPageID3";
        $pos = 3;
    }else if($indexedOnly[$parent]['NextPageID1'] != 0){
        $changeNN="NextPageID2";
        $pos = 2;
    }else{
        $changeNN="NextPageID1";
        $pos = 1;
    }

    echo json_encode($indexedOnly);
    
        fixParentANDSiblings($con,$child,$storyID);

      //update new parent node
       $sql="UPDATE page SET ".$changeNN." = ".$child." WHERE id = ".$parent." AND story = ".$storyID.";";
       //update new child node
       $sql.="UPDATE page SET level = 1+".$indexedOnly[$parent]['level'].", position = ".$pos." WHERE id = ".$child." AND story = ".$storyID.";";
       // echo json_encode($sql);

       $levelDiffmovingIDs = (1+$indexedOnly[$parent]['level'])-$indexedOnly[$child]['level'];

       for($i = 1; $i < sizeof($movingIDs); $i++){
           $sql.="UPDATE page SET level = level+".$levelDiffmovingIDs." WHERE id = ".$movingIDs[$i]." AND story = ".$storyID.";";
       }
    echo json_encode($sql);

       $result = mysqli_multi_query($con,$sql);
       if(!$result)
       {
           die('Could not update data: '. mysqli_error());
       }
       echo "Updated data successfully\n";

    mysqli_close($con);
}