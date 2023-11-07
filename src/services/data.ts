import f from 'fetch-retry';
import { initializeApp } from 'firebase/app';
import { DataSnapshot, child, get, getDatabase, ref } from "firebase/database";

const fetch = f(globalThis.fetch);

export type StoryId = string;
export type CommentId = string;

export interface Story {
  by: string;
  descendants: number;
  id: StoryId;
  kids: { [key: string]: CommentId };
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
  kids: { [key: string]: CommentId };
  parent: StoryId | CommentId;
  text: string;
  time: number;
  type: "comment";
  deleted?: boolean;
}

export interface User {
  id: string;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
}

const app = initializeApp({
  databaseURL: "https://hacker-news.firebaseio.com",
});
const database = getDatabase(app);
const itemsRef = ref(database, "v0/item");

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
  return await tryGet<Story>(get(child(itemsRef, id.toString())));
}

export async function getComment(id: CommentId) {
  return await tryGet<Comment>(get(child(itemsRef, id.toString())));
}

export type Response<T> = { data?: T; error?: undefined; } | { error: unknown; data?: undefined; };

export async function tryGet<T>(url: Promise<DataSnapshot>): Promise<Response<T>> {
  try {
    const response = await url;
    // check if response was in 200 range
    if (!response.exists()) {
      return { error: "Unable to fetch" };
    }
    return { data: response.toJSON()! as T };
  } catch (error) {
    return { error };
  }
}


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
