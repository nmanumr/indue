import {useRouter} from 'next/router';
import Link, {LinkProps} from 'next/link';
import React, {ReactElement} from 'react';
import c from 'classnames';

interface Props extends LinkProps {
  activeClassName?: string;
  inactiveClassName?: string;
  className?: string;
}


export default function ActiveLink({children, ...props}: React.PropsWithChildren<Props>) {
  const router = useRouter()
  let child;

  if (children && typeof children === "function") {
    child = children;
  } else {
    child = React.Children.only(children) as ReactElement
  }

  const isActive = router.pathname === props.href;
  let className = props.className || '';

  if (isActive && props.activeClassName) {
    className += ` ${props.activeClassName}`
  } else if (!isActive && props.inactiveClassName) {
    className += ` ${props.inactiveClassName}`
  }

  props.className = className.trim();

  return (
    <Link {...props}>
      {
        typeof child === 'function'
          ? child(isActive)
          : React.cloneElement(child, {
            className: c({[props.activeClassName ?? '']: isActive}, child.props.className)
          })
      }
    </Link>
  )
}
