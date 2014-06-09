$(document).ready(function() {
  var margin = 10;
  var diameter= $(window).innerWidth()/2;
  var svgWidth = $(window).innerWidth(); 

  var color = d3.scale.linear()
  .domain([-1,5])
  .range(["hsl(152,80%,80%)","hsl(228,30%,40%)"])
  .interpolate(d3.interpolateHcl);


  var svg= d3.select("body").append("svg")
  .attr("width", svgWidth)
  .attr("height", diameter)
  .append("g")
  .attr("transform", "translate(" + diameter + ", " + diameter/2 + ")");


  var pack= d3.layout.pack()
  .size([diameter-margin,diameter - margin])
  .padding(2)
  .value(function(d){ return d.size;})


  d3.json("viz.json", function(error, tree){
    var focus = tree
    var nodes= pack.nodes(tree);
    var view;

    var circle= svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", function(d){return setClass(d);})
    .style("fill",function(d){return d.children ? color(d.depth) : '#BDFCFF';})
    .on("click", function(d){ if (focus !== d) zoom(d), d3.event.stopPropagation();})

    function setClass(d) {
      if (d.parent) {
        if (d.depth == 1) {
          return "node--top"
        } else if (d.depth == 2) {
          if (d.children) {
            return "node--middle"
          } else {
            return "node--leaf"
          }
        } else {
          return 'node--leaf'
        }
      } else {
        return "node node--root"
      }
    }

    var text= svg.selectAll("foreignObject")
    .data(nodes)
    .enter().append("foreignObject")
    .html(function(d){return d.name})
    .attr("class","label")
    .style("fill-opacity", function(d) {return d.parent === tree ? 1 :0; })
    .style("text-align", "center")
    .style("display",function(d){return d.parent === tree ? "inline" : "none";});

    var text_nodes= svg.selectAll(".label")
    var circle_nodes= svg.selectAll("circle")

    d3.select("body")
    .style("background",color(-1))
    .on("click",function(){backgroundZoom(tree);});

    zoomTo([tree.x,tree.y,tree.r*2  + margin])

    function backgroundZoom(d) {
      var focus0 = focus;
      var focus =d;

      var transition = d3.transition()
      .duration(700)
      .tween("zoom",function(d){
        var i= d3.interpolateZoom(view,[focus.x,focus.y,focus.r *2 + margin]);
        return function (t){zoomTo(i(t));};
      });

      console.log("background Zoom");
      transition.selectAll("circle")
      .filter(function(d){ return d.parent ===focus || this.style.display === "inline";})
      .style("fill-opacity", function(d) {return (d.parent === focus) ? 1:0})
      .each("end",function(d){if (d.parent !== focus ) this.style.display = "none";})

      transition.selectAll(".label")
      .filter(function(d){return d.parent ===focus || this.style.display === "inline";})
      .style("fill-opacity", function(d) {return d.parent === focus ? 1:0})
      .each("start",function(d){if (d.parent === focus) this.style.display = "inline"; if (d.parent !== focus) this.style.display = "none"})
      .each("end",function(d){if (d.parent !== focus) this.style.display = "none"; if (d.parent == focus) this.style.display = "inline"})
    }

    function zoom(d){
      var focus0 = focus;
      var focus =d;

      var transition = d3.transition()
      .duration(700)
      .tween("zoom",function(d){
        var i= d3.interpolateZoom(view,[focus.x,focus.y,focus.r *2 + margin]);
        return function (t){zoomTo(i(t));};
      });

      console.log("Zoom");
      transition.selectAll("circle")
      .filter(function(d){ return d.parent ===focus || this.style.display === "inline";})
      .style("fill-opacity", function(d) {return (d.parent === focus) ? 1:0})
      .each("start",function(d){if (d.parent === focus) this.style.display = "inline";})
      .each("end",function(d){if (d.parent !== focus ) this.style.display = "none";})

      transition.selectAll(".label")
      .filter(function(d){return d.parent ===focus || this.style.display === "inline";})
      .each("start",function(d){if (d.parent === focus) this.style.display = "none"; if (d.parent !== focus) this.style.display = "none";})
      .each("end",function(d){if (d.parent === focus) this.style.display = "inline"; if (d.parent !== focus) this.style.display = "none";})
    }

    function zoomTo(v){

      var k = diameter /v[2]; view =v;
      circle_nodes.attr("transform", function (d){ return "translate(" + (d.x-v[0]) * k + "," + (d.y - v[1]) * k + ")" })
      circle.attr("r",function(d){return d.r *k});
      text_nodes.attr("width", function(d) {return d.r *k *2});
      text_nodes.attr("height", function(d) {return d.r *k *2});
      text_nodes.attr("x", function(d) { return ((d.x-v[0]) * k) - (d.r *k) });
      text_nodes.attr("y", function(d) { return ((d.y - v[1]) * k) -15});
      text_nodes.attr("fill", "red");
    }

    d3.select(self.frameElement).style("height",diameter + "px");

  });
});
