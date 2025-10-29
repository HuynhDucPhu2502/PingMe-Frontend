interface MessageVideoProps {
  src: string;
}

export default function MessageVideo({ src }: MessageVideoProps) {
  return (
    <div className="relative max-w-md">
      <video
        src={src}
        controls
        className="w-full max-h-96 rounded-lg"
        preload="metadata"
      >
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  );
}
