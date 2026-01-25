import { AnimatedBackground } from "@/components/animated-background";
import { ScrollableContent } from "@/components/scrollable-content";

function Page() {
    return (
        <>
            <AnimatedBackground />
            <ScrollableContent className=" lg:w-3/4">
                {null}
            </ScrollableContent>
        </>
    );
}

export default Page;
