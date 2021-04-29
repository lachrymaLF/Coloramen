/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

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

function getFFX() {

}

function applyColorama(dirToFFX) {
    var layer = app.project.activeItem.selectedLayers[0];
    var ffx = new File(dirToFFX);
    app.beginUndoGroup("Apply Colorama");
    layer.applyPreset(ffx);
    app.endUndoGroup();
}

function pickColor(oldColor, dir) {
    var externalLibrary = new ExternalObject(dir);
    var newColor = externalLibrary.colorPicker(oldColor, "dialog_title");
    if(newColor == -1){ //Returns -1 if user clicked on cancel
        newColor = oldColor;
    }
    return newColor;
}
