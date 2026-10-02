"use client";

import Image from "next/image";

// Deterministic PRNG so server and client render identical markup.
function seeded(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const COLUMN_COUNT = 4;

const HEIGHTS = ["gallery-tile-sm", "gallery-tile-md", "gallery-tile-lg"];

type Tile = {
  src: string;
  height: string;
  offset: number;
};

function buildColumns(images: string[], columnCount: number): Tile[][] {
  const columns: Tile[][] = Array.from({ length: columnCount }, () => []);

  images.forEach((src, index) => {
    const column = columns[index % columnCount];
    const roll = seeded(index, 1);
    // Bias toward the medium tile so the collage stays balanced.
    const sizeIndex = roll > 0.72 ? 2 : roll < 0.32 ? 0 : 1;

    column.push({
      src,
      height: HEIGHTS[sizeIndex],
      offset: Math.round(seeded(index, 2) * 18),
    });
  });

  return columns;
}

export function GalleryMarquee({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  const columns = buildColumns(images, COLUMN_COUNT);

  return (
    <div
      className="gallery-marquee"
      aria-label="ADIKARA 2026 gallery"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div
        className="gallery-lanes"
        style={{ "--gallery-columns": columns.length } as React.CSSProperties}
      >
        {columns.map((column, columnIndex) => (
          <div className="gallery-lane" key={columnIndex}>
            <div
              className="gallery-lane-track"
              style={
                {
                  "--gallery-duration": `${38 + columnIndex * 9}s`,
                  "--gallery-delay": `${-columnIndex * 5}s`,
                } as React.CSSProperties
              }
            >
              {[0, 1].map((copy) => (
                <div
                  aria-hidden={copy === 1 ? "true" : undefined}
                  className="gallery-lane-set"
                  key={copy}
                >
                  {column.map((tile, tileIndex) => (
                    <div
                      className={`gallery-tile ${tile.height}`}
                      key={`${tile.src}-${tileIndex}`}
                      style={{ marginTop: tile.offset ? `${tile.offset}px` : 0 }}
                    >
                      <Image
                        alt={
                          copy === 0
                            ? `ADIKARA 2026 activity photo ${tileIndex + 1}`
                            : ""
                        }
                        draggable={false}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                        src={tile.src}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}