export default function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse p-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="aspect-[3/4] rounded-lg bg-gray-400"></div>
      ))}
    </div>
  );
}