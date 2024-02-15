"use client";

export function Header({}) {
  return (
    <header className=" text-white p-4 flex justify-between items-center">
      <div>
        <p className="text-lg font-bold">Search from over 100k H&M items</p>
      </div>
      <div>
        <a
          href="https://github.com/your-github-username"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/github-mark-white.svg" // Replace with the actual path to your GitHub logo image
            alt="GitHub Logo"
            className="w-10 h-10"
          />
        </a>
      </div>
    </header>
  );
}
