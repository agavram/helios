import dayjs from "dayjs";
import { Match, Show, Switch, createEffect, createResource, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import { getComment } from "../../services/data";
import { useVisibility } from '../Hooks/useVisiblity';
import HNComments from "./HNComments";
import RetryCard from "../Errors/Retry";
import { IconChevronsRight, IconX } from "@tabler/icons-solidjs";
import Card from "../Elements/Card";

export interface HNCommentProps {
  depth: number;
  id: string;
  isHidden?: boolean;
  isRecursive?: boolean;
}

const MAX_DEPTH = 5;

export default function HNComment(props: HNCommentProps) {
  // Used to fetch the comment JIT
  const [id, setId] = createSignal<string>();

  // Whether the comment is expanded or not
  const [isExpanded, setIsExpanded] = createSignal(true);

  // Fetch the comment
  const [commentStatus, { refetch }] = createResource(id, getComment);
  const comment = () => commentStatus()?.data!;

  // Determine whether the comment is in the viewport or not
  let parent: HTMLElement;
  const isVisible = useVisibility(() => parent);

  createEffect(() => {
    if (isVisible() && id() === undefined) {
      setId(props.id);
    }
  });

  const enterThread = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("comment", props.id.toString());
    return url.toString();
  };

  return (
    <div ref={(el) => { parent = el; }} class={props.depth ? "ml-[12px]" : ""}>
      <Switch>
        <Match when={(commentStatus.state === "unresolved" || commentStatus.state === "pending") && !props.isHidden}>
          <div class="mt-4">
            <Card>
              <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-600 to-gray-800 h-4 w-4/12"></div>
              <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-600 to-gray-900 h-4 w-full mt-3"></div>
              <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-700 to-gray-800 h-4 w-9/12 mt-3"></div>
            </Card>
          </div>
        </Match>
        <Match when={(commentStatus.error === "error" || commentStatus()?.error) && !props.isHidden}>
          <div class="mt-4">
            <RetryCard onRetry={refetch} />
          </div>
        </Match>
        <Match when={comment() && comment().type === "comment" && !comment().deleted}>
          <TransitionGroup name="comment" onExit={(_, d) => {
            setTimeout(() => d(), 300);
          }} appear >
            <Show when={!props.isHidden} keyed>
              <div class="mt-4">
                <Card>
                  <div class="flex flex-wrap">
                    <h4 class="text-gray-400 mr-4">{comment().by}</h4>
                    <a class="text-gray-400 mr-4 hover:underline" href={enterThread()}>{dayjs().to((comment().time ?? 0) * 1000)}</a>
                    <div class="flex-grow"></div>
                    <button class="p-1 cursor-pointer" onclick={() => setIsExpanded(isExpanded => !isExpanded)}>
                      <IconX size="16" stroke="2.5" class={"text-gray-300 mr-1 transition " + (!isExpanded() ? "rotate-135" : "")} />
                    </button>
                  </div>
                  <TransitionGroup name="fade" onExit={(_, d) => {
                    setTimeout(() => d(), 300);
                  }} appear>
                    <Show when={isExpanded()} keyed>
                      <div innerHTML={comment().text} class="text-gray-200 inline-block pt-[6px] comment-block w-full" style={{ "overflow-wrap": "anywhere" }}></div>
                    </Show>
                  </TransitionGroup>
                </Card>
              </div>
              <Show when={props.depth >= MAX_DEPTH && comment().kids}>
                <div class="mt-4">
                  <Card>
                    <div class="flex flex-wrap">
                      <a class="p-1 cursor-pointer flex items-center justify-center hover:underline text-blue-400" href={enterThread()}>
                        Continue thread
                        <IconChevronsRight class="text-blue-400 inline" size="22" />
                      </a>
                    </div>
                  </Card>
                </div>
              </Show>
            </Show>
          </TransitionGroup>
          <Show when={comment().kids && props.depth < MAX_DEPTH && props.isRecursive} keyed>
            <div class="relative">
              <div class="h-full absolute bg-gray-700 rounded-xl" style={{ "width": "1px" }}></div>
              <HNComments depth={props.depth + 1} comments={comment().kids} hide={props.isHidden || !isExpanded()} />
            </div>
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
