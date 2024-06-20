"use client";

import {useEffect, useRef} from "react";
import * as d3 from "d3";

const DrillDownTreeMap = () => {
    // Ref to the SVG element
    const svgRef = useRef<SVGSVGElement>(null);

    // Data
    const treeData = {
        name: "flare",
        children: [
            {
                name: "analytics",
                children: [
                    {
                        name: "cluster",
                        children: [
                            {name: "AgglomerativeCluster", value: 3938, count: 39}
                        ]
                    },
                    {name: "CommunityStructure", value: 3812}
                ]
            },
            {
                name: "animate",
                children: [
                    {
                        name: "Easing",
                        children: [
                            {
                                name: "Easing",
                                value: 17010
                            }
                        ]
                    }
                ]
            }
        ]
    };

    useEffect(() => {

        // I want to make a zoomable treemap: click on any cell to zoom in or on the top to zoom out. Based on andyc's implementation https://codepen.io/nite/pen/MWgrMMR
        
        let palette = [
            '#f7fcf0','#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081'
        ].reverse();;

        const width = 100;
        const height = 100;

        const x = d3.scaleLinear().domain([0, width]).range([0, width]);
        const y = d3.scaleLinear().domain([0, height]).range([0, height]);

        let treemap = d3.treemap().size([width, height]).padding(1);

        const color = d3.scaleOrdinal()
		.range(palette
			.map(function(c) { 
				c = d3.rgb(c); 
				//c.opacity = 0.5; 
				return c; 
			})
		);

        treemap = d3.treemap()
            .size([width, height])
            .paddingInner(0)
            .round(false);

        const data = treeData;

        const nodes = d3.hierarchy(data)
        .sum(d => { return d.value ? 1 : 0; }), currentDepth;
        
        treemap(nodes);

        const chart = d3.select("#chart");

        const cells = chart.selectAll("g")
        .data(nodes.descendants())
        .enter()
        .append("div")
    	.attr("class", d => { return `node level-${d.depth}`; })
	    .attr("title", d => { return d.data.name ? d.data.name : "null"; });

        cells
        .style("left", d => { return `${x(d.x0)}%`; })
        .style("top", d => { return `${y(d.y0)}%`; })
        .style("width", d => { return `${x(d.x1) - x(d.x0)}%`; })
        .style("height", d => { return `${y(d.y1) - y(d.y0)}%`; })
        // .style("background-image", function(d) { return d.value ? imgUrl + d.value : ""; })
        // .style("background-image", function(d) { return d.value ? "url(http://placekitten.com/g/300/300)" : "none"; }) 
        .style("background-color", d => { while (d.depth > 2) d = d.parent; return color(d.data.name); })
        .on("click", zoom)
        .append("p")
        .attr("class", "label")
        .text(d => { return d.data.name ? d.data.name : "---"; });
        //.style("font-size", "")
        //.style("opacity", function(d) { return isOverflowed( d.parent ) ? 1 : 0; });

        const parent = d3.select(".up")
        .datum(nodes)
        .on("click", zoom);

        function zoom(d) { // http://jsfiddle.net/ramnathv/amszcymq/

        console.log(`clicked: ${d.data.name}, depth: ${d.depth}`);

        currentDepth = d.depth;
        parent.datum(d.parent || nodes);

        x.domain([d.x0, d.x1]);
        y.domain([d.y0, d.y1]);

        const t = d3.transition()
            .duration(800)
            .ease(d3.easeCubicOut);

        cells
            .transition(t)
            .style("left", d => { return `${x(d.x0)}%`; })
            .style("top", d => { return `${y(d.y0)}%`; })
            .style("width", d => { return `${x(d.x1) - x(d.x0)}%`; })
            .style("height", d => { return `${y(d.y1) - y(d.y0)}%`; });

        cells // hide this depth and above
            .filter(d => { return d.ancestors(); })
            .classed("hide", d => d.children ? true : false );

        cells // show this depth + 1 and below
            .filter(d => { return d.depth > currentDepth; })
            .classed("hide", false);
        }

    }, []);

    return (
        <svg ref={svgRef} />
    );
}

export default DrillDownTreeMap;