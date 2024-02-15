"use client";
import Image from "next/image";

export function SearchBar({ search, imageBucket, setImageBucket }) {
  return (
    <div className="flex">
      <div className="flex-auto px-2">
        <div className="relative mb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const text = formData.get("text");
              //search only by text
              search(text, []);
            }}
            className="relative mb-2"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              name="text"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for images..."
              autoComplete="off"
              required
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search by text
            </button>
          </form>
          <div
            className="grid gap-2 flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
            style={{
              gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
              sm: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
              xl: { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
              "2xl": { gridTemplateColumns: "repeat(5, minmax(0, 1fr))" },
            }}
          >
            {imageBucket.map((article_id, index) => (
              <div
                key={article_id + index}
                onClick={() => {
                  const tempBucket = [...imageBucket];
                  tempBucket.splice(index, 1);
                  setImageBucket(tempBucket);
                }}
                className="after:content group cursor-pointer relative mb-4 block w-full after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              >
                <Image
                  alt=""
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-50"
                  style={{
                    transform: "translate3d(0, 0, 0)",
                  }}
                  src={`https://d11p8vtjlacpl4.cloudfront.net/kaggle-hm-images/${article_id.slice(
                    0,
                    3
                  )}/${article_id}.jpg`}
                  width={480}
                  height={480}
                  unoptimized={true}
                />
                <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                  <div className="z-10  p-2 h-full w-full  rounded-lg  backdrop-blur-lg transition opacity-0 hover:opacity-100 active:bg-red-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-full w-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {imageBucket.length > 0 && (
            <button
              onClick={() => {
                //search only by images
                search("", imageBucket);
              }}
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search by Images
            </button>
          )}
        </div>
      </div>
      <div className="flex-none pb-2 space-x-2">
        <button
          onClick={() => {
            //search by both
            if (
              document.getElementById("default-search").value !== "" ||
              imageBucket.length > 0
            ) {
              search(
                document.getElementById("default-search").value,
                imageBucket
              );
            }
          }}
          className=" text-white h-full bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search by Both
        </button>
        <button
          onClick={() => {
            //search by both

            document.getElementById("default-search").value = "";
            setImageBucket([]);
          }}
          className=" text-white h-full bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
