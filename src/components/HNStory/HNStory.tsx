import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Match, Show, Switch, createEffect, createResource, createSignal } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import type { Response } from "../../services/data";
import { getStory, type Story, type StoryId } from "../../services/data";
import Card from "../Elements/Card";
import LoadingCard from "../Elements/LoadingCard";
import { ErrorItem } from "../Errors/ErrorItem";
import RetryCard from "../Errors/Retry";
import HNComments from "../HNComment/HNComments";
import { useVisibility } from "../Hooks/useVisiblity";
import "./HNStory.css";

dayjs.extend(relativeTime);

interface FullStory {
  id: StoryId;
  isHeader: true;
  rootCommentId: string | undefined;
  ssrStory: Response<Story>;
}

interface InlineStory {
  id: StoryId;
  isHeader?: false;
  rootCommentId?: never;
  ssrStory?: never;
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

export default function Story({ id: pid, isHeader, rootCommentId, ssrStory }: StoryProps) {
  const [id, setId] = createSignal<string>();

  const [storyStatus, { refetch }] = createResource(id, getStory, ssrStory ? {
    initialValue: ssrStory,
    ssrLoadFrom: "initial"
  } : {});


  const story = () => storyStatus()?.data!;

  let parent: HTMLElement;
  const isVisible = useVisibility(() => parent);
  createEffect(() => {
    if (isVisible() && !ssrStory) {
      setId(pid);
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

  const url = () => story().url ?? `/story/${pid}`;
  let comments = () => story().kids ?? [];

  if (rootCommentId) {
    comments = () => ({ "0": rootCommentId });
  }

  return (
    <div ref={(el) => { parent = el; }}>
      <Switch>
        <Match when={storyStatus.state === "pending" || storyStatus.state === "unresolved"}>
          <LoadingCard />
        </Match>
        <Match when={(storyStatus()?.error || storyStatus.error) && isHeader}>
          <ErrorItem
            title="An error occurred while loading"
            message="Please try again later"
          />
        </Match>
        <Match when={story() && (story().type === "story" || story().type === "job")}>
          <>
            <TransitionGroup name="comment" appear>
              <div class="dark:bg-poimandres-dark p-2 rounded-lg border border-gray-500 hover:border-gray-50 transition-[border]" >
                <div class="pb-2">
                  <a href={url()} class={"text-gray-50 hover:underline break-words mr-2 inline-block" + (isHeader ? " text-lg font-medium" : "")}>
                    {story().title}
                  </a>
                  {story().url && <a href={story().url!} target="_blank" class="text-gray-500 inline hover:underline">({shortenUrl(story().url!)})</a>}
                </div>
                <Show when={isHeader && story().text}>
                  <div innerHTML={story().text!} class="text-gray-200 pb-2" style={{ "overflow-wrap": "anywhere" }}></div>
                </Show>
                <div class="flex flex-wrap">
                  <h4 class="text-gray-400 mr-4">{story().by}</h4>
                  <h4 class="text-gray-500 mr-4">{story().score} points</h4>
                  {story().type !== "job" && <a href={`/story/${pid}`} class="text-gray-500 mr-4 hover:underline cursor-pointer">{story().descendants} replies</a>}
                  <a href={`/story/${pid}`} class="text-gray-500 hover:underline cursor-pointer">{dayjs().to(story().time * 1000)}</a>
                </div>
              </div >
            </TransitionGroup>
            <Show when={isHeader && story().type !== "job"}>
              <Show when={rootCommentId}>
                <div class="pt-4">
                  <Card>
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="inline text-blue-400" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 14l-4 -4l4 -4"></path>
                        <path d="M5 10h11a4 4 0 1 1 0 8h-1"></path>
                      </svg>
                      <a class="text-blue-400 hover:underline hover:cursor-pointer" href={`/story/${pid}`}>
                        Showing single thread. View full discussion?
                      </a>
                    </div>
                  </Card>
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
          <RetryCard onRetry={refetch} />
        </Match>
      </Switch>
    </div>
  );
}
