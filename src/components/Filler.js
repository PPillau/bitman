import classNames from 'classnames';

export default function Filler({ bit, span }) {
  const getSpanClassName = () => {
    return 'filler' + span;
  };
  const getBitClassName = () => {
    return bit ? 'bit' : 'bit_number';
  };

  return (
    <div
      className={classNames('cell f', getBitClassName(), getSpanClassName())}
    ></div>
  );
}
