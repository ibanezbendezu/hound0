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

const data = {
    nodes: [
    {
        id: 'node1',
        x: 250,
        y: 150,
        comboId: 'combo',
    },
    {
        id: 'node2',
        x: 350,
        y: 150,
        comboId: 'combo',
    },
    {
        id: 'node3',
        x: 250,
        y: 300,
        comboId: 'combo2',
    },
    {
        id: 'node4',
        x: 450,
        y: 300,
        comboId: 'combo2',
    },
    ],
    combos: [
    {
        id: 'combo',
        label: 'ibanezbendezu/tingeso-ev1',
    },
    {
        id: 'combo2',
        label: 'holYadio/TingesoPEP1',
    },
    ],
};


export default function Test() {
    const ref = useRef(null);

    let graph: Graph | null = null;

    useEffect(() => {
        if (!graph) {
            graph = new g6.Graph({
                container: ReactDOM.findDOMNode(ref.current),
                width: window.innerWidth,
                height: 500,
                fitCenter: true,
                groupByTypes: false,
                modes: {
                    default: ['drag-canvas', 'drag-node', 'drag-combo', 'collapse-expand-combo', 'zoom-canvas', 'click-select'],
                },

                defaultCombo: {
                    type: 'rect',
                    /* The minimum size of the combo. combo 最小大小 */
                    size: [75, 75],
                    /* style for the keyShape */
                    style: {
                        lineWidth: 1,
                        radius: 7,
                    },
                    labelCfg: {
                    /* label's offset to the keyShape */
                    refY: 10,
                    /* label's position, options: center, top, bottom, left, right */
                    position: 'top',
                    /* label's style */
                    style: {
                        fontSize: 10,
                    },
                    },
                },
                  /* styles for different states, there are built-in styles for states: active, inactive, selected, highlight, disable */
                  /* you can extend it or override it as you want */
                comboStateStyles: {
                    active: {
                        fill: '#f00',
                        opacity: 0.5
                    },
                    disable: {
                        fill: '#ccc',
                        opacity: 0.5
                    },
                },
            });
        }

        graph.data(data);
        graph.render();
    }, []);

    return <div ref={ref}></div>;
}
