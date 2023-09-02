import dayjs from "dayjs";
import { Match, Show, Switch, createEffect, createResource, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import { getComment } from "../../services/data";
import { useVisibility } from '../Hooks/useVisiblity';
import HNComments from "./HNComments";
import RetryCard from "../Errors/Retry";

export interface HNCommentProps {
  depth: number;
  id: number;
  isHidden?: boolean;
  isRecursive?: boolean;
}

const MAX_DEPTH = 5;

export default function HNComment(props: HNCommentProps) {
  // Used to fetch the comment JIT
  const [id, setId] = createSignal<number>();
  const [text, setText] = createSignal<HTMLHeadingElement>();

  // Whether the comment is expanded or not
  const [isExpanded, setIsExpanded] = createSignal(true);

  // Fetch the comment
  const [commentStatus, { refetch }] = createResource(id, getComment);
  const comment = () => commentStatus()?.data!;

  // Determine whether the comment is in the viewport or not
  let parent: HTMLElement;
  const isVisible = useVisibility(() => parent);

  createEffect(() => {
    const t = text();
    if (t) {
      t.innerHTML = "<p>" + comment()?.text ?? "";
      t.innerHTML = t.innerHTML.replace(/<p><\/p>/g, "");
    }
  });

  createEffect(() => {
    if (isVisible() && id() === undefined) {
      setId(props.id);
    }
  });

  const leftMargin = (props.depth * 12) + "px";

  const enterThread = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("comment", props.id.toString());
    return url.toString();
  };

  return (
    <div ref={(el) => { parent = el; }}>
      <Switch>
        <Match when={(commentStatus.state === "unresolved" || commentStatus.state === "pending") && !props.isHidden}>
          <div class="dark:bg-poimandres-dark h-24 p-2 rounded-lg mt-4" style={{ "margin-left": leftMargin }}>
            <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-600 to-gray-800 h-4 w-4/12"></div>
            <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-600 to-gray-900 h-4 w-full mt-3"></div>
            <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-700 to-gray-800 h-4 w-9/12 mt-3"></div>
          </div>
        </Match>
        <Match when={(commentStatus.error === "error" || commentStatus()?.error) && !props.isHidden}>
          <div class="dark:bg-poimandres-dark p-2 rounded-lg mt-4 " style={{ "margin-left": leftMargin }}>
            <RetryCard onRetry={refetch} />
          </div>
        </Match>
        <Match when={comment() && comment().type === "comment" && !comment().deleted}>
          <div>
            <TransitionGroup name="comment" onExit={(_, d) => {
              setTimeout(() => d(), 300);
            }} appear >
              <Show when={!props.isHidden} keyed>
                <div class="dark:bg-poimandres-dark p-2 rounded-lg mt-4" style={{ "margin-left": leftMargin }}>
                  <div class="flex flex-wrap">
                    <h4 class="text-gray-400 mr-4">{comment().by}</h4>
                    <h4 class="text-gray-400 mr-4">{dayjs().to((comment().time ?? 0) * 1000)}</h4>
                    <div class="flex-grow"></div>
                    <button class="p-1 cursor-pointer" onclick={() => setIsExpanded(isExpanded => !isExpanded)}>
                      <svg class={"text-gray-300 h-4 mr-1 transition " + (!isExpanded() ? "rotate-135" : "")} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </button>
                  </div>
                  <TransitionGroup name="comment-text" onExit={(_, d) => {
                    setTimeout(() => d(), 300);
                  }} appear>
                    <Show when={isExpanded()} keyed>
                      <div ref={setText} class="text-gray-200 comment-text break-words"></div>
                    </Show>
                  </TransitionGroup>
                </div>
                <Show when={props.depth >= MAX_DEPTH && comment().kids}>
                  <div class="dark:bg-poimandres-dark p-2 rounded-lg mt-4" style={{ "margin-left": leftMargin }}>
                    <div class="flex flex-wrap">
                      <a class="p-1 cursor-pointer flex items-center justify-center hover:underline text-gray-300" href={enterThread()}>
                        <span class="mr-2">Continue thread</span>
                        <svg class="text-gray-300 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 14 15" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-543.000000, -494.000000)" fill="currentColor" fill-rule="nonzero"><path d="M551.612899,494.209705 L551.707107,494.292893 L556.707107,499.292893 C557.067591,499.653377 557.09532,500.220608 556.790295,500.612899 L556.707107,500.707107 L551.707107,505.707107 C551.316582,506.097631 550.683418,506.097631 550.292893,505.707107 C549.932409,505.346623 549.90468,504.779392 550.209705,504.387101 L550.292893,504.292893 L554.585,500 L550.292893,495.707107 C549.932409,495.346623 549.90468,494.779392 550.209705,494.387101 L550.292893,494.292893 C550.653377,493.932409 551.220608,493.90468 551.612899,494.209705 Z M544.612899,494.209705 L544.707107,494.292893 L549.707107,499.292893 C550.067591,499.653377 550.09532,500.220608 549.790295,500.612899 L549.707107,500.707107 L544.707107,505.707107 C544.316582,506.097631 543.683418,506.097631 543.292893,505.707107 C542.932409,505.346623 542.90468,504.779392 543.209705,504.387101 L543.292893,504.292893 L547.585,500 L543.292893,495.707107 C542.932409,495.346623 542.90468,494.779392 543.209705,494.387101 L543.292893,494.292893 C543.653377,493.932409 544.220608,493.90468 544.612899,494.209705 Z" /></g></g></svg>
                      </a>
                    </div>
                  </div>
                </Show>
              </Show>
            </TransitionGroup>
            <Show when={comment().kids && props.depth < MAX_DEPTH && props.isRecursive} keyed>
              <div class="relative">
                <div class="h-full absolute bg-poimandres-dark" style={{ "width": "2px", "margin-left": leftMargin }}></div>
                <HNComments depth={props.depth + 1} comments={comment().kids} hide={props.isHidden || !isExpanded()} />
              </div>
            </Show>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
