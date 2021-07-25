import React from 'react';

import BitBox from './components/BitBox';
import BitNumber from './components/BitNumber';
import ByteRuler from './components/ByteRuler';
import Filler from './components/Filler';
import ByteValueLabels from './components/ByteValueLabels';
import ByteButtons from './components/ByteButtons';

class BasicBitList {
  constructor(_bitString, fillWith) {
    this.bitString = '';
    this.list = [];
    this.byteList = [];
    this.valueList = [];
    this.byteButtonList = [];
    this.cursorPos = 0;
    this.indices = [];
    this.fillWith = fillWith || '-1';

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
    this.addToList(false, null, 0, null, i);
    if (_bitString != '') {
      for (; i < _bitString.length; i++) {
        this.addToList(true, _bitString.charAt(i), 0, i, i);
        this.indices.push(i);
      }
    }
  }

  clear() {
    this.bitString = '';
    this.list = [];
    this.byteList = [];
    this.valueList = [];
    this.byteButtonList = [];
    this.indices = [];
    this.cursorPos = 0;
    this.cursorToLeft = false;
    this.addToList(false, null, 0, null, 0);
  }

  addSaveToList(_isBit, _bit, _color) {
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
            color={this.list[this.cursorPos].color}
          ></BitBox>
        );
        this.addToList(
          true,
          _bit,
          _color,
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
          0,
          null,
          tempToLeft ? 0 : this.cursorPos + 1
        );
        if (!tempToLeft) {
          this.cursorPos++;
        }
      } else {
        this.deleteFromList(this.cursorPos);
        this.addToList(true, _bit, _color, i, this.cursorPos);
        this.addToList(false, null, 0, null, this.cursorPos);
      }
      this.indices.push(i);
      this.indices.sort((a, b) => a - b);
    }
  }

  addToList(_isBit, _bit, _color, _key, pos) {
    if (_isBit) {
      this.list.splice(pos, 0, {
        isBit: true,
        bit: _bit,
        color: _color,
        key: _key,
        bitElem: null,
      });
      this.list[pos].bitElem = (
        <BitBox
          key={this.list[pos].key}
          bit={this.list[pos].bit}
          color={this.list[pos].color}
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
            color={this.list[pos].color}
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
      this.getBitString(false).substr(0, pos) +
      bit +
      this.getBitString(false).substr(pos, this.getBitString(false).length);
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
      this.getBitString(false).substr(0, pos) +
      this.getBitString(false).substr(pos + 1, this.getBitString(false).length);
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
        this.valueList.splice(
          0,
          0,
          <ByteValueLabels hex='-' dec='-'></ByteValueLabels>
        );
        this.byteList.splice(0, 0, <ByteRuler key={i}>{i + 1}</ByteRuler>);
        this.byteButtonList.splice(
          0,
          0,
          <ByteButtons list={this}>{i + 1}</ByteButtons>
        );
      }
    } else if (byteDiff > 0) {
      for (let i = 0; i < byteDiff; i++) {
        this.byteList.shift();
        this.valueList.shift();
        this.byteButtonList.shift();
      }
    }
    this.updateValueList();
  }

  updateValueList() {
    let unfinished_counter = Math.ceil(
      (this.byteList.length * 8 - this.getBitString(true).length) / 8
    );
    const unfinished = unfinished_counter;
    for (let i = 0; i < this.valueList.length; i++) {
      if (unfinished_counter > 0) {
        this.valueList[i] = <ByteValueLabels hex='-' dec='-'></ByteValueLabels>;
        unfinished_counter--;
      } else {
        const startPos =
          (this.getBitString(true).length % 8) + (i - unfinished) * 8;
        const hexVal = this.getHexValue(
          this.getBitString(true).substr(startPos, 8)
        );
        const decVal = this.getDecValue(
          this.getBitString(true).substr(startPos, 8)
        );
        this.valueList[i] = (
          <ByteValueLabels hex={hexVal} dec={decVal}></ByteValueLabels>
        );
      }
    }
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
      this.addToList(false, null, 0, null, newCursorPos);
      this.cursorPos = newCursorPos;
      this.indices.sort((a, b) => a - b);
    }
  }

  change(bit, pos) {
    let listElem = this.list[pos];
    listElem.bit = bit;
    this.changeInListWithSaveCursor(bit, pos);
    this.changeInStringAt(bit, pos);
    this.updateValueList();
  }

  changeToNewStringAt(_newBitString, pos) {
    let bit = '';

    for (let i = 0; i < _newBitString.length; i++) {
      if (i + pos > this.list.length) {
        return;
      }
      bit = _newBitString.charAt(i);
      this.change(bit, i + pos);
    }
  }

  changeInListWithSaveCursor(bit, pos) {
    if (this.cursorPos == pos) {
      this.list[pos].bitElem = (
        <BitBox
          key={this.list[pos].key}
          bit={bit}
          color={this.list[pos].color}
          cursorToLeft={this.cursorToLeft}
        >
          {this.cursorToLeft ? this.cursorBlank2 : this.cursor}
        </BitBox>
      );
    } else {
      this.list[pos].bitElem = (
        <BitBox
          key={this.list[pos].key}
          bit={this.list[pos].bit}
          color={this.list[pos].color}
          cursorToLeft={this.cursorToLeft}
        ></BitBox>
      );
    }
  }

  changeInStringAt(bit, pos) {
    this.bitString =
      this.getBitString(false).substr(0, pos) +
      bit +
      this.getBitString(false).substr(pos + 1, this.getBitString(false).length);
  }

  changeFilling(_fillWith) {
    this.fillWith = _fillWith;
    this.updateValueList();
  }

  getBitString(filled) {
    const padWithFiller = (str, filler, span) => {
      let result = str;
      while (span > 0) {
        result = filler + result;
        span--;
      }
      return result;
    };
    if (filled) {
      const span = 8 - (this.list.length % 8);
      if (this.fillWith == '-1') {
        return this.bitString;
      } else {
        return padWithFiller(this.bitString, this.fillWith, span);
      }
    } else {
      return this.bitString;
    }
  }
}

class InteractiveBitList extends BasicBitList {
  moveCursor(left) {
    if (left) {
      if (this.cursorPos - 1 >= 0) {
        this.list[this.cursorPos].bitElem = (
          <BitBox
            key={this.list[this.cursorPos].key}
            bit={this.list[this.cursorPos].bit}
            color={this.list[this.cursorPos].color}
          ></BitBox>
        );
        this.addToList(false, null, 0, null, this.cursorPos - 1);
        this.cursorPos--;
      } else if (!this.cursorToLeft && this.cursorPos - 1 == -1) {
        this.list[this.cursorPos].bitElem = (
          <BitBox
            key={this.list[this.cursorPos].key}
            bit={this.list[this.cursorPos].bit}
            color={this.list[this.cursorPos].color}
          ></BitBox>
        );
        this.cursorToLeft = true;
        this.addToList(false, null, 0, null, 0);
      }
    } else if (!left && this.cursorPos + 1 < this.getBitString(false).length) {
      this.list[this.cursorPos].bitElem = (
        <BitBox
          key={this.list[this.cursorPos].key}
          bit={this.list[this.cursorPos].bit}
          color={this.list[this.cursorPos].color}
        ></BitBox>
      );
      if (!this.cursorToLeft) {
        this.addToList(false, null, 0, null, this.cursorPos + 1);
        this.cursorPos++;
      } else {
        this.cursorToLeft = false;
        this.addToList(false, null, 0, null, 0);
      }
    }
  }

  getHexValue(input = this.getBitString(true)) {
    return this.getSafeOutput(parseInt(input, 2).toString(16));
  }

  getDecValue(input = this.getBitString(true)) {
    return this.getSafeOutput(parseInt(input, 2).toString(10));
  }

  getUnicodeValue() {
    return this.getSafeOutput(
      String.fromCharCode(parseInt(this.getBitString(true), 2))
    );
  }

  getSafeOutput(input) {
    return this.getBitString(false) != '' ? input : '-';
  }

  dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  getByte(pos, withFiller) {
    const unfinished = Math.ceil(
      (this.byteList.length * 8 - this.getBitString(withFiller).length) / 8
    );
    if (unfinished > 0 && pos == this.byteList.length) {
      return {
        string: this.getBitString(withFiller).substr(
          0,
          this.getBitString(withFiller).length % 8
        ),
        startPos: 0,
      };
    } else {
      const startPos =
        (this.getBitString(withFiller).length % 8) +
        (this.byteList.length - unfinished - pos) * 8;
      return {
        string: this.getBitString(withFiller).substr(startPos, 8),
        startPos,
      };
    }
  }

  getRealBitSize(_bitString, comparisonString) {
    return _bitString.substr(
      _bitString.length - comparisonString.length,
      _bitString.length
    );
  }

  invert() {
    this.changeToNewStringAt(
      this.getRealBitSize(
        this.dec2bin(~parseInt(this.getBitString(false), 2)),
        this.getBitString(false)
      ),
      0
    );
  }
}

class BitList extends InteractiveBitList {
  render() {
    return [this.renderFiller(true), ...this.list.map((x) => x.bitElem)];
  }

  renderBitNumbers() {
    let result = [];
    for (let i = this.getBitString(false).length; i > 0; i--) {
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

  renderValues() {
    let result = [];
    for (let i = 0; i < this.valueList.length; i++) {
      result.push(this.valueList[i]);
    }
    return result;
  }

  renderByteButtons() {
    let result = [];
    for (let i = 0; i < this.byteButtonList.length; i++) {
      result.push(this.byteButtonList[i]);
    }
    return result;
  }

  renderFiller(bit) {
    const span = 8 - (this.list.length % 8);

    if (
      this.list.length % 8 != 0 &&
      !(this.list.length == 1 && !this.list[0].isBit)
    ) {
      if (this.fillWith != '-1' && bit) {
        const result = [];
        for (let i = 0; i < span; i++) {
          result.push(
            <BitBox
              key={-i - 1}
              bit={this.fillWith}
              color={1}
              cursorToLeft={false}
            ></BitBox>
          );
        }
        return result;
      } else {
        return <Filler bit={bit} span={span}></Filler>;
      }
    } else {
      return '';
    }
  }
}

export { BitList };
