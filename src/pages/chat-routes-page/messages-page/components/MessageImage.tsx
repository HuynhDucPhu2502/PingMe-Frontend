interface MessageImageProps {
  src: string;
  alt?: string;
}

export default function MessageImage({
  src,
  alt = "Image",
}: MessageImageProps) {
  return (
    <div className="relative group">
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="max-w-md max-h-96 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => window.open(src, "_blank")}
      />
    </div>
  );
}
