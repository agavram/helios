export interface ErrorItemProps {
  title: string;
  message: string;
}

export function ErrorItem({ title, message }: ErrorItemProps) {
  return (
    <div class="text-gray-500 flex justify-center flex-col items-center mt-[10vh] px-4 text-center">
      <h4 class="text-xl">{title}</h4><h4>{message}</h4>
      <svg
        width="224"
        height="224"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5">
          <path d="M10 9h.01M14 9h.01M12 3a7 7 0 0 1 7 7v1h1a2 2 0 1 1 0 4h-1v3l2 3H11a6 6 0 0 1-6-5.775v-.226H4a2 2 0 0 1 0-4h1v-1a7 7 0 0 1 7-7z" />
          <path d="M11 14h2a1 1 0 0 0-2 0z" />
        </g>
      </svg>
    </div>
  );
}