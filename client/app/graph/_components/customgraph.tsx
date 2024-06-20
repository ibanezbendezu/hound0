"use client"

import React, { useState, useRef } from 'react';
import { Canvas, Circle } from '@antv/react-g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const TestG6 = () => {
    const circleRef = useRef(null);
    const [size, setSize] = useState(50);
    return (
        <Canvas width={600} height={400} renderer="svg">
            <Circle
                ref={circleRef}
                x={100}
                y={200}
                r={size}
                fill="#1890FF"
                stroke="#F04864"
                lineWidth={4}
                onClick={() => {
                    setSize(100);
                }}
            />
        </Canvas>
    );
};

export default TestG6;