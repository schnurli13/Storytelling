/**
 * Created by Barbara on 04.11.2015.
 */

var nodeEditor = nodeEditor || {};

nodeEditor.module = (function($) {

//initializing
    var width = window.innerWidth*0.595,
        height = window.innerHeight ,
        levelY = 100,
        levelX = width/2,
        storyID,
        selectedNode = null,
        xDrag,
        buttonColor='#96c4cd',
        buttonColorHover='#6b878c',
        buttonColorDisabled='white',
        pause = false,
        movementStyle = null,
        dropStyle = null,
        previousShape,
        hasChildren = false,
        popUpShown=false,
        yDrag,
        xDrop,
        yDrop,
        over,
        deleteText = "ATTENTION:\n All sub-pages will be deleted as well.\nDo you really want to delete this page?",
        moveText = "Do you want to move only this page or all sub-pages as well?",
        dropText = "Do you want replace this page with the dragged one or do you want to add the moving page as sub-page to this page?",

        stage = new Konva.Stage({
            container: 'container',
            width: width,
            height:height

        }),
        backgroundLayer = new Konva.Layer({
            width: width,
            height:height
        }),
        layer  = backgroundLayer.clone(),
        layerConn = backgroundLayer.clone(),
        layerTEXT = backgroundLayer.clone(),
        tempLayer = backgroundLayer.clone(),
        interfaceLayer = backgroundLayer.clone(),

        debugText = new Konva.Text({
            fill: 'black',
            fontSize: 15,
            x: width/2 - 50,
            y: 25
        }),
        deleteButton= new Konva.Group({
            x: 30,
            y: 80,
            id: "deleteButton"
        }),
        addButton = deleteButton.clone({
            x: 30,
            y: 20,
            id: "addButton"
        }),
        button1 = deleteButton.clone({
            y: 130,
            id: "button1"
        }),

        movingGroup = new Konva.Group({
            id: "movingGroup",
            draggable: true
        }),

        button2 = button1.clone({id: "button2"}),
        button3 = button1.clone({x: 335,id: "button3"}),

        dottedLineAdd = new Konva.Line({
            points: [5, 5, 145, 5, 145, 45, 5, 45,5,5],
            stroke: 'black',
            strokeWidth: 1,
            lineJoin: 'round',
            dash: [4, 2]
        }),
        dottedLineDel = dottedLineAdd.clone(),
        dottedLineBack = dottedLineAdd.clone({
            points: [5, 5, width-5, 5, width-5, height-5, 5, height-5,5,5]
        }),
        dottedLinePopUp=  dottedLineAdd.clone({
            points: [10, 10, 390, 10, 390, 240, 10,240,10,10],
            strokeWidth: 2
        }),

        popUpRect= new Konva.Rect({
            x: 0,
            y: 0,
            width: 400,
            height: 250,
            id: "popUpRect",
            fill: buttonColorDisabled
        }),
        popUp = new Konva.Group({
            x: width/2-200,
            y: height/2-125,
            id: "popUp"
        }),

        addRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 150,
            height: 50,
            id: "addRect",
            fill: buttonColorDisabled
        }),
        delRect = addRect.clone({
            id: "delRect"
        }),
        button1Rect = addRect.clone({
            fill: buttonColor,
            id: "button1Rect"
        }),

        addText = new Konva.Text({
        fill: 'black',
        fontSize: 18,
        x: 22,
        y: 18,
        id: "addText",
        text: "Add new Page",
        fontFamily: 'Calibri'
        }),

        delText = addText.clone({
            id: "delText",
            text: "Delete Page"
        }),

        popText = addText.clone({
            align: 'center',
            lineHeight: 1.5
        }),


        ajaxLink = '../../../public/php/getstory.php',

        init,
        startDrawLines,
        drawLines,
        startDrawNodes,
        findID,
        drawNodes,
        count,
        drawConnection,
        nodeSelection,
        reorderNodes,
        reorderBranches,
        checkAdditionalNode,
        checkDeleteNode,
        addNewNode,
        deleteNode,
        setDraggable,
        disable,
        moveQuestion,
        dropQuestion,
        dropReset,
        reorder,
        hoverPopUpButtons
    ;


//draw lines
    startDrawLines = function() {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=drawLines&storyID='+storyID,
            success: function (data) {
               var obj = $.parseJSON(data);
               drawLines(obj['MAX(level)']);
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    };

    drawLines = function(levelNumb) {
        backgroundLayer.destroyChildren();
        var line;
        var levelText;
        var h = levelY;
        for (var j = 0; j <= levelNumb; j++) {
            line = new Konva.Line({
                points: [0, h, stage.getWidth(), h],
                stroke: 'grey',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
            });

            levelText = new Konva.Text({
                fill: 'black',
                fontSize: 15,
                text: j,
                x: 10,
                y: h-15
            });

            backgroundLayer.add(levelText);
            backgroundLayer.add(line);

            h += 100;
        }
        backgroundLayer.draw();

    };

    startDrawNodes = function() {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=drawNodes&storyID='+storyID,
            success: function (data) {
                var obj = $.parseJSON(data);
                drawNodes(obj);
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    };

    findID = function(data, id){
        var idNEW = 0;
        if(id != 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i]['id'] == id) {
                    idNEW = i;
                }
            }
        }
        return idNEW;
    };


    drawNodes = function (data) {
        layer.destroyChildren();
        layerTEXT.destroyChildren();
        layerConn.destroyChildren();

        stage.find('#addRect')[0].setAttr('fill',buttonColorDisabled);
        stage.find('#delRect')[0].setAttr('fill',buttonColorDisabled);
        interfaceLayer.draw();

        //document.getElementById('addNode').disabled = true;
        //document.getElementById('deleteNode').disabled = true;
        selectedNode = null;

        var star;
        var idText;
        var multiple = levelX;
        var center = 0;
        var distance = 70;
        var numb;
        var points = [];
        var IDs = [];
        var z = 0;
        var nodeCounter = 0;


        for (var i = 0; i < data.length; i++) {
            var nextPageIDinData;
            var nextID;
            //first node
            if (i == 0) {
                star = new Konva.Circle({
                    x: multiple - center,
                    y: (parseInt(data[i]['level']) + 1) * levelY,
                    fill: buttonColorHover,
                    radius: 20,
                    draggable: true,
                    name: 'star ' + data[i]['id'],
                    id: data[i]['id'],
                    stroke: 'black',
                    strokeWidth: 2,
                    dragBoundFunc: function (pos) {
                        var newY = pos.y < levelY ? levelY : pos.y;
                        return {
                            x: pos.x,
                            y: newY
                        };
                    }
                });

                layer.add(star);

                //TITLE
                idText = new Konva.Text({
                    x: star.getAbsolutePosition().x-6,
                    y: star.getAbsolutePosition().y-6,
                    text: star.getAttr('id'),
                    fontSize: 20,
                    fill: 'black'
                });
                layerTEXT.add(idText);


                //connection saving
                if (data[i]['NextPageID1']) {
                    points[z] = [];
                    points[z]['pointX'] = star.getAbsolutePosition().x;
                    points[z]['pointY'] = star.getAbsolutePosition().y;
                    points[z][0] = data[i]['NextPageID1'];
                    if (data[i]['NextPageID2']) {
                        points[z][1] = data[i]['NextPageID2'];
                    }
                    if (data[i]['NextPageID3']) {
                        points[z][2] = data[i]['NextPageID3'];
                    }
                    if (data[i]['NextPageID4']) {
                        points[z][3] = data[i]['NextPageID4'];
                    }
                    z++;
                }

            }

            var sh = IDs.shift();
            //get next node id
            for (var q = 1; q < 5; q++) {
                if(i != 0){
                    nextPageIDinData = findID(data, data[sh]["NextPageID" + q]);
                    nextID = nextPageIDinData;

                }else{
                    nextPageIDinData = findID(data,data[i]["NextPageID" + q]);
                    nextID = nextPageIDinData;
                }
                if (nextID != 0) {
                    IDs.push(nextID);
                    numb = count(data, nextPageIDinData);

                    nodeCounter++;

                    if (numb > 1) {
                        center = ((numb * (distance)) / 2) + distance / 2;
                        multiple += distance;
                    } else {
                        center = 0;
                        multiple = levelX;
                    }
                    star = new Konva.Circle({
                        x: multiple - center,
                        y: (parseInt(data[nextPageIDinData]['level']) + 1) * levelY,
                        fill: buttonColorHover,
                        radius: 20,
                        draggable: true,
                        name: 'star ' + data[nextPageIDinData]['id'],
                        id: data[nextPageIDinData]['id'],
                        stroke: 'black',
                        strokeWidth: 2,
                        dragBoundFunc: function (pos) {
                            var newY = pos.y < levelY ? levelY : pos.y;
                            return {
                                x: pos.x,
                                y: newY
                            };
                        }

                    });

                    layer.add(star);

                    //TITLE
                    idText = new Konva.Text({
                        x: star.getAbsolutePosition().x-6,
                        y: star.getAbsolutePosition().y-6 ,
                        text: star.getAttr('id'),
                        fontSize: 20,
                        fill: 'black'
                    });
                    layerTEXT.add(idText);


                    //connection saving
                    if (data[nextPageIDinData]['NextPageID1']) {
                        points[z] = [];
                        points[z]['pointX'] = star.getAbsolutePosition().x;
                        points[z]['pointY'] = star.getAbsolutePosition().y;
                        points[z][0] = data[nextPageIDinData]['NextPageID1'];
                        if (data[nextPageIDinData]['NextPageID2']) {
                            points[z][1] = data[nextPageIDinData]['NextPageID2'];
                        }
                        if (data[nextPageIDinData]['NextPageID3']) {
                            points[z][2] = data[nextPageIDinData]['NextPageID3'];
                        }
                        if (data[nextPageIDinData]['NextPageID4']) {
                            points[z][3] = data[nextPageIDinData]['NextPageID4'];
                        }
                        z++;
                    }

                    //connection drawing
                    for (var j = 0; j < points.length; j++) {
                        for (var k = 0; k < 4; k++) {
                            if (points[j][k] == data[nextPageIDinData]['id']) {
                                drawConnection(points[j][k], data[i]['id'], points[j]['pointX'], points[j]['pointY'], star.getAbsolutePosition().x, star.getAbsolutePosition().y);
                            }
                        }
                    }

                }

            }

           // console.log(IDs);
            //check if END of level
            if (nodeCounter == numb) {
                nodeCounter = 0;
                center = 0;
                multiple = levelX;
            }
        }
        layer.draw();
        layerConn.draw();
        layerTEXT.draw();

    };

    nodeSelection = function(e) {
        if (selectedNode == null || e.target.id() == selectedNode) {
            var fill = e.target.fill() == 'yellow' ? buttonColorHover : 'yellow';
            e.target.fill(fill);
            debugText.text('Selected ' + e.target.name());
            if (fill == 'yellow') {
                selectedNode = e.target.id();
            } else if (fill == buttonColorHover) {
                selectedNode = null;
            }
            layer.draw();
            backgroundLayer.draw();
        }
    };

    reorderNodes = function(ID01, ID02) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=reorderNodes&storyID='+storyID+'&ID01=' + ID01 + '&ID02=' + ID02,
            success: function (data) {
                alert(data);
                console.log("SUCCESS");
                startDrawNodes();
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    };

    reorderBranches = function(ID){
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=reorderBranches&storyID='+storyID+'&ID=' + ID + '&IDs=' + movementStyle,
            success: function (data) {
                alert(data);
                console.log("SUCCESS");
                startDrawLines();
                startDrawNodes();
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    };

    checkAdditionalNode = function(id) {

        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=maxChildren&storyID='+storyID+'&ID=' + id,
            success: function (data) {
              //  alert(data);
                console.log("SUCCESS");
                var obj = $.parseJSON(data);
                hasChildren = false;
                if (obj[0]['NextPageID4'] == 0) {
                    if(!popUpShown) {
                        stage.find('#addRect')[0].setAttr('fill', buttonColor);
                    }
                 //   document.getElementById('addNode').disabled = false;
                } else {
                    if(movementStyle != null) {
                        button1.off('click');
                        hoverPopUpButtons(['#button1Rect', '#button1Text'], buttonColorDisabled, buttonColorDisabled);
                    }
                    if(!popUpShown) {
                        stage.find('#addRect')[0].setAttr('fill', buttonColorDisabled);
                    }
                    //document.getElementById('addNode').disabled = true;
                }
                if(obj[0]['NextPageID1'] != 0){
                    hasChildren = true; // alert(obj[0]['NextPageID1']);
                }
                interfaceLayer.draw();

            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    };

    checkDeleteNode = function(id) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=isFirstNode&storyID='+storyID+'&ID=' + id,
            success: function (data) {
                var obj = $.parseJSON(data);
                if (obj['level'] == 0) {
                    if(!popUpShown) {
                        stage.find('#delRect')[0].setAttr('fill', buttonColorDisabled);
                    }
                   // document.getElementById('deleteNode').disabled = true;
                } else {
                    if(!popUpShown) {
                        stage.find('#delRect')[0].setAttr('fill', buttonColor);
                    }
                  //  document.getElementById('deleteNode').disabled = false;
                }
                interfaceLayer.draw();
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    };

    addNewNode = function(id) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=addNewNode&storyID='+storyID+'&ID=' + id,
            success: function (data) {
                alert(data);
                console.log("SUCCESS");
                startDrawLines();
                startDrawNodes();
                //var obj = $.parseJSON(data);
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    };

    setDraggable = function(bool){
        layer.getChildren(function(node){
            return node.getClassName() === 'Circle';
        }).each(function(shape, n) {
            shape.setAttr('draggable',bool);
        });
    };

    deleteNode = function(id){

       setDraggable(false);

        popText.setAttr('text',deleteText);
        popText.setAttr('x','20');
        popText.setAttr('y','25');
        popText.setAttr('width','380');

        tempLayer.find('#button1Text')[0].setAttr('text','DELETE');
        tempLayer.find('#button1Text')[0].setAttr('x','45');

        tempLayer.find('#button2Text')[0].setAttr('text','CANCEL');
        tempLayer.find('#button2Text')[0].setAttr('x','45');

        popUpRect.setAttr('width','400');
        popUp.setAttr('x',width/2-200);

        dottedLinePopUp.setAttr('points',[10, 10, 390, 10, 390, 240, 10,240,10,10]);
        button1.setAttr('x','30');
        button2.setAttr('x','220');
       // button2.setAttr('id','button2');

        popUp.show();
        tempLayer.draw();


       button2.off('click').on('click',function(e){
            tempLayer.find('#button2Rect')[0].fill(buttonColor);
            popUp.hide();
            tempLayer.draw();
            setDraggable(true);
        });


        button1.off('click').on('click',function(e){
            $.ajax({
                     url: ajaxLink,
                     type: 'GET',
                     data: 'functionName=deleteNode&storyID=' + storyID + '&ID=' + id,
                     success: function (data) {
                     alert(data);
                     console.log("SUCCESS");
                     tempLayer.find('#button1Rect')[0].fill(buttonColor);
                     popUp.hide();
                     tempLayer.draw();
                     setDraggable(true);
                     startDrawLines();
                     startDrawNodes();
                 },
                 error: function (xhr, status, error) {
                     alert(error);
                 }
             });
        });


        hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);

    };

    hoverPopUpButtons = function(element,colorHover, colorOut){

        tempLayer.find(element[0])[0].setAttr('fill',colorOut);
        tempLayer.draw();

        tempLayer.find(element[0])[0].off('mouseover').on('mouseover',function(e){
            e.target.fill(colorHover);
            tempLayer.draw();
        });
        tempLayer.find(element[1])[0].off('mouseover').on('mouseover',function(e){
            tempLayer.find(element[0])[0].fill(colorHover);
            tempLayer.draw();
        });
        tempLayer.find(element[0])[0].off('mouseout').on('mouseout',function(e){
            e.target.fill(colorOut);
            tempLayer.draw();
        });

    };

    moveQuestion = function(evt){

        popUpShown = true;

        pause = true;

        setDraggable(false);

        popText.setAttr('text',moveText);
        popText.setAttr('x','10');
        popText.setAttr('y','65');
        popText.setAttr('width','480');

        tempLayer.find('#button1Text')[0].setAttr('text','MOVE BRANCH');
        tempLayer.find('#button1Text')[0].setAttr('x','20');

        tempLayer.find('#button2Text')[0].setAttr('text','MOVE PAGE');
        tempLayer.find('#button2Text')[0].setAttr('x','25');

        popUpRect.setAttr('width','500');
        popUp.setAttr('x',width/2-250);

        dottedLinePopUp.setAttr('points',[10, 10, 490, 10, 490, 240, 10,240,10,10]);

        button1.setAttr('x','15');
        button2.setAttr('x','175');
      // button2.setAttr('id','button2Move');

        button3.add(button1Rect.clone({id:'button3Rect'}));
        button3.add(dottedLineAdd.clone());
        button3.add(delText.clone({id:'button3Text'}));
      //  button3.setAttr('id','button3Move');
        popUp.add(button3);

        tempLayer.find('#button3Text')[0].setAttr('text','CANCEL');
        tempLayer.find('#button3Text')[0].setAttr('x','45');
        tempLayer.find('#button3Text')[0].setAttr('id','button3Text');

        tempLayer.find('#button3Rect')[0].setAttr('id','button3Rect');

        popUp.show();
        tempLayer.draw();

        hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button3Rect','#button3Text'],buttonColorHover,buttonColor);

        button3.off('click').on('click',function(e){
            tempLayer.find('#button3Rect')[0].fill(buttonColor);
            button3.remove();
            popUp.hide();
            tempLayer.draw();
            pause = false;
            movementStyle = null;
            evt.target.fill(buttonColorHover);
            layer.draw();
            selectedNode = null;
            setDraggable(true);
            startDrawNodes();
            popUpShown = false;
        });

        button1.off('click').on('click',function(e) {
           $.ajax({
                url: ajaxLink,
                type: 'GET',
                data: 'functionName=moveBranch&storyID=' + storyID + '&ID=' + evt.target.id(),
                success: function (data) {
                    tempLayer.find('#button1Rect')[0].fill(buttonColor);
                    button3.remove();
                    popUp.hide();
                    tempLayer.draw();
                    pause = false;
                    movementStyle = data;
                    movementStyle = movementStyle.replace(/"/g,"");
                    movementStyle = movementStyle.split(",");

                    xDrag = evt.target.getAbsolutePosition().x;
                    yDrag = evt.target.getAbsolutePosition().y;

                    movingGroup.setAttr('x',0);
                    movingGroup.setAttr('y',0);
                    for(var i = 0; i < movementStyle.length; i++){
                        var node = layer.find('#'+ movementStyle[i]);
                        node.fill('yellow');
                        node.moveTo(movingGroup);
                    }
                    layer.add(movingGroup);
                    layer.draw();
                    popUpShown = false;
                },
                error: function (xhr, status, error) {
                    alert(error);
                }
            });
        });

       button2.off('click').on('click',function(e){
            tempLayer.find('#button2Rect')[0].fill(buttonColor);
            button3.remove();
            popUp.hide();
            tempLayer.draw();
            pause = false;
            movementStyle = "one";
            layer.find('#'+evt.target.id()).draggable(true);
           popUpShown = false;
        });

    };

    dropQuestion = function(evt){

        pause = true;
        popUpShown = true;

        setDraggable(false);
        evt.target.moveDown();

        popText.setAttr('text',dropText);
        popText.setAttr('x','10');
        popText.setAttr('y','55');
        popText.setAttr('width','480');

        tempLayer.find('#button1Text')[0].setAttr('text','ADD AS SUB-PAGE');
        tempLayer.find('#button1Text')[0].setAttr('x','8');

        tempLayer.find('#button2Text')[0].setAttr('text','REPLACE PAGES');
        tempLayer.find('#button2Text')[0].setAttr('x','18');

        popUpRect.setAttr('width','500');
        popUp.setAttr('x',width/2-250);

        dottedLinePopUp.setAttr('points',[10, 10, 490, 10, 490, 240, 10,240,10,10]);

        button1.setAttr('x','15');
        button2.setAttr('x','175');
     //   button2.setAttr('id','button2Drop');
       // button3.setAttr('id','button3Drop');

        button3.add(button1Rect.clone({id:'button3Rect'}));
        button3.add(dottedLineAdd.clone());
        button3.add(delText.clone({id:'button3Text'}));
        popUp.add(button3);

        tempLayer.find('#button3Text')[0].setAttr('text','CANCEL');
        tempLayer.find('#button3Text')[0].setAttr('x','45');
        tempLayer.find('#button3Text')[0].setAttr('id','button3Text');

        tempLayer.find('#button3Rect')[0].setAttr('id','button3Rect');

        popUp.show();
        tempLayer.draw();

        hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button3Rect','#button3Text'],buttonColorHover,buttonColor);

        button3.off('click').on('click',function(e){
            tempLayer.find('#button3Rect')[0].fill(buttonColor);
            button3.remove();
            popUp.hide();
            tempLayer.draw();
            pause = false;
            selectedNode = null;
            setDraggable(true);

            if (movementStyle == "one") {
                evt.target.setAttr("x", xDrag);
                evt.target.setAttr("y", yDrag);
                evt.target.fill(buttonColorHover);
            } else {
                evt.target.setAttr("x", 0);
                evt.target.setAttr("y", 0);
            }
            dropReset(evt);
            startDrawNodes();
            popUpShown = false;
        });


        if(hasChildren && movementStyle == "one") {
            button1.off('click');
            hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorDisabled,buttonColorDisabled);
        }else{
            hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
            button1.off('click').on('click', function (e) {
                if(movementStyle == "one") {
                   $.ajax({
                        url: ajaxLink,
                        type: 'GET',
                        data: 'functionName=addNodeAsChild&storyID=' + storyID + '&ID01=' + previousShape.id() + '&ID02=' + evt.target.id(),
                        success: function (data) {
                            alert(data);
                            console.log("SUCCESS");
                            tempLayer.find('#button2Rect')[0].fill(buttonColor);
                            button3.remove();
                            popUp.hide();
                            tempLayer.draw();
                            pause = false;
                            dropStyle = "child";
                            dropReset(evt);
                            startDrawLines();
                            startDrawNodes();
                            popUpShown = false;
                        },
                        error: function (xhr, status, error) {
                            alert(error);
                        }
                    });
                }else{
                    $.ajax({
                        url: ajaxLink,
                        type: 'GET',
                        data: 'functionName=addBranchAsChild&storyID=' + storyID + '&ID=' + previousShape.id() + '&IDs=' + movementStyle,
                        success: function (data) {
                             alert(data);
                            console.log("SUCCESS");
                            tempLayer.find('#button2Rect')[0].fill(buttonColor);
                            button3.remove();
                            popUp.hide();
                            tempLayer.draw();
                            pause = false;
                            dropStyle = "child";
                            dropReset(evt);
                            startDrawLines();
                            startDrawNodes();
                            popUpShown = false;
                        },
                        error: function (xhr, status, error) {
                            alert(error);
                        }
                    });
                }
            });
        }

        button2.off('click').on('click',function(e){
            tempLayer.find('#button2Rect')[0].fill(buttonColor);
            button3.remove();
            popUp.hide();
            tempLayer.draw();
            pause = false;
            dropStyle = "reorder";
            reorder(evt);
            popUpShown = false;
            //layer.find('#'+evt.target.id()).draggable(true);
        });

    };

//helpers
    count = function(data, level) {
        var count = 0;
        for (var j = 0; j < data.length; j++) {
            if (parseInt(data[level]['level']) == parseInt(data[j]['level'])) {
                count++;
            }
        }
        return count;
    };

    drawConnection = function(id0, id1, x0, y0, x1, y1) {
        var line;
        line = new Konva.Line({
            points: [x0, y0, x1, y1],
            stroke: 'black',
            name: 'Line' + id0 + id1,
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        });

        layerConn.add(line);
    };

    disable = function(id) {
        if (selectedNode == null) {
            stage.find('#addRect')[0].setAttr('fill',buttonColorDisabled);
           stage.find('#delRect')[0].setAttr('fill',buttonColorDisabled);
            interfaceLayer.draw();

        } else {
            if (selectedNode == id) {
                checkAdditionalNode(id);
                checkDeleteNode(id);
            }
        }
    };

    reorder = function(e){
        if (movementStyle == "one") {
            e.target.setAttr("x", xDrop);
            e.target.setAttr("y", yDrop);
            reorderNodes(previousShape.id(), e.target.id());
            previousShape.fire('drop', {
                type: 'drop',
                target: previousShape,
                evt: e.evt
            }, true);
            e.target.fill('green');

        } else {
            reorderBranches(previousShape.id());
            previousShape.fire('drop', {
                type: 'drop',
                target: previousShape,
                evt: e.evt
            }, true);
        }
      dropReset(e);
    };

    dropReset = function(e){
        previousShape = undefined;
        if (movementStyle == "one") {
            e.target.moveTo(layer);
            if (e.target.id() == selectedNode) {
                selectedNode = null;
            }
            disable(e.target.id());
            setDraggable(true);
        } else {
            e.target.getChildren(function (n) {
                return n.getClassName() === "Circle";
            }).each(function (shape, n) {
                var x = shape.getAbsolutePosition().x;
                var y = shape.getAbsolutePosition().y;
                shape.moveTo(layer);
                shape.setAttr('x', x);
                shape.setAttr('y', y);
                shape.setAttr('fill', buttonColorHover);
                setDraggable(true);
            });
        }

        layer.draw();
        tempLayer.draw();
        dropStyle = null;
        movementStyle = null;
    };

//END

// IIIIIIIIIIIIINIT
    init = function init(){
        var res = window.location.href;
        var array = res.split("/");
        storyID = array[array.length-2];


        //ADD NEW PAGE BUTTON
        addButton.add(addRect);
        addButton.add(addText);
        addButton.add(dottedLineAdd);
        interfaceLayer.add(addButton);

        //DELETE PAGE BUTTON
        deleteButton.add(delRect);
        deleteButton.add(delText);
        deleteButton.add(dottedLineDel);
        interfaceLayer.add(deleteButton);

        //HOVERTEXT + BACKGROUND
        interfaceLayer.add(debugText);
        interfaceLayer.add(dottedLineBack);

        //DELETE POPUP
        popUp.add(popUpRect);
        popUp.add(popText);

        button1.add(button1Rect);
        button1.add(dottedLineAdd.clone());
        button1.add(delText.clone({id:'button1Text'}));
        popUp.add(button1);


        button2.add(button1Rect.clone({id:'button2Rect'}));
        button2.add(dottedLineAdd.clone());
        button2.add(delText.clone({id:'button2Text'}));
        popUp.add(button2);

        popUp.add(dottedLinePopUp);
        tempLayer.add(popUp);

        tempLayer.find('#popUp')[0].hide();
       // tempLayer.draw();

        stage.add(backgroundLayer);
        stage.add(layerConn);
        stage.add(layer);
        stage.add(layerTEXT);
        stage.add(tempLayer);
        stage.add(interfaceLayer);

        startDrawLines();
        startDrawNodes();

//SELECT EVENTS
        layer.on('click', function (e) {
            if(movementStyle == null) {
                nodeSelection(e);
                disable(e.target.id());
            }
        });

        layer.on("mouseover", function (e) {
            var fill = e.target.fill() == 'yellow' ? 'yellow' : 'orange';
            e.target.fill(fill);
            debugText.text('Choose ' + e.target.name());
            layer.draw();
            interfaceLayer.draw();
        });

        layer.on("mouseout", function (e) {
            var fill = e.target.fill() == 'yellow' ? 'yellow' : buttonColorHover;
            e.target.fill(fill);
            layer.draw();
        });

        //add new page
        stage.find('#addButton')[0].on('click',function(e){
            var rect =  stage.find('#addRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColorHover;
            if(fill != buttonColorDisabled){
                addNewNode(selectedNode);
            }
        });
        stage.find('#addRect')[0].on('mouseover',function(e){
            var fill = e.target.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColor;
            if(fill != buttonColorDisabled){
                e.target.fill(buttonColorHover);
                interfaceLayer.draw();
            }
        });
        stage.find('#addRect')[0].on('mouseout',function(e){
            var fill = e.target.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColorHover;
            if(fill != buttonColorDisabled) {
                e.target.fill(buttonColor);
                interfaceLayer.draw();
            }
        });
        stage.find('#addText')[0].on('mouseover',function(e){
            var rect =  stage.find('#addRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColor;
            if(fill != buttonColorDisabled){
                rect.fill(buttonColorHover);
                interfaceLayer.draw();
            }
        });

       //delete page
        stage.find('#deleteButton')[0].off('click').on('click',function(e){
            var rect =  stage.find('#delRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled: buttonColorHover;
            if(fill != buttonColorDisabled){
               deleteNode(selectedNode);
            }
        });
        stage.find('#delRect')[0].off('mouseover').on('mouseover',function(e){
            var fill = e.target.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColor;
            if(fill != buttonColorDisabled){
                e.target.fill(buttonColorHover);
                interfaceLayer.draw();
            }
        });
        stage.find('#delRect')[0].off('mouseout').on('mouseout',function(e){
            var fill = e.target.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColorHover;
            if(fill != buttonColorDisabled) {
                e.target.fill(buttonColor);
                interfaceLayer.draw();
            }
        });
        stage.find('#delText')[0].off('mouseover').on('mouseover',function(e){
            var rect =  stage.find('#delRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColor;
            if(fill != buttonColorDisabled){
                rect.fill(buttonColorHover);
                interfaceLayer.draw();
            }
        });


//END

//DRAGGEN
      stage.on("dragstart", function (e) {
          checkAdditionalNode(e.target.id());
          checkDeleteNode(e.target.id());

          if(!pause && movementStyle == null){
              moveQuestion(e);
              e.target.fill('yellow');
             interfaceLayer.draw();
            }else if(!pause && movementStyle == "one"){
                xDrag = e.target.getAbsolutePosition().x;
                yDrag = e.target.getAbsolutePosition().y;

                // alert(xDrag + ":"+yDrag);
                e.target.moveTo(tempLayer);
                e.target.fill('yellow');
                debugText.text('Moving ' + e.target.name());
                interfaceLayer.draw();
                layer.draw();
            }else if(!pause && movementStyle != "one" && movementStyle != null ){
               // nodeSelection(e.target.find('#'+movementStyle[0]));
                selectedNode= e.target.find('#'+movementStyle[0])[0].getAttr('id');
                movingGroup.moveTo(tempLayer);
                debugText.text('Moving ' + e.target.id() + ' and children');
                interfaceLayer.draw();
                layer.draw();
            }
        });


        stage.on("dragmove", function (evt) {
            if(!pause) {
                var pos = stage.getPointerPosition();
                var shape = layer.getIntersection(pos);
                if (previousShape && shape) {
                    if (previousShape !== shape) {
                        // leave from old target
                        previousShape.fire('dragleave', {
                            type: 'dragleave',
                            target: previousShape,
                            evt: evt.evt
                        }, true);

                        // enter new target
                        shape.fire('dragenter', {
                            type: 'dragenter',
                            target: shape,
                            evt: evt.evt
                        }, true);
                        previousShape = shape;
                    } else {
                        previousShape.fire('dragover', {
                            type: 'dragover',
                            target: previousShape,
                            evt: evt.evt
                        }, true);
                    }
                } else if (!previousShape && shape) {
                    previousShape = shape;
                    shape.fire('dragenter', {
                        type: 'dragenter',
                        target: shape,
                        evt: evt.evt
                    }, true);
                } else if (previousShape && !shape) {
                    previousShape.fire('dragleave', {
                        type: 'dragleave',
                        target: previousShape,
                        evt: evt.evt
                    }, true);
                    previousShape = undefined;
                }
                tempLayer.draw();
            }
        });


        stage.on("dragend", function (e) {
            if(!pause) {
                var pos = stage.getPointerPosition();
                var overlapping = layer.getIntersection(pos);
                if (overlapping) {
                    if (dropStyle == null) {
                        checkAdditionalNode(previousShape.id());
                        dropQuestion(e);
                    }
                } else {
                    if (movementStyle == "one") {
                        e.target.setAttr("x", xDrag);
                        e.target.setAttr("y", yDrag);
                        e.target.fill(buttonColorHover);
                    } else {
                        e.target.setAttr("x", 0);
                        e.target.setAttr("y", 0);
                    }
                   dropReset(e);
                }
            }
        });

        stage.on("dragenter", function (e) {
           if(!pause) {
                debugText.text('dragenter ' + e.target.name());
                layer.draw();
                interfaceLayer.draw();
           }
        });

        stage.on("dragleave", function (e) {
            if(!pause) {
                over = false;
                e.target.fill(buttonColorHover);
                debugText.text('dragleave ' + e.target.name());
                layer.draw();
                interfaceLayer.draw();
            }
        });

        stage.on("dragover", function (e) {
            if(!pause) {
                over = true;
                e.target.fill('green');
                xDrop = e.target.getAbsolutePosition().x;
                yDrop = e.target.getAbsolutePosition().y;
                debugText.text('dragover ' + e.target.name());
                layer.draw();
                interfaceLayer.draw();
            }
        });

        stage.on("drop", function (e) {
            if(!pause) {
                e.target.setAttr("x", xDrag);
                e.target.setAttr("y", yDrag);

                e.target.fill('green');
                debugText.text('drop ' + e.target.name());
                layer.draw();
                interfaceLayer.draw();
            }
        });

    };

    $(document).ready(init);

}($));

//}

//not needed yet
/*function updateConnections(){

 }

 function hasMultipleChildren(array){
 var group;
 if(!(array['NextPageID2'] == null && array['NextPageID3'] == null && array['NextPageID4'] == null)){
 group = new Konva.Group({
 id: array['ID']
 });
 }else{
 return null;
 }
 return group;
 }

 //zoom
 var zoomLevel = 2;
 layer.on('click', function() {
 layer.scale({
 x : zoomLevel,
 y : zoomLevel
 });
 layer.draw();
 });

 //animation
 /* var anim = new Konva.Animation(function(frame) {
 var diffx = xDrag-e.target.getAbsolutePosition().x;
 var diffy = yDrag-e.target.getAbsolutePosition().y;
 var b = Math.sqrt(diffx*diffx + diffy*diffy);

 e.target.setAttr("x", e.target.getAbsolutePosition().x + (diffx/b)*3);
 e.target.setAttr("y", e.target.getAbsolutePosition().y + (diffy/b)*3);
 }, layer);

 anim.start();
 if(e.target.getAbsolutePosition().x == xDrag && e.target.getAbsolutePosition().y == yDrag){
 anim.stop();
 }
 */


