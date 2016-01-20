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
        emptyRectangle,
        pause = false,
        movementStyle = null,
        dropStyle = null,
        found = false,
        previousShape,
        hasChildren = false,
        popUpShown=false,
        highLight = null,
        zoomStyle = "zoomScroll",
        zoom = 1.8,
        zooming = false,
        zoomSc,
        startScale = 1.0,
        startOffsetX = 0.0,
        startOffsetY = 0.0,
        tooltip,
        yDrag,
        diffX,
        diffY,
        xDrop,
        yDrop,
        over,
        deleteText = "ATTENTION:\n All sub-pages will be deleted as well.\nDo you really want to delete this page?",
        moveText = "Do you want to move only this page or all sub-pages as well?",
        dropText = "Do you want replace this page with the dragged one or do you want to add the moving page as sub-page to this page?",
        drop2Text = "Do you really want to replace this branch with the dragged one? This action will influence the sub-pages!",
        toolTipText="",

        stage = new Konva.Stage({
            container: 'container',
            width: width,
            height:height

        }),
        backgroundLayer = new Konva.Layer({
            width: width,
            height:height,
            scale:{
                x: startScale,
                y: startScale
            }
        }),
        layer  = backgroundLayer.clone(),
        layerConn = backgroundLayer.clone(),
        layerTEXT = backgroundLayer.clone(),

        tempLayer = new Konva.Layer({
            width: width,
            height:height
        }),
        emptyLayer = tempLayer.clone(),
        interfaceLayer = tempLayer.clone(),

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
            points: [5, 5, 175, 5, 175, 45, 5, 45,5,5],
            stroke: 'black',
            strokeWidth: 1,
            lineJoin: 'round',
            dash: [4, 2]
        }),
        dottedLineDel = dottedLineAdd.clone(),
       // dottedLineBack = dottedLineAdd.clone({
       //     points: [5, 5, width-5, 5, width-5, height-5, 5, height-5,5,5]
       // }),
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
            id: "popUp",
            draggable:true
        }),

        addRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 180,
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
        x: 18,
        y: 18,
        id: "addText",
        text: "ADD NEW PAGE",
        align: 'center',
        fontFamily: "Architects Daughter"
        }),

        delText = addText.clone({
            id: "delText",
            x:26,
            text: "DELETE PAGE"
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
        zoomOut,
        zoomIn,
        checkAdditionalNode,
        checkDeleteNode,
        addNewNode,
        deleteNode,
        setDraggable,
        disable,
        moveQuestion,
        dropQuestion,
        dropQuestion2,
        dropReset,
        reorder,
        hoverPopUpButtons,
        preventDefault,
        preventDefaultForScrollKeys,
        disableScroll,
        enableScroll,
        setToolTip,
        drawToolTip,
        resetInputFields,
        checkScaleFactor
    ;


//draw lines
    startDrawLines = function() {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=drawLines&storyID='+storyID,
            success: function (data) {
                var obj = $.parseJSON(data);
               drawLines(obj[0]['MAX(level)']);
            },
            error: function (xhr, status, error) {
                debugText.text(error);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
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
                fontSize:20,
                fontFamily: "Architects Daughter",
                text: j,
                x: 10,
                y: h-20
            });

            backgroundLayer.add(levelText);
            backgroundLayer.add(line);

            h += levelY;
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
                //checkScaleFactor(obj);
                drawNodes(obj);
            },
            error: function (xhr, status, error) {
                debugText.text(error);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
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

    drawToolTip = function(){
        tooltip = new Konva.Group({
            visible: false
        });
        var tooltext = new Konva.Text({
            text: "",
            fontFamily:  "Architects Daughter",
            fontSize: 20,
            padding: 8,
            fill: "black",
            opacity: 1.0,
            textFill: "white"
        });

        var rect = new Konva.Rect({
            /*  stroke: 'black',
             strokeWidth: 1,*/
            fill: '#F3E0E1',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.5
            //cornerRadius: 10
        });
        rect.moveTo(tooltip);
        tooltext.moveTo(tooltip);
        layerTEXT.add(tooltip);
        layerTEXT.draw();
    };


    drawNodes = function (data) {
        //startScale=1.0;
        layer.destroyChildren();
        layerTEXT.destroyChildren();
        layerConn.destroyChildren();

        stage.find('#addRect')[0].setAttr('fill',buttonColorDisabled);
        stage.find('#delRect')[0].setAttr('fill',buttonColorDisabled);
        interfaceLayer.draw();

        selectedNode = null;
        resetInputFields();

        var star;
        var idText;
        var multiple = levelX;
        var center = 0;
        var distance = 70;
        var numb = 0;
        var toBig = null;
        var points = [];
        var IDs = [];
        var z = 0;
        var nodeCounter = 0;
        var color = buttonColorHover;


        for (var i = 0; i < data.length; i++) {
            var nextPageIDinData;
            var nextID;
            var scaleFactor = 1.0;
            if(layer.getAttr('scale').x <=1){
                scaleFactor = layer.getAttr('scale').x;
            }
            //first node
            if (i == 0) {
                star = new Konva.Circle({
                    x: (multiple - center)*scaleFactor,
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
                /*idText = new Konva.Text({
                    x: star.getAttr('x')-6,
                    y: star.getAttr('y')-6,
                    text: star.getAttr('id'),
                    fontSize: 20,
                    fill: 'black'
                });
                layerTEXT.add(idText);*/


                //connection saving
                if (data[i]['NextPageID1']) {
                    points[z] = [];
                    points[z]['pointX'] = star.getAttr('x');
                    points[z]['pointY'] = star.getAttr('y');
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
                if (i != 0) {
                    nextPageIDinData = findID(data, data[sh]["NextPageID" + q]);
                    nextID = nextPageIDinData;

                } else {
                    nextPageIDinData = findID(data, data[i]["NextPageID" + q]);
                    nextID = nextPageIDinData;
                }
                if (nextID != 0) {
                    IDs.push(nextID);
                    numb = count(data, nextPageIDinData);

                    nodeCounter++;
                   // alert(numb);
                    if (numb > 1) {
                        center = (((numb * (distance)) / 2) + distance / 2);
                        multiple += distance;
                    } else {
                        center = 0;
                        multiple = levelX;
                    }
                    if (highLight != null && highLight.indexOf(data[nextPageIDinData]['id']) != -1) {
                        color = '#e2b0b3';
                    } else {
                        color = buttonColorHover;
                    }

                    star = new Konva.Circle({
                        x:(multiple - center)*scaleFactor,
                        y: ((parseInt(data[nextPageIDinData]['level']) + 1) * levelY),
                        fill: color,
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

                  if ((star.getAbsolutePosition().x < 20 || star.getAbsolutePosition().x > width - 20|| star.getAbsolutePosition().y > height - 20)&&layer.getAttr('scale').x <=1) {
                      toBig =true;
                     startScale = layer.scaleX().toFixed(2) - 0.02;

                        layer.scale({
                            x : startScale,
                            y : startScale
                        });
                        layerConn.scale({
                            x : startScale,
                            y : startScale
                        });
                        backgroundLayer.scale({
                            x : startScale,
                            y : startScale
                        });
                        layerTEXT.scale({
                            x : startScale,
                            y : startScale
                        });
                        tempLayer.scale({
                            x : startScale,
                            y : startScale
                        });

                        layerConn.offset({
                            x : layer.offsetX()-20,
                            y : 0
                        });
                        layerTEXT.offset({
                            x : layer.offsetX()-20,
                            y : 0
                        });

                        tempLayer.offset({
                              x : layer.offsetX()-20,
                              y : 0
                          });
                        layer.offset({
                            x : layer.offsetX()-20,
                            y : 0
                        });




                        startOffsetX=layer.offsetX();

                        startDrawLines();
                        startDrawNodes();
                    } else {
                        //TITLE
                        toBig = false;
                       /* idText = new Konva.Text({
                            x: star.getAttr('x') - (6),
                            y: star.getAttr('y') - 6,
                            text: star.getAttr('id'),
                            fontSize: 20,
                            fill: 'black'
                        });
                        layerTEXT.add(idText);*/


                        //connection saving
                        if (data[nextPageIDinData]['NextPageID1']) {
                            points[z] = [];
                            points[z]['pointX'] = star.getAttr('x');
                            points[z]['pointY'] = star.getAttr('y');
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
                                    drawConnection(points[j][k], data[i]['id'], points[j]['pointX'], points[j]['pointY'], star.getAttr('x'), star.getAttr('y'));
                                }
                            }
                        }

                    }

                }
               // if (startScale == 1.0) {
                    // console.log(IDs);
                    //check if END of level
                    if (nodeCounter == numb) {
                        nodeCounter = 0;
                        center = 0;
                        multiple = levelX;
                    }
               // }

            }
        }
        if (toBig == false) {
            layer.draw();
            layerConn.draw();
            layerTEXT.draw();
            highLight = null;
            emptyLayer.draw();
        }
        drawToolTip();
    };

    nodeSelection = function(e) {
        if (selectedNode == null || e.target.id() == selectedNode && !popUpShown) {
            var fill = e.target.fill() == 'yellow' ? buttonColorHover : 'yellow';
            e.target.fill(fill);
            debugText.setAttr('fontSize','15');
            debugText.text('Selected ' + e.target.name());
            if (fill == 'yellow') {
                selectedNode = e.target.id();
                if(zoomStyle == "zoomJump") {
                    zoomIn(e, null);
                }
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=getContent&storyID='+storyID+'&ID=' + selectedNode,
                    success: function (data) {//alert(data);
                        var obj = $.parseJSON(data);
                        $('.textEdit').val(obj[0]['text']);
                        $('.titleEdit').val(obj[0]['title']);
                        $('.opt1').val(obj[0]['OptionText1']);
                        $('.opt2').val(obj[0]['OptionText2']);
                        $('.opt3').val(obj[0]['OptionText3']);
                        $('.opt4').val(obj[0]['OptionText4']);
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                        debugText.setAttr('fontSize','20');
                        interfaceLayer.draw();
                    }
                });

            } else if (fill == buttonColorHover) {
                selectedNode = null;
                if(zoomStyle == "zoomJump"){
                    zoomOut();
                }
                resetInputFields();

            }
            layer.draw();
            backgroundLayer.draw();
        }
    };

    zoomIn = function(e,zoomin){
        zooming = true;
        var zoomInit = zoomin;
        if(zoomin == null){
            zoomin = zoom;
        }

        zoomSc = zoomin;
        var clickX;
        var clickY;
        if(zoomInit == null){
             clickX = e.target.x();
             clickY = e.target.y();
        }else{
             clickX = stage.getPointerPosition().x;
             clickY = stage.getPointerPosition().y;
        }

        var distX = (width/2)-clickX;
        var distY = (height/2)-clickY;
        var oldWidth = layer.width()*layer.getAttr('scale').x;
        var oldHeight = layer.height()*layer.getAttr('scale').y;
        var newWidth = layer.width()*zoomin;
        var newHeight = layer.height()*zoomin;
        diffX = ((newWidth-oldWidth)/3)-distX;
        diffY = ((newHeight-oldHeight)/3)-distY;

        var anim = new Konva.Animation(function(frame) {
            var scale = 0;
            var diff = 0;
            if(layer.scaleX().toFixed(2) < zoomin && layer.scaleX().toFixed(2) < zoom ){
                diff = 0.01;
                scale = layer.scaleX() + diff;
                layer.scale({
                    x : scale,
                    y : scale
                });
                layerConn.scale({
                    x : scale,
                    y : scale
                });
                backgroundLayer.scale({
                    x : scale,
                    y : scale
                });
                layerTEXT.scale({
                    x : scale,
                    y : scale
                });
            }

           var moveX = 0;
            if(layer.offsetX().toFixed(2) != diffX.toFixed(2) && layer.scaleX().toFixed(2) < zoom){
                moveX = layer.offsetX() + diffX/((zoomin-startScale)/diff);
                layer.offsetX(moveX);
                layerConn.offsetX(moveX);
              //  backgroundLayer.offsetX(moveX);
                layerTEXT.offsetX(moveX);
            }
            var moveY = 0;
            if(layer.offsetY().toFixed(2)!= diffY.toFixed(2) && layer.scaleX().toFixed(2) < zoom ){
                moveY = layer.offsetY() + diffY/((zoomin-startScale)/diff);
                layer.offsetY(moveY);
                layerConn.offsetY(moveY);
                backgroundLayer.offsetY(moveY);
                layerTEXT.offsetY(moveY);
            }


                if (layer.scaleX().toFixed(2) >= zoomin || layer.scaleX().toFixed(2) >= zoom) {
                    anim.stop();
                }

        }, [layer,layerConn,layerTEXT,backgroundLayer]);

        anim.start();

    };

    zoomOut = function(){
        tooltip.hide();
        layerTEXT.draw();
        toolTipText="";

        var zoomout = startScale;
        zooming = false;
        var zoomin = layer.scaleX().toFixed(2);

        diffX = (startOffsetX-layer.offsetX().toFixed(2))*-1;
        diffY = (startOffsetY-layer.offsetY().toFixed(2))*-1;

        var anim = new Konva.Animation(function(frame) {
            var scale = 0;
            var diff = 0;
            console.log("scroll");
            if(layer.scaleX().toFixed(2) > zoomout ){
                diff = /*frame.timeDiff/10000 +*/ 0.02;
                scale = layer.scaleX().toFixed(2) - diff;
                layer.scale({
                    x : scale,
                    y : scale
                });
                layerConn.scale({
                    x : scale,
                    y : scale
                });
                backgroundLayer.scale({
                    x : scale,
                    y : scale
                });
                layerTEXT.scale({
                    x : scale,
                    y : scale
                });
            }


           var moveX = 0;
            if(layer.offsetX().toFixed(2) != startOffsetX.toFixed(2)){
                moveX = layer.offsetX().toFixed(2) - (diffX/((zoomin-zoomout)/diff));
                layer.offsetX(moveX);
                layerConn.offsetX(moveX);
               // backgroundLayer.offsetX(moveX);
                layerTEXT.offsetX(moveX);
            }

            var moveY = 0;
            if(layer.offsetY().toFixed(2)!= startOffsetY.toFixed(2)){
                moveY = layer.offsetY().toFixed(2) - (diffY/((zoomin-zoomout)/diff));
                layer.offsetY(moveY);
                layerConn.offsetY(moveY);
                backgroundLayer.offsetY(moveY);
                layerTEXT.offsetY(moveY);
            }

           if (layer.scaleX().toFixed(2) <= zoomout || zooming == true) {
                anim.stop();

               var offset = 0;
               if(startScale != 1.0) {
                   offset = 20;
               }else{
                   offset = 0;
               }
               layer.offsetX(startOffsetX);
               layer.offsetY(startOffsetY);
               layerConn.offsetX(startOffsetX);
               layerConn.offsetY(startOffsetY);
               layerTEXT.offsetX(startOffsetX);
               layerTEXT.offsetY(startOffsetY);
               //   backgroundLayer.offsetX(startOffsetX);
               backgroundLayer.offsetY(startOffsetY);
        }


        }, [layer,layerConn,layerTEXT,backgroundLayer]);

        anim.start();

    };

    reorderNodes = function(ID01, ID02) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=reorderNodes&storyID='+storyID+'&ID01=' + ID01 + '&ID02=' + ID02,
            success: function (data) {
                //alert(data);
                console.log("SUCCESS");
                startDrawNodes();
                debugText.text(data);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
            },
            error: function (xhr, status, error) {
                debugText.text(error);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
            }
        });
    };

    reorderBranches = function(ID,found){
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=reorderBranches&storyID='+storyID+'&ID=' + ID + '&IDs=' + movementStyle +'&found='+found,
            success: function (data) {
                if(data != "Updated data successfully\n") {
                    highLight = data;
                }
                console.log("SUCCESS");
                startDrawLines();
                startDrawNodes();
                found = false;
                debugText.text('Successfully updated!');
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();

            },
            error: function (xhr, status, error) {
                debugText.text(error);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
            }
        });
    };

    checkAdditionalNode = function(id) {
       return $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=maxChildren&storyID='+storyID+'&ID=' + id,
            success: function (data) {
                console.log("SUCCESS");
                var obj = $.parseJSON(data);

                hasChildren = false;
                if(obj[0]['NextPageID1'] != 0){
                    hasChildren = true;
                }
                if (obj[0]['NextPageID4'] == 0) {
                    if(!popUpShown) {
                        stage.find('#addRect')[0].setAttr('fill', buttonColor);
                    }
                } else {
                    if(movementStyle != null) {
                        button1.off('click');
                        hoverPopUpButtons(['#button1Rect', '#button1Text'], buttonColorDisabled, buttonColorDisabled);
                    }
                    if(!popUpShown) {
                        stage.find('#addRect')[0].setAttr('fill', buttonColorDisabled);
                    }
                }
                interfaceLayer.draw();

            },
            error: function (xhr, status, error) {
                debugText.text(error);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
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
                if (obj[0]['level'] == 0) {
                    if(!popUpShown) {
                        stage.find('#delRect')[0].setAttr('fill', buttonColorDisabled);
                    }
                } else {
                    if(!popUpShown) {
                        stage.find('#delRect')[0].setAttr('fill', buttonColor);
                    }
                }
                interfaceLayer.draw();
            },
            error: function (xhr, status, error) {
                debugText.text(error);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
            }
        });
    };

    addNewNode = function(id) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=addNewNode&storyID='+storyID+'&ID=' + id,
            success: function (data) {
               // alert(data);
                console.log("SUCCESS");
                startDrawLines();
                startDrawNodes();
                debugText.text('Successfully inserted!');
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
                //var obj = $.parseJSON(data);
            },
            error: function (xhr, status, error) {
                debugText.text(error);
                debugText.setAttr('fontSize','20');
                interfaceLayer.draw();
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
        popText.setAttr('width',(addRect.getAttr('width')*2+80)-20);

        tempLayer.find('#button1Text')[0].setAttr('text','DELETE');
        tempLayer.find('#button1Text')[0].setAttr('x','48');

        tempLayer.find('#button2Text')[0].setAttr('text','CANCEL');
        tempLayer.find('#button2Text')[0].setAttr('x','48');

        popUpRect.setAttr('width',addRect.getAttr('width')*2+80);
        popUp.setAttr('x',width/2-((addRect.getAttr('width')*2+80)/2));

        dottedLinePopUp.setAttr('points',[10, 10, popUpRect.getAttr('width')-10, 10, popUpRect.getAttr('width')-10, 240, 10,240,10,10]);
        button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')-10);
        button2.setAttr('x',button1.getAttr('x')+button1Rect.getAttr('width')+20);
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
                     //alert(data);
                         console.log("SUCCESS");
                         tempLayer.find('#button1Rect')[0].fill(buttonColor);
                         popUp.hide();
                         tempLayer.draw();
                         setDraggable(true);
                         startDrawLines();
                         startDrawNodes();
                         debugText.text('Successfully deleted!');
                         debugText.setAttr('fontSize','20');
                         interfaceLayer.draw();

                 },
                 error: function (xhr, status, error) {
                     debugText.text(error);
                     debugText.setAttr('fontSize','20');
                     interfaceLayer.draw();
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

        popText.setAttr('text',moveText);
        popText.setAttr('x','10');
        popText.setAttr('y','65');
        popText.setAttr('width',(addRect.getAttr('width')*3+80)-20);

        tempLayer.find('#button1Text')[0].setAttr('text','MOVE BRANCH');
        tempLayer.find('#button1Text')[0].setAttr('x','20');

        tempLayer.find('#button2Text')[0].setAttr('text','MOVE PAGE');
        tempLayer.find('#button2Text')[0].setAttr('x','28');

        popUpRect.setAttr('width',addRect.getAttr('width')*3+80);
        popUp.setAttr('x',width/2-((addRect.getAttr('width')*3+80)/2));

        dottedLinePopUp.setAttr('points',[10, 10, popUpRect.getAttr('width')-10, 10, popUpRect.getAttr('width')-10, 240, 10,240,10,10]);


      // button2.setAttr('id','button2Move');

        button3.add(button1Rect.clone({id:'button3Rect'}));
        button3.add(dottedLineAdd.clone());
        button3.add(delText.clone({id:'button3Text'}));
      //  button3.setAttr('id','button3Move');
        popUp.add(button3);

        button1.setAttr('x',15);
        button2.setAttr('x', button1.getAttr('x')+button1Rect.getAttr('width')+20);
        button3.setAttr('x',button2.getAttr('x')+button1Rect.getAttr('width')+20);

        tempLayer.find('#button3Text')[0].setAttr('text','CANCEL');
        tempLayer.find('#button3Text')[0].setAttr('x','48');
        tempLayer.find('#button3Text')[0].setAttr('id','button3Text');

        tempLayer.find('#button3Rect')[0].setAttr('id','button3Rect');

        popUp.show();
        tempLayer.draw();

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
           // startDrawNodes();
            popUpShown = false;
        });


        if(hasChildren == false) {
            button1.off('click');
            hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorDisabled,buttonColorDisabled);
        }else {
            hoverPopUpButtons(['#button1Rect', '#button1Text'], buttonColorHover, buttonColor);
            button1.off('click').on('click', function (e) {
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
                        movementStyle = movementStyle.replace(/"/g, "");
                        movementStyle = movementStyle.split(",");

                        movingGroup.setAttr('x', 0);
                        movingGroup.setAttr('y', 0);

                        for (var i = 0; i < movementStyle.length; i++) {
                            var node = layer.find('#' + movementStyle[i]);
                            node.fill('yellow');
                            node.moveTo(movingGroup);
                        }
                        layer.add(movingGroup);
                        xDrag = movingGroup.getAttr('x');
                        yDrag = movingGroup.getAttr('y');
                        layer.draw();
                        popUpShown = false;
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                        debugText.setAttr('fontSize', '20');
                        interfaceLayer.draw();
                    }
                });
            });
        }

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

    dropQuestion2 = function(evt){ //alert("hhh");

        pause = true;
        popUpShown = true;

        setDraggable(false);
        evt.target.moveDown();

        popText.setAttr('text',drop2Text);
        popText.setAttr('x','10');
        popText.setAttr('y','55');
        popText.setAttr('width',(addRect.getAttr('width')*3+80)-20);

        tempLayer.find('#button1Text')[0].setAttr('text','YES');
        tempLayer.find('#button1Text')[0].setAttr('x','65');

        tempLayer.find('#button2Text')[0].setAttr('text','CANCEL');
        tempLayer.find('#button2Text')[0].setAttr('x','48');

        popUpRect.setAttr('width',(addRect.getAttr('width')*3+80));
        popUp.setAttr('x',width/2-((addRect.getAttr('width')*3+80)/2));

        dottedLinePopUp.setAttr('points',[10, 10, (addRect.getAttr('width')*3+80)-10, 10, (addRect.getAttr('width')*3+80)-10, 240, 10,240,10,10]);

        button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')-10);
        button2.setAttr('x',button1.getAttr('x')+button1Rect.getAttr('width')+20);

        popUp.show();
        tempLayer.draw();

        hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);

        button2.off('click').on('click',function(e){
            tempLayer.find('#button2Rect')[0].fill(buttonColor);
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


        button1.off('click').on('click',function(e){
            tempLayer.find('#button1Rect')[0].fill(buttonColor);
            reorder(evt);
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
        popText.setAttr('width',(addRect.getAttr('width')*3+80)-20);

        tempLayer.find('#button1Text')[0].setAttr('text','ADD AS SUB-PAGE');
        tempLayer.find('#button1Text')[0].setAttr('x','8');

        tempLayer.find('#button2Text')[0].setAttr('text','REPLACE PAGES');
        tempLayer.find('#button2Text')[0].setAttr('x','18');

        popUpRect.setAttr('width',(addRect.getAttr('width')*3+80));
        popUp.setAttr('x',width/2-((addRect.getAttr('width')*3+80)/2));

        dottedLinePopUp.setAttr('points',[10, 10, (addRect.getAttr('width')*3+80)-10, 10, (addRect.getAttr('width')*3+80)-10, 240, 10,240,10,10]);

        button1.setAttr('x',15);
        button2.setAttr('x', button1.getAttr('x')+button1Rect.getAttr('width')+20);
        button3.setAttr('x',button2.getAttr('x')+button1Rect.getAttr('width')+20);


        button3.add(button1Rect.clone({id:'button3Rect'}));
        button3.add(dottedLineAdd.clone({id:'button3dotted'}));
        button3.add(delText.clone({id:'button3Text'}));
        popUp.add(button3);

        tempLayer.find('#button3Text')[0].setAttr('text','CANCEL');
        tempLayer.find('#button3Text')[0].setAttr('x','43');
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
                           // alert(data);
                            console.log("SUCCESS");
                            tempLayer.find('#button2Rect')[0].fill(buttonColor);
                            button3.remove();
                            popUp.hide();
                            tempLayer.draw();
                            pause = false;
                            dropStyle = "child";
                            dropReset(evt);
                            popUpShown = false;
                            startDrawLines();
                            startDrawNodes();
                            debugText.text('Successfully updated!');
                            debugText.setAttr('fontSize','20');
                            interfaceLayer.draw();

                        },
                        error: function (xhr, status, error) {
                            debugText.text(error);
                            debugText.setAttr('fontSize','20');
                            interfaceLayer.draw();
                        }
                    });
                }else{
                    $.ajax({
                        url: ajaxLink,
                        type: 'GET',
                        data: 'functionName=addBranchAsChild&storyID=' + storyID + '&ID=' + previousShape.id() + '&IDs=' + movementStyle,
                        success: function (data) {
                            //alert(data);
                            console.log("SUCCESS");
                            tempLayer.find('#button2Rect')[0].fill(buttonColor);
                            button3.remove();
                            popUp.hide();
                            tempLayer.draw();
                            pause = false;
                            dropStyle = "child";
                            dropReset(evt);
                            popUpShown = false;
                            startDrawLines();
                            startDrawNodes();
                            debugText.text('Successfully updated!');
                            debugText.setAttr('fontSize','20');
                            interfaceLayer.draw();
                        },
                        error: function (xhr, status, error) {
                            debugText.text(error);
                            debugText.setAttr('fontSize','20');
                            interfaceLayer.draw();
                        }
                    });
                }
            });
        }

        button2.off('click').on('click',function(e){
            if(movementStyle != "one") {
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=checkIFParent&storyID=' + storyID + '&ID=' + previousShape.id() + '&IDs=' + movementStyle,
                    success: function (data) {
                      if(data == 'false'){
                          found = false;
                          tempLayer.find('#button2Rect')[0].fill(buttonColor);
                          button3.remove();
                          reorder(evt);
                       }else{
                          found = true;
                          tempLayer.find('#button2Rect')[0].fill(buttonColor);
                          button3.remove();
                          popUp.hide();
                          tempLayer.draw();
                          pause = false;
                          dropStyle = "reorder";
                          popUpShown = false;
                          dropQuestion2(evt);
                      }

                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                        debugText.setAttr('fontSize','20');
                        interfaceLayer.draw();
                    }
                });
            }else{
                tempLayer.find('#button2Rect')[0].fill(buttonColor);
                button3.remove();
                reorder(evt);
            }
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
        popUp.hide();
        tempLayer.draw();
        pause = false;
        dropStyle = "reorder";
        popUpShown = false;
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
            reorderBranches(previousShape.id(),found);
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
                var x = shape.getAttr('x');
                var y = shape.getAttr('y');
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

    setToolTip = function(toolTipText){
        var textToolT;
        tooltip.getChildren(function (n) {
            return n.getClassName() === "Text";
        }).each(function (text, n) {
            textToolT = text;
            textToolT.text(toolTipText);
        });
        tooltip.getChildren(function (n) {
            return n.getClassName() === "Rect";
        }).each(function (rect, n) {
            rect.setAttr('width',textToolT.getAttr('width'));
            rect.setAttr('height',textToolT.getAttr('height'));
        });

        tooltip.show();
        layerTEXT.draw();
    };

    resetInputFields = function(){
        $("#pageEditor .inputField").val('click on node');
    };

    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    preventDefault =  function(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    };

    preventDefaultForScrollKeys = function(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    };

    disableScroll= function() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove  = preventDefault; // mobile
        document.onkeydown  = preventDefaultForScrollKeys;
    };

    enableScroll = function() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    };

//END

// IIIIIIIIIIIIINIT
    init = function init(){
        var res = window.location.href;
        var array = res.split("/");
        storyID = array[array.length-2];

        emptyRectangle = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            id: "emptyRectangle",
            fill:'green',
            opacity: 0
        });

        emptyLayer.add(emptyRectangle);
        emptyRectangle.moveToBottom();

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
        //interfaceLayer.add(dottedLineBack);

        //DELETE POPUP
        popUp.add(popUpRect);
        popUp.add(popText);

        button1.add(button1Rect);
        button1.add(dottedLineAdd.clone({id:'button1dotted'}));
        button1.add(delText.clone({id:'button1Text'}));
        popUp.add(button1);


        button2.add(button1Rect.clone({id:'button2Rect'}));
        button2.add(dottedLineAdd.clone({id:'button2dotted'}));
        button2.add(delText.clone({id:'button2Text'}));
        popUp.add(button2);

        popUp.add(dottedLinePopUp);
        tempLayer.add(popUp);

        tempLayer.find('#popUp')[0].hide();
       // tempLayer.draw();

        stage.add(emptyLayer);
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
            debugText.setAttr('fontSize','15');
            debugText.text('Choose ' + e.target.name());
            layer.draw();
            interfaceLayer.draw();
        });

        layer.on("mouseout", function (e) {
            var fill = e.target.fill() == 'yellow' ? 'yellow' : buttonColorHover;
            e.target.fill(fill);
            layer.draw();
            tooltip.hide();
            layerTEXT.draw();
            toolTipText="";
        });

        stage.on("mouseout", function (e) {
           enableScroll();
        });
        stage.on("mouseout", function (e) {
            tooltip.hide();
            layerTEXT.draw();
        });

        layer.on("mouseover", function(e) {
            // update tooltip
            var mousePos = stage.getPointerPosition();
            tooltip.position({
                x : e.target.getAttr('x'),
                y :  e.target.getAttr('y')
            });
            //alert(mousePos.x + 5);

            if(toolTipText == ""){
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=getTitle&storyID=' + storyID + '&ID=' + e.target.id(),
                    success: function (data) {
                        var obj = $.parseJSON(data);
                        setToolTip(obj[0]['title']);
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                        debugText.setAttr('fontSize', '20');
                        interfaceLayer.draw();
                    }
                });
            }else{
                setToolTip(toolTipText);
            }
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

        $('.save').click(function() {
            if(selectedNode != null) {
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=saveContent&storyID=' + storyID + '&ID=' + selectedNode + '&text=' + $('.textEdit').val()+ '&title=' + $('.titleEdit').val()
                    + '&opt1=' + $('.opt1').val()+ '&opt2=' + $('.opt2').val()+ '&opt3=' + $('.opt3').val()+ '&opt4=' + $('.opt4').val(),
                    success: function (data) {
                        alert(data);
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                        debugText.setAttr('fontSize', '20');
                        interfaceLayer.draw();
                    }
                });
            }
        });

        stage.off('mousewheel').on('mousewheel', function(e) {
            disableScroll();
            var deltaY = e.evt.deltaY;
            if (deltaY != undefined) {
                if (deltaY > 0) {
                  zoomOut();
                } else {
                    if(zoomStyle == "zoomScroll") {
                        zoomIn(e,layer.scaleX()+0.1);
                    }
                   // alert("zoomin");

                }
            }

        });

        emptyRectangle.on('click', function(e) {

               zoomOut();

        });


//END

//DRAGGEN
      layer.on("dragstart", function (e) {
          tooltip.hide();
          layerTEXT.draw();
          toolTipText="";
          if(!pause && movementStyle == null){
              zoomOut();
              selectedNode=e.target.id();
              popUpShown = true;
              pause = true;
              setDraggable(false);
              $.when(checkAdditionalNode(e.target.id()),checkDeleteNode(e.target.id())).done(function(a1,a2){
                  moveQuestion(e);
              });
              e.target.fill('yellow');
              interfaceLayer.draw();
            }else if(!pause && movementStyle == "one"){
                xDrag = e.target.getAbsolutePosition().x;
                yDrag = e.target.getAbsolutePosition().y;

                e.target.moveTo(tempLayer);
                e.target.fill('yellow');
              debugText.setAttr('fontSize','15');
                debugText.text('Moving ' + e.target.name());
                interfaceLayer.draw();
                layer.draw();
            }else if(!pause && movementStyle != "one" && movementStyle != null ){
               // nodeSelection(e.target.find('#'+movementStyle[0]));
                selectedNode= e.target.find('#'+movementStyle[0])[0].getAttr('id');
                movingGroup.moveTo(tempLayer);
                debugText.setAttr('fontSize','15');
                debugText.text('Moving ' + e.target.id() + ' and children');
                interfaceLayer.draw();
                layer.draw();
                tempLayer.draw();
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
                        if(e.target.id() != "popUp") {
                            e.target.setAttr("x", xDrag);
                            e.target.setAttr("y", yDrag);

                        }
                    }
                   dropReset(e);
                }
            }
        });

        stage.on("dragenter", function (e) {
           if(!pause) {
               debugText.setAttr('fontSize','15');
                debugText.text('dragenter ' + e.target.name());
                layer.draw();
                interfaceLayer.draw();
           }
        });

        stage.on("dragleave", function (e) {
            if(!pause) {
                over = false;
                e.target.fill(buttonColorHover);
                debugText.setAttr('fontSize','15');
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
                debugText.setAttr('fontSize','15');
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
                debugText.setAttr('fontSize','15');
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


