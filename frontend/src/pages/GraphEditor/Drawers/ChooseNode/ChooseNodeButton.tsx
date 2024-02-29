import { ReactNode } from 'react';

type ChooseNodeButtonProps = {
  label: string;
  preview: ReactNode;
  onClick: () => void;
};

export const ChooseNodeButton = ({
  label,
  preview,
  onClick,
}: ChooseNodeButtonProps) => (
  <button
    className="group flex shadow-small shadow-neutral-300 flex-col items-center justify-center p-2 rounded-md bg-white hover-focus:bg-N-300 cursor-pointer border-N-500 border"
    onClick={onClick}
  >
    <div className="h-20 w-20 flex items-center">{preview}</div>
    <div className="font-lato text-center font-medium group-hover-focus:font-medium mt-3 flex">
      <p>{label}</p>
    </div>
  </button>
);
