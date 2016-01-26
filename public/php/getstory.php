<?php
/**
 * Created by PhpStorm.
 * User: Barbara
 * Date: 05.11.2015
 * Time: 11:00
 */
require('../../framework/modules/mysqlModule.php');

$functionName = filter_input(INPUT_GET, 'functionName');
$storyID = filter_input(INPUT_GET, 'storyID');

$localhost= "localhost";
$user = "root";
$pw = "";
$db = "storytelling_platform";

$storyID = findStoryID($storyID);


if ($functionName == "drawLines") {
    drawLines($storyID);
}else if($functionName == "drawNodes"){
    drawNodes($storyID);
}else if($functionName == "reorderNodes"){
    reorderNodes($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "maxChildren"){
    maxChildren($storyID);
}else if($functionName == "addNewNode"){
    addNewNode($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "deleteNode"){
    deleteNode($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "isFirstNode"){
    isFirstNode($storyID);
}else if($functionName == "moveBranch"){
    moveBranch($storyID);
}else if($functionName == "reorderBranches"){
    reorderBranches($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "addNodeAsChild"){
    addNodeAsChild($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "addBranchAsChild"){
    addBranchAsChild($localhost, $user, $pw,$db,$storyID);
}else if($functionName == "checkIFParent"){
    $x = filter_input(INPUT_GET, 'IDs');
    $movingIDs =explode(",",$x);
    $ID01 = $movingIDs[0];
    $ID02 = filter_input(INPUT_GET, 'ID');
    $found = checkIFparent($ID02,$ID01,false,$storyID);
    echo json_encode($found);
}else if($functionName == "getContent"){
    getContent($storyID);
}else if($functionName == "saveContent"){
    saveContent($storyID);
}else if($functionName == "getTitle"){
    getTitle($storyID);
}else if($functionName == "getStoryDetails"){
    getStoryDetails($storyID);
}else if($functionName == "getAuthorDetails"){
    getAuthorDetails($storyID);
}else if($functionName == "saveStory"){
    saveStory($storyID);
}

function saveStory($storyID){
    $title = filter_input(INPUT_GET, 'title');
    $mysqlObject = new mysqlModule();
    $sql = "UPDATE story SET name = '".$title."' WHERE id = ".$storyID;
    if($mysqlObject->commandDataBase($sql)){
        echo json_encode("Data saved!");
    }else{
        echo "Error: Transaction rolled back";
    }
}

function getAuthorDetails($storyID){
    $id = filter_input(INPUT_GET, 'authorID');
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT name FROM users WHERE id = '".$id."'"));
}

function getStoryDetails($storyID){
    $name = filter_input(INPUT_GET, 'storyID');
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT user,isPublished FROM story WHERE name = '".$name."'"));
}

function saveContent($storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $text = filter_input(INPUT_GET, 'text');
    $title = filter_input(INPUT_GET, 'title');
    $opt1 = filter_input(INPUT_GET, 'opt1');
    $opt2 = filter_input(INPUT_GET, 'opt2');
    $opt3 = filter_input(INPUT_GET, 'opt3');
    $opt4 = filter_input(INPUT_GET, 'opt4');
    $mysqlObject = new mysqlModule();
    $sql = "UPDATE page SET text = '".$text."', title = '".$title."', OptionText1 = '".$opt1."', OptionText2 = '".$opt2."'
    , OptionText3 = '".$opt3."', OptionText4 = '".$opt4."' WHERE story = ".$storyID." AND id = ".$ID;
    if($mysqlObject->commandDataBase($sql)){
        echo json_encode("Data saved!");
    }else{
        echo "Error: Transaction rolled back";
    }
}


function getContent($storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT title,text,imageLink,NextPageID1,NextPageID2,NextPageID3,NextPageID4,OptionText1,OptionText2,OptionText3,OptionText4 FROM page WHERE story = ".$storyID." AND id = ".$ID));
}

function getTitle($storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT title FROM page WHERE story = ".$storyID." AND id = ".$ID));
}

function isFirstNode($storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT level FROM page WHERE story = ".$storyID." AND id = ".$ID));
}


function findStoryID($storyID){
    $mysqlObject = new mysqlModule();
    $result = $mysqlObject->queryDataBase("SELECT id FROM story WHERE name = '".$storyID."'");
    return $result[0]['id'];
}

function maxChildren($storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT NextPageID1,NextPageID4 FROM page WHERE story = ".$storyID." AND id = ".$ID));
}


function getChildren($parentNode,$hasChildren,$deleteString,$storyID,$additionalFields){
    $id =null;
    while($hasChildren) {
        if ($parentNode[0]['NextPageID1'] != 0 ) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID1'];
            $id = $parentNode[0]['NextPageID1'];
            $newParentNode = getPage($id, $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$storyID,$additionalFields);
            $parentNode[0]['NextPageID1']=0;
        } else if ($parentNode[0]['NextPageID2'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID2'];
            $id = $parentNode[0]['NextPageID2'];
            $newParentNode = getPage($id, $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$storyID,$additionalFields);
            $parentNode[0]['NextPageID2']=0;
        } else if ($parentNode[0]['NextPageID3'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID3'];
            $id = $parentNode[0]['NextPageID3'];
            $newParentNode = getPage($id, $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$storyID,$additionalFields);
            $parentNode[0]['NextPageID3']=0;
        } else if ($parentNode[0]['NextPageID4'] != 0) {
            $hasChildren = true;
            $deleteString .= "," . $parentNode[0]['NextPageID4'];
            $id = $parentNode[0]['NextPageID4'];
            $newParentNode = getPage($id, $additionalFields,$storyID,"id =");
            $deleteString = getChildren($newParentNode,$hasChildren,$deleteString,$storyID,$additionalFields);
            $parentNode[0]['NextPageID4']=0;
        } else {
            return $deleteString;
        }
    }
    return null;
}

function getPage($id,$additionalFields,$storyID,$where){
    $mysqlObject = new mysqlModule();
    $result = $mysqlObject->queryDataBase("SELECT id,".$additionalFields."NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE ".$where.$id." AND story = ".$storyID);
    return $result;
}

function checkIFparent($stoppingID, $startingID, $found,$storyID){
    while(!$found){
        $mysqlObject = new mysqlModule();
        $result = $mysqlObject->queryDataBase("SELECT id,level FROM page WHERE NextPageID1 = ".$startingID." OR NextPageID2 = ".$startingID." OR NextPageID3 = ".$startingID." OR NextPageID4 = ".$startingID." AND story = ".$storyID);
        if($result[0]['id'] == $stoppingID){
            return true;
        }else if($result[0]['level'] == 0){
            return false;
        }else{
            return checkIFparent($stoppingID, $result[0]['id'], $found,$storyID);
        }
    }
    return null;
}

function fixParentANDSiblings($con,$ID,$storyID,$result){
    $mysqlObject = new mysqlModule();
    $indexedOnly = $mysqlObject->queryDataBase(
        "SELECT id,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE NextPageID1 = ".$ID." OR NextPageID2 = ".$ID.
        " OR NextPageID3 = ".$ID." OR NextPageID4 = ".$ID." AND story = ".$storyID);

   /* $indexedOnly = array();
    $sql="SELECT id,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE NextPageID1 = ".$ID." OR NextPageID2 = ".$ID.
        " OR NextPageID3 = ".$ID." OR NextPageID4 = ".$ID." AND story = ".$storyID;
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] =$row;
    }*/

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

   // echo json_encode($indexedOnly);

        $sql="UPDATE page SET NextPageID1 = ".$indexedOnly[0]['NextPageID1']." , NextPageID2 = ".$indexedOnly[0]['NextPageID2']." ,
        NextPageID3 = ".$indexedOnly[0]['NextPageID3']." , NextPageID4 = ".$indexedOnly[0]['NextPageID4']."
        WHERE id = ".$indexedOnly[0]['id']."  AND story = ".$storyID;
    //echo json_encode($sql);
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }

   // UPDATE page SET NextPageID1 = 127 , NextPageID2 = 0 ,\r\n        NextPageID3 = 0 , NextPageID4 = 0\r\n        WHERE id = 116  AND story = 2


        //echo $sql."\n";
      /* $result = mysqli_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
        echo "Updated data successfully\n";*/

        if($indexedOnly[0]['NextPageID1'] != 0){
            $sql="UPDATE page SET position=1 WHERE id = ".$indexedOnly[0]['NextPageID1']." AND story = ".$storyID;
            if($result == true){
                $result = mysqli_query($con,$sql);
            }else{
                mysqli_query($con,$sql);
            }
        }
        if($indexedOnly[0]['NextPageID2'] != 0){
            $sql="UPDATE page SET position=2 WHERE id = ".$indexedOnly[0]['NextPageID2']." AND story = ".$storyID;
            if($result == true){
                $result = mysqli_query($con,$sql);
            }else{
                mysqli_query($con,$sql);
            }
        }
        if($indexedOnly[0]['NextPageID3'] != 0){
            $sql="UPDATE page SET position=3 WHERE id = ".$indexedOnly[0]['NextPageID3']." AND story = ".$storyID;
            if($result == true){
                $result = mysqli_query($con,$sql);
            }else{
                mysqli_query($con,$sql);
            }
        }
        if($indexedOnly[0]['NextPageID4'] != 0){
            $sql="UPDATE page SET position=4 WHERE id = ".$indexedOnly[0]['NextPageID4']." AND story = ".$storyID;
            if($result == true){
                $result = mysqli_query($con,$sql);
            }else{
                mysqli_query($con,$sql);
            }
        }


   // echo json_encode($sql);

    /*$result = mysqli_multi_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error($con));
    }
    echo "Updated data successfully\n";

        do {
         mysqli_store_result($con);
        } while (mysqli_next_result($con));*/
    return $result;
}



function drawLines($storyID){
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT MAX(level) FROM page WHERE story = ".$storyID));
}


function drawNodes($storyID){
    $mysqlObject = new mysqlModule();
    echo json_encode($mysqlObject->queryDataBase("SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE story = ".$storyID." ORDER BY level,position ASC"));
}

//HERE
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
    mysqli_autocommit($con,FALSE);

   // mysqli_begin_transaction($con,MYSQLI_TRANS_START_READ_WRITE);

    //begin($con); // transaction begins

    //  echo json_encode($indexedOnly);
    $sql="";
    $result = true;
    if($indexedOnly[$ID01]['level'] == '0'){
        $sql="UPDATE story SET firstPage = ".$ID02." WHERE id = ".$storyID;
        $result = mysqli_query($con,$sql);
    }



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

    if($result == true){
        $result = mysqli_query($con,$sql);
    }else{
        mysqli_query($con,$sql);
    }



   /* if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
    echo "Updated data successfully\n";*/

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

    if($result == true){
        $result = mysqli_query($con,$sql);
    }else{
        mysqli_query($con,$sql);
    }
    //echo json_encode($sql);

    if($result == false){
        mysqli_rollback($con); // transaction rolls back
        echo "Error: Transaction rolled back";
        exit;
    }else{
        mysqli_commit($con); // transaction is committed
        echo "Successfully updated!";
    }

  /* $result =mysqli_multi_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
        echo "Updated data successfully\n";
*/
    do {
        mysqli_store_result($con);
    } while (mysqli_next_result($con));




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

    $mysqlObject = new mysqlModule();
    /*$indexedOnly = $mysqlObject->queryDataBase("SELECT MAX(id) FROM page");

    $newID = $indexedOnly[0]['MAX(id)']+1;*/

    $res =getPage($ID,"level,position,",$storyID,"id =");

    $newLevel = $res[0]['level']+1;

    $sql="SELECT position FROM page WHERE story = ".$storyID." AND id = ";

    if($res[0]['NextPageID3'] != 0){
        $sql.=$res[0]['NextPageID3'];
        $changeNN="NextPageID4";
        $first=null;
    }else if($res[0]['NextPageID2'] != 0){
        $sql.=$res[0]['NextPageID2'];
        $changeNN="NextPageID3";
        $first=null;
    }else if($res[0]['NextPageID1'] != 0){
        $sql.=$res[0]['NextPageID1'];
        $changeNN="NextPageID2";
        $first=null;
    }else{
        $changeNN="NextPageID1";
        $first = 1;
    }

    if($first != 1){
        $indexedOnly = $mysqlObject->queryDataBase($sql);
        $newPos = $indexedOnly[0]['position']+1;
    }else{
        $newPos = 1;
    }
    mysqli_autocommit($con,FALSE);
    $result = true;


    $sql="INSERT INTO page (level, position, NextPageID1, NextPageID2, NextPageID3,NextPageID4,story) VALUES (".$newLevel.",".$newPos.",0,0,0,0,".$storyID.")";
    if($result == true){
        $result = mysqli_query($con,$sql);
        $last_id = mysqli_insert_id($con);
    }else{
        mysqli_query($con,$sql);
    }

    $sql="UPDATE page SET title= 'Page".$last_id."',text='Text".$last_id."',imageLink='Link".$last_id."',
    OptionText1 = 'Option".$last_id."_1',OptionText2 = 'Option".$last_id."_2',OptionText3 = 'Option".$last_id."_3',
    OptionText4 = 'Option".$last_id."_4' WHERE id = ".$last_id." AND story = ".$storyID;
    if($result == true){
        $result = mysqli_query($con,$sql);
    }else{
        mysqli_query($con,$sql);
    }


    $sql="UPDATE page SET ".$changeNN." = ".$last_id." WHERE id = ".$ID." AND story = ".$storyID;
    if($result == true){
        $result = mysqli_query($con,$sql);
    }else{
        mysqli_query($con,$sql);
    }



    if($result == false){
        mysqli_rollback($con); // transaction rolls back
        echo "Error: Transaction rolled back";
        exit;
    }else{
        mysqli_commit($con); // transaction is committed
        echo "Successfully updated!";
    }
    mysqli_close($con);
}

function deleteNode($localhost, $user, $pw,$db,$storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $hasChildren = true;
    $indexedOnly = getPage($ID,"",$storyID,"id =");

    $deleteString = "(".$indexedOnly[0]['id'];

     $deleteString = getChildren($indexedOnly,$hasChildren,$deleteString,$storyID,"");
     $deleteString.=")";

    mysqli_autocommit($con,FALSE);
    $result = true;
    $sql = "DELETE FROM page WHERE story = ".$storyID." AND id IN".$deleteString;
    if($result == true){
        $result = mysqli_query($con,$sql);
    }else{
        mysqli_query($con,$sql);
    }

    $result = fixParentANDSiblings($con,$ID,$storyID,$result);

    if($result == false){
        mysqli_rollback($con); // transaction rolls back
        echo "Error: Transaction rolled back";
        exit;
    }else{
        mysqli_commit($con); // transaction is committed
        echo "Successfully updated!";
    }

    mysqli_close($con);
}

function moveBranch($storyID){
    $ID = filter_input(INPUT_GET, 'ID');
    $hasChildren = true;
    $indexedOnly = getPage($ID,"",$storyID,"id =");
    $string = $indexedOnly[0]['id'];
    $string = getChildren($indexedOnly,$hasChildren,$string,$storyID,"");
    echo json_encode($string);
}


function reorderBranches($localhost, $user, $pw,$db,$storyID){
    $x = filter_input(INPUT_GET, 'IDs');
    $movingIDs =explode(",",$x);
    $ID01 = $movingIDs[0];
    $ID02 = filter_input(INPUT_GET, 'ID');
    $found = filter_input(INPUT_GET, 'found');

      $con = mysqli_connect($localhost,$user, $pw, $db );
      if (!$con) {
          die('Could not connect: ' . mysqli_error($con));
      }


    if($found == "true"){
        //get children of targetid
        $indexedOnly = array();
        $hasChildren = true;
        $indexedOnly = getPage($ID02,"",$storyID,"id =");

        $string = $indexedOnly[0]['id'];

        $string = getChildren($indexedOnly,$hasChildren,$string,$storyID,"");
        $string = str_replace($x,"",$string);
        $targetIDs =explode(",",$string);
        $targetIDs = array_filter($targetIDs);

        //get the infos of both main ids
        $sql="SELECT id,level,position FROM page WHERE id IN($ID01,$ID02) AND story = ".$storyID;
        $result = mysqli_query($con,$sql);
        $indexedOnly = array();

        while($row = mysqli_fetch_assoc($result)) {
            $indexedOnly[$row['id']] = $row;
        }

        $sql="SELECT id FROM page WHERE NextPageID1 = ".$ID02." OR NextPageID2 = ".$ID02." OR NextPageID3 = ".$ID02." OR NextPageID4 = ".$ID02." AND story = ".$storyID;

        $parentID = array();
        if( $indexedOnly[$ID02]['level'] != 0) {
            $result = mysqli_query($con, $sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $parentID[0] = $row['id'];
            }
        }

        $sql="SELECT id,level,position,NextPageID1 FROM page WHERE id IN($x) AND story = ".$storyID."  ORDER BY level ASC";
        $result = mysqli_query($con,$sql);
        $i = array();
        while($row = mysqli_fetch_assoc($result)) {
            $i[] = $row;
        }

       // echo json_encode($i);
        $maxLevel =0 ;
        $maxNodeID = 0;
        for($a =0; $a < sizeof($i); $a++){
            if($i[$a]['level'] > $maxLevel && $i[$a]['position'] == 1){
                $maxLevel = $i[$a]['level'];
                $maxNodeID = $i[$a]['id'];
            }
        }


        $levelDiffmovingIDs = $indexedOnly[$ID02]['level']-$indexedOnly[$ID01]['level'];
        $levelDifftargetIDs =(($maxLevel+$levelDiffmovingIDs)+1)- $indexedOnly[$ID02]['level'];

        mysqli_autocommit($con,FALSE);

        $result = true;

        $sql="UPDATE page SET position = CASE id
                                             WHEN ".$ID01."   THEN  ".$indexedOnly[$ID02]['position']."
                                             WHEN ".$ID02."   THEN 1
                                             ELSE position
                                             END
                       WHERE id IN($ID01,$ID02) AND story = ".$storyID;
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }

        //changing levels of childpages

        for($i = 0; $i < sizeof($movingIDs); $i++){
            $sql="UPDATE page SET level = level+".$levelDiffmovingIDs." WHERE id = ".$movingIDs[$i]." AND story = ".$storyID;
            if($result == true){
                $result = mysqli_query($con,$sql);
            }else{
                mysqli_query($con,$sql);
            }
        }

            foreach($targetIDs as $key => $val){
                $sql="UPDATE page SET level = level+".$levelDifftargetIDs." WHERE id = ".$targetIDs[$key]." AND story = ".$storyID;
                if($result == true){
                    $result = mysqli_query($con,$sql);
                }else{
                    mysqli_query($con,$sql);
                }
            }


        $sql="UPDATE page SET NextPageID1 = ".$ID02." WHERE id = ".$maxNodeID." AND story = ".$storyID;
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }

        $result = fixParentANDSiblings($con, $ID01, $storyID, $result);

     /*   $sql="UPDATE page SET NextPageID1 = CASE NextPageID1
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
                          WHERE NextPageID1=".$ID01."  OR NextPageID2=".$ID01." OR NextPageID3=".$ID01." OR NextPageID4=".$ID01." AND story = ".$storyID;
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }*/

        if($indexedOnly[$ID02]['level'] != 0) {
            //austauschen der nextpage ids
            $sql = "UPDATE page SET NextPageID" . $indexedOnly[$ID02]['position'] . " = " . $ID01 . " WHERE id = " . $parentID[0] . " AND story = " . $storyID;
        }else{
           $sql="UPDATE story SET firstPage = ".$ID01." WHERE id = ".$storyID;
        }
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }

        if($result == false){
            mysqli_rollback($con); // transaction rolls back
            echo "Error: Transaction rolled back";
            exit;
        }else{
            mysqli_commit($con); // transaction is committed
            echo "Updated data successfully\n";
        }

    /* $result = mysqli_multi_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }*/


        echo json_encode($targetIDs);
        do {
            mysqli_store_result($con);
        } while (mysqli_next_result($con));

    }else{
        $hasChildren = true;
        $indexedOnly = getPage($ID02,"",$storyID,"id =");

        $string = $indexedOnly[0]['id'];

        $string = getChildren($indexedOnly,$hasChildren,$string,$storyID,"");
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

        mysqli_autocommit($con,FALSE);
        $result = true;

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
                       WHERE id IN($ID01,$ID02) AND story = ".$storyID;

        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }

        //changing levels of childpages
        for($i = 1; $i < sizeof($movingIDs); $i++){
            $sql="UPDATE page SET level = level+".$levelDiffmovingIDs." WHERE id = ".$movingIDs[$i]." AND story = ".$storyID;
            if($result == true){
                $result = mysqli_query($con,$sql);
            }else{
                mysqli_query($con,$sql);
            }
        }

        if(sizeof($targetIDs) > 1){
            for($i = 1; $i < sizeof($targetIDs); $i++){
                $sql="UPDATE page SET level = level+".$levelDifftargetIDs." WHERE id = ".$targetIDs[$i]." AND story = ".$storyID;
                if($result == true){
                    $result = mysqli_query($con,$sql);
                }else{
                    mysqli_query($con,$sql);
                }
            }
        }

        //austauschen der nextpage ids
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
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }

        if($result == false){
            mysqli_rollback($con); // transaction rolls back
            echo "Error: Transaction rolled back";
            exit;
        }else{
            mysqli_commit($con); // transaction is committed
            echo "Updated data successfully\n";
        }

       /* $result = mysqli_multi_query($con,$sql);
        if(!$result)
        {
            die('Could not update data: '. mysqli_error());
        }
        echo "Updated data successfully\n";
       // echo json_encode($targetIDs);*/
        do {
            mysqli_store_result($con);
        } while (mysqli_next_result($con));
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


    mysqli_autocommit($con,FALSE);
    $result = true;

    $result = fixParentANDSiblings($con,$child,$storyID,$result);

    $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id IN($parent,$child) AND story = ".$storyID;
    $res = mysqli_query($con,$sql);
    $indexedOnly = array();


    while($row = mysqli_fetch_assoc($res)) {
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



    //update new parent node
    $sql="UPDATE page SET ".$changeNN." = ".$child." WHERE id = ".$parent." AND story = ".$storyID;
    if($result == true){
        $result = mysqli_query($con,$sql);
    }else{
        mysqli_query($con,$sql);
    }
    //update new child node
    $sql="UPDATE page SET level = 1+".$indexedOnly[$parent]['level'].", position = ".$pos." WHERE id = ".$child." AND story = ".$storyID;
    //echo json_encode($sql);

    if($result == true){
        $result = mysqli_query($con,$sql);
    }else{
        mysqli_query($con,$sql);
    }

    if($result == false){
        mysqli_rollback($con); // transaction rolls back
        echo "Error: Transaction rolled back";
        exit;
    }else{
        mysqli_commit($con); // transaction is committed
        echo "Successfully updated!";
    }

  /* $result = mysqli_multi_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error($con));
    }
    echo "Updated data successfully\n";*/

    do {
        mysqli_store_result($con);
    } while (mysqli_next_result($con));

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

    mysqli_autocommit($con,FALSE);
    $result = true;


    $result = fixParentANDSiblings($con,$child,$storyID,$result);

    $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id IN($parent,$child) AND story = ".$storyID;
    $res = mysqli_query($con,$sql);
    $indexedOnly = array();


    while($row = mysqli_fetch_assoc($res)) {
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

   // echo json_encode($indexedOnly);

      //update new parent node
       $sql="UPDATE page SET ".$changeNN." = ".$child." WHERE id = ".$parent." AND story = ".$storyID;
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }


       //update new child node
       $sql="UPDATE page SET level = 1+".$indexedOnly[$parent]['level'].", position = ".$pos." WHERE id = ".$child." AND story = ".$storyID;
        if($result == true){
            $result = mysqli_query($con,$sql);
        }else{
            mysqli_query($con,$sql);
        }
       // echo json_encode($sql);

       $levelDiffmovingIDs = (1+$indexedOnly[$parent]['level'])-$indexedOnly[$child]['level'];

       for($i = 1; $i < sizeof($movingIDs); $i++){
           $sql="UPDATE page SET level = level+".$levelDiffmovingIDs." WHERE id = ".$movingIDs[$i]." AND story = ".$storyID;
           if($result == true){
               $result = mysqli_query($con,$sql);
           }else{
               mysqli_query($con,$sql);
           }
       }
   // echo json_encode($sql);

    if($result == false){
        mysqli_rollback($con); // transaction rolls back
        echo "Error: Transaction rolled back";
        exit;
    }else{
        mysqli_commit($con); // transaction is committed
        echo "Successfully updated!";
    }

      /* $result = mysqli_multi_query($con,$sql);
       if(!$result)
       {
           die('Could not update data: '. mysqli_error());
       }
       echo "Updated data successfully\n";*/
    do {
        mysqli_store_result($con);
    } while (mysqli_next_result($con));

    mysqli_close($con);
}