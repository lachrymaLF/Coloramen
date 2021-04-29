/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

var parameter_IDs = [2, 3, 4, 5, 6, 11, 12, 15, 16, 17, 20, 21, 22, 23, 26, 27, 29, 30]; // check ID labels
var parameters = [];

function getParameters() {
    parameters = []; //flush, shouldnt have to do this but just to be safe
    var i;
    for (i = 0; i < parameter_IDs.length; i++) {
        parameters.push(app.project.activeItem.selectedLayers[0].effect("Coloramen").property(parameter_IDs[i]).value);
    }
}

function setParameters() {
    var i;
    for (i = 0; i < parameter_IDs.length; i++) {
        app.project.activeItem.selectedLayers[0].effect("Coloramen").property(parameter_IDs[i]).setValue(parameters[i]);
    }
    parameters = []; //flush
}

function queryColorama() {
    var s = app.project.activeItem.selectedLayers;
    if (s.length > 1) {
        alert("Please select only one layer!");
        return -1;
    }
    if (s.length == 0) {
        alert("Please select a layer!");
        return -1;
    }
    if (s[0].effect("Coloramen")) {
        return true;
    } else {
        return false;
    } 
}

function applyColorama(dirToFFX, effectPresent) {
    if (effectPresent) {
        focusColorama();        
        getParameters();
    }
    var layer = app.project.activeItem.selectedLayers[0];
    var ffx = new File(dirToFFX);
    app.beginUndoGroup("Apply Colorama");
    layer.applyPreset(ffx);
    if (effectPresent) {
        setParameters();
    }
    app.endUndoGroup();
}

function focusColorama() {
    var layer = app.project.activeItem.selectedLayers[0];
    app.executeCommand(2004);
    layer.selected = true;
    layer.effect("Coloramen").selected = true; // assume exists, checked through queryColorama
}

function pickColor(oldColor, dir) {
    var externalLibrary = new ExternalObject(dir);
    var newColor = externalLibrary.colorPicker(oldColor, "dialog_title");
    if(newColor == -1){ //Returns -1 if user clicked on cancel
        newColor = oldColor;
    }
    return newColor;
}
