import TreeMap from "../../_components/ui/treemap3";
import TestG from "../../_components/customgraph";

const Treemap = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <div
                className="flex flex-col items-center justify-center md:justify-start text-center gap-y-10 flex-1 px-6 pb-4">
                    <TestG/>
            </div>
        </div>
    );
};

export default Treemap;
