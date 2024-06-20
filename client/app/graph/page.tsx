"use client"

import Graph from "../graph/_components/graph2";
import { data } from "../graph/_components/graphdata";

const GraphPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <Graph width={1300} height={510} data={data} />
        </div>
    );
};

export default GraphPage;
