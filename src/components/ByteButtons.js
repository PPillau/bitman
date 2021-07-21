export default function ByteButtons({ list, children }) {
  const handleByteClick = () => {
    navigator.clipboard.writeText(list.getByte(children).string);
  };

  const handleInvertByteClick = () => {
    const byte = list.getByte(children);
    const invertedByte = list.getRealBitSize(
      list.dec2bin(~parseInt(byte.string, 2)),
      byte.string
    );
    list.changeToNewStringAt(invertedByte, byte.startPos);
    const target = document.getElementById('updater');
    target.textContent = parseInt(target.textContent) + 1;
  };

  return (
    <div className='cell byte_buttons text-xs'>
      <button
        onClick={handleByteClick}
        className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded'
      >
        Copy
      </button>
      <button
        onClick={handleInvertByteClick}
        className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded'
      >
        Invert
      </button>
    </div>
  );
}
