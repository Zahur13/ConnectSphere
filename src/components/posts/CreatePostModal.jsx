import { useState, useRef } from "react";
import { X, Image, Smile, MapPin, Hash } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import postService from "../../services/api/postService";

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const emojis = [
    "😀",
    "😂",
    "😍",
    "🤔",
    "👍",
    "❤️",
    "🎉",
    "🔥",
    "👏",
    "😎",
    "🤗",
    "😊",
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const insertEmoji = (emoji) => {
    const position = textareaRef.current?.selectionStart || content.length;
    const newContent =
      content.slice(0, position) + emoji + content.slice(position);
    setContent(newContent);
    setShowEmojis(false);

    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        position + emoji.length,
        position + emoji.length
      );
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      alert("Please write something or add an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost = await postService.createPost(content.trim(), image);

      // Clear form
      setContent("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onPostCreated) {
        onPostCreated(newPost);
      }

      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Escape key to close modal
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit}>
            {/* User Info */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={user?.profilePicture}
                  alt={user?.name}
                  className="object-cover w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">@{user?.username}</p>
                </div>
              </div>
            </div>

            {/* Text Area */}
            <div className="px-4 pb-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="p-0 w-full text-lg placeholder-gray-400 border-0 resize-none focus:outline-none"
                rows="6"
                autoFocus
                disabled={isSubmitting}
              />

              {/* Character Count */}
              <div className="mt-2 text-right">
                <span
                  className={`text-sm ${
                    content.length > 280 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {content.length}/280
                </span>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-4 pb-4">
                <div className="overflow-hidden relative rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full max-h-80"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-gray-900 bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojis && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="p-1 text-2xl rounded transition-colors hover:bg-white"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {/* Media Options */}
            <div className="flex items-center space-x-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload-modal"
                disabled={isSubmitting}
              />

              <label
                htmlFor="image-upload-modal"
                className="p-2 rounded-full transition-colors cursor-pointer text-primary-600 hover:bg-primary-50"
                title="Add photo"
              >
                <Image className="w-5 h-5" />
              </label>

              <button
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
                className="p-2 rounded-full transition-colors text-primary-600 hover:bg-primary-50"
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="p-2 rounded-full transition-colors text-primary-600 hover:bg-primary-50"
                title="Add location"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="p-2 rounded-full transition-colors text-primary-600 hover:bg-primary-50"
                title="Add hashtag"
              >
                <Hash className="w-5 h-5" />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={
                (!content.trim() && !image) ||
                isSubmitting ||
                content.length > 280
              }
              className="px-6 py-2 font-medium text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
