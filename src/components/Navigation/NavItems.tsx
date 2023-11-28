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
                class={"flex justify-between items-center gap-2 max-md:px-4 p-2 transition-[color] hover:text-gray-300 rounded " + (selected === "top" ? " text-gray-100" : "text-gray-500")}
                role="menuitem"
              >
                Top
                <IconSortAscending size={20} />
              </a>
              <a
                href="/best"
                class={"flex justify-between items-center gap-2 max-md:px-4 p-2 transition-[color] hover:text-gray-300 rounded " + (selected === "best" ? " text-gray-100" : "text-gray-500")}
                role="menuitem"
              >
                Best
                <IconStar size={20} />
              </a>
              <a
                href="/new"
                class={"flex justify-between items-center gap-2 max-md:px-4 p-2 transition-[color] hover:text-gray-300 rounded " + (selected === "new" ? " text-gray-100" : "text-gray-500")}
                role="menuitem"
              >
                New
                <IconClockHour3 size={20} />
              </a>
              <a
                href="/ask"
                class={"flex justify-between items-center gap-2 max-md:px-4 p-2 transition-[color] hover:text-gray-300 rounded " + (selected === "ask" ? " text-gray-100" : "text-gray-500")}
                role="menuitem"
              >
                Ask
                <IconMicrophone2 size={20} />
              </a>
              <a href="/show"
                class={"flex justify-between items-center gap-2 max-md:px-4 p-2 transition-[color] hover:text-gray-300 rounded " + (selected === "show" ? " text-gray-100" : "text-gray-500")}
                role="menuitem"
              >
                Show
                <IconTheater size={20} />
              </a>
              <a href="/jobs"
                class={"flex justify-between items-center gap-2 max-md:px-4 p-2 transition-[color] hover:text-gray-300 rounded " + (selected === "jobs" ? " text-gray-100" : "text-gray-500")}
                role="menuitem"
              >
                Jobs
                <IconFileDescription size={20} />
              </a>
            </div>
          </div>
        </Show>
      </TransitionGroup>
    </div>
  );
}
