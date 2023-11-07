import { For } from "solid-js";
import type { CommentId } from "../../services/data";
import HNComment from "./HNComment";

export interface HNCommentsProps {
  depth: number;
  comments: { [key: string]: CommentId }
  hide: boolean;
}

export default function HNComments(props: HNCommentsProps) {
  const { depth, comments } = props;

  return (
    <For each={Object.keys(comments)}>{(key) =>
      <HNComment depth={depth} id={comments[key]!} isHidden={props.hide} isRecursive={true} />}
    </For>
  );
}
