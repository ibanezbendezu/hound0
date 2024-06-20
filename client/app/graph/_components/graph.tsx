import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import { select, zoom as d3Zoom, zoomIdentity, drag as d3Drag } from 'd3';
import { Treemap3 } from "../_components/d3treemap3test";
import { data3 } from "../_components/tmdata3";
import ReactDOM from 'react-dom';

type Node = { id: string } & Partial<SimulationNodeDatum>;
type Link = { source: string, target: string };

type Props = {
  width: number;
  height: number;
  data: { nodes: Array<{ id: string }>, links: Array<{ source: string, target: string }> };
};

const Graph: React.FC<Props> = ({ width, height, data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      let g: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select('g');

      if (g.empty()) {
        g = svg.append('g');
      }

      const zoom = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform); // Aplica zoom al grupo
      });
      
      const simulation = d3.forceSimulation(data.nodes as SimulationNodeDatum[])
        .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(250))
        .force("charge", d3.forceManyBody().strength(-250))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = g.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .join("line");

        /* const node = svg.append("g")
        .selectAll("g")
        .data(data.nodes)
        .join("g")
        .each(function(d, i) {
          const treemap = <Treemap3 height={200} width={300} data={data3} />;
          ReactDOM.render(treemap, d3.select(this).node());
        }); */

        const node = g.append("g")
        .selectAll("g.node")
        .data(data.nodes)
        .join("g")
        .attr("class", "node");

        node.each(function(d, i) {   
          const offsetX = 20;
          const offsetY = 10;
        
          const x = (d: any) => d.x - offsetX;
          const y = (d: any) => d.y - offsetY;
          
          const treemapContainer = d3.select(this)
            .append('foreignObject')
            .attr('width', 100)
            .attr('height', 50)
            .attr('x', x)
            .attr('y', y)
            .node() as Element;
        
            const treemap = <Treemap3 height={200} width={300} data={data3} />;
            const container = d3.select(this).node() as Element;
            ReactDOM.render(treemap, treemapContainer);
        });

        /* node.append("circle")
        .attr("r", 50)
        .attr("fill", "#000"); */

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);
      
        node
          .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
        });

      svg.call(zoom);
      
    }
  }, [width, height, data]);

  return <svg ref={ref} viewBox="0 0 1000 450"/>;
};

export default Graph;