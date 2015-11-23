<?php
/**
 * Created by PhpStorm.
 * User: Barbara
 * Date: 05.11.2015
 * Time: 11:00
 */

$functionName = filter_input(INPUT_GET, 'functionName');

$localhost= "localhost";
$user = "root";
$pw = "";
$db = "storytelling_platform";


if ($functionName == "drawLines") {
    drawLines($localhost, $user, $pw,$db);
}else if($functionName == "drawNodes"){
    drawNodes($localhost, $user, $pw,$db);
}else if($functionName == "reorderNodes"){
    reorderNodes($localhost, $user, $pw,$db);
}else if($functionName == "maxChildren"){
    maxChildren($localhost, $user, $pw,$db);
}else if($functionName == "addNewNode"){
    addNewNode($localhost, $user, $pw,$db);
}

function maxChildren($localhost, $user, $pw,$db){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT NextPageID4 FROM page WHERE id = ".$ID;
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);

    }
    mysqli_free_result($result);
    mysqli_close($con);
}

function addNewNode($localhost, $user, $pw,$db){
    $ID = filter_input(INPUT_GET, 'ID');
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT MAX(id) FROM page WHERE story = 1";
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();
    while($row = mysqli_fetch_assoc($result)) {

        $indexedOnly[] =$row;
    }
    $newID = $indexedOnly[0]['MAX(id)']+1;

    $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id =".$ID." AND story = 1";
    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {

        $indexedOnly[] =$row;
    }

    $newLevel = $indexedOnly[1]['level']+1;

    $sql="SELECT position FROM page WHERE story = 1 AND id = ";

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
       $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE level =".$indexedOnly[1]['level']." AND story = 1 AND position < ".$indexedOnly[1]['position'];
       $indexedOnly = array();
       $changeNN="NextPageID1";
       $first = 1;
   }

    $result = mysqli_query($con,$sql);
    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] =$row;
    }
    if($first != 1){
        $newPos = $indexedOnly[2]['position']+1;
    }else{
        $newPos = 0;
       foreach($indexedOnly as $key =>$val) {
          if($indexedOnly[$key]['NextPageID1'] != 0){
              $newPos++;
          }
           if($indexedOnly[$key]['NextPageID2'] != 0){
              $newPos++;
          }
           if($indexedOnly[$key]['NextPageID3'] != 0){
              $newPos++;
           }
           if($indexedOnly[$key]['NextPageID4'] != 0){
              $newPos++;
          }

        }
      $newPos=$newPos+1;
    }



    $sql="UPDATE page SET ".$changeNN." = ".$newID." WHERE id = ".$ID." AND story = 1";
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
    echo "Updated data successfully\n";

    $sql="UPDATE page SET position=position+1 WHERE level = ".$newLevel." AND position >=".$newPos;
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
    echo "Updated data successfully\n";

    $sql="INSERT INTO page (id,level, position, NextPageID1, NextPageID2, NextPageID3,NextPageID4,story,title,text,imageLink,OptionText1,OptionText2,OptionText3,OptionText4)
    VALUES (".$newID.",".$newLevel.",".$newPos.",0,0,0,0,1,'','','','','','',''); ";
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not insert data: '. mysqli_error());
    }
    echo "Inserted data successfully\n";

    //mysqli_free_result($result);
    mysqli_close($con);
}

function drawLines($localhost, $user, $pw,$db){
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT MAX(level) FROM page WHERE story = 1 ";
    $result = mysqli_query($con,$sql);

    while($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);
    }
    mysqli_free_result($result);
    mysqli_close($con);
}


function drawNodes($localhost, $user, $pw,$db){
    $con = mysqli_connect($localhost,$user, $pw, $db );
    if (!$con) {
        die('Could not connect: ' . mysqli_error($con));
    }

    $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE story = 1 ORDER BY level ASC";
    $result = mysqli_query($con,$sql);
    $indexedOnly = array();

    while($row = mysqli_fetch_assoc($result)) {
        $indexedOnly[] = $row;
    }

    echo json_encode($indexedOnly);
    mysqli_free_result($result);
    mysqli_close($con);
}


function reorderNodes($localhost, $user, $pw,$db){
    $ID01 = filter_input(INPUT_GET, 'ID01');
    $ID02 = filter_input(INPUT_GET, 'ID02');

    $con = mysqli_connect($localhost,$user, $pw, $db );
        if (!$con) {
            die('Could not connect: ' . mysqli_error($con));
        }

        $sql="SELECT id,level,position,NextPageID1,NextPageID2,NextPageID3,NextPageID4 FROM page WHERE id IN($ID01,$ID02) AND story = 1";
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
              WHERE id IN($ID01,$ID02) AND story = 1";

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
              WHERE NextPageID1 IN($ID01,$ID02) OR NextPageID2 IN($ID01,$ID02) OR NextPageID3 IN($ID01,$ID02) OR NextPageID4 IN($ID01,$ID02) AND story = 1";
    $result = mysqli_query($con,$sql);
    if(!$result)
    {
        die('Could not update data: '. mysqli_error());
    }
        echo "Updated data successfully\n";
        mysqli_close($con);
}




