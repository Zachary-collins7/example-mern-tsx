import './button.css';
// import React from 'react';

// // dev note, will prioritize highest variant between primary, secondary, and tertiary
// // default: tertiary

// export interface IButtonProps {
//   primary?: boolean,
//   secondary?: boolean,
//   tertiary?: boolean,
//   children?: JSX.Element | JSX.Element[] | string
// }
// export default function Button(props: {
//   primary?: boolean,
//   secondary?: boolean,
//   tertiary?: boolean,
//   children?: JSX.Element | JSX.Element[] | string
// } & (
//   React.ButtonHTMLAttributes<HTMLButtonElement> & {as: "button"}
//   | React.AnchorHTMLAttributes<HTMLAnchorElement> & {as: "exlink"}
// )) {
//   const { primary, secondary, tertiary, children, ...other } = props;

//   return props.as == exlink ? (
//     <a {...other}></a>
//   ) : (
//       <button {...other} className={
//         primary ? "primary" :
//           secondary ? "secondary" :
//             "tertiary"
//       }>{children}</button>
//   )
// }

import * as React from 'react'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'

type BaseProps = {
  children: React.ReactNode
  className?: string
  styleType: 'primary' | 'secondary' | 'tertiary'
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button'
  }

type ButtonAsUnstyled = Omit<ButtonAsButton, 'as' | 'styleType'> & {
  as: 'unstyled'
  styleType?: BaseProps['styleType']
}

type ButtonAsLink = BaseProps &
  Omit<LinkProps, keyof BaseProps> & {
    as: 'link'
  }

type ButtonAsExternal = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: 'externalLink'
  }

type ButtonProps =
  | ButtonAsButton
  | ButtonAsExternal
  | ButtonAsLink
  | ButtonAsUnstyled

export function Button(props: ButtonProps): JSX.Element {
  const allClassNames = `btn ${props.styleType ? props.styleType : ''} ${props.className ? props.className : ''
    }`

  if (props.as === 'link') {
    // don't pass unnecessary props to component
    const { className, styleType, as, ...rest } = props
    return <Link className={allClassNames} {...rest} />
  } else if (props.as === 'externalLink') {
    const { className, styleType, as, ...rest } = props
    return (
      <a
        className={allClassNames}
        // provide good + secure defaults while still allowing them to be overwritten
        target='_blank'
        rel='noopener noreferrer'
        {...rest}
      >
        {props.children}
      </a>
    )
  } else if (props.as === 'unstyled') {
    const { className, styleType, as, ...rest } = props
    return <button className={className} {...rest} />
  } else {
    const { className, styleType, as, ...rest } = props
    return <button className={allClassNames} {...rest} />
  }
}