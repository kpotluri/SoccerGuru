var NetworkChart = {

draw: function(graph) {

/* Refresh the SVG */
d3.select(".bubble_svg").remove();

/* Set the screen size */
var width = 1000,
    height = 600;
var radius = 20;
var border=0;
// var bordercolor='black';

/* Create SVG for the chart */
var svg = d3.select("#bubble_viz").append("svg")
    .attr("class", "bubble_svg")
    .attr("width", width)
    .attr("height", height)
    .attr("border",border);

/* Add border to the SVG */
var borderPath = svg.append("rect")
                .attr("x", 0)
           			.attr("y", 0)
           			.attr("height", height)
           			.attr("width", width)
           			// .style("stroke", bordercolor)
           			.style("fill", "none")
           			.style("stroke-width", border);

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
// var div = svg.append("div")
//      .attr("class", "tooltip")
//      .style("opacity", 0);

/* Set and Start the force layout */
var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(graph.links)
    .gravity(.05)
    .distance(200)
    .charge(-100)
    .friction(0.001)
    // .linkDistance(100)
    .size([width, height])
    // .on('tick', tick)
    .start();

/* Add the links to the graph */
var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("path")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .style("stroke", function(d){
          if(d.value < 0)
          {
            return "rgb(204,0,0)";
          }
          else if (d.value > 0) {

            return "rgb(0, 200, 0)";
          }
          else
          {
            return "rgb(255, 255, 0)";
          }
        })
    .style("opacity", function(d){ d.visible = false; return 0;})
    .style("fill", "none")
    .style("stroke-width", 3)
    .on('mouseout', function(d){

      div.transition()
         .duration(500)
         .style("opacity", 0);
    })
    .on('mouseover', function(d){
      if (d.visible) {
        div.transition()
           .duration(200)
           .style("opacity", .9);
           div.html("<p class='tooltip-p'>"+"Week "+ d.week + " - " + d.date+"</p>" +"<p class='tooltip-p'>" + d.home_team + " (H) vs. "+ d.away_team+ " (A)" + "<p class='tooltip-p'>"
                      + "<p class='tooltip-p'>" + d.home_goals + " - " + d.away_goals + "</p>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      }
    })
    .on('click', function(d){

      if (d.visible) {
        div.transition()
           .duration(200)
           .style("opacity", .9);
        div.html("<br>"+"Week "+ d.week + " - " + d.date +"<p class='tooltip-p'>" + d.home_team + " (H) vs. "+ d.away_team+ " (A)" + "<p class='tooltip-p'>"
                   + "<p class='tooltip-p'>" + d.home_goals + " - " + d.away_goals + "</p>")
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
      }
    });

/* Custom behavior for drag and drop of nodes */
var node_drag = d3.behavior.drag()
       .on("dragstart", dragstart)
       .on("drag", dragmove)
       .on("dragend", dragend);

function dragstart(d, i) {
     force.stop() // stops the force auto positioning before you start dragging
}

function dragmove(d, i) {
     d.px += d3.event.dx;
     d.py += d3.event.dy;
     d.x += d3.event.dx;
     d.y += d3.event.dy;
     tick(); // this is the key to make it work together with updating both px,py,x,y on d !
}

function dragend(d, i) {
     d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
     tick();
     force.resume();
}

/* Function to move svg elements to front*/
d3.selection.prototype.moveToFront = function() {
     return this.each(function(){
        this.parentNode.appendChild(this);
     });
};

/* Add the nodes */
var node = svg.selectAll(".node")
     .data(graph.nodes)
     .enter().append("g")
     .attr("class", "node")
     .call(node_drag);

 node.append("circle")
    //  .attr("class", "node")
     .attr("id", function(d){return "node-"+d.name;})
     .attr("r", function(d) { return d.totalWin/5; })
     .style("fill", "#fff")
     .style("stroke", "#000")
     .on("dblclick", function(d){
                d = d3.select(this).node().__data__;
                link.style("opacity", function (o) {
                    if(d.index==o.source.index | d.index==o.target.index)
                    {
                      o.visible = true;
                      var sel = d3.select(this);
                      sel.moveToFront();
                      node.moveToFront();
                      return 1;
                    }
                    else{
                      o.visible = false;
                      return 0;
                    }

                });
                link.style("stroke", function (o) {
                    if(d.index==o.source.index)
                    {
                      var value = 0;
                      value = o.home_goals - o.away_goals;

                      if(value < 0)
                      {
                        return "rgb(204, 0, 0)";
                      }
                      else if (value > 0) {

                        return "rgb(0, 200, 0)";
                      }
                      else
                      {
                        return "rgb(255, 255, 0)";
                      }
                    }
                    else if (d.index==o.target.index)
                    {
                      var value = 0;
                      value = o.away_goals - o.home_goals;

                      if(value < 0)
                      {
                        return "rgb(204,0,0)";
                      }
                      else if (value > 0) {

                        return "rgb(0, 200, 0)";
                      }
                      else
                      {
                        return "rgb(255, 255, 0)";
                      }

                    }

                });

              })
              .on('mouseout', function(d){
                // tip.hide(d);
                div.transition()
                   .duration(500)
                   .style("opacity", 0);
              })
              .on('mouseover', function(d){

                  // tip.show(d);
                  div.transition()
                     .duration(200)
                     .style("opacity", .7);
                     div.html("<p class='tooltip-p'>"+"Team : "+ d.name +"</p>" +"<p class='tooltip-p'>Points : "+ d.totalWin + "</p>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");

              });
    //  .on('mouseout', tip.hide)
    //  .on('mouseover', tip.show);
    // //  .call(node_drag);

    // node.append("image")
    //      .attr("class", "circle")
    //      .attr("xlink:href", "chelsea2_360.png")
    //      .attr("x", "-8px")
    //      .attr("y", "-8px")
    //      .attr("width", "30px")
    //      .attr("height", "30px");

node.append("text")
     .attr("class", "text")
     .attr("dx", 20)
     .attr("dy", ".35em")
     .text(function(d) { return d.name });

force.on("tick", tick);

/* Set the color scale */
var color = d3.scale.ordinal()
  .domain(["Loss", "Win", "Draw"])
  .range(['rgb(204, 0, 0)', 'rgb(0, 200, 0)', 'rgb(255, 255, 0)']);
var legendRectSize = 20;
var legendSpacing = 40;

/* Add the legend for the lines */
var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var h =  legendSpacing;
    var horz = width - 110;
    var vert = (i +1) * h;
    return 'translate(' + horz + ',' + vert + ')';
  });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', 2)
    .style('fill', color)
    .style('stroke', color);
legend.append('text')
    .attr('x', legendRectSize + legendSpacing/2)
    .attr('y', legendRectSize/4)
    .text(function(d) { return d; });

/* Set the size scale */
var size = d3.scale.ordinal()
    .domain(["25 Points", "50 Points", "75 Points", "100 Points"])
    .range([5, 10, 15, 20]);

/* Legend for the size */
var legend_size = svg.selectAll('.legend_size')
    .data(size.domain())
    .enter()
    .append('g')
    .attr('class', 'legend_size')
    .attr('transform', function(d, i) {
        var h =  legendSpacing;
        var horz = width - 100;
        var vert = 120 + (i +1) * h;
        return 'translate(' + horz + ',' + vert + ')';
    });

legend_size.append('circle')
        .attr("r", size)
        .style('fill', "#FFF")
        .style('stroke', "#000")
        .style('stroke-width', 2);
legend_size.append('text')
        .attr('x', legendRectSize)
        .attr('y', legendRectSize/4)
        .text(function(d) { return d; });

div.moveToFront();

// var columns = ["Team", "Opponent", "Venue", "Result", "Home Goals", "Away Goals"];

// The table generation function
// function tabulate(data, columns) {
//             var table = d3.select("body").append("table")
//                     .attr("style", "margin-left: 250px"),
//                 thead = table.append("thead"),
//                 tbody = table.append("tbody");
//
//             // append the header row
//             thead.append("tr")
//                 .selectAll("th")
//                 .data(columns)
//                 .enter()
//                 .append("th")
//                 .text(function(column) { return column; });
//
//             // create a row for each object in the data
//             var rows = tbody.selectAll("tr")
//                 .data(data)
//                 .enter()
//                 .append("tr");
//
//             // create a cell in each row for each column
//             var cells = rows.selectAll("td")
//                 .data(function(row) {
//                     return columns.map(function(column) {
//                         return {column: column, value: row[column]};
//                     });
//                 })
//                 .enter()
//                 .append("td")
//                 .attr("style", "font-family: Courier") // sets the font style
//                 .html(function(d) { return d.value; });
//
//             return table;
//         }
//
//
// // render the table
// var peopleTable = tabulate(graph, columns);

function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
}

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("d", linkArc);

    node.attr("transform", function(d) {
      if (d.x < 0)
      {
        d.x = 0;
      }
      else if (d.x > width) {
        d.x = width;
      }
      else if (d.y < 0 ) {
        d.y = 0;
      }
      else if (d.y > height) {
        d.y = height;
      }
      return "translate(" + d.x + "," + d.y + ")";
    });

  };

}
};
