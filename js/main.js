/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
'use strict';

function main() {
    //init
    let csInterface = new CSInterface();
    let tab_container = document.querySelector("#gradtab-container");
    let btn_addtab = document.querySelector("#btn_addtab");
    let btn_deltab = document.querySelector("#btn_deltab");
    let btn_changecolor = document.querySelector("#btn_changecolor");
    let btn_apply = document.querySelector("#btn_apply");
    let gradient = document.querySelector("#grad");
    let tab_table = document.querySelector("#tab-table");

    let tabs;
    let tab_colors;
    let tab_positions;

    const tab_width = 10; //in px, check styls.css > .gradtab > width

    const max_tab_count = 64;

    let selected_tab;

    let last_selected_color = "FF0000";

    update_tab_data();

    tabs.forEach(init_tab);
    init_tab_dragging();
    init_btn_addtab();
    init_btn_deltab();
    init_btn_changecolor();
    init_btn_apply();

    themeManager.init();

    update_grad(tab_colors, tab_positions);


    // helpers
    function update_grad(colors, positions) {
        let grad_str = "linear-gradient(to right, ";

        var i;
        for (i = 0;; i++) {
            if (i != tabs.length - 1) {
                grad_str += `#${colors[i]} ${positions[i]*100}%, `;
            } else {
                grad_str += `#${colors[i]} ${positions[i]*100}%)`;
                break;
            }
        }

        gradient.style.background = grad_str;

        update_table();
    }

    function update_table() {
        Array.from(tab_table.children[0].rows).forEach((e) => e.remove());
        let rows = tabs.map((e, i) => tab_table.insertRow(0));
        rows.reverse().forEach((r, i) => {
            if (i == tabs.indexOf(selected_tab)) {
                r.classList.add("tr-selected");
            }
            let cell1 = r.insertCell(0);
            let cell2 = r.insertCell(1);
            let cell3 = r.insertCell(2);
            cell1.innerHTML = i;
            cell2.innerHTML = (tab_positions[i] * 100).toFixed(2) + "%";
            cell3.innerHTML = tab_colors[i];

            cell3.style.position = "relative";
            let preview_block = document.createElement("div");
            preview_block.style.width = "1em";
            preview_block.style.height = "75%";
            preview_block.style.right = "5px";
            preview_block.style.position = "absolute";
            preview_block.style.backgroundColor = `#${tab_colors[i]}`;
            preview_block.style.display = "inline-block";
            cell3.appendChild(preview_block);
        });
        rows.forEach((e, i) => e.addEventListener("click", function() {
            update_selection(tabs[i]);
            update_grad(tab_colors, tab_positions);
        }));
    }

    function update_tab_data() {
        tabs = Array.from(document.querySelectorAll(".gradtab"));
        tabs.sort((a, b) => (a.dataset.pos - b.dataset.pos));
        tab_colors = tabs.map((tab) => tab.dataset.color);
        tab_positions = tabs.map((tab) => tab.dataset.pos);
    }

    function update_selection(tab) {
        Array.from(tab_table.rows).forEach((item) => item.classList.remove("tr-selected"));
        tabs.forEach((i_tab) => {
            i_tab.classList.remove("selected");
        });
        if (tab) {
            selected_tab = tab;
            tab.classList.add("selected");
            last_selected_color = tab.dataset.color;

            tab_table.rows[tabs.indexOf(tab)].classList.add("tr-selected");
        } else {
            selected_tab = null;
        }
    }

    function compute_tab_pos(percentage) {
        return `calc(${percentage*100}% - ${tab_width/2}px)`;
    }

    function tab_set_color(tab) {
        tab.style.backgroundColor = `#${tab.dataset.color}`;
    }

    //init functions
    function init_tab(tab) {
        tab.addEventListener("mousedown", function() {
            update_selection(this);
        });
        tab.style.left = compute_tab_pos(tab.dataset.pos);
        if (tab.dataset.color)
            tab_set_color(tab);
    }

    function init_tab_dragging() {
        tab_container.addEventListener("mousedown", function(e) {
            if (e.target == this) {
                update_selection(null);
            };
            let grad_offset = calc_abs_left(document.querySelector("#first-tab"));
            let grad_length = calc_abs_left(document.querySelector("#last-tab")) - grad_offset;

            window.onmousemove = function(emove) {
                if (selected_tab && !(selected_tab.id == "first-tab") && !(selected_tab.id == "last-tab")) {
                    let new_tab_pos = Math.min(Math.max(0.005, (emove.clientX - grad_offset) / grad_length), .995);
                    selected_tab.style.left = compute_tab_pos(new_tab_pos);
                    selected_tab.dataset.pos = new_tab_pos;
                    update_tab_data();
                    update_grad(tab_colors, tab_positions);
                }
            };

            // tab_container.addEventListener("mouseup", function() {
            //     this.onmousemove = null;
            // });

            window.addEventListener("mouseup", function() {
                window.onmousemove = null;
            });
        });
    }

    function init_btn_addtab() {
        btn_addtab.addEventListener("click", function() {
            if (!(tabs.length < max_tab_count)) {
                csInterface.evalScript('alert("Max amount of tabs reached!");');
                return;
            }
            let tab = document.createElement("span");
            tab.classList.add("gradtab");
            tab.dataset.color = last_selected_color;
            tab.dataset.pos = (tab_positions[0] + tab_positions[1]) / 2;
            init_tab(tab);
            tab_container.appendChild(tab);
            update_tab_data();
            update_grad(tab_colors, tab_positions);
            update_selection(tab);
        });
    }

    function init_btn_deltab() {
        btn_deltab.addEventListener("click", function() {
            if (!selected_tab) {
                csInterface.evalScript('alert("No tab selected!");');
                return;
            }
            if (selected_tab.id == "last-tab" || selected_tab.id == "first-tab") {
                csInterface.evalScript('alert("This tab cannot be deleted!");');
                return;
            }
            selected_tab.remove();
            update_selection(null);
            update_tab_data();
            update_grad(tab_colors, tab_positions);
        });
    }

    function init_btn_changecolor() {
        btn_changecolor.addEventListener("click", function() {
            if (!selected_tab) {
                csInterface.evalScript('alert("No tab selected!");');
                return;
            }

            csInterface.evalScript(
                `pickColor(${parseInt(selected_tab.dataset.color, 16)}, \"lib:${csInterface.getSystemPath(SystemPath.EXTENSION).replace(new RegExp('\/', 'g'), '\\\\')}\\\\AEColorPicker.aex\");`,
                function(result) {
                    selected_tab.dataset.color = last_selected_color = Number(result).toString(16).toUpperCase().padStart(6, '0');
                    tab_set_color(selected_tab);
                    update_tab_data();
                    update_grad(tab_colors, tab_positions);
                });
        });
    }

    function init_btn_apply() {
        btn_apply.addEventListener("click", function() {
            //TODO: edit .ffx and apply to selected, maybe do this in node directly?
        });
    }

    //misc helpers
    function calc_abs_left(elem) {
        let b = elem.getBoundingClientRect();
        return (b.left + b.right) / 2;
    }
}

main();