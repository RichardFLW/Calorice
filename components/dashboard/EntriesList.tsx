import EntryItem from "./EntryItem";

type Entry = {
  id: string;
  eatenAt: Date;
  amount: number;
  unit: string;
  calories: number;
  food: { name: string; brands: string | null };
};

type Props = {
  entries: Entry[];
  removeAction: (prevState: any, formData: FormData) => Promise<any>;
};

export default function EntriesList({ entries, removeAction }: Props) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <EntryItem key={entry.id} entry={entry} removeAction={removeAction} />
      ))}
    </ul>
  );
}
