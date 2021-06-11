import React from 'react';

import BitBox from './components/BitBox';
import BitNumber from './components/BitNumber';
import ByteRuler from './components/ByteRuler';
import Filler from './components/Filler';

class BitList {
  constructor(_bitString) {
    this.bitString = '';
    this.list = [];
    this.byteList = [];
    this.cursorPos = 0;
    this.indices = [];

    this.cursor = <span key='-1' className='cursor h-12'></span>;
    this.cursorBlank = (
      <span key='-1' className='cursor cursor_left h-12'></span>
    );
    this.cursorBlank2 = (
      <span key='-1' className='cursor cursor_left2 h-12'></span>
    );
    this.cursorToLeft = false;
    this.numRegex = new RegExp('^[01]$');

    let i = 0;
    this.addToList(false, null, null, null, i);
    if (_bitString != '') {
      for (; i < _bitString.length; i++) {
        this.addToList(true, _bitString.charAt(i), false, i, i);
        this.indices.push(i);
      }
    }
  }

  addSaveToList(_isBit, _bit, _active) {
    if (_isBit) {
      let i = 0;
      for (; i < this.indices.length; i++) {
        if (this.indices[i] != i) {
          break;
        }
      }
      if (this.list[this.cursorPos].isBit) {
        this.list[this.cursorPos].bitElem = (
          <BitBox
            key={this.list[this.cursorPos].key}
            bit={this.list[this.cursorPos].bit}
            active={this.list[this.cursorPos].active}
          ></BitBox>
        );
        this.addToList(
          true,
          _bit,
          _active,
          i,
          this.cursorToLeft ? 0 : this.cursorPos + 1
        );

        const tempToLeft = this.cursorToLeft;
        if (this.cursorToLeft) {
          this.cursorToLeft = false;
        }
        this.addToList(
          false,
          null,
          null,
          null,
          tempToLeft ? 0 : this.cursorPos + 1
        );
        if (!tempToLeft) {
          this.cursorPos++;
        }
      } else {
        this.deleteFromList(this.cursorPos);
        this.addToList(true, _bit, _active, i, this.cursorPos);
        this.addToList(false, null, null, null, this.cursorPos);
      }
      this.indices.push(i);
      this.indices.sort((a, b) => a - b);
    }
  }

  recalculateByteList() {
    const currentBytesNeeded = Math.ceil(this.list.length / 8);
    const byteDiff = this.byteList.length - currentBytesNeeded;
    const currentBytes = this.byteList.length;
    if (byteDiff < 0) {
      //add bytes
      for (
        let i = this.byteList.length;
        i < currentBytes + Math.abs(byteDiff);
        i++
      ) {
        this.byteList.splice(0, 0, <ByteRuler key={i}>{i + 1}</ByteRuler>);
      }
    } else if (byteDiff > 0) {
      for (let i = 0; i < byteDiff; i++) {
        this.byteList.shift();
      }
    }
  }

  addToList(_isBit, _bit, _active, _key, pos) {
    if (_isBit) {
      this.list.splice(pos, 0, {
        isBit: true,
        bit: _bit,
        active: _active,
        key: _key,
        bitElem: null,
      });
      this.list[pos].bitElem = (
        <BitBox
          key={this.list[pos].key}
          bit={this.list[pos].bit}
          active={this.list[pos].active}
        ></BitBox>
      );
      this.addToSting(_bit, pos);
      this.recalculateByteList();
    } else {
      if (this.list[pos]) {
        this.list[pos].bitElem = (
          <BitBox
            key={this.list[pos].key}
            bit={this.list[pos].bit}
            active={this.list[pos].active}
            cursorToLeft={this.cursorToLeft}
          >
            {this.cursorToLeft ? this.cursorBlank2 : this.cursor}
          </BitBox>
        );
      } else {
        this.list.splice(pos, 0, {
          isBit: false,
          bitElem: <div className='cell bit'>{this.cursorBlank}</div>,
        });
      }
    }
  }

  addToSting(bit, pos) {
    this.bitString =
      this.bitString.substr(0, pos) +
      bit +
      this.bitString.substr(pos, this.bitString.length);
  }

  deleteSaveFromList() {
    if (this.list[this.cursorPos].isBit) {
      this.deleteFromSting(this.cursorPos);
      this.indices.splice(
        this.indices.findIndex((el) => el == this.list[this.cursorPos].key),
        1
      );
      this.list.splice(this.cursorPos, 1);
      this.recalculateByteList();
      const newCursorPos = this.cursorPos - 1 >= 0 ? this.cursorPos - 1 : 0;
      this.addToList(false, null, null, null, newCursorPos);
      this.cursorPos = newCursorPos;
      this.indices.sort((a, b) => a - b);
    }
  }

  deleteFromList(pos) {
    if (this.list[pos]) {
      if (this.list[pos].bitElem != this.cursor) {
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
    if (left) {
      if (this.cursorPos - 1 >= 0) {
        this.list[this.cursorPos].bitElem = (
          <BitBox
            key={this.list[this.cursorPos].key}
            bit={this.list[this.cursorPos].bit}
            active={this.list[this.cursorPos].active}
          ></BitBox>
        );
        this.addToList(false, null, null, null, this.cursorPos - 1);
        this.cursorPos--;
      } else if (!this.cursorToLeft && this.cursorPos - 1 == -1) {
        this.list[this.cursorPos].bitElem = (
          <BitBox
            key={this.list[this.cursorPos].key}
            bit={this.list[this.cursorPos].bit}
            active={this.list[this.cursorPos].active}
          ></BitBox>
        );
        this.cursorToLeft = true;
        this.addToList(false, null, null, null, 0);
      }
    } else if (!left && this.cursorPos + 1 < this.bitString.length) {
      this.list[this.cursorPos].bitElem = (
        <BitBox
          key={this.list[this.cursorPos].key}
          bit={this.list[this.cursorPos].bit}
          active={this.list[this.cursorPos].active}
        ></BitBox>
      );
      if (!this.cursorToLeft) {
        this.addToList(false, null, null, null, this.cursorPos + 1);
        this.cursorPos++;
      } else {
        this.cursorToLeft = false;
        this.addToList(false, null, null, null, 0);
      }
    }
  }

  clear() {
    this.bitString = '';
    this.list = [
      {
        isBit: false,
        bitElem: this.cursor,
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
    listElem.bitElem = (
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

  renderFiller(bit) {
    const span = 8 - (this.list.length % 8);

    if (
      this.list.length % 8 != 0 &&
      !(this.list.length == 1 && !this.list[0].isBit)
    ) {
      return <Filler bit={bit} span={span}></Filler>;
    } else {
      return '';
    }
  }

  render() {
    return [this.renderFiller(true), ...this.list.map((x) => x.bitElem)];
  }

  renderBitNumbers() {
    let result = [];
    for (let i = this.bitString.length; i > 0; i--) {
      result.push(<BitNumber key={i}>{i}</BitNumber>);
    }
    return [this.renderFiller(false), ...result];
  }

  renderBytes() {
    let result = [];
    for (let i = 0; i < this.byteList.length; i++) {
      result.push(this.byteList[i]);
    }
    return result;
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
