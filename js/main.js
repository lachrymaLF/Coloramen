/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
'use strict';

function main() {
    //init
    //let csInterface = new CSInterface();

    let btn_addtab = document.querySelector("#btn_addtab");
    let btn_deltab = document.querySelector("#btn_deltab");
    let btn_changecolor = document.querySelector("#btn_changecolor");
    let btn_apply = document.querySelector("#btn_apply");
    let perc_text = document.querySelector("#perc_text");
    let gradient = document.querySelector("#grad");

    let tabs;
    let tab_colors;
    let tab_positions;

    const tab_width = 10; //in px

    let selected_tab;

    update_tab_data();

    tabs.forEach(init_tab);
    init_tab_deselector();
    init_btn_addtab();
    init_btn_deltab();
    init_btn_changecolor();
    init_btn_apply();

    //themeManager.init();

    update_grad(tab_colors, tab_positions);


    // helpers
    function update_grad(colors, positions) {
        let grad_str = "linear-gradient(to right, ";
        let tab_count = colors.length;

        var i;
        for (i = 0;; i++) {
            if (i != tab_count - 1) {
                grad_str += `#${colors[i]} ${positions[i]*100}%, `;
            } else {
                grad_str += `#${colors[i]} ${positions[i]*100}%)`;
                break;
            }
        }

        gradient.style.background = grad_str;
    }

    function update_tab_data() {
        tabs = Array.from(document.querySelectorAll(".gradtab"));
        tabs.sort((a, b) => (a.dataset.pos - b.dataset.pos));
        tab_colors = tabs.map((tab) => tab.dataset.color);
        tab_positions = tabs.map((tab) => tab.dataset.pos);
    }

    function update_selection(tab) {
        tabs.forEach((i_tab) => {
            i_tab.classList.remove("selected");
        });
        if (tab) {
            selected_tab = tab;
            tab.classList.add("selected");
        } else {
            selected_tab = null;
        }
    }

    function compute_tab_pos(percentage) {
        return `calc(${percentage*100}% - ${tab_width/2}px)`;
    }

    //init functions
    function init_tab(tab) {
        if (tab.id == "first-tab") {
            tab.style.left = compute_tab_pos(0);
        } else if (tab.id == "last-tab") {
            tab.style.left = compute_tab_pos(1);
        } else {
            // TODO: init dragging behavior
        }
        tab.addEventListener("mousedown", function() {
            update_selection(this);
        });
        tab.addEventListener("drag", function() {
            update_tab_data(null);
        });
        if (tab.dataset.color)
            tab.style.backgroundColor = `#${tab.dataset.color}`;
    }

    function init_tab_deselector() {
        document.querySelector("#gradtab-container").addEventListener("mousedown", function(e) {
            if (e.target == this) {
                update_selection(null);
            };
        });
    }

    function init_btn_addtab() {
        btn_addtab.addEventListener("click", function() {
            //TODO: add tab obj in dom and update data
        });
    }

    function init_btn_deltab() {
        btn_deltab.addEventListener("click", function() {
            if (!selected_tab) {
                //TODO: turn alert into extendscript alert
                alert("No tab selected!");
                return;
            }
            if (selected_tab.id == "last-tab" || selected_tab.id == "first-tab") {
                //TODO: turn alert into extendscript alert
                alert("This tab cannot be deleted!");
                return;
            }
            selected_tab.remove();
            selected_tab = null;
            update_tab_data();
        });
    }

    function init_btn_changecolor() {
        btn_changecolor.addEventListener("click", function() {
            if (!selected_tab) {
                alert("No tab selected!");
                return;
            }
            //TODO: color selector, pass val into dataset.color
            update_tab_data();
        });
    }

    function init_btn_apply() {
        btn_apply.addEventListener("click", function() {
            //TODO: edit .ffx and apply to selected, maybe do this in node directly?
        });
    }

}

main();