function get_exits(from, to) {
    exits = {
        "front": {},
        "middle": {},
        "back": {}
    };

    from_station = tunnelbanekarta[from];
    to_station = tunnelbanekarta[to];

    if (!from_station || !to_station) {
        alert("Se till att du stavade stationerna rätt eller välj önskad station " +
              "från rullistan så behöver du ej oroa dig för stavningen.")
    }

    common_lines = from_station.lines.filter(function(n) {
        return to_station.lines.indexOf(n) !== -1;
    });
    
    if (common_lines.length == 0) {
        alert("Stationerna är på olika linjer - var vänlig försök igen");
        return false;
    }

    if (from_station.level < to_station.level) {
        exits['front'] = to_station.exits.up;
        exits['back'] = to_station.exits.down;
    } else {
        exits['back'] = to_station.exits.up;
        exits['front'] = to_station.exits.down;
    }
    exits['middle'] = to_station.exits.middle;
    return exits;
}

function exit_element(exit) {
    p = document.createElement('p')
    p.class = "exit";

    sign = document.createElement('span');
    sign.innerHTML = exit.name;
    sign.class = "direction-sign";

    distance = document.createElement('span');
    distance.innerHTML = exit.pos ? exit.pos : '-';
    distance.class = "distance-to";

    p.appendChild(sign);
    // p.appendChild(document.createElement('br'));
    // p.appendChild(distance);
    
    return p;
}

function render_results(exits, show_distance) {
    front_exits_node = document.getElementById('front-exits');
    middle_exits_node = document.getElementById('middle-exits');
    back_exits_node = document.getElementById('back-exits');

    front_exits_node.innerHTML = "<p>Ingen uppgång fram</p>";
    middle_exits_node.innerHTML = "<p>Ingen uppgång i mitten</p>";
    back_exits_node.innerHTML = "<p>Ingen uppgång bak</p>";
    
    if (exits.front.length) {
        front_exits_node.innerHTML = "";
        for (const exit of exits.front) {
            front_exits_node.appendChild(
                exit_element(exit)
            );
        }
    }

    if (exits.middle.length) {
        middle_exits_node.innerHTML = "";
        for (const exit of exits.middle) {
            middle_exits_node.appendChild(
                exit_element(exit)
            );
        }
    }

    if (exits.back.length) {
        back_exits_node.innerHTML = "";
        for (const exit of exits.back) {
            back_exits_node.appendChild(
                exit_element(exit)
            );
        }
    }

    document.getElementById('result').style = "display: block;";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

function search(event) {
    event.preventDefault();
    from = event.target.elements.from.value.trim();
    to = event.target.elements.to.value.trim();
    show_distance = false; // event.target.elements['show-distance'].checked;

    exits = get_exits(from, to);
    if (exits) {
        render_results(exits, show_distance);
    }
}

document.getElementById('search-form').addEventListener('submit', search);
autocomplete(document.getElementById("from"), Object.keys(tunnelbanekarta));
autocomplete(document.getElementById("to"), Object.keys(tunnelbanekarta));