

var holder = d3.select("#area2") // select the 'body' element
      .append("svg")           // append an SVG element to the body
      .attr("width", 1000)
      .attr("height", 500);


// draw a rectangle - pitch
holder.append("rect")        // attach a rectangle
    .attr("x", 0)         // position the left of the rectangle
    .attr("y", 0)          // position the top of the rectangle
    .attr("height", 500)    // set the height
    .attr("width", 1000)    // set the width
    .style("stroke-width", 5)    // set the stroke width
    .style("stroke", "#ffffff")    // set the line colour
    .style("fill", "#9ed072");    // set the fill colour


// draw a rectangle - halves
holder.append("rect")        // attach a rectangle
    .attr("x", 0)         // position the left of the rectangle
    .attr("y", 0)          // position the top of the rectangle
    .attr("height", 500)    // set the height
    .attr("width", 500)    // set the width
    .style("stroke-width", 5)    // set the stroke width
    .style("stroke", "#ffffff")    // set the line colour
    .style("fill", "#9ed072");    // set the fill colour


// draw a circle - center circle
holder.append("circle")          // attach a circle
    .attr("cx", 500)             // position the x-centre
    .attr("cy", 250)             // position the y-centre
    .attr("r", 50)               // set the radius
    .style("stroke-width", 5)    // set the stroke width
    .style("stroke", "#ffffff")      // set the line colour
    .style("fill", "none");      // set the fill colour


// draw a rectangle - penalty area 1
holder.append("rect")        // attach a rectangle
    .attr("x", 0)         // position the left of the rectangle
    .attr("y", 105)          // position the top of the rectangle
    .attr("height", 290)    // set the height
    .attr("width", 170)    // set the width
    .style("stroke-width", 5)    // set the stroke width
    .style("stroke", "#ffffff")    // set the line colour
    .style("fill", "#9ed072");    // set the fill colour


// draw a rectangle - penalty area 2
holder.append("rect")        // attach a rectangle
    .attr("x", 830)         // position the left of the rectangle
    .attr("y", 105)          // position the top of the rectangle
    .attr("height", 290)    // set the height
    .attr("width", 170)    // set the width
    .style("stroke-width", 5)    // set the stroke width
    .style("stroke", "#ffffff")    // set the line colour
    .style("fill", "#9ed072");    // set the fill colour

// draw a rectangle - six yard box 1
holder.append("rect")        // attach a rectangle
    .attr("x", 0)         // position the left of the rectangle
    .attr("y", 184)          // position the top of the rectangle
    .attr("height", 132)    // set the height
    .attr("width", 60)    // set the width
    .style("stroke-width", 5)    // set the stroke width
    .style("stroke", "#ffffff")    // set the line colour
    .style("fill", "#9ed072");    // set the fill colour

// draw a rectangle - six yard box 2
holder.append("rect")        // attach a rectangle
    .attr("x", 940)         // position the left of the rectangle
    .attr("y", 184)          // position the top of the rectangle
    .attr("height", 132)    // set the height
    .attr("width", 60)    // set the width
    .style("stroke-width", 5)    // set the stroke width
    .style("stroke", "#ffffff")    // set the line colour
    .style("fill", "#9ed072");    // set the fill colour


// draw a circle - penalty spot 1
holder.append("circle")        // attach a circle
    .attr("cx", 120)           // position the x-centre
    .attr("cy", 250)           // position the y-centre
    .attr("r", 5)             // set the radius
    .style("fill", "#ffffff");     // set the fill colour

// draw a circle - penalty spot 2
holder.append("circle")        // attach a circle
    .attr("cx", 880)           // position the x-centre
    .attr("cy", 250)           // position the y-centre
    .attr("r", 5)             // set the radius
    .style("fill", "#ffffff");     // set the fill colour

// draw a circle - center spot
holder.append("circle")        // attach a circle
    .attr("cx", 500)           // position the x-centre
    .attr("cy", 250)           // position the y-centre
    .attr("r", 5)             // set the radius
    .style("fill", "#ffffff");     // set the fill colour


// penalty box semi-circle 1
// var vis = d3.select("body").append("svg")
// var pi = Math.PI;

var arc = d3.svg.arc()
    .innerRadius(70)
    .outerRadius(75)
    .startAngle(0.75) //radians
    .endAngle(2.4) //just radians

var arc2 = d3.svg.arc()
    .innerRadius(70)
    .outerRadius(75)
    .startAngle(-0.75) //radians
    .endAngle(-2.4) //just radians

    holder.append("path")
    .attr("d", arc)
    .attr("fill", "#ffffff")
    .attr("transform", "translate(120,250)");

    holder.append("path")
    .attr("d", arc2)
    .attr("fill", "#ffffff")
    .attr("transform", "translate(880,250)");


// Dragging circles

var color = d3.scale.ordinal().range(["#14293c", "pink"]);
var color1 = d3.scale.ordinal().range(["#14293c", "red"]);

//var color = d3.scale.category10();

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

// d3.csv("data/dots.csv", dottype, function(error, dots) {
//   dot = holder.append("g")
//       .attr("class", "dot")
//     .selectAll("circle")
//       .data(dots)
//     .enter().append("circle")
//       .attr("r", 14)
//       .attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; })
//       .style("fill", function(d) { return color(d.team); })
//       .style("stroke", function(d) { return color1(d.team); })
//       .call(drag)
//       .transition()
//     .delay(100)
//     .duration(1000);

// });

function default1(){
d3.csv("dots.csv", dottype, function(error, dots) {
  dot = holder.append("g")
    .selectAll(".circle_players")
      .data(dots)
    .enter().append("circle")
    .attr("class", "circle_players")
      .attr("r", 14)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", function(d) { return color(d.team); })
      .style("stroke", function(d) { return color1(d.team); })
      .call(drag);

});

}



default1();


function formone(){

d3.csv("dots.csv", dottype, function(error, dots) {
  var dot = d3.selectAll(".circle_players").data(dots)
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

});
}



function formtwo(){

d3.csv("dots1.csv", dottype, function(error, dots) {
  var dot = d3.selectAll(".circle_players").data(dots)
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

});
}

function formthree(){

d3.csv("dots2.csv", dottype, function(error, dots) {
  var dot = d3.selectAll(".circle_players").data(dots)
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

});
}


function formfour(){

d3.csv("dots3.csv", dottype, function(error, dots) {
  var dot = d3.selectAll(".circle_players").data(dots)
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

});
}









// functions for above...

function dottype(d) {
  d.x = +d.x;
  d.y = +d.y;
  return d;
}


function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this)
  //.classed("dragging", true);
;
}

function dragged(d) {
  d3.select(this)
  .attr("cx", d.x = d3.event.x)
  .attr("cy", d.y = d3.event.y)
  .style("opacity", .5);
}

function dragended(d) {
  d3.select(this)
  .style("opacity", 1)
//  .classed("dragging", false);
;
}
