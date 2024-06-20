"use client";

import {useEffect, useRef} from "react";
import * as d3 from "d3";

interface TreeNode extends d3.HierarchyNode<{
    name: string;
    children: { name: string; children: { name: string; value: number; }[]; }[];
}> {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}

/* const treeData = {
    name: "flare",
    children: [
        {
        name: "analytics",
        children: [
            {
            name: "cluster",
            children: [
                {
                name: "AgglomerativeCluster",
                children: [
                    { name: "AgglomerativeCluster", value: 3938, count: 39 }
                ]
                },
                { name: "CommunityStructure", value: 3812 }
            ]
            }
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
}; */

const treeData = {
    name: "Expenses",
    children: [
        {
            name: "Housing",
            children: [
                {name: "Rent/Mortgage", value: 1200},
                {name: "Utilities", value: 200},
                {name: "Maintenance", value: 100},
            ],
        },
        {
            name: "Food",
            children: [
                {name: "Groceries", value: 300},
                {name: "Dining Out", value: 200},
            ],
        },
        {
            name: "Transportation",
            children: [
                {name: "Car Payment", value: 250},
                {name: "Gas", value: 100},
                {name: "Public Transit", value: 75},
            ],
        },
        {
            name: "Healthcare",
            children: [
                {name: "Insurance", value: 200},
                {name: "Medications", value: 50},
            ],
        },
        {
            name: "Entertainment",
            children: [
                {name: "Streaming Services", value: 30},
                {name: "Events", value: 100},
            ],
        },
        {
            name: "Savings & Investments",
            children: [
                {name: "Retirement", value: 500},
                {name: "Other Investments", value: 300},
            ],
        },
    ],
};

const TreeMap = () => {
    const ref = useRef(null);

    useEffect(() => {
        const svg = d3.select(ref.current).attr("width", 500).attr("height", 500);

        function handleZoom(e) {
            g.attr('transform', e.transform);
        }
        
        let zoom = d3.zoom()
            .on('zoom', handleZoom);
        
        svg.call(zoom);

        const root = d3
        .hierarchy(treeData)
        .sum((d: any) => d.value)
        .sort((a, b) => (b.height - a.height) || (b.value ? b.value : 0) - (a.value ? a.value : 0)) as d3.HierarchyNode<{ name: string; children: { name: string; children: { name: string; value: number; }[]; }[]; }>;
    
        const color = d3.scaleOrdinal(d3.schemeCategory10); // Add color scale

        d3.treemap()
            .tile(d3.treemapResquarify)
            .size([500, 500])
            .round(true)
            .paddingInner(1)(root as d3.HierarchyNode<unknown>);

        const g = svg.append("g");

        const cell = g
            .selectAll(".node")
            .data(root.leaves() as TreeNode[])
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")");

        cell
            .append("rect")
            .attr("id", (d) => d.data.name)
            .attr("width", (d) => (d as any).x1 - (d as any).x0)
            .attr("height", (d) => (d as any).y1 - (d as any).y0)
            .attr("fill", (d) => color(d.data.name)); // Use color scale to set fill color

        cell
            .append("text")
            .attr("class", "label")
            .attr("x", 5)
            .attr("y", 20)
            .text((d) => d.data.name);

    }, []);

    return (
        <div>
            <svg ref={ref}></svg>
        </div>
    );
};

export default TreeMap;