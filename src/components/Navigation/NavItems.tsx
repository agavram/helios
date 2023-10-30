import { Show, createSignal, onMount } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import "./NavItems.css";
import { IconClockHour3, IconFileDescription, IconMenu2, IconMicrophone2, IconSortAscending, IconStar, IconTheater } from "@tabler/icons-solidjs";

export interface NavItemsProps {
  selected?: string | undefined;
}

export default function NavItems({ selected }: NavItemsProps) {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isWindowLarge, setIsWindowLarge] = createSignal(window.innerWidth >= 768);
  let child: HTMLDivElement;

  onMount(() => {
    document.onclick = (e: MouseEvent) => {
      if (e.target instanceof Node && !child.contains(e.target)) {
        setIsExpanded(false);
      }
    };
  });

  window.addEventListener("resize", () => {
    setIsWindowLarge(window.innerWidth >= 768);
  });

  const shouldShow = () => isExpanded() || isWindowLarge();

  return (
    <div ref={(e) => { child = e; }}>
      <button
        type="button"
        class="block md:hidden"
        onClick={() => setIsExpanded(isExpanded => !isExpanded)}
      >
        <IconMenu2 class="text-gray-200" />
      </button>
      <TransitionGroup name="nav-dropdown" onExit={(_, d) => {
        setTimeout(() => d(), 300);
      }}>
        <Show when={shouldShow()}>
          <div
            class={"px-1 max-md:absolute right-4 z-10 max-md:mt-3 max-w-64 origin-top-right rounded-md max-md:dark:bg-poimandres-dark max-md:shadow-lg " + (isWindowLarge() ? "max-md:hidden" : "")}
          >
            <div class="flex gap-1 max-md:flex-col py-1">
              <a
                href="/top"
                class={"flex justify-between items-center gap-2 text-gray-300 max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "top" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Top
                <IconSortAscending class="text-gray-200" size={20} />
              </a>
              <a
                href="/best"
                class={"flex justify-between items-center gap-2 text-gray-300 max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "best" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Best
                <IconStar class="text-gray-200" size={20} />
              </a>
              <a
                href="/new"
                class={"flex justify-between items-center gap-2 text-gray-300 max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "new" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                New
                <IconClockHour3 class="text-gray-200" size={20} />
              </a>
              <a
                href="/ask"
                class={"flex justify-between items-center gap-2 text-gray-300 max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "ask" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Ask
                <IconMicrophone2 class="text-gray-200" size={20} />
              </a>
              <a href="/show"
                class={"flex justify-between items-center gap-2 text-gray-300 max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "show" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Show
                <IconTheater class="text-gray-200" size={20} />
              </a>
              <a href="/jobs"
                class={"flex justify-between items-center gap-2 text-gray-300 max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "jobs" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Jobs
                <IconFileDescription class="text-gray-200" size={20} />
              </a>
            </div>
          </div>
        </Show>
      </TransitionGroup>
    </div>
  );
}
