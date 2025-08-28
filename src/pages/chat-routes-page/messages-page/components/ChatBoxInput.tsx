import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Smile, ImagePlus, Paperclip, Send } from "lucide-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
}

export function ChatBoxInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setNewMessage(newMessage + emojiData.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleSendClick = () => {
    onSendMessage();
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t bg-white">
      <div className="flex items-center space-x-1 p-3 border-b bg-gradient-to-r from-gray-50 to-purple-50">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-purple-600 hover:bg-purple-100 transition-all duration-200 rounded-lg"
        >
          <ImagePlus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-purple-600 hover:bg-purple-100 transition-all duration-200 rounded-lg"
        >
          <Paperclip className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 mb-2 z-50 shadow-2xl rounded-lg overflow-hidden">
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
              autoFocusSearch={false}
              width={350}
              height={400}
              previewConfig={{
                showPreview: false,
              }}
              skinTonesDisabled
            />
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-11 px-4 transition-all duration-200"
            onKeyPress={handleKeyPress}
            disabled={disabled}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEmojiPicker}
            className="text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition-all duration-200 rounded-lg p-2"
          >
            <Smile className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleSendClick}
            disabled={!newMessage.trim() || disabled}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 h-11 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2" />
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}
