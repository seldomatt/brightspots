$(document).ready(function() {

  var data = [1,2,3]
  var svg = d3.select("svg");

  svg.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("transform", function(d, i) { return "translate(" + 100 + "," + d * 30 * 10 + ")"; })
  .style("fill", "steelblue")
  .attr("cy", 90)
  .attr("r", function(d, i) { return d * 30 });
  // var width, barHeight, scaler, chart, bar;

  // width = 420;
  // barHeight = 20;

  // scaler = d3.scale.linear()
  // .range([0,width]);

  // chart = d3.select(".chart")
  // .attr("width", width);

  // d3.json("viz.json", function(error, data) {

    // var data = data.results;
    // scaler.domain([0, d3.max(data, function(d) { return d.value; })]);

    // chart.attr("height", barHeight * data.length);

    // bar = chart.selectAll("g")
    // .data(data)
    // .enter().append("g")
    // .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    // bar.append("rect")
    // .attr("width", function(d) { return scaler(d.value); })
    // .attr("height", barHeight - 1);

    // bar.append("text")
    // .attr("x", function(d) { return scaler(d.value) - 3; })
    // .attr("y", barHeight / 2)
    // .attr("dy", ".35em")
    // .text(function(d) { return d.value; });
  // });
});
