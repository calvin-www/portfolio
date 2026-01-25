import { OceanBackground } from "@/components/ocean/OceanBackground";
import { LightRays } from "@/components/ocean/LightRays";
import { Bubbles } from "@/components/ocean/Bubbles";
import { FishSchool } from "@/components/ocean/FishSchool";
import { Jellyfish } from "@/components/ocean/Jellyfish";
import { Shark3D } from "@/components/ocean/Shark3D";
import { ScrollableContent } from "@/components/scrollable-content";

function Page() {
    return (
        <>
            <LightRays />
            <OceanBackground />
            <Bubbles />
            <FishSchool />
            <Jellyfish />
            <Shark3D />
            <ScrollableContent className=" lg:w-3/4">
                {null}
            </ScrollableContent>
        </>
    );
}

export default Page;
