"use client"

import react, { useRef, useEffect } from "react";
import reactdom from "react-dom";
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
            id: '0',
            comboId: 'a',
        },
        {
            id: '1',
            comboId: 'a',
        },
        {
            id: '2',
            comboId: 'a',
        },
        {
            id: '3',
            comboId: 'b',
        },
        {
            id: '4',
            comboId: 'b',
        },
        {
            id: '5',
            comboId: 'b',
        }
    ],
    edges: [
        {
            source: 'a',
            target: 'b',
            label: 'combo a - combo b',
            size: 3,
            labelCfg: {
                autoRotate: true,
                style: {
                    stroke: '#fff',
                    lineWidth: 5,
                    fontSize: 20,
                },
            },
            style: {
                stroke: 'red',
            },
        },
        {
            source: '0',
            target: '3',
        },
        {
            source: '1',
            target: '4',
        },
        {
            source: '2',
            target: '5',
        },
    ],

    combos: [
        {
            id: 'a',
            label: 'combo a',
        },
        {
            id: 'b',
            label: 'combo b',
        },
    ],
};


export default function Force() {
    const ref = useRef(null);

    let graph: Graph | null = null;

    useEffect(() => {
        if (!graph) {
            graph = new g6.Graph({
                container: reactdom.findDOMNode(ref.current),
                width: 600,
                height: 800,
                fitView: true,
                fitViewPadding: 50,
                minZoom: 0.00000001,
                layout: {
                    type: 'comboForce',
                    nodeSpacing: (d: any) => 8,
                },
                defaultNode: {
                    size: 15,
                    color: '#5B8FF9',
                    style: {
                    lineWidth: 2,
                    fill: '#C6E5FF',
                    },
                },
                defaultEdge: {
                    size: 2,
                    color: '#e2e2e2',
                },
                defaultCombo: {
                    type: 'rect',
                    /* The minimum size of the combo. combo 最小大小 */
                    size: [50, 50],
                    /* style for the keyShape */
                    // style: {
                    //   lineWidth: 1,
                    // },
                    labelCfg: {
                      /* label's offset to the keyShape */
                      // refY: 10,
                      /* label's position, options: center, top, bottom, left, right */
                      position: 'top',
                      /* label's style */
                      // style: {
                      //   fontSize: 18,
                      // },
                    },
                },
                modes: {
                    default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas'],
                },
            });
        }
        graph.data(data);
        graph.render();
        graph.on("node:click", function (evt) {
            console.log(evt, "evt");
        });
    }, []);

    return <div ref={ref}></div>;
}
