import type { Metadata } from "next";
import { FramedShot } from "@/components/FramedShot";
import { Gallery } from "@/components/Gallery";
import { tiktok } from "@/content/beyond";
import { clientLine, getDesignWorks } from "@/lib/design";
import { getScreenshot } from "@/lib/screenshots";

export const metadata: Metadata = {
  title: "Beyond code",
  description: "What Yaw Nana Gyamfi Prempeh does away from the keyboard.",
};

export default function Beyond() {
  const tiktokShot = getScreenshot("tiktok-profile");
  const works = getDesignWorks().flatMap((work) =>
    work.width && work.height
      ? [
          {
            id: work.id,
            title: work.title,
            alt: work.alt,
            file: work.file,
            width: work.width,
            height: work.height,
            credit: `${clientLine(work)}${work.year ? `, ${work.year}` : ""}`,
            verified: work.verified,
          },
        ]
      : [],
  );

  return (
    <>
      <h1>Beyond code</h1>

      <h2>Drone flying</h2>
      <p>
        I fly drones as a hobby. My videos are on TikTok: <a href={tiktok.url}>{tiktok.label}</a>
      </p>

      {tiktokShot ? (
        <div className="drone-card">
          <FramedShot
            src={tiktokShot.file}
            alt={tiktokShot.alt}
            width={tiktokShot.width}
            height={tiktokShot.height}
            host={tiktokShot.host}
            caption={tiktokShot.caption}
          />
        </div>
      ) : null}

      {works.length > 0 ? (
        <>
          <h2>Graphic design</h2>
          <p>I draw in Adobe Illustrator. Select a picture to open it at full size.</p>
          <Gallery works={works} />
        </>
      ) : null}
    </>
  );
}
