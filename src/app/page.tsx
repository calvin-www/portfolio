import { OceanBackground } from "@/components/ocean/OceanBackground";
import { ScrollableContent } from "@/components/scrollable-content";

function Page() {
    return (
        <>
            <OceanBackground />
            <ScrollableContent className=" lg:w-3/4">
                {null}
            </ScrollableContent>
        </>
    );
}

export default Page;
