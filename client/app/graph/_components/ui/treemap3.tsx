"use client"

import React, { useEffect, useRef } from 'react';
import { TreemapChart } from '@opd/g2plot-react'
import { useCallback } from 'react'

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

const config = {
    data: data,
    colorField: 'name',
    rectStyle : { lineWidth: 2, stroke: '#fff' },
    drilldown: {
        enabled: true,
        breadCrumb: { rootText: 'package', activeFill: '#873bf4' }
    },
    autoFit: true,

    interactions: [
        {
            type: 'treemap-drill-down',
            activeFill: '#873bf4'
        }, 
        {
            type: 'drag-move',
        },
        {
            type: 'view-zoom',
        }
    ],
    animation: {},
    
}

const TreeMap = () => {
    const getChart = useCallback((chart) => {
        console.log(chart)
    }, [])

    const getContainer = useCallback((container) => {
        console.log(container)
    }, [])

    return <TreemapChart {...config} ref={getContainer} chartRef={getChart} />
}

export default TreeMap;