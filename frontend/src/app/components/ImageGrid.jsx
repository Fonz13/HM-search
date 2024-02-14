"use client";

import Image from "next/image";
import { blurHashToDataURL } from "../utils.js";
import { LoadIcon } from "./LoadIcon";

export function ImageGrid({ images, setCurrentImage }) {
  //TODO
  // add placehodlder images
  return (
    <div className="columns-2 gap-4 sm:columns-3 xl:columns-4 2xl:columns-5">
      {images &&
        images.map(({ article_id, prod_name }) => (
          <div
            key={article_id}
            href={`https://www2.hm.com/en_gb/productpage.${article_id}.html0`}
            className="after:content group cursor-pointer relative mb-4 block w-full after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            onClick={() => {
              setCurrentImage({ article_id, prod_name });
            }}
          >
            <Image
              alt=""
              className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
              style={{ transform: "translate3d(0, 0, 0)" }}
              //placeholder={<LoadIcon></LoadIcon>}
              //blurDataURL={blurHashToDataURL(blur)}
              src={`https://d11p8vtjlacpl4.cloudfront.net/kaggle-hm-images/${article_id.slice(
                0,
                3
              )}/${article_id}.jpg`}
              width={480}
              height={480}
              unoptimized={true}
            />
          </div>
        ))}
    </div>
  );
}
