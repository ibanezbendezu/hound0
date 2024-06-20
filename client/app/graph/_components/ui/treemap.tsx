"use client"

import React, { useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import { Chart } from '@antv/g2';

export default function Treemap() {
    const ref = useRef(null);

    useEffect(() => {
        const data = {
            name: 'root',
            children: [
                {
                    name: 'child1',
                    children: [
                    {
                        name: 'grandchild1',
                        children: [
                        { name: '1', value: 430 },
                        { name: '2', value: 530 },
                        { name: '3', value: 80 },
                        { name: '4', value: 130 },
                        ],
                    },
                    { name: 'grandchild2', value: 30 },
                    { name: 'grandchild3', value: 60 },
                    { name: 'grandchild4', value: 160 },
                    { name: 'grandchild5', value: 80 },
                    ],
                },
                {
                    name: 'child2',
                    children: [
                    { name: 'grandchild1', value: 280 },
                    { name: 'grandchild2', value: 150 },
                    { name: 'grandchild3', value: 210 },
                    { name: 'grandchild4', value: 80 },
                    {
                        name: 'grandchild5',
                        children: [
                        { name: '1', value: 122 },
                        { name: '2', value: 244 },
                        { name: '3', value: 49 },
                        { name: '4', value: 82 },
                        ],
                    },
                    { name: 'grandchild6', value: 40 },
                    ],
                },
                { name: 'child3', value: 450 },
            ],
        };

        const chart = new Chart({
            container: ReactDOM.findDOMNode(ref.current),
            width: 600,
            height: 400,
        });

        chart
        .treemap()
        .data({ value: data })
        .layout({
            tile: 'treemapBinary',
            paddingInner: 5,
        })
        .encode('value', 'value')
        .interaction({
            treemapDrillDown: {
                breadCrumbY: 12,
                activeFill: '#873bf4',
            },
        })
        .style({
            labelFill: '#000',
            labelStroke: '#fff',
            labelLineWidth: 1.5,
            labelFontSize: 14,
            labelPosition: 'top-left',
            labelDx: 5,
            labelDy: 5,
        });

        chart.render();
    }, []);

    return <div ref={ref}></div>;
}