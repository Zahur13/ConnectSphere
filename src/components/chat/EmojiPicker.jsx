const EmojiPicker = ({ onSelect }) => {
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😜",
    "🤪",
    "🤔",
    "🤫",
    "🤭",
    "🤗",
    "🤑",
    "😎",
    "🤓",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "👍",
    "👎",
    "👊",
    "✊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🎉",
    "🎊",
    "🎈",
    "🎁",
    "🎂",
    "🍰",
    "🧁",
    "🥳",
    "🔥",
    "💯",
  ];

  return (
    <div className="p-3 w-80 bg-white rounded-lg border border-gray-200 shadow-xl">
      <div className="grid grid-cols-10 gap-1">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="p-1 text-xl rounded transition-colors hover:bg-gray-100"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
