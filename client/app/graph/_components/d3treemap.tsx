"use client";

import { useMemo, useRef, useEffect } from "react";
import { Tree } from "./tmdata";
import * as d3 from "d3";
import { select, zoom as d3Zoom, zoomIdentity, Selection, BaseType, ZoomTransform } from "d3";


type TreemapProps = {
    width: number;
    height: number;
    data: Tree;
};

const colors = [
    "#e0ac2b",
    "#6689c6",
    "#a4c969",
    "#e85252",
    "#9a6fb0",
    "#a53253",
    "#7f7f7f",
];

export const Treemap = ({ width, height, data }: TreemapProps) => {

    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);

    const hierarchy = useMemo(() => {
        return d3.hierarchy(data).sum((d) => d.value);
    }, [data]);

    // List of item of level 1 (just under root) & related color scale
    const firstLevelGroups = hierarchy?.children?.map((child) => child.data.name);
    let colorScale = d3
        .scaleOrdinal<string>()
        .domain(firstLevelGroups || [])
        .range(colors);

    const root = useMemo(() => {
        const treeGenerator = d3.treemap<Tree>().size([500, 300]).padding(4);
        return treeGenerator(hierarchy);
    }, [hierarchy, width, height]);

    const allShapes = root.leaves().map((leaf, index) => {
        const parentName = leaf.parent?.data.name;
        const fillColor = parentName ? colorScale(parentName) : "#000000"; // default color if parentName is undefined
        return (
            <g key={index}>
                <rect
                    x={leaf.x0}
                    y={leaf.y0}
                    width={leaf.x1 - leaf.x0}
                    height={leaf.y1 - leaf.y0}
                    stroke="transparent"
                    fill={fillColor}
                    className={"opacity-80 hover:opacity-100"}
                    
                />
                <text
                    x={leaf.x0 + 3}
                    y={leaf.y0 + 3}
                    fontSize={12}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                    fill="white"
                    className="font-bold"
                >
                    {leaf.data.name}
                </text>
                <text
                    x={leaf.x0 + 3}
                    y={leaf.y0 + 18}
                    fontSize={12}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                    fill="white"
                    className="font-light"
                >
                    {leaf.data.value}
                </text>
            </g>
        );
    });

    useEffect(() => {
        if (svgRef.current && gRef.current) {
            const svg = select(svgRef.current);
            const g = select(gRef.current);
            const zoom = d3Zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
            svg.call(zoom);
        }
    }, []);

    return (
            <svg ref={svgRef} width={width} height={height}>
                <g ref={gRef}>{allShapes}</g>
            </svg>
    );
}
