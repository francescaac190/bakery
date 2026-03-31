export default function InfoCard({ text }: { text: string }) {
  return (
    <div className="bg-background4 py-2 px-4 rounded-full flex items-center justify-center">
      <p className="text-text-primary font-semibold text-md">{text}</p>
    </div>
  );
}
