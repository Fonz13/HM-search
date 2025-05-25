"use client";

export function Header({}) {
  return (
    <header className=" text-white py-4 flex justify-between items-center">
      <div>
        <p className="text-5xl font-bold">Search for H&M items</p>
      </div>
      <div className="pb-2">
        <a
          className="hover:opacity-70"
          href="https://github.com/Fonz13/HM-seach"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/github-mark-white.svg" // Replace with the actual path to your GitHub logo image
            alt="GitHub Logo"
            className="w-14 h-14"
          />
        </a>
      </div>
    </header>
  );
}
