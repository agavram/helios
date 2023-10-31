import { For } from "solid-js";
import type { CommentId } from "../../services/data";
import HNComment from "./HNComment";

export interface HNCommentsProps {
  depth: number;
  comments: CommentId[];
  hide: boolean;
}

export default function HNComments(props: HNCommentsProps) {
  const { depth, comments } = props;

  return (
    <For each={comments}>{(comment) =>
      <HNComment depth={depth} id={comment} isHidden={props.hide} isRecursive={true} />}
    </For>
  );
}
