(function() {

  
  angular.module("mainApp", [])
  .controller("MainCtrl", MainCtrl);

  // controller function MainCtrl
  function MainCtrl($http) {
    var ctrl = this;
    init();


    // function init
    function init() {
      // initialize controller variables
      ctrl.seasons_network = [
        "2014-2015",
        "2013-2014",
        "2012-2013",
        "2011-2012",
        "2010-2011",
        "2009-2010",
        "2008-2009"
      ];
      ctrl.seasonSelected_network = ctrl.seasons_network[0];
      ctrl.selectSeason_network = selectSeason_network;

      // initialize controller functions
      ctrl.selectSeason_network(ctrl.seasonSelected_network);


      //Line Chart 
      // initialize controller variables
      ctrl.seasons_line = [
        "2014-2015",
        "2013-2014",
        "2012-2013",
        "2011-2012",
        "2010-2011",
        "2009-2010",
        "2008-2009"
      ];
      ctrl.seasonSelected_line = ctrl.seasons_line[0];
      ctrl.selectSeason_line = selectSeason_line;

      // initialize controller functions
      ctrl.selectSeason_line(ctrl.seasonSelected_line);
    }

    // function selectExample
    function selectSeason_line(item) {
      var file = item + ".csv";
      LineChart.draw(file);
      // d3.csv(file, function(error, data) {
      //   ctrl.csv = data;
      //   ctrl.json_data = csv_to_json(data);
      //
      // });
    }

    // function selectExample
    function selectSeason_network(item) {
      var file = item + ".csv";
      d3.csv(file, function(error, data) {
        ctrl.csv = data;
        ctrl.json_data = csv_to_json(data);
        NetworkChart.draw(ctrl.json_data);
      });
    }

    function csv_to_json(data){
      var teams = {};
      i = 0;
      data.forEach(function(d) {
        if(teams[d.team]==undefined)
        {
          teams[d.team] = i;
          i=i+1;
        }
      });

      var json_data = {};
      var nodes = [];
      var links =[];

      data.forEach(function(d) {
        var link = {};
        link['source'] = teams[d.home_team];
        link['target'] = teams[d.away_team];
        link['home_team'] = d.home_team;
        link['away_team'] = d.away_team;
        link['week'] = +d.week;
        var date = d.date2.split('-');
        link['date'] = date[1] +'/'+ date[2] +'/'+ date[0];
        link['home_goals'] = +d.home_goals;
        link['away_goals'] = +d.away_goals;
        link['value'] = (+d.home_goals) - (+d.away_goals);
        links.push(link);

        if (+d.week == 38) {
          var node = {};
          node['name'] = d.team;
          node['totalWin'] = +d.points;
          node['id'] = teams[d.team];
          nodes.push(node);
        }

      });
      json_data['nodes'] = nodes;
      json_data['links'] = links;
      return json_data;
    }

}
})();
