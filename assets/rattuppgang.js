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

function setFromAndTo(from, to) {
    form = document.getElementById('search-form');
    from_input = form.elements.from
    to_input = form.elements.to

    from_input.value = from;
    to_input.value = to;
    form.submit();
}

function setLatestSearches() {
    setLatestSearch();

    let latestSearches = localStorage.getItem('latestSearches');
    latestSearches = JSON.parse(latestSearches);

    if (!latestSearches) {
        return;
    }

    let latestSearchesDiv = document.getElementById('latest-searches')

    // Loop through the latest searches and create the required HTML structure
    let i = 0;
    for (const search of latestSearches) {

        if (i > 5) {
            break;
        }

        let searchItemDiv = document.createElement('div');
        searchItemDiv.className = 'search-item';

        let fromDiv = document.createElement('div');
        fromDiv.className = 'search-item-from';
        fromDiv.textContent = search.from;

        let arrowDiv = document.createElement('div');
        arrowDiv.className = 'to-arrow';
        arrowDiv.textContent = '→';

        let toDiv = document.createElement('div');
        toDiv.className = 'search-item-to';
        toDiv.textContent = search.to;

        // Append the elements to the search item div
        searchItemDiv.appendChild(fromDiv);
        searchItemDiv.appendChild(arrowDiv);
        searchItemDiv.appendChild(toDiv);

        searchItemDiv.addEventListener(
            'click',
            function() {setFromAndTo(search.from, search.to)}
        )

        // Append the search item div to the main 'latest-searches' div
        latestSearchesDiv.appendChild(searchItemDiv);
        i++;

    }

}

function remember(from, to) {
    let lastSearch = {'from': from, 'to': to}
    localStorage.setItem('lastSearch', JSON.stringify(lastSearch));

    let latestSearches = localStorage.getItem('latestSearches');
    if (latestSearches) {
        latestSearches = JSON.parse(latestSearches);

        latestSearches = [lastSearch].concat(latestSearches);
        
        // Remove duplicates
        latestSearches = latestSearches.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.from === value.from && t.to === value.to
            ))
        );

        localStorage.setItem('latestSearches', JSON.stringify(latestSearches));
    } else {
        localStorage.setItem('latestSearches', JSON.stringify([lastSearch]));
    }
}

function search(event) {
    event.preventDefault();
    
    let latestSearchesBox = document.getElementById('latest-searches');
    if (latestSearchesBox) {
        latestSearchesBox.remove(); // Hide
    }

    from = event.target.elements.from.value.trim();
    to = event.target.elements.to.value.trim();
    show_distance = false; // event.target.elements['show-distance'].checked;

    remember(from, to);

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


let form = document.getElementById('search-form')
form.addEventListener('submit', search);

document.getElementById('switch-from-to').addEventListener('click', switchFromTo)
document.getElementById('clear-from').addEventListener('click', clearFrom)
document.getElementById('clear-to').addEventListener('click', clearTo)

document.addEventListener('DOMContentLoaded', setLatestSearches)

autocomplete(document.getElementById("from"), Object.keys(tunnelbanekarta));
autocomplete(document.getElementById("to"), Object.keys(tunnelbanekarta));