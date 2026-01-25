"use client";

import { OceanBackground } from "@/components/ocean/OceanBackground";
import { LightRays } from "@/components/ocean/LightRays";
import { Bubbles } from "@/components/ocean/Bubbles";
import { FishSchool } from "@/components/ocean/FishSchool";
import { Jellyfish } from "@/components/ocean/Jellyfish";
import { Shark3D } from "@/components/ocean/Shark3D";
import { Shark2D } from "@/components/ocean/Shark2D";
import { ScrollableContent } from "@/components/scrollable-content";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";

function Page() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <LightRays />
            <OceanBackground />
            <Bubbles />
            <FishSchool />
            <Jellyfish />
            {mounted && (isDesktop ? <Shark3D /> : <Shark2D />)}
            <ScrollableContent className=" lg:w-3/4">
                {null}
            </ScrollableContent>
        </>
    );
}

export default Page;
