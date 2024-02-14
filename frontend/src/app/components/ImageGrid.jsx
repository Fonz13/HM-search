"use client";

import Image from "next/image";
import { blurHashToDataURL } from "../utils.js";
import { LoadIcon } from "./LoadIcon";

export function ImageGrid({
  images,
  setCurrentImage,
  currentImage,
  setImageBucket,
  imageBucket,
}) {
  //TODO

  /*
  * create a blurhash image
  * get the blurhash from https://blurha.sh/

  console.log(
    blurHashToDataURL(
      "U68D^SxtM{oJ9F9ZNG%L%2IVof-p~pt7IUM{"
      //"A08D^S~q0000"
    )
  );

  * <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
  * old = <div className="columns-2 gap-4 sm:columns-3 xl:columns-4 2xl:columns-5">

  */

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {images &&
        images.map(({ article_id, prod_name }) => (
          <div
            key={article_id}
            href={`https://www2.hm.com/en_gb/productpage.${article_id}.html0`}
            className="after:content group cursor-pointer relative mb-4 block w-full after:pointer-events-none after:absolute after:inset-0 after:rounded-lg "
          >
            {!currentImage && (
              <div className="absolute top-2  right-2  flex items-center justify-center">
                <button
                  onClick={() => setImageBucket([...imageBucket, article_id])}
                  className="z-10 rounded-full  bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 active:bg-green-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-10 w-10"
                    style={{ transform: "rotate(45deg)" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
            <Image
              alt=""
              className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
              style={{ transform: "translate3d(0, 0, 0)" }}
              placeholder={"blur"}
              blurDataURL={
                "data:image/png;base64,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"
              }
              onClick={() => {
                setCurrentImage({ article_id, prod_name });
              }}
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
