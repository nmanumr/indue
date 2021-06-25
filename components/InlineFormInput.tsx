import React, {useEffect, useRef, useState} from "react";
import c from 'classnames';

interface Props {
  value: string | number;
  render?: (type: string | number) => JSX.Element | string;
  onUpdate: (value: string) => void;
}

export function InlineFormInput(props: React.PropsWithChildren<Props>) {
  const [isEditing, setEditingMode] = useState(false);
  const spanEl = useRef<HTMLSpanElement>(null);

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key  === 'Escape') setEditingMode(false);
    if (!isEditing) return;

    if (event.code === 'Enter') {
      props.onUpdate(spanEl.current?.innerText as string);
      setEditingMode(false);
    }

    if (isNaN(event.key as any)) event.preventDefault();
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <span
      onClick={() => setEditingMode(true)}
      onKeyPress={handleKeyPress as any}
      contentEditable={isEditing}
      suppressContentEditableWarning
      ref={spanEl}
      className={c(
        "inline-flex items-center px-1 cursor-pointer border-b border-gray-400",
        isEditing ? 'border-solid focus:outline-none' : 'hover:border-solid border-dashed'
      )}
    >
      {(props.render && !isEditing) ? props.render(props.value) : props.value}
    </span>
  )
}
