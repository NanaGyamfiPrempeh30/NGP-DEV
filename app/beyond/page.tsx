import type { Metadata } from "next";
import Image from "next/image";
import { Claims } from "@/components/Claims";
import { TikTokFacade } from "@/components/TikTokFacade";
import { designWorks, droneLicence, flights, tiktokHandle } from "@/content/beyond";

export const metadata: Metadata = {
  title: "Beyond code",
  description: "Drone flying and graphic design by Yaw Nana Gyamfi Prempeh.",
};

export default function Beyond() {
  return (
    <>
      <h1>Beyond code</h1>

      <h2>Drone pilot</h2>
      <p>{droneLicence ?? "I fly as a hobbyist pilot."}</p>
      <Claims claims={[flights]} />
      <TikTokFacade handle={tiktokHandle} />

      {designWorks.length > 0 ? (
        <>
          <h2>Graphic design</h2>
          <ul className="cards">
            {designWorks.map((work) => (
              <li key={work.src}>
                <Image src={work.src} alt={work.alt} width={work.width} height={work.height} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
