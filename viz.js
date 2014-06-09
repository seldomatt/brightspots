$(document).ready(function() {
  var margin = 20;
  var diameter= 960;

  var color = d3.scale.linear()
  .domain([-1,5])
  .range(["hsl(152,80%,80%)","hsl(228,30%,40%)"])
  .interpolate(d3.interpolateHcl);


  var svg= d3.select("body").append("svg")
  .attr("width",diameter)
  .attr("height", diameter)
  .append("g")
  .attr("transform", "translate(" + diameter /2 + ", " + diameter /2 + ")");


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
    .style("fill",function(d){return d.children ? color(d.depth) : null;})
    .on("mouseover", function(d){if (focus !== d) zoom(d), showCircles(d), wrap(d), d3.event.stopPropagation();})
    // .on("mouseover", function(d){ showCircles(d) } )


    var text= svg.selectAll("text")



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

function showCircles(d) {
  if (d.depth >= 1) {
    $(".node--leaf").css( { 'fill': 'white', 'display': 'block' } )
    $(".node--middle").css( { 'fill': 'blue', 'fill-opacity': '.5', 'display': 'block' } )
  }
  else {
    $(".node--leaf").css("display", "none")
  }

}


    function inspectChildren(d) {
     for(var i = 0; i < d.children.length; i++){
        if (d.children[i].children) {
          return  "node--top"
        } else {
          return "node--middle"
        }
     }
    }

    var text= svg.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class","label")
    .style("fill-opacity", function(d) {return d.parent === tree ? 1 :0; })
    .style("display",function(d){return d.parent === tree ? null : "none";})
    .text(function(d){return d.name;});

    var node= svg.selectAll("circle,text")

    d3.select("body")
    .style("background",color(-1))
    .on("click",function(){zoom (tree);});

    zoomTo([tree.x,tree.y,tree.r*2  + margin])

    function zoom(d){
      var focus0 = focus;
      var focus =d;

      var transition = d3.transition()
      .duration(1000)
      .tween("zoom",function(d){
        var i= d3.interpolateZoom(view,[focus.x,focus.y,focus.r *2 + margin]);
        return function (t){zoomTo(i(t));};
      });

      transition.selectAll("text")
      .filter(function(d){return d.parent ===focus || this.style.display === "inline";})
      .style("fill-opacity", function(d) {return d.parent === focus ? 1:0})
      .each("start",function(d){if (d.parent === focus) this.style.display = "inline";})
      .each("end",function(d){if (d.parent !== focus) this.style.display = "none";})
      .each("end",function(d){if (d.parent !== focus) this.style.display = "none";})
    }

    function zoomTo(v){
      console.log(circle)
      var k = diameter /v[2]; view =v
      node.attr("transform", function (d){  return "translate(" + (d.x-v[0]) * k + "," + (d.y - v[1]) * k + ")" })
      circle.attr("r",function(d){return d.r *k});

    }




    d3.select(self.frameElement).style("height",diameter + "px");




  });
  //d3.json('flare.json', function(tree){

});
