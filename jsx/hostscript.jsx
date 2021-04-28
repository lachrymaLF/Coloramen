/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function applyColorama(){
    //TODO: use ID to perserve effect for script
    //TODO: preset
    app.beginUndoGroup("Apply Colorama");
    var bruh = app.project.activeItem.selectedLayers;
    for (var i=0; i < bruh.length; i++){
        bruh[i].effect.addProperty("APC Colorama");
    }
    app.endUndoGroup();
}

// Primitive Method
// function pickColor(){
//     var myNull=app.project.activeItem.layers.addNull();
//     var colorControl = myNull.effect.addProperty("ADBE Color Control");
//     var colorProp = colorControl.property("ADBE Color Control-0001");
//     colorProp.selected = true;
//     app.executeCommand(2240);
//     var userColor = colorProp.value;
//     app.executeCommand(16);
//     app.executeCommand(16);
//     app.executeCommand(16);
//     userColor.pop();
//     for (i = 0; i < 3; i++) {
//         userColor[i] = Math.round(userColor[i] * 255);
//     }
//     return userColor;
// }

function pickColor() {
    // TODO: figure out the right location for relative paths
    // TODO: communicate old color from last selected color in main.js
    var externalLibrary = new ExternalObject('lib:AEColorPicker.aex'); 
    var oldColor = 0x20F186;
    var newColor = externalLibrary.colorPicker(oldColor, "dialog_title");
    if(newColor == -1){ //Returns -1 if user clicked on cancel
        newColor = oldColor;
    }
    alert(newColor);
}
