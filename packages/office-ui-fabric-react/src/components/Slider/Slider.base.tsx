import * as React from 'react';
import { BaseComponent, KeyCodes, css, getId, getRTL, getRTLSafeKeyCode } from '../../Utilities';
import { ISliderProps, ISlider, ISliderStyleProps, ISliderStyles } from './Slider.types';
import { classNamesFunction, getNativeProps, divProperties } from '../../Utilities';
import { Label } from '../../Label';
// import { TooltipHost } from '../Tooltip';
// import { DefaultButton } from '../Button';
import { Beak } from '../../Beak';
import { RectangleEdge, getOppositeEdge } from '../../utilities/positioning';

export interface ISliderState {
  value?: number;
  renderedValue?: number;
  /**
   * The left position of the beak
   */
  beakLeft?: string;

  /**
   * The right position of the beak
   */
  beakTop?: string;

  /**
   * The right position of the beak
   */
  beakRight?: string;

  /**
   * The bottom position of the beak
   */
  beakBottom?: string;

  /**
   * Position of Coachmark/TeachingBubble in relation to target
   */
  targetPosition?: RectangleEdge;
}

const getClassNames = classNamesFunction<ISliderStyleProps, ISliderStyles>();
export const ONKEYDOWN_TIMEOUT_DURATION = 1000;

export class SliderBase extends BaseComponent<ISliderProps, ISliderState> implements ISlider {
  public static defaultProps: ISliderProps = {
    step: 1,
    min: 0,
    max: 10,
    showValue: true,
    disabled: false,
    vertical: false,
    buttonProps: {},
    originFromZero: false
  };

  private _sliderLine = React.createRef<HTMLDivElement>();
  private _thumb = React.createRef<HTMLSpanElement>();
  private _id: string;
  private _onKeyDownTimer = -1;

  constructor(props: ISliderProps) {
    super(props);

    this._warnMutuallyExclusive({
      value: 'defaultValue'
    });

    this._id = getId('Slider');

    const value = props.value !== undefined ? props.value : props.defaultValue !== undefined ? props.defaultValue : props.min;

    this.state = {
      value: value,
      renderedValue: undefined
    };
  }

  private get _beakDirection(): RectangleEdge {
    const { targetPosition } = this.state;
    if (targetPosition === undefined) {
      return RectangleEdge.bottom;
    }

    return getOppositeEdge(targetPosition);
  }

  public render(): React.ReactElement<{}> {
    const {
      ariaLabel,
      className,
      disabled,
      label,
      max,
      min,
      showValue,
      buttonProps,
      vertical,
      valueFormat,
      styles,
      theme,
      originFromZero,
      marks,
      thumblabel
    } = this.props;
    const { beakLeft, beakTop, beakRight, beakBottom } = this.state;
    // Defaulting the main background before passing it to the styles because it is used for `Beak` too.
    const defaultColor = theme!.semanticColors.primaryButtonBackground;
    const value = this.value;
    const renderedValue = this.renderedValue;
    const thumbOffsetPercent: number = min === max ? 0 : ((renderedValue! - min!) / (max! - min!)) * 100;
    const zeroOffsetPercent: number = min! >= 0 ? 0 : (-min! / (max! - min!)) * 100;
    const lengthString = vertical ? 'height' : 'width';
    const onMouseDownProp: {} = disabled ? {} : { onMouseDown: this._onMouseDownOrTouchStart };
    const onTouchStartProp: {} = disabled ? {} : { onTouchStart: this._onMouseDownOrTouchStart };
    const onKeyDownProp: {} = disabled ? {} : { onKeyDown: this._onKeyDown };
    const classNames = getClassNames(styles, {
      className,
      disabled,
      vertical,
      showTransitions: renderedValue === value,
      showValue,
      theme: theme!
    });
    const divButtonProps = buttonProps ? getNativeProps<React.HTMLAttributes<HTMLDivElement>>(buttonProps, divProperties) : undefined;

    return (
      <div className={classNames.root}>
        {label && (
          <Label className={classNames.titleLabel} {...(ariaLabel ? {} : { htmlFor: this._id })} disabled={disabled}>
            {label}
          </Label>
        )}
        <div className={classNames.container}>
          <div
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={this._getAriaValueText(value)}
            aria-label={ariaLabel || label}
            aria-disabled={disabled}
            {...onMouseDownProp}
            {...onTouchStartProp}
            {...onKeyDownProp}
            {...divButtonProps}
            className={css(classNames.slideBox, buttonProps!.className)}
            id={this._id}
            role="slider"
            tabIndex={disabled ? undefined : 0}
            data-is-focusable={!disabled}
          >
            <div ref={this._sliderLine} className={classNames.line}>
              {/* {this is where origin from zero stuff is} */}
              {originFromZero && ( // line that adds the tick
                <span
                  className={css(classNames.zeroTick)}
                  style={
                    // the zeroOffsetPercent denotes where the tick mark should go
                    this._getStyleUsingOffsetPercent(vertical, zeroOffsetPercent)
                  }
                />
              )}
              {/* {tick marks will go here} */}
              {typeof marks === 'boolean' && marks && this._addTickmarks(css(classNames.zeroTick))}
              <span ref={this._thumb} className={classNames.thumb} style={this._getStyleUsingOffsetPercent(vertical, thumbOffsetPercent)} />
              {originFromZero ? (
                <>
                  <span
                    className={css(classNames.lineContainer, classNames.inactiveSection)}
                    style={{ [lengthString]: Math.min(thumbOffsetPercent, zeroOffsetPercent) + '%' }}
                  />
                  <span
                    className={css(classNames.lineContainer, classNames.activeSection)}
                    style={{ [lengthString]: Math.abs(zeroOffsetPercent - thumbOffsetPercent) + '%' }}
                  />

                  <span // 2nd half of slider
                    className={css(classNames.lineContainer, classNames.inactiveSection)}
                    style={{ [lengthString]: Math.min(100 - thumbOffsetPercent, 100 - zeroOffsetPercent) + '%' }}
                  />
                </>
              ) : (
                <>
                  <span
                    className={css(classNames.lineContainer, classNames.activeSection)}
                    style={{ [lengthString]: thumbOffsetPercent + '%' }}
                  />
                  {/* So basically this displays the value of the slider inline with the slider thumb and it only does
                    so when specified by thumblabel property */}

                  {thumblabel && showValue && <Label className={classNames.valueLabel}>{valueFormat ? valueFormat(value!) : value}</Label>}
                  {thumblabel ? (
                    <Beak
                      left={beakLeft}
                      top={beakTop}
                      right={beakRight}
                      bottom={beakBottom}
                      direction={this._beakDirection}
                      color={defaultColor}
                    />
                  ) : (
                    <br />
                  )}
                  <span
                    className={css(classNames.lineContainer, classNames.inactiveSection)}
                    style={{ [lengthString]: 100 - thumbOffsetPercent + '%' }}
                  />
                </>
              )}
            </div>
            {!thumblabel && showValue && <Label className={classNames.valueLabel}>{valueFormat ? valueFormat(value!) : value}</Label>}
          </div>
          {showValue && (
            <Label className={classNames.valueLabel} disabled={disabled}>
              {valueFormat ? valueFormat(value!) : value}
            </Label>
          )}
        </div>
      </div>
    ) as React.ReactElement<{}>;
  }

  public focus(): void {
    if (this._thumb.current) {
      this._thumb.current.focus();
    }
  }

  public get value(): number | undefined {
    const { value = this.state.value } = this.props;
    if (this.props.min === undefined || this.props.max === undefined || value === undefined) {
      return undefined;
    } else {
      return Math.max(this.props.min, Math.min(this.props.max, value));
    }
  }

  private get renderedValue(): number | undefined {
    // renderedValue is expected to be defined while user is interacting with control, otherwise `undefined`. Fall back to `value`.
    const { renderedValue = this.value } = this.state;
    return renderedValue;
  }

  private _getAriaValueText = (value: number | undefined): string | undefined => {
    if (this.props.ariaValueText && value !== undefined) {
      return this.props.ariaValueText(value);
    }
  };

  private _getStyleUsingOffsetPercent(vertical: boolean | undefined, thumbOffsetPercent: number): any {
    const direction: string = vertical ? 'bottom' : getRTL() ? 'right' : 'left';
    return {
      [direction]: thumbOffsetPercent + '%'
    };
  }

  private _addTickmarks(cssZeroTickClassNames: string | undefined) {
    const { min, max, step, vertical } = this.props;
    if (min === undefined || max === undefined || step === undefined) {
      return [];
    }
    const ticks = [];
    for (let i = 0; i <= 100; i += (100 * step) / (max - min)) {
      // += number is basically the distance between each tick
      ticks.push(
        <span
          className={cssZeroTickClassNames}
          style={
            // the zeroOffsetPercent denotes where the tick mark should go
            this._getStyleUsingOffsetPercent(vertical, i)
          }
        />
      );
    }
    console.log(ticks);
    // return html here
    return ticks;
  }

  private _onMouseDownOrTouchStart = (event: MouseEvent | TouchEvent): void => {
    if (event.type === 'mousedown') {
      this._events.on(window, 'mousemove', this._onMouseMoveOrTouchMove, true);
      this._events.on(window, 'mouseup', this._onMouseUpOrTouchEnd, true);
    } else if (event.type === 'touchstart') {
      this._events.on(window, 'touchmove', this._onMouseMoveOrTouchMove, true);
      this._events.on(window, 'touchend', this._onMouseUpOrTouchEnd, true);
    }
    this._onMouseMoveOrTouchMove(event, true);
  };

  private _onMouseMoveOrTouchMove = (event: MouseEvent | TouchEvent, suppressEventCancelation?: boolean): void => {
    if (!this._sliderLine.current) {
      return;
    }

    const { max, min, step } = this.props;
    const steps: number = (max! - min!) / step!;
    const sliderPositionRect: ClientRect = this._sliderLine.current.getBoundingClientRect();
    const sliderLength: number = !this.props.vertical ? sliderPositionRect.width : sliderPositionRect.height;
    const stepLength: number = sliderLength / steps;
    let currentSteps: number | undefined;
    let distance: number | undefined;

    if (!this.props.vertical) {
      const left: number | undefined = this._getPosition(event, this.props.vertical);
      distance = getRTL() ? sliderPositionRect.right - left! : left! - sliderPositionRect.left;
      currentSteps = distance / stepLength;
    } else {
      const bottom: number | undefined = this._getPosition(event, this.props.vertical);
      distance = sliderPositionRect.bottom - bottom!;
      currentSteps = distance / stepLength;
    }

    let currentValue: number | undefined;
    let renderedValue: number | undefined;

    // The value shouldn't be bigger than max or be smaller than min.
    if (currentSteps! > Math.floor(steps)) {
      renderedValue = currentValue = max as number;
    } else if (currentSteps! < 0) {
      renderedValue = currentValue = min as number;
    } else {
      renderedValue = min! + step! * currentSteps!;
      currentValue = min! + step! * Math.round(currentSteps!);
    }

    this._updateValue(currentValue, renderedValue);
    // after value is updated time to snap the value to the next good value

    if (!suppressEventCancelation) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  private _getPosition(event: MouseEvent | TouchEvent, vertical: boolean | undefined): number | undefined {
    let currentPosition: number | undefined;
    switch (event.type) {
      case 'mousedown':
      case 'mousemove':
        currentPosition = !vertical ? (event as MouseEvent).clientX : (event as MouseEvent).clientY;
        break;
      case 'touchstart':
      case 'touchmove':
        currentPosition = !vertical ? (event as TouchEvent).touches[0].clientX : (event as TouchEvent).touches[0].clientY;
        break;
    }
    return currentPosition;
  }

  private _updateValue(value: number, renderedValue: number): void {
    const { step, snaps } = this.props;

    let numDec = 0;
    if (isFinite(step!)) {
      while (Math.round(step! * Math.pow(10, numDec)) / Math.pow(10, numDec) !== step!) {
        numDec++;
      }
    }

    // Make sure value has correct number of decimal places based on number of decimals in step
    const roundedValue = parseFloat(value.toFixed(numDec));
    const valueChanged = roundedValue !== this.state.value;
    // as long as current num value is diff than roundedVal then its changed so val change is true
    // console.log(renderedValue + ' ' + roundedValue);
    // if the property is told to snap
    if (this.props.snaps) {
      renderedValue = roundedValue;
    }

    this.setState(
      {
        value: roundedValue,
        renderedValue
      },
      () => {
        if (valueChanged && this.props.onChange) {
          this.props.onChange(this.state.value as number);
        }
      }
    );
  }

  private _onMouseUpOrTouchEnd = (event: MouseEvent | TouchEvent): void => {
    // Disable renderedValue override.
    this.setState({
      renderedValue: undefined
    });

    if (this.props.onChanged) {
      this.props.onChanged(event, this.state.value as number);
    }

    this._events.off();
  };

  private _onKeyDown = (event: KeyboardEvent): void => {
    let value: number | undefined = this.state.value;
    const { max, min, step } = this.props;

    let diff: number | undefined = 0;

    switch (event.which) {
      case getRTLSafeKeyCode(KeyCodes.left):
      case KeyCodes.down:
        diff = -(step as number);

        this._clearOnKeyDownTimer();
        this._setOnKeyDownTimer(event);

        break;
      case getRTLSafeKeyCode(KeyCodes.right):
      case KeyCodes.up:
        diff = step;

        this._clearOnKeyDownTimer();
        this._setOnKeyDownTimer(event);

        break;

      case KeyCodes.home:
        value = min;
        break;

      case KeyCodes.end:
        value = max;
        break;

      default:
        return;
    }

    const newValue: number = Math.min(max as number, Math.max(min as number, value! + diff!));

    this._updateValue(newValue, newValue);

    event.preventDefault();
    event.stopPropagation();
  };

  private _clearOnKeyDownTimer = (): void => {
    this._async.clearTimeout(this._onKeyDownTimer);
  };

  private _setOnKeyDownTimer = (event: KeyboardEvent): void => {
    this._onKeyDownTimer = this._async.setTimeout(() => {
      if (this.props.onChanged) {
        this.props.onChanged(event, this.state.value as number);
      }
    }, ONKEYDOWN_TIMEOUT_DURATION);
  };
}
