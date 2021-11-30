
// 1: Set up dimensions of SVG
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = $(window).width() - margin.left - margin.right,
    height = 1.05*$(window).height() - margin.top - margin.bottom;
var s = width / height

// 2: Create SVG
var svg = d3.select("#home").append("svg")
    .attr("width", width+ margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("position", "absolute")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3: Scales
var x = d3.scaleLinear()
	.domain([-5,5])
    .range([0, width]);
var y = d3.scaleLinear()
	.domain([-5/s,5/s])
    .range([height, 0]);

// Helper Functions:
var data = []
var interval;
var mux = 0,
    muy = 0,
    std = 1;

function start() {
  interval = setInterval(function() { 

  	var data = sample(1, mux, muy, std)
	
	data.forEach(function(d, i){
		svg.append("circle")
		  .attr("cx", x(d["x"]))
		  .attr("cy", y(d["y"]))
		  .attr("r", 5)
		  .style("fill", 'white')
		  .style("fill-opacity", 0.2)
		.transition().duration(10000)
		  .style("fill-opacity", 0.2)
		  .on('end', function(d){
		    d3.select(this).remove();
		  })
	});

  }, 1);
}

function stop() {
  clearInterval(interval);
}

function sample(n, mu1, mu2, std) {
    var data = [];
    for (var i = 0; i < n; i++) {
    	data.push(randn(mu1, mu2, std))
    }
    return data
}

function randn(mu1, mu2, std) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    z1 = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    z2 = Math.sqrt( -2.0 * Math.log( u ) ) * Math.sin( 2.0 * Math.PI * v );
    return {"x" : std*z1 + mu1, "y" : std*z2 + mu2}
}

$(window).on("resize", function () {
  console.log("need to resize")
});

$(window).on("load", function () {
  start();
});