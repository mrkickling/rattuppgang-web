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

    front_elevator = document.getElementById('front-elevator');
    middle_elevator = document.getElementById('middle-elevator');
    back_elevator = document.getElementById('back-elevator');
    front_elevator = "display:none;";
    middle_elevator = "display:none;";
    back_elevator.style = "display:none;";

    front_exits_node.innerHTML = "<p>Ingen uppgång fram</p>";
    middle_exits_node.innerHTML = "<p>Ingen uppgång i mitten</p>";
    back_exits_node.innerHTML = "<p>Ingen uppgång bak</p>";
    
    if (exits.front.length) {
        if (exits.front[0].elevator) {
            front_elevator.style = "display: block;";
        }
        front_exits_node.innerHTML = "";
        for (const exit of exits.front) {
            front_exits_node.appendChild(
                exit_element(exit)
            );
        }
    }

    if (exits.middle.length) {
        if (exits.middle[0].elevator) {
            middle_elevator.style = "display: block;";
        }
        middle_exits_node.innerHTML = "";
        for (const exit of exits.middle) {
            middle_exits_node.appendChild(
                exit_element(exit)
            );
        }
    }

    if (exits.back.length) {
        if (exits.back[0].elevator) {
            back_elevator.style = "display: block;";
        }
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

function setLatestSearch() {
    try {
        let lastSearch = localStorage.getItem('lastSearch');
        lastSearch = JSON.parse(lastSearch);

        from_input = document.getElementById('search-form').elements.from;
        to_input = document.getElementById('search-form').elements.to;

        from_input.value = lastSearch.from;
        to_input.value = lastSearch.to;

    } catch (error) {
        return
    }
      
}

function search(event) {
    event.preventDefault();
    from = event.target.elements.from.value.trim();
    to = event.target.elements.to.value.trim();
    show_distance = false; // event.target.elements['show-distance'].checked;

    let lastSearch = {'from': from, 'to': to}
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));

    exits = get_exits(from, to);
    if (exits) {
        render_results(exits, show_distance);
    }
}

function switchFromTo(event) {
    event.preventDefault();
    from_input = document.getElementById('search-form').elements.from
    to_input = document.getElementById('search-form').elements.to

    from = from_input.value.trim();
    to = to_input.value.trim();

    to_input.value = from;
    from_input.value = to;
}

function clearFrom(event) {
    event.preventDefault();
    document.getElementById('search-form').elements.from.value = "";
}

function clearTo(event) {
    event.preventDefault();
    to_input = document.getElementById('search-form').elements.to.value = "";
}


document.getElementById('search-form').addEventListener('submit', search);
document.getElementById('switch-from-to').addEventListener('click', switchFromTo)
document.getElementById('clear-from').addEventListener('click', clearFrom)
document.getElementById('clear-to').addEventListener('click', clearTo)

document.addEventListener('DOMContentLoaded', setLatestSearch)

autocomplete(document.getElementById("from"), Object.keys(tunnelbanekarta));
autocomplete(document.getElementById("to"), Object.keys(tunnelbanekarta));