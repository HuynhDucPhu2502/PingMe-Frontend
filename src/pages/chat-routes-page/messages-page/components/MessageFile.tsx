import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageFileProps {
  src: string;
  fileName: string;
}

export default function MessageFile({ src, fileName }: MessageFileProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md">
      <div className="flex-shrink-0">
        <FileText className="w-8 h-8 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{fileName}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDownload}
        className="flex-shrink-0"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}
