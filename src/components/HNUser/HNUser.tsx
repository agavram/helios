import { Match, Switch } from "solid-js";
import type { User } from "../../services/data";
import Card from "../Elements/Card";
import { ErrorItem } from "../Errors/ErrorItem";

export default function HNUser({ user }: { user: User | undefined; }) {
  return (
    <Switch>
      <Match when={user}>
        <Card>

        </Card>
      </Match>
      <Match when={true}>
        <ErrorItem title="Person does not exist" message="We couldn't find that user" />
      </Match>
    </Switch>
  );
}
