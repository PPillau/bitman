import BitBox from './components/BitBox';
import React from 'react';

class BitList {
  constructor(_bitString) {
    this.bitString = '';
    this.list = [];
    this.cursorPos = 0;
    this.indices = [];

    this.cursor = <span key='-1' className='cursor h-12'></span>;
    this.numRegex = new RegExp('^[01]$');

    let i = 0;
    if (_bitString != '') {
      for (; i < _bitString.length; i++) {
        this.addToList(true, _bitString.charAt(i), false, i, i);
        this.indices.push(i);
      }
    }
    this.addToList(false, null, null, null, i);
  }

  addSaveToList(_isBit, _bit, _active) {
    if (_isBit) {
      let i = 0;
      for (; i < this.indices.length; i++) {
        if (this.indices[i] != i) {
          break;
        }
      }
      this.addToList(true, _bit, _active, i, this.cursorPos);
      this.indices.push(i);
      this.indices.sort((a, b) => a - b);
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
      this.list[pos].elem = (
        <BitBox
          key={this.list[pos].key}
          bit={this.list[pos].bit}
          active={this.list[pos].active}
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
      this.deleteFromSting(this.cursorPos - 1);
      this.indices.splice(
        this.indices.findIndex((el) => el == this.list[this.cursorPos - 1].key),
        1
      );
      this.list.splice(this.cursorPos - 1, 1);
      this.cursorPos--;
      this.indices.sort((a, b) => a - b);
    }
  }

  deleteFromList(pos) {
    if (this.list[pos]) {
      if (this.list[pos].elem != this.cursor) {
        this.deleteFromSting(pos);
      }
      this.list.splice(pos, 1);
    }
  }

  deleteFromSting(pos) {
    this.bitString =
      this.bitString.substr(0, pos) +
      this.bitString.substr(pos + 1, this.bitString.length);
  }

  moveCursor(left) {
    if (left && this.cursorPos - 1 >= 0) {
      this.deleteFromList(this.cursorPos);
      this.cursorPos--;
      this.addToList(false, null, null, null, this.cursorPos);
    } else if (!left && this.cursorPos + 1 <= this.bitString.length) {
      this.deleteFromList(this.cursorPos);
      this.cursorPos++;
      this.addToList(false, null, null, null, this.cursorPos);
    }
  }

  clear() {
    this.bitString = '';
    this.list = [
      {
        isBit: false,
        elem: this.cursor,
      },
    ];
    this.indices = [];
    this.cursorPos = 0;
  }

  changeTo(_newBitString) {
    let bit = '';
    for (let i = 0; i < _newBitString.length; i++) {
      bit = _newBitString.charAt(i);
      this.change(bit, i);
    }
  }

  getSaveFromList(pos) {
    return pos >= this.cursorPos ? this.list[pos + 1] : this.list[pos];
  }

  invert() {
    this.changeTo(
      this.getRealBitSize(this.dec2bin(~parseInt(this.bitString, 2)))
    );
  }

  change(bit, pos) {
    let listElem = this.getSaveFromList(pos);
    listElem.bit = bit;
    listElem.elem = (
      <BitBox
        key={listElem.key}
        bit={listElem.bit}
        active={listElem.active}
      ></BitBox>
    );
    this.changeInStringAt(bit, pos);
  }

  changeInStringAt(bit, pos) {
    this.bitString =
      this.bitString.substr(0, pos) +
      bit +
      this.bitString.substr(pos + 1, this.bitString.length);
  }

  render() {
    return this.list.map((x) => x.elem);
  }

  getHexValue() {
    return this.getSafeOutput(parseInt(this.bitString, 2).toString(16));
  }

  getDecValue() {
    return this.getSafeOutput(parseInt(this.bitString, 2).toString(10));
  }

  getUnicodeValue() {
    return this.getSafeOutput(String.fromCharCode(parseInt(this.bitString, 2)));
  }

  getSafeOutput(input) {
    return this.bitString != '' ? input : '-';
  }

  dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  getRealBitSize(_bitString) {
    return _bitString.substr(
      _bitString.length - this.bitString.length,
      _bitString.length
    );
  }
}

export { BitList };
