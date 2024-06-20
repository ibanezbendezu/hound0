"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Tree, findNode } from "./tmdata3";
import * as d3 from "d3";
import { select, zoom as d3Zoom } from 'd3';
import { scaleLinear } from 'd3-scale';


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

    const colorScale = scaleLinear<string>()
    .domain([0, 100]) // Define el rango de valores
    .range(["#2E9335", "#B82318"]); // Define el rango de colores


    const [selectedNode, setSelectedNode] = useState<Tree | null>(null);
    const [nodeHistory, setNodeHistory] = useState<Array<Tree | null >>([]);

    const handleNodeClick = (node: d3.HierarchyRectangularNode<Tree>) => {
        if (!node.children || node.children.length === 0) {
            return;
        }
        const selectedNode = findNode(data, node.data.name);
        setNodeHistory([...nodeHistory, selectedNode]);
        setSelectedNode(selectedNode);
    };

    const handleGoBack = () => {
        const newHistory = [...nodeHistory];
        const lastNode = newHistory.pop() || null;
        setSelectedNode(lastNode);
        setNodeHistory(newHistory);
    };

    function root(data: Tree) {
        const hierarchy = useMemo(() => {
            const root = d3.hierarchy(data)
                .sum((d) => d.value)
                .eachAfter(node => {
                    if (node.children) {
                        const totalFever = node.children.reduce((acc, child) => acc + child.data.fever, 0);
                        const averageFever = node.children.length > 0 ? totalFever / node.children.length : 0;
                        node.data.fever = averageFever; 
                    }
                });
            return root;
        }, [data]);
    
        const r = useMemo(() => {
            const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
            return treeGenerator(hierarchy);
        }, [hierarchy, width, height]);
    
        return r;
    }

    function nodeShapes(node: Tree) {
        const tree = root(node);

        let nodesToRender;
        const level = tree.depth;
        if (level === 0 && tree.children) {
            nodesToRender = tree.children;
        } else if (level > 0) {
            nodesToRender = tree.leaves();
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
                    fill={colorScale(child.data.fever)}
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
                <path d={d} fill="#363636" stroke="#363636" />
                <text
                    x={width / 2}
                    y={-5}
                    textAnchor="middle"
                    fontSize="14"
                    fill="white"
                    className="font-bold"
                >
                    {data.name}
                </text>

                {selectedNode ? nodeShapes(selectedNode) : nodeShapes(data)}

                <text
                    x={10}
                    y={-15}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                    fontSize="12"
                    className="font-bold"
                    fill="white"
                    onClick={handleGoBack}
                    style={{ cursor: 'pointer' }}
                >
                    {selectedNode ? "volver" : ''}
                </text>
            </g>
        </svg>
    );
}
