import { useRef, useEffect } from "react";
import { select, zoom as d3Zoom, zoomIdentity, drag as d3Drag } from 'd3';
import { Treemap3 } from "../_components/d3treemap3test";
import { data3 } from "..//_components/tmdata3";
import ReactDOM from 'react-dom';
import React from 'react';

export const Treemaps = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef0 = useRef<SVGGElement>(null);
    const gRefs = useRef<{ [key: string]: SVGGElement | null }>({});

    const data = ['repo1'];    

    data.forEach((d, i) => {
        gRefs.current[i] = null;
    });

    useEffect(() => {
        if (svgRef.current) {
            const svg = select(svgRef.current);
            const g0 = select(gRef0.current);
    
            const svgWidth = 1000; // Ancho del SVG
            const svgHeight = 600; // Altura del SVG
            const treemapWidth = 400; // Ancho del treemap
            const treemapHeight = 200; // Altura del treemap
    
            data.forEach((d, i) => {
                const g = select(gRefs.current[i]);
    
                const x = (i % 3) * (treemapWidth + 10);
                const y = Math.floor(i / 3) * (treemapHeight + 10);
    
                const treemap3WithRef = React.cloneElement(<Treemap3 height={treemapHeight} width={treemapWidth} data={data3} />, { ref: gRefs.current[i] });
                ReactDOM.render(treemap3WithRef, g.node());
    
                g.attr('transform', `translate(${x}, ${y})`);


                /* const drag = d3Drag<SVGGElement, unknown>()
                    .on("start", (event) => {
                        event.sourceEvent.stopPropagation();
                    })
                    .on("drag", (event) => {
                        g.attr("transform", `translate(${event.x}, ${event.y})`);
                    });
                g.call(drag); */
            });

            /* const zoom = d3Zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 5])
                .on('zoom', (event) => {
                    svg.selectAll('g').attr('transform', event.transform);
                });

            svg.call(zoom).call(zoom.transform, zoomIdentity); */
    
            const zoom = d3Zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
                g0.attr("transform", event.transform);
            });
            svg.call(zoom);
        }
    }, [data]);
    

    return (
        <svg ref={svgRef} viewBox="0 0 1000 600">
            <g ref={gRef0}>
                {data.map((d, i) => (
                    <g key={i} ref={(ref) => (gRefs.current[i] = ref)} />
                ))}
            </g>
        </svg>
    );
}
