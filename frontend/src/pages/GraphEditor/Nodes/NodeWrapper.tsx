import { PropsWithChildren, memo } from "react";

const BaseWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={`flex flex-col items-center justify-center group/container font-lato`}
    >
      {children}
    </div>
  );
};

export const NodeWrapper = memo(BaseWrapper);
