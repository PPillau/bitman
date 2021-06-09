import BitBox from './components/BitBox';

class BitList {
  constructor(_bitString) {
    this.bitString = '';
    this.list = '';
    this.cursorPos = 0;
    this.indices = [];

    this.cursor = <span key='-1' className='cursor h-12'></span>;
    this.numRegex = new RegExp('^[01]$');

    if (_bitString != '') {
      let i = 0;
      for (; i < _bitString.length; i++) {
        this.addToList(true, _bitString.charAt(i), false, i, i);
        this.indices.push(i);
      }
      this.addToList(false, null, null, null, i);
    }
  }

  addSaveToList(_isBit, _bit, _active) {
    if (_isBit) {
      this.addToList(true, _bit, _active, 0, this.cursorPos);
      this.cursorPos++;
    }
  }

  addToList(_isBit, _bit, _active, _key, pos) {
    if (_isBit) {
      this.list.splice(pos, 0, {
        isBit: true,
        bit: _bit,
        active: _active,
        key: _key,
        elem: null,
      });
      this.list[i].elem = (
        <BitBox
          key={this.list[i].key}
          bit={this.list[i].bit}
          active={this.list[i].active}
        ></BitBox>
      );
      this.addToSting(_bit, pos);
    } else {
      this.list.splice(pos, 0, {
        isBit: false,
        elem: this.cursor,
      });
      this.cursorPos = pos;
    }
  }

  addToSting(bit, pos) {
    this.bitString =
      this.bitString.substr(0, pos) +
      bit +
      this.bitString.substr(pos, this.bitString.length);
  }

  deleteSaveFromList() {
    if (this.list[this.cursorPos - 1]) {
      this.list.splice(this.cursorPos - 1, 1);
      this.deleteFromSting(this.cursorPos - 1);
    }
  }

  deleteFromList(pos) {
    if (this.list[pos]) {
      this.list.splice(pos, 1);
      this.deleteFromSting(pos);
    }
  }

  deleteFromSting(pos) {
    this.bitString =
      this.bitString.substr(0, pos - 1) +
      this.bitString.substr(pos, this.bitString.length);
  }

  render() {
    return this.list.map((x) => x.elem);
  }
}
