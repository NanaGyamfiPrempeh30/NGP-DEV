import type { Metadata } from "next";
import Image from "next/image";
import { designWorks, tiktok } from "@/content/beyond";

export const metadata: Metadata = {
  title: "Beyond code",
  description: "What Yaw Nana Gyamfi Prempeh does away from the keyboard.",
};

export default function Beyond() {
  return (
    <>
      <h1>Beyond code</h1>

      <h2>Drone flying</h2>
      <p>
        I fly drones as a hobby. My videos are on TikTok: <a href={tiktok.url}>{tiktok.label}</a>
      </p>

      {designWorks.length > 0 ? (
        <>
          <h2>Graphic design</h2>
          <ul role="list" className="cards">
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
