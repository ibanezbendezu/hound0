"use client"

import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import g6, { Graph } from "@antv/g6";
import {
    Rect,
    Text,
    Circle,
    Image,
    Group,
    createNodeFromReact
} from "@antv/g6-react-node";

const card = ({ cfg }) => {
    const { collapsed = false } = cfg;
    console.log(cfg, "cfg");
    return (
        <Group draggable>
            <Rect>
                <Text
                    style={{
                        width: 80,
                        fill: "#000",
                        margin: [0, 0],
                        fontSize: "16", // fix: change the value to a string
                        fontWeight: "bold",
                    }}
                >
                    grupo
                </Text>
            </Rect>
        </Group>
    );
};
g6.registerNode("test", createNodeFromReact(card));


const data = {
    nodes: [
        {
            id: 'node1',
            x: 100,
            y: 200,
        },
        {
            id: 'node2',
            x: 300,
            y: 200,
        },
    ],
    edges: [
        {
            source: 'node1',
            target: 'node2',
        },
    ],
};


export default function Test2() {
    const ref = useRef(null);

    let graph: Graph | null = null;

    useEffect(() => {
        if (!graph) {
            graph = new g6.Graph({
                container: ReactDOM.findDOMNode(ref.current),
                width: window.innerWidth,
                height: 500,
                fitCenter: true,
                modes: {
                    default: ["drag-node", "drag-canvas", "zoom-canvas", "click-select"]
                  },
            });
        }

        graph.data(data);
        graph.render();
    }, []);

    return <div ref={ref}></div>;
}
