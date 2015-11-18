/**
 * Created by Barbara on 04.11.2015.
 */

var nodeEditor = nodeEditor || {};

//initializing
var width = window.innerWidth;
var height = window.innerHeight;

var levelY = 100;
var levelX = width/2;
var selectedNode = null;
var xDrag;
var yDrag;
var xDrop;
var yDrop;
var over;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var backgroundLayer = new Konva.Layer();
var layer = new Konva.Layer();
var layerConn = new Konva.Layer();
var layerTEXT = new Konva.Layer();
var ajaxLink = '../../../public/php/getstory.php';


var text = new Konva.Text({
    fill : 'black'
});
backgroundLayer.add(text);

stage.add(backgroundLayer);
stage.add(layerConn);
stage.add(layer);
stage.add(layerTEXT);


var tempLayer = new Konva.Layer();
stage.add(tempLayer);


startDrawLines();
startDrawNodes();


//draw lines
function startDrawLines() {
    $.ajax({
        url: ajaxLink,
        type: 'GET',
        data: "functionName=drawLines",
        success: function (data) {
            var obj = $.parseJSON(data);
            drawLines(obj['MAX(level)']);
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function drawLines(levelNumb){
    var line;
    var h = levelY;
    for (var j = 0; j <= levelNumb; j++) {
        line = new Konva.Line({
            points: [0,h,stage.getWidth(),h],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round'
        });

        backgroundLayer.add(line);

        h +=100;
    }
    backgroundLayer.draw();

}

function startDrawNodes() {
    $.ajax({
        url: ajaxLink,
        type: 'GET',
        data: "functionName=drawNodes",
        success: function (data) {
            var obj = $.parseJSON(data);
            drawNodes(obj);
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function drawNodes(data){
    layer.destroyChildren();
    layerTEXT.destroyChildren();
    console.log("test");

    var star;
    var text;
    var multiple = levelX;
    var center = 0;
    var distance = 35;
    var numb;
    var points = [];
    var z=0;

    for (var i = 0; i < data.length; i++) {
        numb = count(data,i);
      if(numb > 1){
           center = ((numb*(distance*2))/2)+distance;
           multiple = levelX + (parseInt(data[i]['position'])*(distance*2));
       }else{
          center = 0;
          multiple = levelX;
      }
        star = new Konva.Circle({
            x : multiple-center,
            y : (parseInt(data[i]['level'])+1)*levelY,
            fill : "red",
            radius:20,
            draggable: true,
            name : 'star ' + data[i]['ID'],
            id:   data[i]['ID'],
            stroke:'black',
            strokeWidth:2,
            dragBoundFunc: function(pos) {
                var newY = pos.y < levelY ? levelY : pos.y;
                return {
                    x: pos.x,
                    y: newY
                };
            }

        });

        //connection saving
        if(data[i]['nextNodeID1']){
            points[z] = [];
           points[z]['pointX'] = star.getAbsolutePosition().x;
            points[z]['pointY'] = star.getAbsolutePosition().y;
            points[z][0] = data[i]['nextNodeID1'];
            if(data[i]['nextNodeID2']){
                points[z][1] = data[i]['nextNodeID2'];
            }
            if(data[i]['nextNodeID3']){
                points[z][2] = data[i]['nextNodeID3'];
            }
            if(data[i]['nextNodeID4']){
                points[z][3] = data[i]['nextNodeID4'];
            }
            z++;
        }


        //connection drawing
        for(var j = 0; j < points.length; j++){
            for(var k = 0; k < 4; k++){
             if(points[j][k] == data[i]['ID'] ){
                drawConnection(points[j][k],data[i]['ID'],points[j]['pointX'],points[j]['pointY'], star.getAbsolutePosition().x,star.getAbsolutePosition().y);
             }
            }
         }

        layer.add(star);

        //TITLE
       text = new Konva.Text({
            x: star.getAbsolutePosition().x-6,
            y: star.getAbsolutePosition().y-6,
            text: star.getAttr('id'),
            fontSize: 20,
            fill : 'black'
        });
        layerTEXT.add(text);
    }

    layer.draw();
    layerConn.draw();
    layerTEXT.draw();
}

function nodeSelection(e){
    if(selectedNode == null || e.target.id() == selectedNode ) {
        var fill = e.target.fill() == 'yellow' ? 'red' : 'yellow';
        e.target.fill(fill);
        text.text('Selected ' + e.target.name());
        if(fill == 'yellow'){
            selectedNode = e.target.id();
        }else if(fill == 'red'){
            selectedNode = null;
        }
        layer.draw();
        backgroundLayer.draw();
    }
}

function reorderNodes(ID01,ID02){
    $.ajax({
        url : ajaxLink,
        type: 'GET',
        data: 'functionName=reorderNodes&ID01='+ID01+'&ID02='+ID02,
        success: function(data) {
            //alert(data);
            console.log("SUCCESS");
            startDrawNodes();
        },
        error: function(xhr, status, error){
            alert(error);
        }
    });
}

//helpers
function count(data,level){
    var count = 0;
    for (var j = 0; j < data.length; j++) {
        if(parseInt(data[level]['level']) == parseInt(data[j]['level'])){
            count++;
        }
    }
    return count;
}

function drawConnection(id0,id1,x0,y0,x1,y1){
    var line ;
    line = new Konva.Line({
        points: [x0,y0,x1,y1],
        stroke: 'black',
        name: 'Line'+id0+id1,
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });

    layerConn.add(line);
}

function checkAdditionalNode(id){
        $.ajax({
            url: ajaxLink,
            type: 'GET',
            data: 'functionName=maxChildren&ID=' + id,
            success: function (data) {
                //alert(data);
                console.log("SUCCESS");
                var obj = $.parseJSON(data);
                if (obj['nextNodeID4'] == null) {
                    document.getElementById('addNode').disabled = false;
                } else {
                    document.getElementById('addNode').disabled = true;
                }

            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
}

function disable(id){
    if(selectedNode == null){
        document.getElementById('addNode').disabled = true;
    }else{
        checkAdditionalNode(id);
    }
}



//END


//SELECT EVENTS
stage.on('click', function(e) {
    nodeSelection(e);
    disable(e.target.id());
});

stage.on("mouseover", function(e){
    var fill =   e.target.fill() == 'yellow' ? 'yellow' : 'orange';
    e.target.fill(fill);
    text.text('Choose ' + e.target.name());
    layer.draw();
    backgroundLayer.draw();
});

stage.on("mouseout", function(e){
    var fill =   e.target.fill() == 'yellow' ? 'yellow' : 'red';
    e.target.fill(fill);
    layer.draw();
});


document.getElementById('addNode').addEventListener('click', function() {
    console.log("addNode");
}, false);

//END

//DRAGGEN
stage.on("dragstart", function(e){
    nodeSelection(e);
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
stage.on("dragmove", function(evt){
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




stage.on("dragend", function(e){
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
        if(e.target.id()==selectedNode) {
            selectedNode = null;
        }
        disable(e.target.id());
});

stage.on("dragenter", function(e){
        text.text('dragenter ' + e.target.name());
        layer.draw();
        backgroundLayer.draw();
});

stage.on("dragleave", function(e){
        over = false;
        e.target.fill('red');
        text.text('dragleave ' + e.target.name());
        layer.draw();
        backgroundLayer.draw();
});

stage.on("dragover", function(e){
        over = true;
        e.target.fill('green');
        xDrop = e.target.getAbsolutePosition().x;
        yDrop = e.target.getAbsolutePosition().y;
        text.text('dragover ' + e.target.name());
        layer.draw();
        backgroundLayer.draw();
});

stage.on("drop", function(e){
        e.target.setAttr("x", xDrag);
        e.target.setAttr("y", yDrag);

        e.target.fill('green');
        text.text('drop ' + e.target.name());
        layer.draw();
        backgroundLayer.draw();
});




//not needed yet
/*function updateConnections(){

}

function hasMultipleChildren(array){
    var group;
    if(!(array['nextNodeID2'] == null && array['nextNodeID3'] == null && array['nextNodeID4'] == null)){
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


