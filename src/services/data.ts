import f from 'fetch-retry';
const fetch = f(globalThis.fetch);

export type StoryId = number;
export type CommentId = number;

export interface Story {
  by: string;
  descendants: number;
  id: StoryId;
  kids: CommentId[];
  score: number;
  time: number;
  title: string;
  type: "story" | "job";
  url?: string;
  text?: string;
}

export interface Comment {
  by: string;
  id: CommentId;
  kids: CommentId[];
  parent: StoryId | CommentId;
  text: string;
  time: number;
  type: "comment";
  deleted?: boolean;
}

export async function getJobStories() {
  return await tryFetch<StoryId[]>('https://hacker-news.firebaseio.com/v0/jobstories.json');
}

export async function getShowStories() {
  return await tryFetch<StoryId[]>('https://hacker-news.firebaseio.com/v0/showstories.json');
}

export async function getAskStories() {
  return await tryFetch<StoryId[]>('https://hacker-news.firebaseio.com/v0/askstories.json');
}

export async function getTopStories() {
  return await tryFetch<StoryId[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
}

export async function getBestStories() {
  return await tryFetch<StoryId[]>('https://hacker-news.firebaseio.com/v0/beststories.json');
}

export async function getNewStories() {
  return await tryFetch<StoryId[]>('https://hacker-news.firebaseio.com/v0/newstories.json');
}

export async function getStory(id: StoryId) {
  return await tryFetch<Story>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
}

export async function getComment(id: CommentId) {
  return await tryFetch<Comment>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
}

export type Response<T> = { data?: T; error?: undefined } | { error: unknown; data?: undefined };

export async function tryFetch<T>(url: string): Promise<Response<T>> {
  try {
    const response = await fetch(url);
    // check if response was in 200 range
    if (!response.ok) {
      return { error: response.statusText };
    }
    return { data: await response.json() };
  } catch (error) {
    return { error };
  }
}
