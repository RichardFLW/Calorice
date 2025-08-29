type Props = {
  title: string;
  children: React.ReactNode;
};

export default function MacroGroup({ title, children }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}
