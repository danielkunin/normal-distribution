
// 1: Set up dimensions of SVG
function pdf_visualization() {
  var margin = {top: 30, right: 30, bottom: 30, left: 30};
  var width = $("#pdf").width() - margin.left - margin.right,
      height = 0.5*$("#pdf").width() - margin.top - margin.bottom;

  // 2: Create SVG
  var svg = d3.select("#pdf").append("svg")
      .attr("width", width+ margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3: Scales
  var x = d3.scaleLinear()
  	  .domain([-5,5])
      .range([0, width]);
  var y = d3.scaleLinear()
      .domain([0,1])
      .range([height,0]);
  var variance = d3.scaleLinear()
  	  .domain([2,0.5])
      .range([height, 0]);


  	// 4: Axes
	var xAxis = d3.axisBottom(x),
		yAxis = d3.axisLeft(y);

	var xGrid = d3.axisBottom(x).tickSize(-height).tickFormat(''),
		yGrid = d3.axisLeft(y).tickSize(-width).tickFormat('');

	// 5: Axes Group
	var xGroup = svg.append("g")
	  .attr("class", "axis axis--x")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);
	var yGroup = svg.append("g")
	  .attr("class", "axis axis--y")
	  .attr("transform", "translate(0,0)")
	  .call(yAxis);

	var xGroup = svg.append("g")
	  .attr("class", "x axis-grid")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xGrid);
	var yGroup = svg.append("g")
	  .attr("class", "y axis-grid")
	  .attr("transform", "translate(0,0)")
	  .call(yGrid);

	// // 6: Axes Labels
	// svg.append("text")
	//   .attr("class", "label")
	//   .attr("text-anchor", "middle")
	//   .attr("transform", "translate(" + width / 2 + "," + (height + margin.bottom / 2) + ")")
	//   .text("x");              
	// svg.append("text")
	//   .attr("class", "label")
	//   .attr("text-anchor", "middle")
	//   .attr("transform", "translate(" + margin.left / -2 + "," + height / 2 + ")rotate(-90)")
	//   .text("f(x)");


  function pdf(mu, std) {
      return d3.range(-5, 5, 0.01).map(function(x) { 
      		return [x, 1.0/(std*Math.sqrt(2*Math.PI))*Math.exp(-1.0/2*((x-mu)/std)**2)];
      });
  }

  var line = d3.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); });

  svg.append("defs").append("path")
      .attr("id", "curve")
      .attr("d", line(pdf(0,1)));

  // svg.append("text")
  // .attr("id", "curve-text")
  // .attr("x", 180)
  // .append("textPath")
  // .attr("xlink:href", "#curve")
  // .text('What is normal about the Normal Distribution?');

  svg.append("use")
      .attr("id", "curve-line")
      .attr("xlink:href", "#curve");


  $(window).on("resize", function () {
    console.log("need to resize")
  });


  d3.select("#pdf").on("mousemove", function () {
    var p1 = d3.mouse(this);
    var mu = x.invert(p1[0]);
    var sigma = variance.invert(p1[1]);
    $("#mean").text(mu.toFixed(3))
    $("#std").text(sigma.toFixed(3))
    d3.select("#curve").attr("d", line(pdf(mu,sigma)));
  });
};

pdf_visualization();
