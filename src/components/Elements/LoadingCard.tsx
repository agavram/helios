export default function LoadingCard() {
  return (
    <div class="
    dark:bg-poimandres-dark p-2 rounded-lg border border-gray-700
      bg-gradient-to-r
      from-transparent
      via-poimandres-dark/10
      relative 
      before:absolute before:inset-0
      before:-translate-x-full
      before:animate-[shimmer_2s_infinite_ease-in-out]
      before:bg-gradient-to-r
      before:from-transparent before:via-[#ddf]/5 before:to-transparent
      isolate
      overflow-hidden
      shadow-xl shadow-black/5
      before:border-t before:border-gray-50/20
      ">
      <div class="rounded-lg bg-poimandres-main/50 h-4 w-4/12"></div>
      <div class="rounded-lg bg-poimandres-main h-4 w-full mt-3"></div>
      <div class="rounded-lg bg-poimandres-main h-4 w-8/12 mt-3"></div>
    </div>
  );
}
