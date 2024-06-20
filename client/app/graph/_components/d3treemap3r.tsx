"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Tree } from "./tmdata";
import * as d3 from "d3";
import { select, zoom as d3Zoom } from 'd3';

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

export const Treemap3 = ({ width, height, data }: TreemapProps) => {
    const svgSize = { width: 700, height: 500 };

    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);

    const [selectedNode, setSelectedNode] = useState<d3.HierarchyRectangularNode<Tree> | null>(null);
    const [nodeHistory, setNodeHistory] = useState<Array<d3.HierarchyRectangularNode<Tree> | null>>([]);

    const hierarchy = useMemo(() => {
        return d3.hierarchy(data).sum((d) => d.value);
    }, [data]);

    const firstLevelGroups = hierarchy?.children?.map((child) => child.data.name);
    let colorScale = d3
        .scaleOrdinal<string>()
        .domain(firstLevelGroups || [])
        .range(colors);

    const handleNodeClick = (node: d3.HierarchyRectangularNode<Tree>) => {
        if (!node.children || node.children.length === 0) {
            return;
        }
        if (selectedNode !== node) {
            setNodeHistory([...nodeHistory, selectedNode]);
            setSelectedNode(node);
        }
    };

    const handleGoBack = () => {
        const newHistory = [...nodeHistory];
        const lastNode = newHistory.pop() || null;
        setSelectedNode(lastNode);
        setNodeHistory(newHistory);
    };

    const root = useMemo(() => {
        const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
        return treeGenerator(hierarchy);
    }, [hierarchy, width, height]);

/*     const specificNode = hierarchy.find(node => node.data.name === 'controllers');
    const hierarchy2 = d3.hierarchy(specificNode?.data);

    const root2 = useMemo(() => {
        const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
        return treeGenerator(hierarchy2);
    }, [hierarchy2, width, height]);

    console.log("root")
    console.log(root);
    console.log("root2")
    console.log(root2); */

    function nodeShapes(node: d3.HierarchyRectangularNode<Tree>) {
        let nodesToRender;
        const level = node.depth;
        if (level === 0 && node.children) {
            nodesToRender = node.children;
        } else if (level > 0) {
            nodesToRender = node.leaves();
        } else {
            return null;
        }

        return nodesToRender.map((child, index) => (
            <g key={index} onClick={() => handleNodeClick(child)}>
                <rect
                    x={child.x0}
                    y={child.y0}
                    width={child.x1 - child.x0}
                    height={child.y1 - child.y0}
                    stroke="transparent"
                    fill={colorScale(child.data.name)}
                    className={"opacity-80 hover:opacity-100"}
                />
                <text
                    x={child.x0 + 5}
                    y={child.y0 + 5}
                    fontSize={12}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                    fill="white"
                    className="font-bold"
                >
                    {child.data.name}
                </text>
                <text
                    x={child.x0 + 5}
                    y={child.y0 + 20}
                    fontSize={12}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                    fill="white"
                    className="font-light"
                >
                    {child.value}
                </text>
            </g>
        ));
    }

    const x0 = 0;
    const y0 = -25;
    const x1 = width;
    const y1 = height;
    const borderRadius = 10;

    const d = `
        M ${x0 + borderRadius}, ${y0}
        H ${x1 - borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x1} ${y0 + borderRadius}
        V ${y1 - borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x1 - borderRadius} ${y1}
        H ${x0 + borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x0} ${y1 - borderRadius}
        V ${y0 + borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x0 + borderRadius} ${y0}
        Z
    `;

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
        <svg ref={svgRef} width={svgSize.width} height={svgSize.height}>
            <g ref={gRef}>
                <foreignObject>
                    <button onClick={handleGoBack} disabled={nodeHistory.length === 0}>Volver</button>
                </foreignObject>
                <path d={d} fill="#363636" stroke="#363636" />
                <text
                    x={width / 2}
                    y={-5}
                    textAnchor="middle"
                    fontSize="14"
                    fill="white"
                    className="font-bold"
                >{hierarchy.data.name}</text>
                {selectedNode ? nodeShapes(selectedNode) : nodeShapes(root)}
            </g>
        </svg>
    );
}
