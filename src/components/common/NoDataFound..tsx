export default function NoDataFound({ text = "No Data Found" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-lg font-semibold">😕 {text}</p>
      <p className="text-sm text-muted-foreground">
        Try refreshing or check back later
      </p>
    </div>
  );
}