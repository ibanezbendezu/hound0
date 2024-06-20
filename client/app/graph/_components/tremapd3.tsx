"use client"

import React, {Component} from 'react';
import {format as d3format} from 'd3-format';
import {scaleLinear} from 'd3-scale';
import {hierarchy, treemap} from 'd3-hierarchy';
import styled from 'styled-components';
import {select} from "d3-selection";
import {sum} from 'd3-array';

const StyledSVG = styled.svg`
background: #ddd;

text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
}

rect {
  fill: none;
  stroke: #fff;
}

rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

.grandparent rect {
  fill: orange;
}

.grandparent:hover rect {
  fill: #ee9700;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: .5;
}

.children:hover rect.child {
  fill: #bbb;
}
`;

class Rect extends Component {
	shouldComponentUpdate({x, y, width, height}) {
		select(this.el)
			.transition()
			.duration(800)
			.attr("x", x)
			.attr("y", y)
			.attr("width", width)
			.attr("height", height);
		return false;
	}

	render() {
		const {children, ...rest} = this.props;
		return <rect {...rest} ref={el => this.el = el}>{children}</rect>
	}
}

class Text extends Component {
	shouldComponentUpdate({x, y}) {
		select(this.el)
			.transition()
			.duration(800)
			.attr("x", x)
			.attr("y", y);
		return false;
	}

	render() {
		const {children, ...rest} = this.props;
		return <text {...rest} ref={el => this.el = el}>{children}</text>
	}
}

export class ZoomableTreemap extends Component {
	constructor({margin, format, width = 960, height = 500, x, y, currentNode, data}) {
		super();
		this.margin = {top: 20, right: 0, bottom: 0, left: 0, ...margin};
		this.format = format || d3format(",d");

		this.x = x || scaleLinear();
		this.y = y || scaleLinear();
		this.x
			.domain([0, width])
			.range([0, width]);
		this.y
			.domain([0, height])
			.range([0, height]);

		const root = hierarchy(data, d => d.values)
			.ancestors(d => {
				console.log(d.children);
				const total = d.children.reduce((o, n) => n.value.total + o, 0),
					capacity = d.children.reduce((o, n) => n.value.capacity + o, 0);
				d = {
					...d,
					total,
					capacity,
					value: capacity / total
				}
			})
			.sort((a, b) => a.value - b.value);
		this.state = {
			transitioningChildren: undefined,
			d: currentNode || root
		};
		this.treemap = treemap(undefined, (d, depth) => depth ? null : d.values)
			.size([width, height])
			// .paddingInner(1)
			.round(false);
		this.treemap(this.state.d);
	}


	transition = (d) => {
		if (this.state.transitioningChildren) clearTimeout(this.timeOut);
		// let el = select(this.el);

		// Update the domain only after entering new elements.
		this.setState({
			transitioningChildren: this.state.d.children,
			d: d || this.state.d
		}, () => {
			this.x.domain([d.x0, d.x1]);
			this.y.domain([d.y0, d.y1]);
			this.forceUpdate(() =>
				this.timeOut = setTimeout(() =>
						this.setState({transitioningChildren: undefined})
					, 850)
			);
		});

		// Fade-in entering text.
		// g2.selectAll("text").style("fill-opacity", 0);

		// Transition to the new view.
		// t1.selectAll("text").call(text).style("fill-opacity", 0);
		// t2.selectAll("text").call(text).style("fill-opacity", 1);
	}

	text({Comp = Text, d, children, ...rest}) {
		return <Comp
			x={this.x(d.x0) + 6}
			y={this.y(d.y0) + 6}
			{...rest}>
			{children}
		</Comp>;
	}

	rect = ({Comp = Rect, d, children, ...rest}) => {
		return <Comp
			x={this.x(d.x0)}
			y={this.y(d.y0)}
			width={this.x(d.x1) - this.x(d.x0)}
			height={this.y(d.y1) - this.y(d.y0)}
			key={this.key(d)}
			{...rest}>
			{children}
		</Comp>;
	}

	key = (d) => {
		return d.parent
			? this.key(d.parent) + "." + d.data.key
			: d.data.key;
	}

	child = (d) => <g key={this.key(d)} className={d.children && 'children'}
	                  onClick={() => d.children && this.transition(d)}>
		{(d.children || [d]).map(d =>
			this.rect({d, className: 'child'})
		)}
		{this.rect({d, className: 'parent', children: <title>{this.format(d.value)}</title>})}
		{this.text({d, dy: '.75em', children: d.data.key})}
	</g>;

	render() {
		const {width = 960, height = 500} = this.props;
		const {margin, child} = this;
		const {d, transitioningChildren} = this.state;

		console.log(d);

		const svgProps = {
			width: width + margin.left + margin.right,
			height: height + margin.bottom + margin.top,
			style: {
				marginLeft: -margin.left + "px",
				marginRight: -margin.right + "px"
			}
		};
		const gProps = {
			transform: "translate(" + margin.left + "," + margin.top + ")",
			style: {
				shapeRendering: transitioningChildren && 'crispEdges'
			}
		};

		return (
			<StyledSVG {...svgProps}>
				<g {...gProps}>
					<g className={'depth'}>
						{transitioningChildren && transitioningChildren.map(child)}
						{d.children.map(child)}
					</g>
					<g className={'grandparent'} onClick={() => d.parent && this.transition(d.parent)}>
						{this.rect({d, y: -margin.top, width, height: margin.top, Comp: 'rect'})}
						{this.text({d, x: 6, y: 6 - margin.top, dy: '.75em', children: this.key(d), Comp: 'text'})}
					</g>
				</g>
			</StyledSVG>
		)
	}
}