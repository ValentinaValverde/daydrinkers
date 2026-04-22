export function MenuItemCard({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-end gap-8">
      {image ? (
        <img
          src={image}
          alt={name}
          className="hover:rotate-45 transition-all duration-300"
        />
      ) : (
        <div className="w-full aspect-square rounded-2xl shadow-md bg-[#d9cbb9] flex items-center justify-center">
          <span className="text-black/40 text-xs text-center px-2 leading-snug">
            {name}
          </span>
        </div>
      )}
      <div className="flex flex-col items-center gap-1 text-center text-black">
        <p className="font-medium text-lg leading-tight">{name}</p>
        <p className="text-sm">{price}</p>
      </div>
    </div>
  );
}
