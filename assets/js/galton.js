
// 1: Set up dimensions of SVG
function galtons_board() {
  var margin = {top: 30, right: 30, bottom: 30, left: 30};
  var width = $("#galton").width() - margin.left - margin.right,
      height = $("#galton").width() - margin.top - margin.bottom;

  // 2: Create SVG
  var svg = d3.select("#galton").append("svg")
      .attr("width", width+ margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3: Scales
  var x = d3.scaleLinear()
  	  .domain([0,1])
      .range([0, width]);
  var y = d3.scaleLinear()
      .domain([0,1])
      .range([height,0]);


  	// 4: Axes
	var xAxis = d3.axisBottom(x);

	// 5: Axes Group
	var xGroup = svg.append("g")
	  .attr("class", "axis axis--x")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);


  function peg_positions(levels) {
    var dx = 1/(levels + 1);
    var positions = [];

    for (var i = 0; i < levels; i++) {
      for (var j = 0; j <= i; j++) {
        pos = {
          "x" : 0.5 - i*dx/2 + j*dx,
          "y" : 1.0 - i*dx,
        }
        positions.push(pos)
      }
    }
    return positions
  }

  function location(index, level) {

  }


  var n = 8;
  var r = 4

  var pegs = svg.selectAll("circle.pegs")
    .data(peg_positions(n), function(d) { return d["Index"]; })
    .enter().append("circle")
    .attr("cx", function(d) { return x(d["x"]); })
    .attr("cy", function(d) { return y(d["y"]); })
    .attr("r", r)
    .attr("class", "pegs")
    .style("fill", "#F5D800");





  var dt = 500;
  function sample() {
    var index = 0;
    var i = 0
    var dx = 1 / (n + 1)
    var ball = svg.append("circle")

    function drop() {
      if (i < n) {
        i += 1
        index += bernouli(0.5)
        ball.transition()
          .duration(dt)
          .attr("cx", x(0.5 - i*dx/2 + index*dx))
          .attr("cy", y(1.0 - i*dx) - 2*r)
          .on("end", drop)
      } else {
        d3.select(this).remove();
      }
    }
    
    ball.attr("cx", x(0.5))
    .attr("cy", y(1.2))
    .attr("r", "4px")
    .style("fill", "#FF8B22")
    .transition()
    .duration(dt)
    .attr("cy", y(1.0) - 2*r)
    .on("end", drop);
  }

  function start_sampling() {
  // dt = 350/Math.pow(1.04, draws);
  var dt = 600
  var count = 0;
  interval_clt = setInterval(function() { 
    sample();
      // if (++count === draws){
      //   clearInterval(interval_clt);
      // }
  }, dt);
}

start_sampling()


  function bernouli(p) {
    return Math.random() <= p;
  }


  function pdf(mu, std) {
      return d3.range(-5, 5, 0.01).map(function(x) { 
      		return [x, 1.0/(std*Math.sqrt(2*Math.PI))*Math.exp(-1.0/2*((x-mu)/std)**2)];
      });
  }


  $(window).on("resize", function () {
    console.log("need to resize")
  });

};

galtons_board();
