import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export function useVisibility(element: () => HTMLElement | undefined): Accessor<boolean> {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const vis = entry?.isIntersecting;
      if (vis) {
        setIsVisible(true);
        observer.unobserve(element()!);
      }
    }, { rootMargin: "0px 0px 100px 0px" });

    if (element()) observer.observe(element()!);

    onCleanup(() => {
      if (element()) observer.unobserve(element()!);
    });
  });

  return isVisible;
}
