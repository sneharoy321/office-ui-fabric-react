import * as React from 'react';
import { classNamesFunction } from '../../Utilities';
import { IChicletCardStyles, IChicletCardStyleProps } from './ChicletCard.types';
import { IChicletCardProps } from './ChicletCard.types';
import { generatePreview } from '../../utilities/chicletHelper';

const getClassNames = classNamesFunction<IChicletCardStyleProps, IChicletCardStyles>();

const PREVIEW_IMAGE_WIDTH = '61px';
const PREVIEW_IMAGE_HEIGHT = '59px';

export class ChicletXsmallBase extends React.Component<IChicletCardProps, {}> {
  private _classNames: { [key in keyof IChicletCardStyles]: string };

  public render(): JSX.Element {
    const { onClick, title, image, imageAlt, className, footer, theme, styles, url } = this.props;

    const footerProvided = !!footer;
    const imageProvided = !!image || !!imageAlt;

    this._classNames = getClassNames(styles, { theme: theme!, className, footerProvided });

    // if this element is actionable it should have an aria role
    const role = onClick ? 'button' : 'link';
    const tabIndex = onClick ? 0 : undefined;

    return (
      <div tabIndex={tabIndex} role={role} onClick={this._onClick} className={this._classNames.root}>
        {generatePreview(this.props, imageProvided, this._classNames, PREVIEW_IMAGE_HEIGHT, PREVIEW_IMAGE_WIDTH)}
        <div className={this._classNames.info}>
          <div className={this._classNames.title}>{title ? title : null}</div>
          <div className={this._classNames.url}>{url ? url : null}</div>
        </div>
        {footer}
      </div>
    );
  }

  private _onClick = (ev: React.MouseEvent<HTMLElement>): void => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(ev);
    }
  };
}
