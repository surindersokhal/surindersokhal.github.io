function temp(){
var margin = {top: 20, right: 10, bottom: 70, left: 40};
var width = 600- margin.left - margin.right; 
var height = 600 - margin.top - margin.bottom;; 
var g = d3.select("#bad").append("svg").attr("width",600).attr("height",600).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var x = d3.scaleBand()
.rangeRound([0, width])
.padding(0.1)
.align(0.1);
var y = d3.scaleLinear()
.rangeRound([height, 0]);
var z = d3.scaleOrdinal()
.range(["#936c6c", "#b34d4d", "#cc3333", "#ffb3b3", "#b30000", "#ff9999","#ff3333","#f90606", "#fb6542"]);
var stack = d3.stack();
d3.csv("data.csv", type, function(error, data) {
if (error) throw error;
data.sort(function(a, b) { return b.total - a.total; });
x.domain(data.map(function(d) { return d.City; }));
y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
z.domain(data.columns.slice(1));
g.selectAll(".serie")
.data(stack.keys(data.columns.slice(1))(data))
.enter().append("g")
.attr("class", "serie")
.attr("fill", function(d) { return z(d.key); })
.selectAll("rect")
.data(function(d) { return d; })
.enter().append("rect")
.attr("x", function(d) { return x(d.data.City); })
.attr("y", function(d) { return y(d[1]); })
.attr("height", function(d) { return y(d[0]) - y(d[1]); })
.attr("width", x.bandwidth());
g.append("g")
.attr("class", "axis axis--x")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))
.append("text")
.attr("x", 240)
.attr("y", 40)
.attr("dy", "0.35em")
.style("font-size", "18px") 
.attr("text-anchor", "start")
.attr("fill", "#000")
.text("Cities in MA");;
g.append("g")
.attr("class", "axis axis--y")
.call(d3.axisLeft(y).ticks(10, "s"))
.append("text")
.attr("x", 2)
.attr("y", y(y.ticks(10).pop()))
.attr("dy", "0.35em")
.style("font-size", "18px") 
.attr("text-anchor", "start")
.attr("fill", "#000")
.text("Crimes");
var legend = g.selectAll(".legend")
.data(data.columns.slice(1).reverse())
.enter().append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
.style("font", "10px sans-serif");
legend.append("rect")
.attr("x", width - 18)
.attr("width", 18)
.attr("height", 18)
.attr("fill", z);
legend.append("text")
.attr("x", width - 24)
.attr("y", 9)
.attr("dy", ".35em")
.attr("text-anchor", "end")
.text(function(d) { return d; });
});
function type(d, i, columns) {
for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
d.total = t;
return d;
}
}