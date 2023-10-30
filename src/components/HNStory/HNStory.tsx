import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Match, Show, Switch, createEffect, createResource, createSignal } from "solid-js";
import { getStory, type StoryId } from "../../services/data";
import { ErrorItem } from "../Errors/ErrorItem";
import HNComments from "../HNComment/HNComments";
import "./HNStory.css";
import RetryCard from "../Errors/Retry";
import { IconArrowBackUp } from "@tabler/icons-solidjs";
import { TransitionGroup } from "solid-transition-group";

dayjs.extend(relativeTime);

interface FullStory {
  id: StoryId;
  isHeader: true;
  rootCommentId: number | undefined;
}

interface InlineStory {
  id: StoryId;
  isHeader?: false;
  rootCommentId?: never;
}

export type StoryProps = FullStory | InlineStory;

const shortenUrl = (url: string) => {
  url = url.toLowerCase();
  url = url.replace(/(^\w+:|^)\/\//, '');
  url = url.replace(/^www\./, '');

  let i = url.indexOf("/");
  i = i === -1 ? url.length : i;

  return url.substring(0, i);
};

export default function Story({ id, isHeader, rootCommentId }: StoryProps) {
  const [storyStatus, { refetch }] = createResource(id, getStory);
  const [text, setText] = createSignal<HTMLHeadingElement>();

  const story = () => storyStatus()?.data!;

  createEffect(() => {
    const t = text();
    if (t) {
      t.innerHTML = "<p>" + story().text ?? "";
    }
  });

  createEffect(() => {
    if (isHeader && story()) {
      document.title = "Unknown Story";
      if (story().title) {
        document.title = story().title + " | Hacker News";
      }
    }
  });

  const url = () => story().url ?? `/story/${story().id}`;
  let comments = () => story().kids ?? [];

  if (rootCommentId) {
    comments = () => [rootCommentId];
  }

  return (
    <>
      <Switch>
        <Match when={storyStatus.state === "pending" || storyStatus.state === "unresolved"}>
          <div class="dark:bg-poimandres-dark h-[72px] p-2 rounded-lg">
            <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-600 to-gray-800 h-4 w-4/12"></div>
            <div class="rounded-lg bg-300% animate-gradient bg-gradient-to-r from-gray-600 to-gray-900 h-4 w-full mt-3"></div>
          </div>
        </Match>
        <Match when={storyStatus()?.error || storyStatus.error}>
          <ErrorItem
            title="An error occurred while loading"
            message="Please try again later"
          />
        </Match>
        <Match when={story() && (story().type === "story" || story().type === "job")}>
          <>
            <TransitionGroup name="comment" onExit={(_, d) => {
              setTimeout(() => d(), 300);
            }} appear>
              <div class="dark:bg-poimandres-dark p-2 rounded-lg" >
                <div class="pb-2">
                  <a href={url()} class={"text-gray-50 hover:underline break-words mr-2 inline-block " + (isHeader ? "text-lg" : "")}>
                    {story().title}
                  </a>
                  {story().url && <a href={story().url!} target="_blank" class="text-gray-500 inline hover:underline">({shortenUrl(story().url!)})</a>}
                </div>
                <Show when={isHeader && story().text}>
                  <div ref={setText} class="text-gray-200 pb-2"></div>
                </Show>
                <div class="flex flex-wrap">
                  <h4 class="text-gray-400 mr-4">{story().by}</h4>
                  <h4 class="text-gray-500 mr-4">{story().score} points</h4>
                  {story().type !== "job" && <a href={`/story/${story().id}`} class="text-gray-500 mr-4 hover:underline cursor-pointer">{story().descendants} replies</a>}
                  <a href={`/story/${story().id}`} class="text-gray-500 hover:underline cursor-pointer">{dayjs().to(story().time * 1000)}</a>
                </div>
              </div >
            </TransitionGroup>
            <Show when={isHeader && story().type !== "job"}>
              <Show when={rootCommentId}>
                <div class="dark:bg-poimandres-dark p-2 rounded-lg mt-4 flex items-center gap-2">
                  <IconArrowBackUp class="inline text-blue-400" />
                  <a class="text-blue-400 hover:underline hover:cursor-pointer" href={"/story/" + id}>
                    Showing single thread. View full discussion?
                  </a>
                </div>
              </Show>
              <HNComments depth={0} comments={comments()} hide={false} />
            </Show>
          </>
        </Match>
        <Match when={isHeader}>
          <ErrorItem
            title="Couldn't fetch story"
            message="Invalid ID"
          />
        </Match>
        <Match when={true}>
          <div class="dark:bg-poimandres-dark p-2 rounded-lg">
            <RetryCard onRetry={refetch} />
          </div>
        </Match>
      </Switch>
    </>
  );
}
