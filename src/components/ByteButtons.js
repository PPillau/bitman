export default function ByteButtons({ list, children }) {
  const handleByteClick = () => {
    navigator.clipboard.writeText(list.getByte(children));
  };
  return (
    <div className='cell byte_buttons text-xs'>
      <button
        onClick={handleByteClick}
        className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded'
      >
        Copy
      </button>
    </div>
  );
}
