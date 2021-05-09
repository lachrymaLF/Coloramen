/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
'use strict';

function main() {
    //init
    let ffx = require(__dirname + '/js/node_modules/colorama_ffx');

    let csInterface = new CSInterface();
    let tab_container = document.querySelector("#gradtab-container");
    let btn_addtab = document.querySelector("#btn-addtab");
    let btn_deltab = document.querySelector("#btn-deltab");
    let btn_changecolor = document.querySelector("#btn-changecolor");
    let btn_apply = document.querySelector("#btn-apply");
    let gradient = document.querySelector("#grad");
    let tab_table = document.querySelector("#tab-table");
    let pos_input = document.querySelector("#pos-input");
    let btn_table = document.querySelector("#btn-table");
    let btn_help = document.querySelector("#btn-help");

    let tabs;
    let tab_colors;
    let tab_positions;

    const tab_width = 10; //in px, check styles.css > .gradtab > width

    const max_tab_count = 64;

    const extremity_soft_limit = 0.005;

    let root_path, picker_aex_path;
    switch (process.platform) {
        case 'win32':
            root_path = csInterface.getSystemPath(SystemPath.EXTENSION).replace(new RegExp('\/', 'g'), '\\\\') + '\\\\';
            picker_aex_path = `lib:${root_path}AEColorPicker.aex`;
            break;
        case 'darwin':
            root_path = csInterface.getSystemPath(SystemPath.EXTENSION) + '/';
            picker_aex_path = `lib:${root_path}AEColorPicker.plugin`;
            break;
        default:
            alert("Platform Error!");
            break;
    }

    const ffxPath = `${root_path}coloramen.ffx`;

    let selected_tab;

    let last_selected_color = "FF0000";

    update_tab_data();

    tabs.forEach(init_tab);
    init_tab_dragging();
    init_btn_addtab();
    init_btn_deltab();
    init_btn_changecolor();
    init_btn_apply();
    init_btn_table();
    init_btn_help();
    init_pos_input();

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
            if (i === tabs.indexOf(selected_tab)) {
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
            preview_block.classList.add("preview-block");
            preview_block.style.backgroundColor = `#${tab_colors[i]}`;
            cell3.appendChild(preview_block);
        });
        rows.forEach((e, i) => e.addEventListener("click", function() {
            update_selection(tabs[i]);
            update_grad(tab_colors, tab_positions);
        }));
        rows.forEach((e, i) => e.addEventListener("dblclick", function() {
            csInterface.evalScript(
                `pickColor(${parseInt(selected_tab.dataset.color, 16)}, \"${picker_aex_path}\");`,
                function(result) {
                    selected_tab.dataset.color = last_selected_color = Number(result).toString(16).toUpperCase().padStart(6, '0');
                    tab_set_color(selected_tab);
                    update_tab_data();
                    update_grad(tab_colors, tab_positions);
                });
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
            if ((selected_tab.id === "first-tab") || (selected_tab.id === "last-tab")) {
                pos_input.disabled = true;
            } else {
                pos_input.disabled = false;
            }
            pos_input.value = tab.dataset.pos;
        } else {
            selected_tab = null;
            pos_input.value = "";
            pos_input.disabled = true;
        }
    }

    function compute_tab_pos(percentage) {
        return `calc(${percentage*100}% - ${tab_width/2}px)`;
    }

    function tab_set_color(tab) {
        tab.style.backgroundColor = `#${tab.dataset.color}`;
    }

    function update_tab_pos(tab, pos) {
        if ((selected_tab.id === "first-tab") || (selected_tab.id === "last-tab"))
            return;
        tab.style.left = compute_tab_pos(pos);
        pos_input.value = tab.dataset.pos = pos;
        update_tab_data();
        update_grad(tab_colors, tab_positions);
    }

    //init functions
    function init_tab(tab) {
        tab.addEventListener("mousedown", function() {
            update_selection(this);
        });
        tab.style.left = compute_tab_pos(tab.dataset.pos);
        if (tab.dataset.color)
            tab_set_color(tab);
        tab.addEventListener("dblclick", function() {
            csInterface.evalScript(
                `pickColor(${parseInt(selected_tab.dataset.color, 16)}, \"${picker_aex_path}\");`,
                function(result) {
                    selected_tab.dataset.color = last_selected_color = Number(result).toString(16).toUpperCase().padStart(6, '0');
                    tab_set_color(selected_tab);
                    update_tab_data();
                    update_grad(tab_colors, tab_positions);
                });
        });
    }

    function init_tab_dragging() {
        tab_container.addEventListener("mousedown", function(e) {
            if (e.target === this) {
                update_selection(null);
                return;
            };
            let grad_offset = calc_abs_left(document.querySelector("#first-tab"));
            let grad_length = calc_abs_left(document.querySelector("#last-tab")) - grad_offset;

            window.onmousemove = function(emove) {
                if (selected_tab && !(selected_tab.id === "first-tab") && !(selected_tab.id === "last-tab")) {
                    let new_tab_pos = Math.min(Math.max(extremity_soft_limit, (emove.clientX - grad_offset) / grad_length), 1 - extremity_soft_limit);
                    update_tab_pos(selected_tab, new_tab_pos);
                }
            };

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
            if (selected_tab.id === "last-tab" || selected_tab.id === "first-tab") {
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
                `pickColor(${parseInt(selected_tab.dataset.color, 16)}, \"${picker_aex_path}\");`,
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
            csInterface.evalScript('queryColorama();', function(result) {
                ffx.writeColors(tab_colors, tab_positions);
                csInterface.evalScript(`applyColorama(\"${ffxPath}\", ${result.toString()});`);
            });
        });
    }

    function init_pos_input() {
        pos_input.disabled = true;
        pos_input.addEventListener("focusout", function() {
            update_tab_pos(selected_tab, Math.max(Math.min(this.value, 1 - extremity_soft_limit), extremity_soft_limit));
        });
        pos_input.addEventListener("keyup", function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                update_tab_pos(selected_tab, Math.max(Math.min(this.value, 1 - extremity_soft_limit), extremity_soft_limit));
            }
        });
    }

    function init_btn_help() {
        btn_help.addEventListener("click", function() {
            csInterface.evalScript('alert("Coloramen v1.0.0\\nColorama helper panel\\nlachrymal.net\\n2021")');
        });
    }

    function init_btn_table() {
        btn_table.addEventListener("click", function() {
            this.classList.toggle("pushed");
            tab_table.parentElement.classList.toggle("hidden");
        });
    }

    //misc helpers
    function calc_abs_left(elem) {
        let b = elem.getBoundingClientRect();
        return (b.left + b.right) / 2;
    }
}

main();