import { SVGProps } from "react";

const IconSetting = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={37}
    viewBox="0 0 35 37"
    fill="currentColor"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fill="#fff"
        d="M32.76 13.667h-3.026a13.12 13.12 0 0 0-1.26-3.039l2.14-2.141a1.474 1.474 0 0 0 0-2.078L27.82 3.613a1.474 1.474 0 0 0-2.078 0l-2.142 2.142a13.064 13.064 0 0 0-3.038-1.26V1.469C20.56.66 19.9 0 19.09 0h-3.954c-.809 0-1.469.66-1.469 1.469v3.026c-1.074.293-2.091.72-3.039 1.26L8.488 3.613a1.474 1.474 0 0 0-2.079 0L3.614 6.41a1.474 1.474 0 0 0 0 2.078l2.141 2.141c-.54.945-.966 1.965-1.26 3.039H1.469c-.809 0-1.469.66-1.469 1.469v3.954c0 .808.66 1.469 1.469 1.469h3.026a13.04 13.04 0 0 0 1.26 3.035l-2.141 2.141a1.473 1.473 0 0 0 0 2.079l2.795 2.795a1.474 1.474 0 0 0 2.079 0l2.141-2.142c.945.54 1.962.967 3.036 1.26v3.027c0 .808.66 1.468 1.469 1.468h3.954c.81 0 1.47-.66 1.47-1.468v-3.026a13.04 13.04 0 0 0 3.035-1.26l2.142 2.14a1.474 1.474 0 0 0 2.078 0l2.796-2.794a1.473 1.473 0 0 0 0-2.079l-2.142-2.141a13.04 13.04 0 0 0 1.26-3.035h3.026c.809 0 1.47-.66 1.47-1.47v-3.953c0-.81-.661-1.47-1.47-1.47h.007Zm-10.298 3.446a5.348 5.348 0 1 1-10.695-.001 5.348 5.348 0 0 1 10.695 0Z"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={34.222}
        height={36.222}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_16_3" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_16_3"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default IconSetting;
