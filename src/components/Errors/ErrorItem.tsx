import { IconGhost2 } from "@tabler/icons-solidjs";

export interface ErrorItemProps {
  title: string;
  message: string;
}

export function ErrorItem({ title, message }: ErrorItemProps) {
  return (
    <div class="text-gray-500 flex justify-center mt-[10vh] px-4 text-center">
      <div class="p-8 flex flex-col items-center w-min bg-poimandres-dark/70">
        <h4 class="text-xl">{title}</h4><h4>{message}</h4>
        <IconGhost2 size="224" />
      </div>
    </div>
  );
}
