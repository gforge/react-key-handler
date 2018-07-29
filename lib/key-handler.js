/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {canUseDOM} from 'exenv';

import {KEYDOWN, KEYPRESS, KEYUP} from './constants';
import {type rawOrArray} from './types';
import {isInput, matchesKeyboardEvent} from './utils';

type Props = {|
  +keyValue?: ?rawOrArray<string>,
  +keyCode?: ?rawOrArray<number>,
  +code?: ?rawOrArray<string>,
  +keyEventName: KEYDOWN | KEYPRESS | KEYUP,
  +onKeyHandle?: (event: KeyboardEvent) => void,
|}

export default class KeyHandler extends React.Component<Props> {
  static propTypes = {
    keyValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    keyCode: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number),
    ]),
    code: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    keyEventName: PropTypes.oneOf([KEYDOWN, KEYPRESS, KEYUP]),
    onKeyHandle: PropTypes.func,
  };

  static defaultProps = {
    keyEventName: KEYUP,
  };

  shouldComponentUpdate(): boolean {
    return false;
  }

  constructor(props: Props) {
    super(props);

    /* eslint-disable no-console */
    if (props.keyCode) {
      console.warn('The `keyCode` is deprecated, use `code` instead');
    }

    if (!props.keyValue && !props.keyCode && !props.code) {
      console.error('Warning: Failed propType: Missing prop `keyValue` or `keyCode` for `KeyHandler`.');
    }

    /* eslint-enable */
  }

  componentDidMount(): void {
    if (!canUseDOM) return;

    window.document.addEventListener(this.props.keyEventName, this.handleKey);
  }

  componentWillUnmount(): void {
    if (!canUseDOM) return;

    window.document.removeEventListener(this.props.keyEventName, this.handleKey);
  }

  render(): null {
    return null;
  }

  handleKey = (event: KeyboardEvent): void => {
    const {keyValue, keyCode, code, onKeyHandle} = this.props;

    if (!onKeyHandle) {
      return;
    }

    const {target} = event;

    if (target instanceof window.HTMLElement && isInput(target)) {
      return;
    }

    if (!matchesKeyboardEvent(event, {keyValue, keyCode, code})) {
      return;
    }

    onKeyHandle(event);
  };
}
