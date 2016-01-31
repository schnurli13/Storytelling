/**
 * Created by Barbara on 04.11.2015.
 */

var nodeEditor = nodeEditor || {};

nodeEditor.module = (function($) {

//initializing
    var  width = $('#container').width(),
        height = window.innerHeight ,
        levelY = 100,
        startY = 0,
        levelX,
        storyID,
        userID,
        selectedNode = null,
        xDrag,
        buttonColor='#96c4cd',
        buttonColorHover='#6b878c',
        buttonColorDisabled='white',
        emptyRectangle,
        actualLevel,
        pause = false,
        movementStyle = null,
        firstNode = null,
        firstLast = ":first",
        dropStyle = null,
        found = false,
        previousShape,
        hasChildren = false,
        popUpShown=false,
        highLight = null,
        zoomStyle = "zoomScroll",
        zoom = 1.8,
        zooming = false,
        isMobile= false,
        zoomSc,
        startScale = 1.0,
        startOffsetX = 0.0,
        startOffsetY = 0.0,
        offset = 0.0,
        maxHeight,
        tooltip,
        initFontSize,
        yDrag,
        diffX,
        diffY,
        xDrop,
        yDrop,
        over,
        deleteText = "ATTENTION:\n All sub-pages will be deleted as well.\nDo you really want to delete this page?",
        moveText = "Do you want to move only this page or all sub-pages as well?",
        dropText = "Do you want replace this page with the dragged one, OR do you want to add the moving page as sub-page to this page " +
            "OR do you want to connect this two pages to reunite the branches?",
        drop2Text = "Do you really want to replace this branch with the dragged one? This action will influence the sub-pages!",
        toolTipText="",

        stage = new Konva.Stage({
            container: 'container',
            width: width,
            height:height,
            draggable:false,
            id: "stage"

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
        levelTextLayer= backgroundLayer.clone(),

        tempLayer = new Konva.Layer({
            width: width,
            height:height
        }),
        emptyLayer = tempLayer.clone(),
        interfaceLayer = tempLayer.clone(),

        debugText = new Konva.Text({
            fill: 'black',
            fontSize: 20,
            y: 25,
            align: 'center',
            fontFamily: "Architects Daughter"
        }),
        deleteButton= new Konva.Group({
            x: width*0.05,
            y: 80,
            id: "deleteButton"
        }),
        addButton = deleteButton.clone({
            x: width*0.05,
            y: 20,
            id: "addButton"
        }),
        zoomInButton = deleteButton.clone({
            y: 20,
            id: "zoomInButton"
        }),
        zoomOutButton = deleteButton.clone({
            y: 80,
            id: "zoomOutButton"
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
        button4 = button1.clone({id: "button4"}),

        dottedLineAdd = new Konva.Line({
            points: [5, 5, 175, 5, 175, 45, 5, 45,5,5],
            stroke: 'black',
            strokeWidth: 1,
            lineJoin: 'round',
            dash: [4, 2]
        }),
        dottedLineDel = dottedLineAdd.clone(),
        dottedLineZoomIn = dottedLineAdd.clone({
            points: [5, 5, 45, 5, 45, 45, 5,45,5,5]
        }),
        dottedLineZoomOut = dottedLineZoomIn.clone(),
        layerGroup = new Konva.Group({
            id: "layergroup"
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
        zoomInRect = addRect.clone({
            width: 50,
            height: 50,
            fill: buttonColor,
            id: "zoomInRect"
        }),
        zoomOutRect = addRect.clone({
            width: 50,
            height: 50,
            fill: buttonColor,
            id: "zoomOutRect"
        }),
        button1Rect = addRect.clone({
            fill: buttonColor,
            id: "button1Rect"
        }),

        addText = new Konva.Text({
        fill: 'black',
        fontSize: width*0.018,
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
        zoomInText = addText.clone({
            id: "zoomInText",
            fontSize: 30,
            x:14,
            y:8,
            text: "+"
        }),
        zoomOutText = addText.clone({
            id: "zoomOutText",
            fontSize: 30,
            x:10,
            y:0,
            text: "_"
        }),

        popText = addText.clone({
            fontSize: width*0.018,
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
        hoverInterfaceButtons,
        preventDefault,
        preventDefaultForScrollKeys,
        disableScroll,
        enableScroll,
        setToolTip,
        drawToolTip,
        resetInputFields,
        changeFontSize,
        getStoryDetails,
        setStoryDetails,
        resetScale
    ;


//draw lines
    startDrawLines = function() {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=drawLines&storyID='+storyID+ '&userID=' + userID,
            success: function (data) {
                var obj = $.parseJSON(data);
               drawLines(obj[0]['MAX(level)']);
            },
            error: function (xhr, status, error) {
                debugText.text(error);
              //  debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
            }
        });
    };

    drawLines = function(levelNumb) {
        backgroundLayer.destroyChildren();
        levelTextLayer.destroyChildren();
        var line;
        var levelText;
        var h = levelY;
        for (var j = 0; j <= levelNumb; j++) {
            line = new Konva.Line({
                points: [-stage.getWidth()*10, startY+h, stage.getWidth()*10, startY+h],
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
                y: (startY+h)-20
            });

            levelTextLayer.add(levelText);
            backgroundLayer.add(line);

            h += levelY;
        }

        maxHeight = h;

        backgroundLayer.draw();
        levelTextLayer.draw();
      //  height = maxHeight;
      //  stage.setAttr('height',500);

    };


    startDrawNodes = function() {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=drawNodes&storyID='+storyID+ '&userID=' + userID,
            success: function (data) {
                var obj = $.parseJSON(data);
                //checkScaleFactor(obj);
                drawNodes(obj);
            },
            error: function (xhr, status, error) {
                debugText.text(error);
              //  debugText.setAttr('fontSize','25');
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
            id: "tooltext",
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
        var multiple = levelX;
        var center = 0;
        var distance = 70;
        var numb = 0;
        var toBig = false;
        var points = [];
        var IDs = [];
        var z = 0;
        var nodeCounter = 0;
        var color = buttonColorHover;
        var h = startY;

        if(layer.getAttr('scale').x < 1.0){
            distance = distance * (1+(1-layer.getAttr('scale').x));
        }

        for (var i = 0; i < data.length; i++) {
            var nextPageIDinData;
            var nextID;
            var scaleFactor = 1.0;
            if(layer.getAttr('scale').x <=1){
                scaleFactor = layer.getAttr('scale').x;
            }
            //first node
            if (i == 0) {
                firstNode = data[i]['id'];
                star = new Konva.Circle({
                    x: ((multiple - center)*scaleFactor)-offset,
                    y: h+(parseInt(data[i]['level']) + 1) * (levelY),
                    fill: buttonColorHover,
                    radius: 20,
                    draggable: true,
                    name: 'star ' + data[i]['id'],
                    id: data[i]['id'],
                    stroke: 'black',
                    strokeWidth: 2
                });

                layer.add(star);


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
                if(layer.find('#'+data[nextPageIDinData]['id'])[0] == undefined) {
                    if (nextID != 0) {
                        IDs.push(nextID);
                        numb = count(data, nextPageIDinData);

                        nodeCounter++;


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
                            x: ((multiple - center) * scaleFactor) - offset,
                            y: h + ((parseInt(data[nextPageIDinData]['level']) + 1) * levelY),
                            fill: color,
                            radius: 20,
                            draggable: true,
                            name: 'star ' + data[nextPageIDinData]['id'],
                            id: data[nextPageIDinData]['id'],
                            stroke: 'black',
                            strokeWidth: 2

                        });
                        layer.add(star);


                        if ((star.getAbsolutePosition().x < 20 || star.getAbsolutePosition().x > width - 20 || star.getAbsolutePosition().y > height - 20) && layer.getAttr('scale').x <= 1) {
                            toBig = true;
                            startScale = layer.scaleX().toFixed(2) - 0.02;
                            if (window.innerWidth < 850) {
                                offset = 50;
                            }
                           if(layer.getAttr('scale').y < 1.0){
                                startY = 10 *(1+(1-layer.getAttr('scale').y));
                                offset = -10 *(1+(1-layer.getAttr('scale').x));
                            }
                            //offset weiter rechts
                            //offset= -10*(1+(1-layer.getAttr('scale').x));

                            layer.scale({
                                x: startScale,
                                y: startScale
                            });
                            layerConn.scale({
                                x: startScale,
                                y: startScale
                            });
                            backgroundLayer.scale({
                                x: 1.0,
                                y: startScale
                            });
                            levelTextLayer.scale({
                                x: startScale,
                                y: startScale
                            });
                            layerTEXT.scale({
                                x: startScale,
                                y: startScale
                            });
                            tempLayer.scale({
                                x: startScale,
                                y: startScale
                            });

                            layerConn.offset({
                                x: layer.offsetX() - 20,
                                y: 0
                            });
                            layerTEXT.offset({
                                x: layer.offsetX() - 20,
                                y: 0
                            });

                            tempLayer.offset({
                                x: layer.offsetX() - 20,
                                y: 0
                            });
                            layer.offset({
                                x: layer.offsetX() - 20,
                                y: 0
                            });


                            startOffsetX = layer.offsetX();

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
        }
        if (toBig == false) {
            layer.draw();
            layerConn.draw();
            layerTEXT.draw();
            emptyLayer.draw();
            nodeSelection(layer.find('#'+ firstNode)[0]);
            checkAdditionalNode(firstNode);
        }
        drawToolTip();

    };

    nodeSelection = function(elem) {
        if (!popUpShown) {
            var fill = elem.fill() == 'yellow' ? buttonColorHover : 'yellow';
            elem.fill(fill);
            debugText.setAttr('fontSize','20');
            if(selectedNode != null){
                layer.find('#'+selectedNode).fill(buttonColorHover);
            }

            if (fill == 'yellow') {
                resetInputFields();
                debugText.text('Selected "' + toolTipText+'"');
                debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);
                selectedNode = elem.id();
                if(zoomStyle == "zoomJump") {
                    zoomIn(e, null);
                }
                //HIER geklickter node in die session
                var fd = new FormData();
                fd.append('function', 'setCurrentPage');
                fd.append('page', selectedNode);
                $.ajax({
                    url: '/Storytelling/public/php/formFunctions.php',
                    type: 'POST',
                    data: fd,
                    enctype: 'multipart/form-data',
                    processData: false,  // tell jQuery not to process the data
                    contentType: false   // tell jQuery not to set contentType
                }).done(function( data ) {
                    console.log('nice');
                });

                var currentPagePicture = $('.currentPagePicture');
                currentPagePicture.parent().siblings('.profilePicSection').remove();
                currentPagePicture.parent().siblings('.changePicSection').remove();
                var changePictureButton = $('.changePictureButton');
                changePictureButton.each(function(){
                    if($(this).hasClass('pagePicture')){
                        $(this).attr('value', 'SELECT PICTURE');
                        $(this).removeClass('open');
                    }
                });


                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=getContent&storyID='+storyID+ '&userID=' + userID+'&ID=' + selectedNode,
                    success: function (data) {
                        var obj = $.parseJSON(data);
                        $('.textEdit').val(obj[0]['text']);
                        $('.titleEdit').val(obj[0]['title']);

                        debugText.text('Selected "' + obj[0]['title']+'"');
                        debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);
                        interfaceLayer.draw();
                        if(obj[0]['NextPageID1'] == 0){
                            $('.opt1').attr('disabled','disabled');
                        }else{
                            $('.opt1').val(obj[0]['OptionText1']);
                        }
                        if(obj[0]['NextPageID2'] == 0){
                            $('.opt2').attr('disabled','disabled');
                        }else{
                            $('.opt2').val(obj[0]['OptionText2']);
                        }
                        if(obj[0]['NextPageID3'] == 0){
                            $('.opt3').attr('disabled','disabled');
                        }else{
                            $('.opt3').val(obj[0]['OptionText3']);
                        }
                        if(obj[0]['NextPageID4'] == 0){
                            $('.opt4').attr('disabled','disabled');
                        }else{
                            $('.opt4').val(obj[0]['OptionText4']);
                        }

                        var src = $('#pageEditor #currentPicture').prop('src');
                        if(obj[1]['path'] != " " && src.search("page") == -1 ){
                            var array = src.split("/");
                            var picName = array[array.length-1];
                            src = src.replace(picName, "page/"+obj[1]['path']);
                            $('#pageEditor #currentPicture').prop('src',src);
                           // $('#previewEditor #currentPicturePreview').prop('src',src);
                        }

                        if(!pause) {
                            $('#showRight').trigger('click');
                        }

                      //  $('#pageOptions:first').removeAttr('id');
                        loadPage(selectedNode);

                        $('.pageOptions').bind('DOMNodeInserted', function() {
                            $('.pageOption').off('click').click(function(){
                                nodeSelection(layer.find('#'+ $(this).attr('data-pageId'))[0]);
                            });
                        });


                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                       // debugText.setAttr('fontSize','25');
                        interfaceLayer.draw();
                    }
                });

            } else if (fill == buttonColorHover) {
                debugText.text('Deselected "' + toolTipText+'"');
                debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

                selectedNode = null;
                if(zoomStyle == "zoomJump"){
                    zoomOut();
                }
                resetInputFields();

            }
            layer.draw();
            backgroundLayer.draw();
            levelTextLayer.draw();



        }
    };

    zoomIn = function(e,zoomin){
        stage.setAttr('draggable', true);
        zooming = true;
        var zoomInit = zoomin;
        if(zoomin == null){
            zoomin = zoom;
        }else if(zoomin == 'default'){
            zoomin = layer.scaleX()+0.05;
        }

        zoomSc = zoomin;
        var clickX;
        var clickY;
        if(zoomInit == null){
             clickX = e.target.x();
             clickY = e.target.y();
        }else if(zoomInit == 'default'){
            clickX = stage.getAttr('width')/2;
            clickY = stage.getAttr('height')/2;
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
                    x : 1.0,
                    y : scale
                });
                levelTextLayer.scale({
                    x: scale,
                    y: scale
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
               // backgroundLayer.offsetX(moveX);
                layerTEXT.offsetX(moveX);
            }
            var moveY = 0;
            if(layer.offsetY().toFixed(2)!= diffY.toFixed(2) && layer.scaleX().toFixed(2) < zoom ){
                moveY = layer.offsetY() + diffY/((zoomin-startScale)/diff);
                layer.offsetY(moveY);
                layerConn.offsetY(moveY);
                backgroundLayer.offsetY(moveY);
                levelTextLayer.offsetY(moveY);
                layerTEXT.offsetY(moveY);
            }


                if (layer.scaleX().toFixed(2) >= zoomin || layer.scaleX().toFixed(2) >= zoom) {
                    anim.stop();
                }

        }, [layer,layerConn,layerTEXT,backgroundLayer,levelTextLayer]);

        anim.start();

    };

    zoomOut = function(){
       stage.setAttr('draggable', false);
        interfaceLayer.setAttr('x',0);
        interfaceLayer.setAttr('y',0);
        stage.setAttr('x',0);
        stage.setAttr('y',0);
        if(!pause){
            tooltip.hide();
            layerTEXT.draw();
            toolTipText="";
        }


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
                    x : 1.0,
                    y : scale
                });
                levelTextLayer.scale({
                    x: scale,
                    y: scale
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
                levelTextLayer.offsetY(moveY);
                layerTEXT.offsetY(moveY);
            }

           if (layer.scaleX().toFixed(2) <= zoomout || zooming == true) {
                anim.stop();

             //  alert(startScale + "....."+ startOffsetX + "....."+startOffsetY );
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


        }, [layer,layerConn,layerTEXT,backgroundLayer,levelTextLayer]);

        anim.start();

    };

    reorderNodes = function(ID01, ID02) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=reorderNodes&storyID='+storyID+ '&userID=' + userID+'&ID01=' + ID01 + '&ID02=' + ID02,
            success: function (data) {
                //alert(data);
                console.log("SUCCESS");
                startDrawNodes();
                debugText.text(data);
                debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

               // debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
            },
            error: function (xhr, status, error) {
                debugText.text(error);
               // debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
            }
        });
    };

    reorderBranches = function(ID,found){
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=reorderBranches&storyID='+storyID+ '&userID=' + userID+'&ID=' + ID + '&IDs=' + movementStyle +'&found='+found,
            success: function (data) {
               // alert(data);
                if(data != "Updated data successfully\n") {
                    highLight = data;
                }
                console.log("SUCCESS");
                startDrawLines();
                startDrawNodes();
                found = false;
                if(data == "Error: Transaction rolled back"){
                    debugText.text(data);
                }else{
                    debugText.text('Successfully updated!');
                }
                debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

               // debugText.setAttr('fontSize','25');
                interfaceLayer.draw();


            },
            error: function (xhr, status, error) {
                debugText.text(error);
               // debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
            }
        });
    };

    checkAdditionalNode = function(id) {
       return $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=maxChildren&storyID='+storyID + '&userID=' + userID +'&ID=' + id,
            success: function (data) {
                console.log("SUCCESS");
                var obj = $.parseJSON(data);

                if(actualLevel-obj[0]['level'] != -1 && actualLevel-obj[0]['level'] != 1){
                    button4.off('click tap');
                    hoverPopUpButtons(['#button4Rect', '#button4Text'], buttonColorDisabled, buttonColorDisabled);
                }

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
                        button1.off('click tap');
                        hoverPopUpButtons(['#button1Rect', '#button1Text'], buttonColorDisabled, buttonColorDisabled);
                    }
                    if(!popUpShown) {
                        stage.find('#addRect')[0].setAttr('fill', buttonColorDisabled);
                    }
                }
                interfaceLayer.draw();
                actualLevel=obj[0]['level'];
            },
            error: function (xhr, status, error) {
                debugText.text(error);
               // debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
            }
        });
    };

    checkDeleteNode = function(id) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=isFirstNode&storyID='+storyID + '&userID=' + userID +'&ID=' + id,
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
              //  debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
            }
        });
    };

    addNewNode = function(id) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=addNewNode&storyID='+storyID + '&userID=' + userID +'&ID=' + id,
            success: function (data) {
               // alert(data);
                console.log("SUCCESS");
                startDrawLines();
                startDrawNodes();
                debugText.text(data);
                debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);
               // debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
                //var obj = $.parseJSON(data);
            },
            error: function (xhr, status, error) {
                debugText.text(error);
               // debugText.setAttr('fontSize','25');
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

        popUpShown = true;
        pause = true;
        setDraggable(false);
        button3.hide();
        button4.hide();


        interfaceLayer.find('#button1Text')[0].setAttr('text','DELETE');
        interfaceLayer.find('#button1Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button1Text')[0].getAttr('width')/2);

        interfaceLayer.find('#button2Text')[0].setAttr('text','CANCEL');
        interfaceLayer.find('#button2Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button2Text')[0].getAttr('width')/2);

        popUpRect.setAttr('width',addRect.getAttr('width')*2+80);
        popText.setAttr('text',deleteText);
        popText.setAttr('width',(addRect.getAttr('width')*2+80)-20);
        popText.setAttr('x',popUpRect.getAttr('width')/2-popText.getAttr('width')/2);
        popText.setAttr('y',25);

        popUp.setAttr('x',width/2-((addRect.getAttr('width')*2+80)/2));
        popUp.setAttr('y',height/2-((addRect.getAttr('height')*2+80)/2));
        if(isMobile){
            popUpRect.setAttr('height',(addRect.getAttr('height')*2+100+popText.getAttr('height'))-20);
        }else{
            popUpRect.setAttr('height',250);
        }

        dottedLinePopUp.setAttr('points',[10, 10, popUpRect.getAttr('width')-10, 10, popUpRect.getAttr('width')-10, popUpRect.getAttr('height')-10, 10,popUpRect.getAttr('height')-10,10,10]);
        if(!isMobile){
            button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')-10);
            button1.setAttr('y',130);
            button2.setAttr('x',button1.getAttr('x')+button1Rect.getAttr('width')+20);
            button2.setAttr('y',130);
        }else{
            button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button1.setAttr('y',popText.getAttr('y')+ popText.getAttr('height')+10);
            button2.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button2.setAttr('y',button1.getAttr('y')+button1Rect.getAttr('height')+10);
        }

       // button2.setAttr('id','button2');

        popUp.show();
        interfaceLayer.draw();


       button2.off('click tap').on('click tap',function(e){
           interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
            popUp.hide();
            setDraggable(true);
           pause = false;
           popUpShown = false;
           interfaceLayer.find('#button1Text')[0].setAttr('text','');
           interfaceLayer.draw();
        });


        button1.off('click tap').on('click tap',function(e){
            $.ajax({
                     url: ajaxLink,
                     type: 'GET',
                     data: 'functionName=deleteNode&storyID=' + storyID + '&userID=' + userID + '&ID=' + id,
                     success: function (data) {
                     //alert(data);
                         console.log("SUCCESS");
                         interfaceLayer.find('#button1Rect')[0].fill(buttonColor);
                         popUp.hide();
                         pause = false;
                         popUpShown = false;
                         setDraggable(true);
                         if(layer.getAttr('scale') < 1.0){
                             resetScale();
                         }
                         startDrawLines();
                         startDrawNodes();
                         debugText.text(data);
                         debugText.setAttr('x',width/2-70-offset);
                         debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);


                         interfaceLayer.find('#button1Text')[0].setAttr('text','');
                         //debugText.setAttr('fontSize','25');
                         interfaceLayer.draw();

                 },
                 error: function (xhr, status, error) {
                     debugText.text(error);
                    // debugText.setAttr('fontSize','25');
                     interfaceLayer.draw();
                 }
             });
        });


        hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);

    };

    hoverPopUpButtons = function(element,colorHover, colorOut){

        interfaceLayer.find(element[0])[0].setAttr('fill',colorOut);
        interfaceLayer.draw();

        interfaceLayer.find(element[0])[0].off('mouseover').on('mouseover',function(e){
            e.target.fill(colorHover);
            interfaceLayer.draw();
        });
        interfaceLayer.find(element[1])[0].off('mouseover').on('mouseover',function(e){
            interfaceLayer.find(element[0])[0].fill(colorHover);
            interfaceLayer.draw();
        });
        interfaceLayer.find(element[0])[0].off('mouseout').on('mouseout',function(e){
            e.target.fill(colorOut);
            interfaceLayer.draw();
        });

    };

    moveQuestion = function(evt){

        popText.setAttr('text',moveText);
        popText.setAttr('x',10);
        popText.setAttr('y',65);
        button3.show();
        button4.hide();
        if(!isMobile){
            popText.setAttr('width',(addRect.getAttr('width')*3+80)-30);
        }else{
            popText.setAttr('width',(addRect.getAttr('width')*2+80)-30);
        }


        interfaceLayer.find('#button1Text')[0].setAttr('text','MOVE BRANCH');
        interfaceLayer.find('#button1Text')[0].setAttr('fontSize',initFontSize);
        interfaceLayer.find('#button1Text')[0].setAttr('x', addRect.getAttr('width')/2-interfaceLayer.find('#button1Text')[0].getAttr('width')/2);


        interfaceLayer.find('#button2Text')[0].setAttr('text','MOVE PAGE');
        interfaceLayer.find('#button2Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button2Text')[0].getAttr('width')/2);

        if(!isMobile){
            popUpRect.setAttr('width',addRect.getAttr('width')*3+80);
            popUp.setAttr('x',width/2-((addRect.getAttr('width')*3+80)/2));
            popUp.setAttr('y',height/2-((addRect.getAttr('height')*2+80)/2));
            popUpRect.setAttr('height',250);
        }else{
            popUpRect.setAttr('width',addRect.getAttr('width')*2+80);
            popUp.setAttr('x',width/2-((addRect.getAttr('width')*2+80)/2));
            popUpRect.setAttr('height',(addRect.getAttr('height')*3+150+popText.getAttr('height'))-20);
            popUp.setAttr('y',height/2- popUpRect.getAttr('height')/2);

        }

        dottedLinePopUp.setAttr('points',[10, 10, popUpRect.getAttr('width')-10, 10, popUpRect.getAttr('width')-10, popUpRect.getAttr('height')-10, 10,popUpRect.getAttr('height')-10,10,10]);


      // button2.setAttr('id','button2Move');


        if(!isMobile){
            button1.setAttr('x',15);
            button1.setAttr('y',130);
            button2.setAttr('x', button1.getAttr('x')+button1Rect.getAttr('width')+20);
            button2.setAttr('y',130);
            button3.setAttr('x',button2.getAttr('x')+button1Rect.getAttr('width')+20);
            button3.setAttr('y',130);
        }else{
            button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button1.setAttr('y',popText.getAttr('y')+ popText.getAttr('height')+10);
            button2.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button2.setAttr('y',button1.getAttr('y')+button1Rect.getAttr('height')+10);
            button3.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button3.setAttr('y',button2.getAttr('y')+button1Rect.getAttr('height')+10);
        }



        interfaceLayer.find('#button3Text')[0].setAttr('text','CANCEL');
        interfaceLayer.find('#button3Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button3Text')[0].getAttr('width')/2);
        interfaceLayer.find('#button3Text')[0].setAttr('id','button3Text');

        interfaceLayer.find('#button3Rect')[0].setAttr('id','button3Rect');

        popUp.show();
        interfaceLayer.draw();

        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button3Rect','#button3Text'],buttonColorHover,buttonColor);

        button3.off('click tap').on('click tap',function(e){
            interfaceLayer.find('#button3Rect')[0].fill(buttonColor);
            button3.hide();
            popUp.hide();
            interfaceLayer.draw();
            pause = false;
            movementStyle = null;
            evt.target.fill(buttonColorHover);
            layer.draw();
            selectedNode = null;
            resetInputFields();
            setDraggable(true);
           // startDrawNodes();
            popUpShown = false;
            interfaceLayer.find('#button1Text')[0].setAttr('text','');
            //debugText.setAttr('fontSize','25');
            interfaceLayer.draw();
        });


        if(hasChildren == false) {
            button1.off('click tap');
            hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorDisabled,buttonColorDisabled);
        }else {
            hoverPopUpButtons(['#button1Rect', '#button1Text'], buttonColorHover, buttonColor);
            button1.off('click tap').on('click tap', function (e) {
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=moveBranch&storyID=' + storyID + '&userID=' + userID + '&ID=' + evt.target.id(),
                    success: function (data) {
                        interfaceLayer.find('#button1Rect')[0].fill(buttonColor);
                        button3.hide();
                        popUp.hide();
                        interfaceLayer.draw();
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
                        xDrag = evt.target.getAbsolutePosition().x;
                        yDrag = evt.target.getAbsolutePosition().y;
                        layer.draw();
                        popUpShown = false;
                        interfaceLayer.find('#button1Text')[0].setAttr('text','');
                        //debugText.setAttr('fontSize','25');
                        interfaceLayer.draw();
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                      //  debugText.setAttr('fontSize', '25');
                        interfaceLayer.draw();
                    }
                });
            });
        }

       button2.off('click tap').on('click tap',function(e){
           interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
            button3.hide();
            popUp.hide();
           interfaceLayer.draw();
            pause = false;
            movementStyle = "one";
            layer.find('#'+evt.target.id()).draggable(true);
           popUpShown = false;
           interfaceLayer.find('#button1Text')[0].setAttr('text','');
           //debugText.setAttr('fontSize','25');
           interfaceLayer.draw();
        });

    };

    dropQuestion2 = function(evt){ //alert("hhh");
        button3.hide();
        button4.hide();
        pause = true;
        popUpShown = true;

        setDraggable(false);
        evt.target.moveDown();

        popText.setAttr('text',drop2Text);
        popText.setAttr('x',10);
        popText.setAttr('y',55);
        if(!isMobile){
            popText.setAttr('width',(addRect.getAttr('width')*3+80)-30);
        }else{
            popText.setAttr('width',(addRect.getAttr('width')*2+80)-30);
        }

        interfaceLayer.find('#button1Text')[0].setAttr('text','YES');
        interfaceLayer.find('#button1Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button1Text')[0].getAttr('width')/2);

        interfaceLayer.find('#button2Text')[0].setAttr('text','CANCEL');
        interfaceLayer.find('#button2Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button2Text')[0].getAttr('width')/2);

        if(!isMobile){
            popUpRect.setAttr('width',addRect.getAttr('width')*3+80);
            popUp.setAttr('x',width/2-((addRect.getAttr('width')*3+80)/2));
            popUp.setAttr('y',height/2-((addRect.getAttr('height')*2+80)/2));
            popUpRect.setAttr('height',250);
        }else{
            popUpRect.setAttr('width',addRect.getAttr('width')*2+80);
            popUp.setAttr('x',width/2-((addRect.getAttr('width')*2+80)/2));
            popUpRect.setAttr('height',(addRect.getAttr('height')*3+100+popText.getAttr('height'))-20);
            popUp.setAttr('y',height/2- popUpRect.getAttr('height')/2);

        }

        dottedLinePopUp.setAttr('points',[10, 10, popUpRect.getAttr('width')-10, 10, popUpRect.getAttr('width')-10, popUpRect.getAttr('height')-10, 10,popUpRect.getAttr('height')-10,10,10]);
        if(!isMobile){
            button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')-10);
            button1.setAttr('y',130);
            button2.setAttr('x',button1.getAttr('x')+button1Rect.getAttr('width')+20);
            button2.setAttr('y',130);
        }else{
            button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button1.setAttr('y',popText.getAttr('y')+ popText.getAttr('height')+10);
            button2.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button2.setAttr('y',button1.getAttr('y')+button1Rect.getAttr('height')+10);
        }
       /* dottedLinePopUp.setAttr('points',[10, 10, (addRect.getAttr('width')*3+80)-10, 10, (addRect.getAttr('width')*3+80)-10, 240, 10,240,10,10]);

        button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')-10);
        button2.setAttr('x',button1.getAttr('x')+button1Rect.getAttr('width')+20);*/

        interfaceLayer.find('#button1Text')[0].setAttr('text','YES');
        interfaceLayer.find('#button1Text')[0].setAttr('fontSize',initFontSize);
        interfaceLayer.find('#button1Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button1Text')[0].getAttr('width')/2);
        popUp.show();
        interfaceLayer.draw();

        hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);

        button2.off('click tap').on('click tap',function(e){
            interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
            popUp.hide();
            interfaceLayer.draw();
            pause = false;
            selectedNode = null;
            setDraggable(true);

            if (movementStyle == "one") {
                evt.target.setAttr("x", xDrag);
                evt.target.setAttr("y", yDrag);
                evt.target.fill(buttonColorHover);
            } else {
                evt.target.setAttr("x", xDrag);
                evt.target.setAttr("y", yDrag);
            }
            dropReset(evt);
            startDrawNodes();
            popUpShown = false;
            interfaceLayer.find('#button1Text')[0].setAttr('text','');
            interfaceLayer.draw();
        });


        button1.off('click tap').on('click tap',function(e){
            interfaceLayer.find('#button1Rect')[0].fill(buttonColor);
            interfaceLayer.find('#button1Text')[0].setAttr('text','');
            interfaceLayer.draw();
            reorder(evt);
        });

    };

    dropQuestion = function(evt){

        pause = true;
        popUpShown = true;
        button3.show();
        button4.show();
        setDraggable(false);
        evt.target.moveDown();

        popText.setAttr('text',dropText);
        popText.setAttr('y',55);
        if(!isMobile){
            popText.setAttr('width',(addRect.getAttr('width')*4+80)-30);
        }else{
            popText.setAttr('width',(addRect.getAttr('width')*2+80)-30);
        }

        interfaceLayer.find('#button1Text')[0].setAttr('text','ADD AS SUB-PAGE');
        interfaceLayer.find('#button1Text')[0].setAttr('fontSize',initFontSize-1);
        interfaceLayer.find('#button1Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button1Text')[0].getAttr('width')/2);


        interfaceLayer.find('#button2Text')[0].setAttr('text','REPLACE PAGES');
        interfaceLayer.find('#button2Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button2Text')[0].getAttr('width')/2);

        if(!isMobile){
            popUpRect.setAttr('width',addRect.getAttr('width')*4+100);
            popUp.setAttr('x',width/2-((addRect.getAttr('width')*4+80)/2));
            popUp.setAttr('y',height/2-((addRect.getAttr('height')*2+80)/2));
            popUpRect.setAttr('height',250);
        }else{
            popUpRect.setAttr('width',addRect.getAttr('width')*2+80);
            popUp.setAttr('x',width/2-((addRect.getAttr('width')*2+80)/2));
            popUpRect.setAttr('height',(addRect.getAttr('height')*4+150+popText.getAttr('height'))-20);
            popUp.setAttr('y',height/2- popUpRect.getAttr('height')/2);

        }
        popText.setAttr('x',popUpRect.getAttr('width')/2 - popText.getAttr('width')/2);

        dottedLinePopUp.setAttr('points',[10, 10, popUpRect.getAttr('width')-10, 10, popUpRect.getAttr('width')-10, popUpRect.getAttr('height')-10, 10,popUpRect.getAttr('height')-10,10,10]);

        if(!isMobile){
            button1.setAttr('x',15);
            button1.setAttr('y',130);
            button2.setAttr('x', button1.getAttr('x')+button1Rect.getAttr('width')+20);
            button2.setAttr('y',130);
            button4.setAttr('x',button2.getAttr('x')+button1Rect.getAttr('width')+20);
            button4.setAttr('y',130);
            button3.setAttr('x',button4.getAttr('x')+button1Rect.getAttr('width')+20);
            button3.setAttr('y',130);

        }else{
            button1.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button1.setAttr('y',popText.getAttr('y')+ popText.getAttr('height')+10);
            button2.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button2.setAttr('y',button1.getAttr('y')+button1Rect.getAttr('height')+10);
            button4.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button4.setAttr('y',button2.getAttr('y')+button1Rect.getAttr('height')+10);
            button3.setAttr('x',(popUpRect.getAttr('width')/2)-button1Rect.getAttr('width')/2);
            button3.setAttr('y',button4.getAttr('y')+button1Rect.getAttr('height')+10);
        }


        interfaceLayer.find('#button3Text')[0].setAttr('text','CANCEL');
        interfaceLayer.find('#button3Text')[0].setAttr('id','button3Text');
        interfaceLayer.find('#button3Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button3Text')[0].getAttr('width')/2);

        interfaceLayer.find('#button4Text')[0].setAttr('text','ADD CONNECTION');
        interfaceLayer.find('#button4Text')[0].setAttr('fontSize',initFontSize-1);
        interfaceLayer.find('#button4Text')[0].setAttr('id','button4Text');
        interfaceLayer.find('#button4Text')[0].setAttr('x',addRect.getAttr('width')/2-interfaceLayer.find('#button4Text')[0].getAttr('width')/2);


        interfaceLayer.find('#button3Rect')[0].setAttr('id','button3Rect');
        interfaceLayer.find('#button4Rect')[0].setAttr('id','button4Rect');

        popUp.show();
        interfaceLayer.draw();

        hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button2Rect','#button2Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button3Rect','#button3Text'],buttonColorHover,buttonColor);
        hoverPopUpButtons(['#button4Rect','#button4Text'],buttonColorHover,buttonColor);


        button3.off('click tap').on('click tap',function(e){
            interfaceLayer.find('#button3Rect')[0].fill(buttonColor);
            button3.hide();
            popUp.hide();
            interfaceLayer.draw();
            pause = false;
            selectedNode = null;
            setDraggable(true);
            if (movementStyle == "one") {
                evt.target.setAttr("x", xDrag);
                evt.target.setAttr("y", yDrag);
                evt.target.fill(buttonColorHover);
            } else {
                evt.target.setAttr("x", xDrag);
                evt.target.setAttr("y", yDrag);
            }
            dropReset(evt);
            startDrawNodes();
            popUpShown = false;
            interfaceLayer.find('#button1Text')[0].setAttr('text','');
            interfaceLayer.draw();
        });


        if(movementStyle == 'one'){
            button4.off('click tap').on('click tap',function(e){
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=addConnection&storyID=' + storyID + '&userID=' + userID + '&ID01=' + previousShape.id() + '&ID02=' + evt.target.id(),
                    success: function (data) {
                      //  alert(data);
                        console.log("SUCCESS");
                        interfaceLayer.find('#button4Rect')[0].fill(buttonColor);
                        button3.hide();
                        button4.hide();
                        popUp.hide();
                        pause = false;
                        dropStyle = "connection";
                        dropReset(evt);
                        popUpShown = false;
                        startDrawLines();
                        startDrawNodes();
                        debugText.text(data);
                        debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

                        interfaceLayer.find('#button1Text')[0].setAttr('text','');
                        interfaceLayer.draw();

                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                        // debugText.setAttr('fontSize','25');
                        interfaceLayer.draw();
                    }
                });
            });

        }else{
            button4.off('click tap');
            hoverPopUpButtons(['#button4Rect', '#button4Text'], buttonColorDisabled, buttonColorDisabled);
        }


        if(hasChildren && movementStyle == "one") {
            button1.off('click tap');
            hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorDisabled,buttonColorDisabled);
        }else{
            hoverPopUpButtons(['#button1Rect','#button1Text'],buttonColorHover,buttonColor);
            button1.off('click tap').on('click tap', function (e) {
                if(movementStyle == "one") {
                   $.ajax({
                        url: ajaxLink,
                        type: 'GET',
                        data: 'functionName=addNodeAsChild&storyID=' + storyID + '&userID=' + userID + '&ID01=' + previousShape.id() + '&ID02=' + evt.target.id(),
                        success: function (data) {
                           // alert(data);
                            console.log("SUCCESS");
                            interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
                            button3.hide();
                            button4.hide();
                            popUp.hide();
                            pause = false;
                            dropStyle = "child";
                            dropReset(evt);
                            popUpShown = false;
                            startDrawLines();
                            startDrawNodes();
                            debugText.text(data);
                            debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

                            interfaceLayer.find('#button1Text')[0].setAttr('text','');
                            interfaceLayer.draw();

                        },
                        error: function (xhr, status, error) {
                            debugText.text(error);
                           // debugText.setAttr('fontSize','25');
                            interfaceLayer.draw();
                        }
                    });
                }else{
                    $.ajax({
                        url: ajaxLink,
                        type: 'GET',
                        data: 'functionName=addBranchAsChild&storyID=' + storyID + '&userID=' + userID+ '&ID=' + previousShape.id() + '&IDs=' + movementStyle,
                        success: function (data) {
                           // alert(data);
                            console.log("SUCCESS");
                            interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
                            button3.hide();
                            button4.hide();
                            popUp.hide();
                            pause = false;
                            dropStyle = "child";
                            dropReset(evt);
                            popUpShown = false;
                            startDrawLines();
                            startDrawNodes();
                            debugText.text(data);
                            debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

                            interfaceLayer.find('#button1Text')[0].setAttr('text','');
                            interfaceLayer.draw();
                        },
                        error: function (xhr, status, error) {
                            debugText.text(error);
                            //debugText.setAttr('fontSize','25');
                            interfaceLayer.draw();
                        }
                    });
                }
            });
        }

        button2.off('click tap').on('click tap',function(e){
            if(movementStyle != "one") {
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=checkIFParent&storyID=' + storyID + '&userID=' + userID+ '&ID=' + previousShape.id() + '&IDs=' + movementStyle,
                    success: function (data) {
                      if(data == 'false'){
                          found = false;
                          interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
                          button3.hide();
                          button4.hide();
                          reorder(evt);
                       }else{
                          found = true;
                          interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
                          button3.hide();
                          button4.hide();
                          popUp.hide();
                          interfaceLayer.draw();
                          pause = false;
                          dropStyle = "reorder";
                          popUpShown = false;
                          dropQuestion2(evt);
                      }
                        //interfaceLayer.find('#button1Text')[0].setAttr('text','');
                        interfaceLayer.draw();

                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                       // debugText.setAttr('fontSize','25');
                        interfaceLayer.draw();
                    }
                });
            }else{
                interfaceLayer.find('#button2Rect')[0].fill(buttonColor);
                button3.hide();
                button4.hide();
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
        interfaceLayer.draw();
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

    setToolTip = function(toolText,e){
        var textToolT;
        toolTipText = toolText;
        tooltip.getChildren(function (n) {
            return n.getClassName() === "Text";
        }).each(function (text, n) {
            textToolT = text;
            textToolT.text('"'+toolText+'"');
            if(layerTEXT.getAttr('scale').x <= 1.0){
                textToolT.setAttr('fontSize', 20*(1+(1-layerTEXT.getAttr('scale').x)*1.5));
            }
           // alert(layerTEXT.getAttr('scale').x);
        });
        tooltip.getChildren(function (n) {
            return n.getClassName() === "Rect";
        }).each(function (rect, n) {
            rect.setAttr('width',textToolT.getAttr('width'));
            rect.setAttr('height',textToolT.getAttr('height'));
        });

        tooltip.setAttr('x', e.target.getAttr('x')-stage.find('#tooltext')[0].getAttr('width')/2);

        if(selectedNode == null) {
            debugText.setAttr('x', (width/2)-stage.find('#tooltext')[0].getAttr('width')/2);
            debugText.setAttr('fontSize','20');
            debugText.text('"'+toolText+'"');
            interfaceLayer.draw();
        }
        tooltip.show();
        layerTEXT.draw();

    };


    setStoryDetails = function(){
        //set title
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=getStoryDetails&storyID=' + storyID + '&userID=' + userID,
            success: function (data) {
               //alert(data);
                var obj = $.parseJSON(data);
                //if it is published
                if(obj[0]['isPublished'] == '1'){
                    $(".isPublished").attr("checked", true);
                }else{
                    $(".isPublished").attr("checked", false);
                }
                $(".storyTitle").val(obj[0]['name']);
                $(".storyAuthor").val(obj[0]['author_name']);
                $(".storyCoAuthor").val(obj[0]['co_author_name']);

            },
            error: function (xhr, status, error) {
                debugText.text(error);
                //debugText.setAttr('fontSize','25');
                interfaceLayer.draw();
            }
        });

    };

    resetInputFields = function(){
        $("#pageEditor .inputField").val('');
        $('#pageEditor #currentPicture').prop('src','/Storytelling/public/images/dummyProfile.jpg');
        if(selectedNode == null){
            $('#previewEditor #currentPicturePreview').prop('src','/Storytelling/public/images/dummyProfile.jpg');
            $('#previewEditor #title h2').text('Default-Title');
            $('#previewEditor #pageText').text('DefaultText');
            $('#previewEditor #pageOptions').empty();
        }
        $('.opt1').removeAttr('disabled');
        $('.opt2').removeAttr('disabled');
        $('.opt3').removeAttr('disabled');
        $('.opt4').removeAttr('disabled');

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
       // window.ontouchmove  = preventDefault; // mobile
       // document.onkeydown  = preventDefaultForScrollKeys;
    };

    enableScroll = function() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
       window.onwheel = null;
      //  window.ontouchmove = null;
        //document.onkeydown = null;
    };


    hoverInterfaceButtons = function(rect, text){
        stage.find(rect)[0].on('mouseover',function(e){
            var fill = e.target.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColor;
            if(fill != buttonColorDisabled){
                e.target.fill(buttonColorHover);
                interfaceLayer.draw();
            }
        });
        stage.find(rect)[0].on('mouseout',function(e){
            var fill = e.target.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColorHover;
            if(fill != buttonColorDisabled) {
                e.target.fill(buttonColor);
                interfaceLayer.draw();
            }
        });
        stage.find(text)[0].on('mouseover',function(e){
            var rec =  stage.find(rect)[0];
            var fill = rec.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColor;
            if(fill != buttonColorDisabled){
                rec.fill(buttonColorHover);
                interfaceLayer.draw();
            }
        });

    };

    changeFontSize = function(object,scale){
        object.setAttr('fontSize',width*scale);
    };


    resetScale = function() {

        offset = 0;
        startY = 0;
        startScale = 1.0;
        var scale = 1;
        var offset = 0.0;

        layer.scale({
            x: scale,
            y: scale
        });
        layerConn.scale({
            x: scale,
            y: scale
        });
        backgroundLayer.scale({
            x: scale,
            y: scale
        });
        levelTextLayer.scale({
            x: scale,
            y: scale
        });
        layerTEXT.scale({
            x: scale,
            y: scale
        });
        tempLayer.scale({
            x: scale,
            y: scale
        });

        layerConn.offset({
            x: offset,
            y: offset
        });
        layerTEXT.offset({
            x: offset,
            y: offset
        });

        tempLayer.offset({
            x: offset,
            y: offset
        });
        layer.offset({
            x: offset,
            y: offset
        });
        startOffsetX=offset;
        startOffsetY=offset;
    };

//END

// IIIIIIIIIIIIINIT
    init = function init(){

        var res = window.location.href;
        var array = res.split("/");
        storyID = array[array.length-2];
        userID = array[array.length-3];
      //  storyID = storyID.replace(new RegExp("%20","g"),' ');

        width = $('#container').width();
        stage.setAttr('width',width);
        levelX = width/2;


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

        //zoomin  BUTTON
        zoomInButton.setAttr('x',width-(50+width*0.05));
        zoomInButton.add(zoomInRect);
        zoomInText.setAttr('x',zoomInRect.getAttr('width')/2-zoomInText.getAttr('width')/2);
        zoomInText.setAttr('y',zoomInRect.getAttr('height')/2-zoomInText.getAttr('height')/2.2);
        zoomInButton.add(zoomInText);
        zoomInButton.add(dottedLineZoomIn);
        interfaceLayer.add(zoomInButton);

        //zoomout PAGE BUTTON
        zoomOutButton.setAttr('x',width-(50+width*0.05));
        zoomOutButton.add(zoomOutRect);
        zoomOutText.setAttr('x',zoomOutRect.getAttr('width')/2-zoomOutText.getAttr('width')/2);
        zoomOutText.setAttr('y',zoomOutRect.getAttr('height')/2-zoomOutText.getAttr('height')/1.5);
        zoomOutButton.add(zoomOutText);
        zoomOutButton.add(dottedLineZoomOut);
        interfaceLayer.add(zoomOutButton);

        zoomInButton.show();
        zoomOutButton.show();
        if(window.innerWidth<850){
            firstLast = ":last";
        }

        //HOVERTEXT + BACKGROUND
        debugText.setAttr('x', width/2-30);
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

        button3.add(button1Rect.clone({id:'button3Rect'}));
        button3.add(dottedLineAdd.clone({id:'button3dotted'}));
        button3.add(delText.clone({id:'button3Text'}));
        popUp.add(button3);

        button4.add(button1Rect.clone({id:'button4Rect'}));
        button4.add(dottedLineAdd.clone({id:'button4dotted'}));
        button4.add(delText.clone({id:'button4Text'}));
        popUp.add(button4);

        popUp.add(dottedLinePopUp);
        interfaceLayer.add(popUp);

        interfaceLayer.find('#popUp')[0].hide();

        stage.add(emptyLayer);
        stage.add(backgroundLayer);
        stage.add(levelTextLayer);
        stage.add(layerConn);
        stage.add(layer);

        stage.add(tempLayer);
        stage.add(interfaceLayer);
        stage.add(layerTEXT);



        startDrawLines();
        startDrawNodes();

        isMobile = false;
        debugText.show();
        initFontSize = stage.find('#button1Text')[0].getAttr('fontSize');
        //change fontsize
        if(stage.getAttr('width') <850){
            isMobile = true;
            //mobile version meldungen
            debugText.hide();

            changeFontSize(addText,0.02);
            changeFontSize(delText,0.02);
            changeFontSize(stage.find('#button1Text')[0],0.02);
            initFontSize = stage.find('#button1Text')[0].getAttr('fontSize');
            changeFontSize(stage.find('#button2Text')[0],0.02);
            changeFontSize(stage.find('#button3Text')[0],0.02);
            changeFontSize(popText,0.02);

            height=stage.getAttr('width');
            stage.setAttr('height',height);
        }
        if(stage.getAttr('width') <750){
            changeFontSize(addText,0.023);
            changeFontSize(delText,0.023);
            changeFontSize(stage.find('#button1Text')[0],0.023);
            initFontSize = stage.find('#button1Text')[0].getAttr('fontSize');
            changeFontSize(stage.find('#button2Text')[0],0.023);
            changeFontSize(stage.find('#button3Text')[0],0.023);
            changeFontSize(popText,0.023);
            height=stage.getAttr('width');
            stage.setAttr('height',height);
        }
        if(stage.getAttr('width') <650){
            changeFontSize(addText,0.028);
            changeFontSize(delText,0.028);
            changeFontSize(stage.find('#button1Text')[0],0.028);
            initFontSize = stage.find('#button1Text')[0].getAttr('fontSize');
            changeFontSize(stage.find('#button2Text')[0],0.028);
            changeFontSize(stage.find('#button3Text')[0],0.028);
            changeFontSize(popText,0.028);
            height=stage.getAttr('width');
            stage.setAttr('height',height);
        }
        if(stage.getAttr('width') <550){
            changeFontSize(addText,0.035);
            changeFontSize(delText,0.035);
            changeFontSize(stage.find('#button1Text')[0],0.035);
            initFontSize = stage.find('#button1Text')[0].getAttr('fontSize');
            changeFontSize(stage.find('#button2Text')[0],0.035);
            changeFontSize(stage.find('#button3Text')[0],0.035);
            changeFontSize(popText,0.035);
            height=stage.getAttr('width');
            stage.setAttr('height',height);

        }
        if(stage.getAttr('width') <450){
            changeFontSize(addText,0.04);
            changeFontSize(delText,0.04);
            changeFontSize(stage.find('#button1Text')[0],0.04);
            initFontSize = stage.find('#button1Text')[0].getAttr('fontSize');
            changeFontSize(stage.find('#button2Text')[0],0.04);
            changeFontSize(stage.find('#button3Text')[0],0.04);
            changeFontSize(popText,0.04);
        }

        if(stage.getAttr('width') <500){
            startY = 80;
        }



       // console.log(stage.getAttr('width'));
        addText.setAttr('x',addRect.getAttr('width')/2-addText.getAttr('width')/2);
        delText.setAttr('x',delRect.getAttr('width')/2-delText.getAttr('width')/2);
        addText.setAttr('y',addRect.getAttr('height')/2-(addText.getAttr('height')/3));
        delText.setAttr('y',delRect.getAttr('height')/2-delText.getAttr('height')/3);

        emptyRectangle = new Konva.Rect({
            x: 0,
            y: 0,
            width: stage.getAttr('width')*100,
            height: stage.getAttr('height')*100,
            id: "emptyRectangle",
            fill:'green',
            opacity: 0
        });

        emptyLayer.add(emptyRectangle);
        emptyRectangle.moveToBottom();


        //refresh page on browser resize
        $(window).bind('resize', function(e)
        {
            if (window.RT) clearTimeout(window.RT);
            window.RT = setTimeout(function()
            {
                zoomOut();
                popUp.destroyChildren();
                resetScale();
                init();

           }, 500);
        });


        //fill in story details
        setStoryDetails();


//SELECT EVENTS
        layer.off('click tap').on('click tap', function (e) {   //e.target.setAttr('y',100);

            if(movementStyle == null) {
                nodeSelection(e.target);
                disable(e.target.id());
            }else if(movementStyle != null && movementStyle != 'one'){
                layer.find('#movingGroup')[0].getChildren(function (n) {
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
                layer.draw();
                tempLayer.draw();
                dropStyle = null;
                movementStyle = null;
            }
        });

        layer.on("mouseover", function (e) {
            var fill = e.target.fill() == 'yellow' ? 'yellow' : 'orange';
            e.target.fill(fill);
            highLight = null;
            layer.draw();
            interfaceLayer.draw();
        });

        layer.on("mouseout", function (e) {
            var fill = e.target.fill() == 'yellow' ? 'yellow' : buttonColorHover;
            e.target.fill(fill);
            layer.draw();
            tooltip.hide();
            layerTEXT.draw();
            if(selectedNode == null){
                debugText.text('');
                debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

                interfaceLayer.draw();
            }

            tooltip.show();
            layerTEXT.draw();
            toolTipText="";
        });

        emptyRectangle.on("mouseout", function (e) {
                enableScroll();
        });
        emptyRectangle.on("mouseenter", function (e) {
            disableScroll();
        });
        stage.on("mouseout", function (e) {
            tooltip.hide();
            toolTipText="";
            layerTEXT.draw();
        });

        layer.on("mouseover", function(e) {
            tooltip.position({
                x : e.target.getAttr('x')-40,
                y :  e.target.getAttr('y')-50*(1+(1-layer.getAttr('scale').x))
            });

            if(toolTipText == ""){
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=getTitle&storyID=' + storyID + '&userID=' + userID + '&ID=' + e.target.id(),
                    success: function (data) {
                        var obj = $.parseJSON(data);
                        setToolTip(obj[0]['title'],e);
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                     //   debugText.setAttr('fontSize', '25');
                        interfaceLayer.draw();
                    }
                });
            }else{
                setToolTip(toolTipText,e);
            }

        });

        //add new page
        stage.find('#addButton')[0].off('click tap').on('click tap',function(e){
            var rect =  stage.find('#addRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled : buttonColorHover;
            if(fill != buttonColorDisabled){
                addNewNode(selectedNode);
            }
        });

        hoverInterfaceButtons('#addRect','#addText');


       //delete page
        stage.find('#deleteButton')[0].off('click tap').on('click tap',function(e){
            var rect =  stage.find('#delRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled: buttonColorHover;
            if(fill != buttonColorDisabled){
               deleteNode(selectedNode);
            }
        });

        hoverInterfaceButtons('#delRect','#delText');

        //zoomIn button
        stage.find('#zoomInButton')[0].off('click tap').on('click tap',function(e){
            var rect =  stage.find('#zoomInRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled: buttonColorHover;
            if(fill != buttonColorDisabled){
                zoomIn(e,'default');
            }
        });

        hoverInterfaceButtons('#zoomInRect','#zoomInText');

        //zoomOut button
        stage.find('#zoomOutButton')[0].off('click tap').on('click tap',function(e){
            var rect =  stage.find('#zoomOutRect')[0];
            var fill = rect.fill() == buttonColorDisabled ? buttonColorDisabled: buttonColorHover;
            if(fill != buttonColorDisabled){
                zoomOut();
            }
        });

        hoverInterfaceButtons('#zoomOutRect','#zoomOutText');


        $('.savePage').off('click').click(function() {
            if(selectedNode != null) {
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=saveContent&storyID=' + storyID + '&userID=' + userID + '&ID=' + selectedNode + '&text=' + $('.textEdit'+firstLast).val()+ '&title=' + $('.titleEdit'+firstLast).val()
                    + '&opt1=' + $('.opt1'+firstLast).val()+ '&opt2=' + $('.opt2'+firstLast).val()+ '&opt3=' + $('.opt3'+firstLast).val()+ '&opt4=' + $('.opt4'+firstLast).val(),
                    success: function (data) {
                        debugText.text(data);
                        debugText.setAttr('x', (width/2)-debugText.getAttr('width')/2);

                        interfaceLayer.draw();
                        loadPage(selectedNode);
                        $("#closeResponsiveNav").trigger('click');
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                      //  debugText.setAttr('fontSize', '25');
                        interfaceLayer.draw();
                    }
                });
            }
        });

        //change url !!!!!!!!!!!
        $('.saveStory').click(function() {
            var published;

            if($('.isPublished').prop('checked') == true){
                published = 1;
            }else{
                published = 0;
            }
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=saveStory&storyID=' + storyID + '&userID=' + userID + '&title=' + $('.storyTitle'+firstLast).val() + '&author='
                    + $('.storyAuthor'+firstLast).val() + '&coAuthor=' + $('.storyCoAuthor'+firstLast).val()+ '&published=' + published,
                    success: function (data) {
                        var obj = $.parseJSON(data);
                        var res = window.location.href;
                        var array = res.split("/");
                        var storyName = array[array.length-2];
                       // obj[0]['name'] = obj[0]['name'].replace(new RegExp(" ","g"),'%20');
                      //  alert(res + " :::: "+ storyName + " :.::: "+ obj[1]['name']);
                        res = res.replace(storyName,obj[1]['name']);
                        location.replace(res);
                    },
                    error: function (xhr, status, error) {
                        debugText.text(error);
                        debugText.setAttr('fontSize', '25');
                        interfaceLayer.draw();
                    }
                });
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
                }
            }

        });

        emptyRectangle.on('click tap', function(e) {
               zoomOut();
        });


//END

//DRAGGEN
      layer.on("dragstart", function (e) {
          if (!pause && movementStyle == null) {
              pause = true;
              zoomOut();
              if(e.target.id() != selectedNode){
                  nodeSelection(e.target);
              }
              popUpShown = true;
              setDraggable(false);
              $.when(checkAdditionalNode(e.target.id()), checkDeleteNode(e.target.id())).done(function (a1, a2) {
                  tooltip.hide();
                  layerTEXT.draw();
                  toolTipText="";
                  moveQuestion(e);
              });
              e.target.fill('yellow');
              interfaceLayer.draw();
          } else if (!pause && movementStyle == "one") {
              xDrag = e.target.getAttr('x');
              yDrag = e.target.getAttr('y');

              e.target.moveTo(tempLayer);
              e.target.fill('yellow');
              layer.draw();
          } else if (!pause && movementStyle != "one" && movementStyle != null) {
              selectedNode = e.target.find('#' + movementStyle[0])[0].getAttr('id');
              movingGroup.moveTo(tempLayer);
              layer.draw();
              tempLayer.draw();
          }


      });


        //drag the whole canvas except interfaceLayer 
        var stageX,stageY = 0;
        stage.off('dragstart').on("dragstart",function(e){
            if(e.target.id() == "stage"){
                stageX= 0;
                stageY = 0;
                interfaceLayer.setAttr('x',stageX);
                interfaceLayer.setAttr('y',stageY);
            }
        });

        stage.off('dragmove').on("dragmove",function(e){
            if(e.target.id() == "stage"){
                var diffX = stage.getAttr('x') - stageX;
                var diffY = stage.getAttr('y') - stageY;
                console.log(diffX);
                interfaceLayer.setAttr('x',interfaceLayer.getAttr('x')+(diffX*(-1)));
                interfaceLayer.setAttr('y',interfaceLayer.getAttr('y')+(diffY*(-1)));
                stageX= stage.getAttr('x');
                stageY = stage.getAttr('y');
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
            if(!pause && e.target.id() != 'stage') {
                var pos = stage.getPointerPosition();
                var overlapping = layer.getIntersection(pos);
                if (overlapping) {
                    if (dropStyle == null) {
                        checkAdditionalNode(previousShape.id());
                        tooltip.hide();
                        layerTEXT.draw();
                        toolTipText="";
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
           /*if(!pause) {
               debugText.setAttr('fontSize','20');
                debugText.text('Drag over' + toolTipText);
                layer.draw();
                interfaceLayer.draw();
           }*/
        });

        stage.on("dragleave", function (e) {
            if(!pause) {
                over = false;
                e.target.fill(buttonColorHover);
                debugText.setAttr('fontSize','20');
                debugText.text('');
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
                //debugText.setAttr('fontSize','20');
                //debugText.text('Drag over ' + e.target.id());
                layer.draw();
                //interfaceLayer.draw();
            }
        });

        stage.on("drop", function (e) {
            if(!pause) {
                e.target.setAttr("x", xDrag);
               e.target.setAttr("y", yDrag);

                e.target.fill('green');
              /*  debugText.setAttr('fontSize','20');
                debugText.text('Drop ' + e.target.id());*/
                layer.draw();
               // interfaceLayer.draw();
            }
        });



    };

    $(document).ready(init);

}($));




