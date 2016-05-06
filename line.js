var LineChart ={

draw: function(file)
{
/* Refresh the SVG */
d3.select(".svg_line").remove();

var y_scales = {};
var border=0;
var bordercolor='transparent';

/* Set margin and widths */
var margin = {top: 50, right: 80, bottom: 50, left: 50},
    w = 1000,
    h = 600,
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

/* Function to Set the date format */
var parseDate = d3.time.format("%Y%m%d").parse;

/* Sets the range of scale to 0 - width of the chart */
/* Range defines the area available to render the graph */
/* Left to Right for x Axis */
var xScale = d3.scale.linear()
    .range([0, width]);

/* Sets the range of scale to height - 0 of the chart */
/* Range defines the area available to render the graph */
/* Top to Bottom for y Axis */
var yScale = d3.scale.linear()
    .range([height, 0]);

/* Sets the scale for colors */
var color = d3.scale.category10();

/* Creates axes */
/* Scales for the axes are set to the scales created above */
/* Orient sets the position of ticks & text w.r.t. axis path */
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var xAxis_top = d3.svg.axis()
    .scale(xScale)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var yAxis_right = d3.svg.axis()
    .scale(yScale)
    .orient("right");

/* Function to create the line for each data point */
/* Interpolate specifies the shape of the line rendered */
/* x and y for the datapoint are set according to the scales */
var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return xScale(d.week); })
    .y(function(d)
    {
      var y_scale = y_scales[d.week];
      return y_scale(d.points);
    });

/* Creates the SVG and bundles the grouped elements together based on margins */
/* Selects the body tag from the html and appends SVG*/
/* Sets the width and height of the SVG */
/* Bundles the group elements based on margins */
var svg = d3.select("#line_viz").append("svg")
    .attr("class","svg_line")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("border",border);

    // Define the div for the tooltip
var div_2 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/* Add border to the SVG */
var borderPath = svg.append("rect")
                    .attr("x", - margin.left)
               			.attr("y", - margin.top)
               			.attr("height", h)
               			.attr("width", w)
               			.style("stroke", bordercolor)
               			.style("fill", "none")
               			.style("stroke-width", border);

/* Open data file and populate the chart*/
d3.csv(file, function(error, data) {
  /* Throw error else continue */
  if (error) throw error;

  weeklyPoints = {}

  var dataPoints = [];

  var teamName = data[0].team;
  var teams = [];
  var team = {};
  var teamData = [];
  /* Runs the parse date function to transform the data into desired format */
  data.forEach(function(d) {
    if (d.team != teamName) {
      team['values'] = teamData;
      team['name'] = teamName;
      teams.push(team);
      team = {};
      teamData = [];
      teamName = d.team;
    }
    var dataPoint = {};
    dataPoint['name'] = d.team;
    dataPoint['away_goals'] = d.away_goals;
    dataPoint['away_team'] = d.away_team;
    dataPoint['home_goals'] = d.home_goals;
    dataPoint['home_team'] = d.home_team;
    var date = d.date2.split('-');
    dataPoint['date'] = date[1] +'/'+ date[2] +'/'+ date[0];
    dataPoint['points'] = +d.points;
    dataPoint['week'] = +d.week;
    teamData.push(dataPoint);
    dataPoints.push(dataPoint);
    // d.date = parseDate(d.date);
    if(!weeklyPoints[+d.week])
    {
      weeklyPoints[+d.week] = [+d.points];
    }
    else
    {
      var pointList = weeklyPoints[+d.week];
      pointList.push(+d.points);
      weeklyPoints[+d.week] = pointList;
    }

  });
  team['values'] = teamData;
  team['name'] = teamName;
  teams.push(team);

  console.log(teams);

  var teamNameList = d3.map(teams, function(d) { return d.name; }).keys();

  for(var key in weeklyPoints)
  {
    var y_Scale = d3.scale.linear()
        .range([height, 0]);

    var maxP = d3.max(weeklyPoints[key]);
    var minP = d3.min(weeklyPoints[key]);

    y_Scale.domain([
        minP,
        maxP
    ]);

    var pointDifference = maxP - minP + 1;
    var dash_height_per_point = height/pointDifference;

    y_scales[key] = y_Scale;

    // var uniques = weeklyPoints[key].unique();
    var uniques = weeklyPoints[key].filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    var yAxis = d3.svg.axis()
        .scale(y_Scale)
        .orient("left")
        .ticks(0);

    var weeklyAxis = svg.append("g")
                    .attr("class", "weekly y axis")
                    .attr("id", "axis-" + key.toString())
                    .call(yAxis)
                    .attr("transform", "translate("+width*(key-1)/37 +" ,0)")
                    .style("stroke-dasharray", dash_height_per_point*0.8+ ","+dash_height_per_point*0.2)
                    .style("stroke-width", 1)
                    .style("opacity", .2);
        weeklyAxis.append("text")
                  .text("W" + key.toString())
                  .style("color", "#FFF")
                  .style("text-anchor", "middle")
                  .style("font", "10px sans-serif")
                  .attr("dy", "-2.6em");
        weeklyAxis.append("text")
                  .text(maxP + "p")
                  .style("color", "#FFF")
                  .style("text-anchor", "middle")
                  .style("font", "10px sans-serif")
                  .attr("dy", "-1em");
        weeklyAxis.append("text")
                  .text(minP + "p")
                  .style("color", "#FFF")
                  .style("text-anchor", "middle")
                  .style("font", "10px sans-serif")
                  .attr("y", height)
                  .attr("dy", "2em");
  }


  /* Sets the domain for the color scale */
  /* Assigns name of each category to a color */
  color.domain(teamNameList);

  /* Defines the maximum and minimum values for the x scale */
  xScale.domain([
    d3.min(teams, function(c) { return d3.min(c.values, function(v) { return v.week; }); }),
    d3.max(teams, function(c) { return d3.max(c.values, function(v) { return v.week; }); })
  ]);

  /* Defines the maximum and minimum values for the y scale */
  yScale.domain([
    d3.min(teams, function(c) { return d3.min(c.values, function(v) { return v.points; }); }),
    d3.max(teams, function(c) { return d3.max(c.values, function(v) { return v.points; }); })
  ]);

  /* Append the x axis to the svg */
  /* attr "class" adds the class name to the axes element */
  /* attr "transform" positions the axes element */
  xAxis.ticks(0);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  /* Append the y axis to the svg */
  /* attr "class" adds the class name to the axes element */
  /* Appends the text to the axes */
  /* attr "rotate" rotates the text element */
  /* attr "y" positions the text element absolutely away from the y axes */
  /* attr "dy" positions the text element relatively away from the y axes */
  /* attr "text-anchor" positions the text element. "end" positions it such
     that the end of the text aligns with the start position for the text */
  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis)
  //     .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Points");

  /* Creates svg groups for all the data points and adds class name "city" */
  var team = svg.selectAll(".team_2")
      .data(teams)
      .enter().append("g")
      .attr("class", "team_2");

  /* Plots the line for each data point */
  team.append("path")
      .attr("class", "line_2")
      .attr("id", function(d) { return "line-" + d.name.replace(" ", "-")})
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .style("stroke-width", 2)
      .style("fill", "none")
      .on("mouseover", function(d){
                var that = this;

                d3.selectAll(".line_2")
                  .transition().duration(100)
                  .style("opacity", 0.1);
                d3.selectAll(".teamText")
                  .transition().duration(100)
                  .style("opacity", 0.1);
                d3.selectAll(".node_2")
                    .transition().duration(100)
                    .style("opacity", 0);

                d3.select(that)
                    .transition().duration(100)
                    .style("opacity", 1);

                d3.select("#text-" + d.name.replace(" ", "-"))
                    .transition().duration(100)
                    .style("opacity", 1);
                d3.selectAll("#node-" + d.name.replace(" ", "-"))
                    .transition().duration(100)
                    .style("opacity", 0.8);



              })
      .on("mouseout", function(d){

                d3.selectAll(".line_2")
                  .transition().duration(100)
                  .style("opacity", 1);
                d3.selectAll(".teamText")
                    .transition().duration(100)
                    .style("opacity", 1);
                d3.selectAll(".node_2")
                    .transition().duration(100)
                    .style("opacity", 0);

              });

  /* Adds the text towards the end */
  /* datum gets the data point name and the value of the last data point */
  /* transform positions the text based on the location of the data point */
  /* x and dy are relative positions fo the text */
  team.append("text")
      .attr("class", "teamText")
      .attr("id", function(d) { return "text-" + d.name.replace(" ", "-")})
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) {
        y_scale = y_scales[d.value.week];
        return "translate(" + xScale(d.value.week) + "," + y_scale(d.value.points) + ")";
      })
      .attr("x", 8)
      .attr("dy", ".35em")
      .style("font", "11px sans-serif")
      .text(function(d) { return d.name; });

  var node = svg.selectAll(".node_2")
           .data(dataPoints )
           .enter().append("g")
           .attr("class", "node_2")
           .attr("id", function(d){
             return "node-"+d.name.replace(" ", "-");})
           .style("opacity", 0)
           ;
  node.append("circle")
              //  .attr("class", "node")

              .attr("r", 5)
              .style("fill", function(d){
                if (d.name == d.home_team) {
                  if (d.home_goals > d.away_goals) {
                    return 'rgb(0, 200, 0)'
                  }
                  else if (d.home_goals < d.away_goals) {
                    return 'rgb(204, 0, 0)'
                  }
                  else if (d.home_goals == d.away_goals) {
                    return "#EEEE00"
                  }

                }
                else if (d.name == d.away_team) {
                  if (d.home_goals < d.away_goals) {
                    return 'rgb(0, 200, 0)'
                  }
                  else if (d.home_goals > d.away_goals) {
                    return 'rgb(204, 0, 0)'
                  }
                  else if (d.home_goals == d.away_goals) {
                    return "#EEEE00"
                  }
                }
              })
              .style("stroke", "#000")

              .attr("cx", function(d) { return xScale(d.week); })
              .attr("cy",function(d)
              {

                var y_scale = y_scales[d.week];
                return y_scale(d.points);
              })
              .on('mouseout', function(d){
                div_2.transition()
                   .duration(500)
                   .style("opacity", 0);
                d3.selectAll(".line_2")
                  .transition().duration(100)
                  .style("opacity", 1);
                d3.selectAll(".teamText")
                  .transition().duration(100)
                  .style("opacity", 1);
                d3.selectAll(".node_2")
                  .transition().duration(100)
                  .style("opacity", 0);
              })
              .on('mouseover', function(d){

                  div_2.transition()
                     .duration(200)
                     .style("opacity", .9);
                     div_2.html("<p class='tooltip-p'>"+"Week "+ d.week + " - " + d.date+"</p>" +"<p class='tooltip-p'>" + d.home_team + " (H) vs. "+ d.away_team+ " (A)" + "<p class='tooltip-p'>"
                                + "<p class='tooltip-p'>" + d.home_goals + " - " + d.away_goals + "</p>" + "<p class='tooltip-p'>" +"Total Points for " + d.home_team+
                                " : "+ d.points+"</p>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");


                        d3.selectAll(".line_2")
                          .transition().duration(100)
                          .style("opacity", 0.1);
                        d3.selectAll(".teamText")
                          .transition().duration(100)
                          .style("opacity", 0.1);
                        d3.selectAll(".node_2")
                            .transition().duration(100)
                            .style("opacity", 0);

                        d3.select("#line-" + d.name.replace(" ", "-"))
                            .transition().duration(100)
                            .style("opacity", 1);

                        d3.select("#text-" + d.name.replace(" ", "-"))
                            .transition().duration(100)
                            .style("opacity", 1);
                        d3.selectAll("#node-" + d.name.replace(" ", "-"))
                            .transition().duration(100)
                            .style("opacity", 0.8);

              })
              ;
              var win_domain = d3.scale.ordinal()
                          .domain(["Loss", "Win", "Draw"])
                          .range(['rgb(204, 0, 0)', 'rgb(0, 200, 0)', '#FFFF00']);

              var legendRectSize = 100;
              var legendSpacing = 40;

              /* Add the legend for the lines */
              var legend_line = svg.selectAll('.legend_line')
                .data(win_domain.domain())
                .enter()
                .append('g')
                .attr('class', 'legend_line')
                .attr('transform', function(d, i) {
                  var h =  legendSpacing;
                  var vert = height+ legendSpacing;
                  var horz = width*2/3+ i*legendRectSize;
                  return 'translate(' + horz + ',' + vert + ')';
                });

              legend_line.append('circle')
                        .attr("r", 5)
                        .style('fill', win_domain)
                        .style('stroke', "#000")
                        .style('stroke-width', 1);
              legend_line.append('text')
                        .attr('x', legendSpacing/3)
                        .attr('y', 4)
                        .style("font", "10px sans-serif")
                        .text(function(d) { return d; });

              var win_domain = d3.scale.ordinal()
                               .domain(["Week"])
                               .range([1]);

              var legend_week = svg.selectAll('.legend_week')
                          .data(win_domain.domain())
                          .enter()
                          .append('g')
                          .attr('class', 'legend_week')
                          .attr('transform', function(d, i) {
                            var h =  legendSpacing;
                            var vert = height+ legendSpacing;
                            var horz = -20;
                            return 'translate(' + horz + ',' + vert + ')';
                          });
              legend_week.append('text')
                        .attr('x', legendSpacing/3)
                        .attr('y', 4)
                        .style("font", "10px sans-serif")
                        .text("W1-W38 : Week Number");

              var point_domain = d3.scale.ordinal()
                                 .domain(["Point"])
                                 .range([1]);

              var legend_point = svg.selectAll('.legend_point')
                                    .data(point_domain.domain())
                                    .enter()
                                    .append('g')
                                    .attr('class', 'legend_point')
                                    .attr('transform', function(d, i) {
                                      var h =  legendSpacing;
                                      var vert = height+ legendSpacing;
                                      var horz = 130;
                                      return 'translate(' + horz + ',' + vert + ')';
                                    });
              legend_point.append('text')
                                  .attr('x', legendSpacing/3)
                                  .attr('y', 4)
                                  .style("font", "10px sans-serif")
                                  .text("0p-100p : Min and Max points for the week");

              var legend_dash = svg.selectAll('.legend_dash')
                                  .data(point_domain.domain())
                                  .enter()
                                  .append('g')
                                  .attr('class', 'legend_dash')
                                  .attr('transform', function(d, i) {
                                    var h =  legendSpacing;
                                    var vert = height+ legendSpacing;
                                    var horz = 370;
                                    return 'translate(' + horz + ',' + vert + ')';
                                  });
              legend_dash.append('rect')
                          .attr('width', 10)
                          .attr('height', 2)
                          .style('fill', "#000")
                          .style('stroke', "#000")
                          .style('opacity', 0.2);
              legend_dash.append('text')
                          .attr('x', legendSpacing/2)
                          .attr('y', 4)
                          .style("font", "10px sans-serif")
                          .text("Points (Each dash is 1 point)");
});
}}
