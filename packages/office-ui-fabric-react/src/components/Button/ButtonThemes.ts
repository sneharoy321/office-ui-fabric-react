import { IButtonStyles } from './Button.types';
import { ITheme, HighContrastSelector } from '../../Styling';
import { IsFocusVisibleClassName } from '../../Utilities';

export function standardStyles(theme: ITheme): IButtonStyles {
  const { semanticColors: s, palette: p } = theme;

  const buttonBackground = s.buttonBackground;
  const buttonBackgroundPressed = s.buttonBackgroundPressed;
  const buttonBackgroundHovered = s.buttonBackgroundHovered;

  const buttonText = s.buttonText;
  const buttonTextHovered = s.buttonTextHovered;
  const buttonTextChecked = s.buttonTextChecked;
  const buttonTextCheckedHovered = s.buttonTextCheckedHovered;

  return {
    root: {
      backgroundColor: buttonBackground,
      color: buttonText
    },

    rootHovered: {
      backgroundColor: buttonBackgroundHovered,
      color: buttonTextHovered,
      selectors: {
        [HighContrastSelector]: {
          borderColor: 'Highlight',
          color: 'Highlight'
        }
      }
    },

    rootPressed: {
      backgroundColor: buttonBackgroundPressed,
      color: buttonTextChecked
    },

    rootExpanded: {
      backgroundColor: buttonBackgroundPressed,
      color: buttonTextChecked
    },

    rootChecked: {
      backgroundColor: buttonBackgroundPressed,
      color: buttonTextChecked
    },

    rootCheckedHovered: {
      backgroundColor: buttonBackgroundPressed,
      color: buttonTextCheckedHovered
    },

    rootDisabled: {
      selectors: {
        [HighContrastSelector]: {
          color: 'GrayText',
          borderColor: 'GrayText',
          backgroundColor: 'Window'
        }
      }
    },

    // Split button styles
    splitButtonContainer: {
      selectors: {
        [HighContrastSelector]: {
          border: 'none'
        }
      }
    },

    splitButtonMenuButton: {
      color: p.white,
      backgroundColor: 'transparent',
      selectors: {
        ':hover': {
          backgroundColor: p.neutralLight,
          selectors: {
            [HighContrastSelector]: {
              color: 'Highlight'
            }
          }
        }
      }
    },

    splitButtonMenuButtonDisabled: {
      backgroundColor: s.buttonBackgroundDisabled,
      selectors: {
        ':hover': {
          backgroundColor: s.buttonBackgroundDisabled
        }
      }
    },

    splitButtonDivider: {
      backgroundColor: p.neutralTertiaryAlt
    },

    splitButtonDividerDisabled: {
      backgroundColor: theme.palette.neutralTertiaryAlt
    },

    splitButtonMenuButtonChecked: {
      backgroundColor: p.neutralQuaternaryAlt,
      selectors: {
        ':hover': {
          backgroundColor: p.neutralQuaternaryAlt
        }
      }
    },

    splitButtonMenuButtonExpanded: {
      backgroundColor: p.neutralQuaternaryAlt,
      selectors: {
        ':hover': {
          backgroundColor: p.neutralQuaternaryAlt
        }
      }
    },

    splitButtonMenuIcon: {
      color: s.buttonText
    },

    splitButtonMenuIconDisabled: {
      color: s.buttonTextDisabled
    }
  };
}

export function primaryStyles(theme: ITheme): IButtonStyles {
  const { palette: p, semanticColors: s } = theme;

  return {
    root: {
      backgroundColor: s.primaryButtonBackground,
      color: s.primaryButtonText,
      border: 'none',
      selectors: {
        [HighContrastSelector]: {
          color: 'Window',
          backgroundColor: 'WindowText',
          MsHighContrastAdjust: 'none'
        },
        [`.${IsFocusVisibleClassName} &:focus`]: {
          selectors: {
            ':after': {
              outline: `none`,
              borderColor: p.white
            }
          }
        }
      }
    },

    rootHovered: {
      backgroundColor: s.primaryButtonBackgroundHovered,
      color: s.primaryButtonTextHovered,
      selectors: {
        [HighContrastSelector]: {
          color: 'Window',
          backgroundColor: 'Highlight'
        }
      }
    },

    rootPressed: {
      backgroundColor: s.primaryButtonBackgroundPressed,
      color: s.primaryButtonTextPressed,
      selectors: {
        [HighContrastSelector]: {
          color: 'Window',
          backgroundColor: 'WindowText',
          MsHighContrastAdjust: 'none'
        }
      }
    },

    rootExpanded: {
      backgroundColor: s.primaryButtonBackgroundPressed,
      color: s.primaryButtonTextPressed
    },

    rootChecked: {
      backgroundColor: s.primaryButtonBackgroundPressed,
      color: s.primaryButtonTextPressed
    },

    rootCheckedHovered: {
      backgroundColor: s.primaryButtonBackgroundPressed,
      color: s.primaryButtonTextPressed
    },

    rootDisabled: {
      selectors: {
        [HighContrastSelector]: {
          color: 'GrayText',
          borderColor: 'GrayText',
          backgroundColor: 'Window'
        }
      }
    },

    // Split button styles
    splitButtonContainer: {
      selectors: {
        [HighContrastSelector]: {
          border: 'none'
        }
      }
    },

    splitButtonDivider: {
      backgroundColor: p.neutralTertiaryAlt
    },

    splitButtonMenuButton: {
      backgroundColor: s.primaryButtonBackground,
      color: s.primaryButtonText,
      selectors: {
        ':hover': {
          backgroundColor: s.primaryButtonBackgroundHovered,
          selectors: {
            [HighContrastSelector]: {
              color: 'Highlight'
            }
          }
        }
      }
    },

    splitButtonMenuButtonDisabled: {
      backgroundColor: s.primaryButtonBackgroundDisabled,
      selectors: {
        ':hover': {
          backgroundColor: s.primaryButtonBackgroundDisabled
        }
      }
    },

    splitButtonMenuButtonChecked: {
      backgroundColor: s.primaryButtonBackgroundPressed,
      selectors: {
        ':hover': {
          backgroundColor: s.primaryButtonBackgroundPressed
        }
      }
    },

    splitButtonMenuButtonExpanded: {
      backgroundColor: s.primaryButtonBackgroundPressed,
      selectors: {
        ':hover': {
          backgroundColor: s.primaryButtonBackgroundPressed
        }
      }
    },

    splitButtonMenuIcon: {
      color: s.primaryButtonText,

      selectors: {
        [HighContrastSelector]: {
          color: 'Window'
        }
      }
    },

    splitButtonMenuIconDisabled: {
      color: p.neutralTertiary,

      selectors: {
        [HighContrastSelector]: {
          color: 'GrayText'
        }
      }
    }
  };
}
