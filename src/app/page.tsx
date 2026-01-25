import { OceanBackground } from "@/components/ocean/OceanBackground";
import { Bubbles } from "@/components/ocean/Bubbles";
import { FishSchool } from "@/components/ocean/FishSchool";
import { ScrollableContent } from "@/components/scrollable-content";

function Page() {
    return (
        <>
            <OceanBackground />
            <Bubbles />
            <FishSchool />
            <ScrollableContent className=" lg:w-3/4">
                {null}
            </ScrollableContent>
        </>
    );
}

export default Page;
