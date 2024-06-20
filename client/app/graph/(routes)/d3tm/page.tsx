"use client"

import { Treemaps } from "../../_components/d3treemaps";
import { Treemap3 } from "../../_components/d3treemap3f";
import { data3 } from "../../_components/tmdata3";

const TreemapPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <div
                className="flex flex-col items-center justify-center md:justify-start text-center gap-y-10 flex-1 px-6 pb-4">
                    {/* <Treemaps/> */}
                    <Treemap3 width={1300} height={510} data={data3} />
            </div>
        </div>
    );
};

export default TreemapPage;
