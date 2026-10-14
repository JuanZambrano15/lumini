import type { SVGProps } from 'react';

/** Íconos de trazo del Figma (lápiz, ayuda, salir, flecha y más). Heredan el color del texto. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
    <path d="m14.5 5.5 3 3" />
  </Icon>
);

export const HelpIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M5 3.5h14a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-6l-4 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 16V5A1.5 1.5 0 0 1 5 3.5Z" />
    <path d="M10 8.5a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2v.5" />
    <path d="M12 14.5h.01" strokeWidth={2.2} />
  </Icon>
);

export const ExitIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M14 4H5v16h9" />
    <path d="M5 4l6 2.5v15L5 20" />
    <path d="M16 12h6m-2.5-2.5L22 12l-2.5 2.5" />
  </Icon>
);

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon strokeWidth={2.4} {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <Icon strokeWidth={0.7} {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
