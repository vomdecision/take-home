import { SVGProps } from 'react';

export const DiamondSvg = (props?: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      // The svg had originally a 0 0 100 100 viewBox, but due to our stroke, we
      // had to change it in order to not crop its corners.
      viewBox="-3 -3 106 106"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      stroke="black"
      strokeWidth={1.0}
      {...props}
    >
      <path d="M 0 50 L 50 100 L 100 50 L 50 0 z" fill="currentColor" />
    </svg>
  );
};
