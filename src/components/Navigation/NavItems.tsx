import { Show, createSignal, onMount } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import "./NavItems.css";

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
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-200" viewBox="0 0 448 512" fill="currentColor">
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
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
                class={"text-gray-300 block max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "top" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Top
              </a>
              <a
                href="/best"
                class={"text-gray-300 block max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "best" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Best
              </a>
              <a
                href="/new"
                class={"text-gray-300 block max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "new" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                New
              </a>
              <a
                href="/ask"
                class={"text-gray-300 block max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "ask" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Ask
              </a>
              <a href="/show"
                class={"text-gray-300 block max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "show" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Show
              </a>
              <a href="/jobs"
                class={"text-gray-300 block max-md:px-4 p-2 hover:underline hover:bg-poimandres-lighter rounded " + (selected === "jobs" ? " bg-poimandres-lighter" : "")}
                role="menuitem"
              >
                Jobs
              </a>
            </div>
          </div>
        </Show>
      </TransitionGroup>
    </div>
  );
}
