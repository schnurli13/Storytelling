/**
 * Created by Barbara on 04.11.2015.
 */

var nodeEditor = nodeEditor || {};

nodeEditor.module = (function($) {

//initializing
    var width = window.innerWidth*0.59,
        height = window.innerHeight ,
        levelY = 100,
        levelX = width/2,
        storyID,
        selectedNode = null,
        xDrag,
        yDrag,
        xDrop,
        yDrop,
        over,
        deleteText = "ATTENTION: All sub-pages will be deleted as well.\nDo you really want to delete this page?",
        moveText = "Do you want to move only this page or all sub-pages as well?",

        stage = new Konva.Stage({
            container: 'container',
            width: width,
            height:height

        }),
        backgroundLayer = new Konva.Layer({
            width: width,
            height:height
        }),
        layer = new Konva.Layer({
            width: width,
            height:height
        }),
        layerConn = new Konva.Layer({
            width: width,
            height:height
        }),
        layerTEXT = new Konva.Layer({
                width: width,
                height:height
            }
        ),
        tempLayer = new Konva.Layer({
            width: width,
            height:height
        }),

        ajaxLink = '../../../public/php/getstory.php',
        text = new Konva.Text({
            fill: 'black',
            fontSize: 15,
            x: width / 2 - 50,
            y: 3
        }),

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
        checkAdditionalNode,
        checkDeleteNode,
        addNewNode,
        deleteNode,
        disable,
        moveBranch
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
        document.getElementById('addNode').disabled = true;
        document.getElementById('deleteNode').disabled = true;
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
                    fill: "red",
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
                        fill: "red",
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
            var fill = e.target.fill() == 'yellow' ? 'red' : 'yellow';
            e.target.fill(fill);
            text.text('Selected ' + e.target.name());
            if (fill == 'yellow') {
                selectedNode = e.target.id();
            } else if (fill == 'red') {
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

    checkAdditionalNode = function(id) {
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=maxChildren&storyID='+storyID+'&ID=' + id,
            success: function (data) {
                //alert(data);
                console.log("SUCCESS");
                var obj = $.parseJSON(data);
                if (obj['NextPageID4'] == 0) {
                    document.getElementById('addNode').disabled = false;
                } else {
                    document.getElementById('addNode').disabled = true;
                }

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
                    document.getElementById('deleteNode').disabled = true;
                } else {
                    document.getElementById('deleteNode').disabled = false;
                }

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

    deleteNode = function(id){
            var x;
            if (confirm(deleteText) == true) {
                $.ajax({
                    url: ajaxLink,
                    type: 'GET',
                    data: 'functionName=deleteNode&storyID='+storyID+'&ID=' + id,
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
            } else {
                x = "Cancel pressed!";
            }
            console.log(x);
    };

    moveBranch = function(id){
        var x;
        if (confirm(moveText) == true) {
            x = "true pressed!";
          /*  $.ajax({
                url: ajaxLink,
                type: 'GET',
                data: 'functionName=deleteNode&ID=' + id,
                success: function (data) {
                    alert(data);
                    console.log("SUCCESS");
                    startDrawLines();
                    startDrawNodes();
                },
                error: function (xhr, status, error) {
                    alert(error);
                }
            });*/
        } else {
            x = "Cancel pressed!";
        }
        console.log(x);
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
            document.getElementById('addNode').disabled = true;
            document.getElementById('deleteNode').disabled = true;
        } else {
            if (selectedNode == id) {
                checkAdditionalNode(id);
                checkDeleteNode(id);
            }
        }
    };

//END

// IIIIIIIIIIIIINIT
    init = function init(){
        var res = window.location.href;
        var array = res.split("/");
        storyID = array[array.length-2];
        backgroundLayer.add(text);
        stage.add(backgroundLayer);
        stage.add(layerConn);
        stage.add(layer);
        stage.add(layerTEXT);
        stage.add(tempLayer);

        startDrawLines();
        startDrawNodes();

//SELECT EVENTS
        stage.on('click', function (e) {
            nodeSelection(e);
            disable(e.target.id());
        });

        stage.on("mouseover", function (e) {
            var fill = e.target.fill() == 'yellow' ? 'yellow' : 'orange';
            e.target.fill(fill);
            text.text('Choose ' + e.target.name());
            layer.draw();
            backgroundLayer.draw();
        });

        stage.on("mouseout", function (e) {
            var fill = e.target.fill() == 'yellow' ? 'yellow' : 'red';
            e.target.fill(fill);
            layer.draw();
        });

        document.getElementById('addNode').addEventListener('click', function () {
            addNewNode(selectedNode);
        }, false);

        document.getElementById('deleteNode').addEventListener('click', function () {
           deleteNode(selectedNode);
        }, false);

//END

//DRAGGEN
      stage.on("dragstart", function (e) {
            nodeSelection(e);
            moveBranch(e.target.id);

            xDrag = e.target.getAbsolutePosition().x;
            yDrag = e.target.getAbsolutePosition().y;
            // alert(xDrag + ":"+yDrag);
            e.target.moveTo(tempLayer);
            e.target.fill('yellow');
            text.text('Moving ' + e.target.name());
            layer.draw();
            backgroundLayer.draw();
        });


        var previousShape;
        stage.on("dragmove", function (evt) {
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
        });


        stage.on("dragend", function (e) {
            var pos = stage.getPointerPosition();
            var shape = layer.getIntersection(pos);
            if (shape) {
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
                e.target.setAttr("x", xDrag);
                e.target.setAttr("y", yDrag);
                e.target.fill('red');
            }

            previousShape = undefined;
            e.target.moveTo(layer);
            layer.draw();
            tempLayer.draw();
            if (e.target.id() == selectedNode) {
                selectedNode = null;
            }
            disable(e.target.id());
        });

        stage.on("dragenter", function (e) {
            text.text('dragenter ' + e.target.name());
            layer.draw();
            backgroundLayer.draw();
        });

        stage.on("dragleave", function (e) {
            over = false;
            e.target.fill('red');
            text.text('dragleave ' + e.target.name());
            layer.draw();
            backgroundLayer.draw();
        });

        stage.on("dragover", function (e) {
            over = true;
            e.target.fill('green');
            xDrop = e.target.getAbsolutePosition().x;
            yDrop = e.target.getAbsolutePosition().y;
            text.text('dragover ' + e.target.name());
            layer.draw();
            backgroundLayer.draw();
        });

        stage.on("drop", function (e) {
            e.target.setAttr("x", xDrag);
            e.target.setAttr("y", yDrag);

            e.target.fill('green');
            text.text('drop ' + e.target.name());
            layer.draw();
            backgroundLayer.draw();
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


