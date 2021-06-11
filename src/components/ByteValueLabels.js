export default function ByteValueLabels({ hex, dec }) {
  return (
    <div className='cell value_labels'>
      <span className='mx-5'>
        Hex: <span className='font-bold'>0x</span>
        <span className='uppercase font-bold'>{hex}</span>
      </span>
      <span className='mx-5'>
        Dec: <span className='font-bold'>{dec}</span>
      </span>
    </div>
  );
}
