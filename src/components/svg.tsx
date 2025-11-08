import { SVGProps } from 'react';

export function OnchainkitSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      aria-label="Onchainkit logo"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.0001 17.0001C13.866 17.0001 17.0001 13.866 17.0001 10.0001C17.0001 6.13412 13.866 3.00006 10.0001 3.00006C6.13412 3.00006 3.00006 6.13412 3.00006 10.0001C3.00006 13.866 6.13412 17.0001 10.0001 17.0001Z"
        fill="#0052FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.50006 9.50006C7.77621 9.50006 8.00006 9.72392 8.00006 10.0001V12.5001C8.00006 12.7762 7.77621 13.0001 7.50006 13.0001C7.22392 13.0001 7.00006 12.7762 7.00006 12.5001V10.0001C7.00006 9.72392 7.22392 9.50006 7.50006 9.50006Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0001 6.50006C10.2762 6.50006 10.5001 6.72392 10.5001 7.00006V12.5001C10.5001 12.7762 10.2762 13.0001 10.0001 13.0001C9.72392 13.0001 9.50006 12.7762 9.50006 12.5001V7.00006C9.50006 6.72392 9.72392 6.50006 10.0001 6.50006Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5001 8.50006C12.7762 8.50006 13.0001 8.72392 13.0001 9.00006V12.5001C13.0001 12.7762 12.7762 13.0001 12.5001 13.0001C12.2239 13.0001 12.0001 12.7762 12.0001 12.5001V9.00006C12.0001 8.72392 12.2239 8.50006 12.5001 8.50006Z"
        fill="white"
      />
    </svg>
  );
}

export function BaseSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      aria-label="Base logo"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="10" cy="10" r="10" fill="#0052FF" />
      <path
        d="M10.0001 16.5001C13.5899 16.5001 16.5001 13.5899 16.5001 10.0001C16.5001 6.41027 13.5899 3.50006 10.0001 3.50006C6.65595 3.50006 3.89856 6.02429 3.56506 9.25006H12.7501C13.1643 9.25006 13.5001 9.58585 13.5001 10.0001C13.5001 10.4143 13.1643 10.7501 12.7501 10.7501H3.56506C3.89856 13.9758 6.65595 16.5001 10.0001 16.5001Z"
        fill="white"
      />
    </svg>
  );
}

export function ArrowSvg(props: SVGProps<SVGSVGElement> & { direction?: 'up' | 'down' | 'left' | 'right' }) {
  const { direction = 'right', ...svgProps } = props;
  
  const rotations = {
    up: '270',
    down: '90', 
    left: '180',
    right: '0',
  };

  return (
    <svg
      role="img"
      aria-label={`Arrow pointing ${direction}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
      {...svgProps}
    >
      <path
        d="M6 12L10 8L6 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}