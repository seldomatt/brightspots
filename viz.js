$(document).ready(function() {

  $('body').on('mouseover', '.middle circle', function() {
    console.log("hi");
    $(this).attr("r", 400);
  });
  // $('.middle circle').mousenter(function() {
    // console.log("hi");
    // // $(this).attr("r", 10000);
  // });

  var diameter, pack, format, svg;

   diameter = 960;
   format = d3.format("d");

   pack = d3.layout.pack()
  .size([diameter - 4, diameter - 4])
  .value(function(d) { return d.size; });

   svg = d3.select("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .append("g")
  .attr("transform", "translate(2,2)");

  function nesting(d) {
    if (d.children) {
      if (d.depth > 1) {
        return "middle";
      } else {
        return "";
      }
    } else {
      return "leaf";
    }
  };


  d3.json("viz.json", function(error, data){
    var node = svg.datum(data).selectAll(".node")
    .data(pack.nodes)
    .enter().append("g")
    .attr("class", function(d) { return nesting(d); })
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});

    node.append("title")
      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

    node.append("circle")
      .attr("r", function(d) { return d.r; });

    node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name.substring(0, d.r / 3); });
  });

  d3.select(self.frameElement).style("height", diameter + "px");

});
