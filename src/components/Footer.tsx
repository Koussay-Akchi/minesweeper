import { FC, memo } from "react";

const Footer: FC = memo(() => (
  <div className="relative bg-neutral-900 px-1 pb-3 pt-3 sm:px-8 sm:pb-4 sm:pt-4">
    <div className="flex flex-col items-center gap-y-2">
    <div className=" text-neutral-500">
        Made from scratch with React and basic JavaScript
      </div>
      <div className=" text-neutral-500">
        Sounds from FTL menus and freesound.org
      </div>
      <a href="https://github.com/Koussay-Akchi/minesweeper">
        <span className="text-sm text-neutral-400">Github repo</span>
      </a>
      <span className="text-sm text-neutral-400">
        © Copyright 2024 Koussay Akchi
      </span>
    </div>
  </div>
));

Footer.displayName = "Footer";
export default Footer;
