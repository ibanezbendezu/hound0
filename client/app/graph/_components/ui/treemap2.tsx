"use client"

import React, { useEffect, useRef } from 'react';
import { Treemap } from '@antv/g2plot';

import { TreemapChart } from '@opd/g2plot-react'


const TreeMapComponent = ({ treemapData }: { treemapData: any }) => {
    const ref = useRef(null);

    useEffect(() => {
        const treemapPlot = new Treemap(ref.current, {
        data: treemapData,
        colorField: 'name',
        legend: {
            position: 'top-left',
        },
        tooltip: {
            formatter: (v) => {
                const root = v.path[v.path.length - 1];
                return {
                    name: v.name,
                    value: `${v.value}(总占比${((v.value / root.value) * 100).toFixed(2)}%)`,
                };
            },
        },
        // use `drilldown: { enabled: true }` to
        // replace `interactions: [{ type: 'treemap-drill-down' }]`
        interactions: [{ type: 'treemap-drill-down' }],
        // drilldown: {
        //   enabled: true,
        //   breadCrumb: {
        //     rootText: '初始',
        //   },
        // },
        // 开启动画
        animation: {},
        });

        treemapPlot.render();
    }, [treemapData]);

    return <div ref={ref}></div>;
};

export default TreeMapComponent;