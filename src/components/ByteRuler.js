export default function ByteRuler({ children }) {
  return (
    <div className='cell byte_ruler'>
      <span className='byte_label'>Byte {children}</span>
    </div>
  );
}
