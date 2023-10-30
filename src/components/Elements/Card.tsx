import type { ParentProps } from "solid-js";

export default function Card(props: ParentProps) {

  return (
    <div class="dark:bg-poimandres-dark p-2 rounded-lg mt-4 border border-gray-700">
      {props.children}
    </div>
  );
}
