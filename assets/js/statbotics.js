/**
 * Fetches JSON data from Statbotics for team 3461 the specified year.
 * @param {int} year - The year to fetch JSON data from.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 */
async function getTeamEvents(year) {
    url = "https://api.statbotics.io/v3/team_events?team=3461&year=" + year
    await fetch(url).then(response => response.json)
}


/**
 * Fetches JSON data from Statbotics for team 3461 the specified event.
 * @param {int} eventKey - The eventKey to fetch JSON data from.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 */
 async function getTeamEvent(eventKey) {
    url = "https://api.statbotics.io/v3/team_event/3461/" + eventKey
    await fetch(url).then(response => response.json)
}


/**
 * Fetches JSON data from Statbotics for team 3461 for the specified event.
 * @param {int} year - The year to fetch JSON data from. 
 * @param {int} eventKey - The eventKey to fetch JSON data from.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 */
 async function getTeamMatches(year, eventKey) {
    let url = "https://api.statbotics.io/v3/team_matches?team=3461";

    if (year) {
        url += "&year=" + year;
    }

    if (eventKey) {
        url += "&event=" + eventKey;
    }

    //console.log("Fetching data from Statbotics at " + url );

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}


/**
 * Creates a graphs of EPA per Match for a specified event
 * @param {array} team_matches_array - Array of team matches supplied by the `getTeamMatches` function
 */
async function generateEPAperMatchGraph(team_matches_array, graphID) {
    // const arr = Array.from({length: team_matches_array.length}, (_, index) => team_matches_array[index]['match'].split('_').slice(1).join(' ').toUpperCase() );
    team_matches_array_sorted = sortMatchesByKey(team_matches_array)
    console.log("Sorted Statbotics Matches", team_matches_array_sorted)
    const arr = []
    var xValues = arr;
    var barColors = ["red", "green","blue","orange","brown"];
    var chartConfig = {
      type: "line",
      data: {
        labels: arr,
        datasets: [
            {
                'label': "Autonomous EPA",
                'borderColor': barColors[3],
                'backgroundColor': barColors[3],
                'data': [],
                'fill': false,
                'tension': 0
            },
            {
              'label': "Teleoperated EPA",
              'borderColor': barColors[2],
              'backgroundColor': barColors[2],
              'data': [],
              'fill': false,
              'tension': 0
              },
            {
              'label': "Endgame EPA",
              'borderColor': barColors[1],
              'backgroundColor': barColors[1],
              'data': [],
              'fill': false,
              'tension': 0
          },
          {
            'label': "Total EPA",
            'borderColor': barColors[0],
            'backgroundColor': barColors[0],
            'data': [],
            'fill': false,
            'tension': 0
            },
        ]
      },
      options: {
        legend: {display: true},
        // scales: {
        //   yAxes: [{ticks: {min: 0}}],
        // }
        title: {
          display: true,
          text: "EPA Over Time",
          fontSize: 16
        }
      }
    };

    console.log(chartConfig.data.datasets)
    team_matches_array_sorted.forEach( index => chartConfig.data.datasets[0].data.push(index['epa']['breakdown']['auto_points']));
    team_matches_array_sorted.forEach( index => chartConfig.data.datasets[1].data.push(index['epa']['breakdown']['teleop_points']));
    team_matches_array_sorted.forEach( index => chartConfig.data.datasets[2].data.push(index['epa']['breakdown']['endgame_points']));
    team_matches_array_sorted.forEach( index => chartConfig.data.datasets[3].data.push(index['epa']['breakdown']['total_points']));
    
    team_matches_array_sorted.forEach(index => arr.push(index['match'].split('_').slice(1).join(' ').toUpperCase()))

    return chartConfig
}


function sortMatchesByKey(matches) {
  const keyOrder = {
      'qm': 1,
      'ef': 2,
      'qf': 3,
      'sf': 4,
      'f': 5
  };

  matches.sort((a, b) => {
      const keyA = a.match.split('_')[1]; // Extracting the match number from the match key
      const keyB = b.match.split('_')[1];



      // Compare the keys based on their order in the keyOrder object
      if (keyOrder[keyA.substring(0, 2)] !== keyOrder[keyB.substring(0, 2)]) {
          return keyOrder[keyA.substring(0, 2)] - keyOrder[keyB.substring(0, 2)];
      }



      // If both keys are the same type, compare them numerically
      const numA = parseInt(keyA.match(/\d+/)[0]);
      const numB = parseInt(keyB.match(/\d+/)[0]);

      return numA - numB;
  });

  return matches;
}

