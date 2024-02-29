const plugin = require("tailwindcss/plugin");

const N0 = "#FFFFFF";
const N50 = "#FAFBFF";
const N75 = "#F9FAFC";
const N100 = "#F4F6FA";
const N200 = "#EDEFF5";
const N300 = "#E6E8F0";
const N400 = "#D8DAE5";
const N500 = "#C1C4D6";
const N600 = "#8F95B2";
const N700 = "#696F8C";
const N800 = "#474D66";
const N900 = "#101840";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/*.svg",
  ],
  plugins: [
    /**
     * Adds two new variants to tailwind for easier writing.
     * So instead of using "hover:bg-black focus:bg-black",
     * you can use "hover-focus:bg-black" instead.
     * To center styles in one place and write less.
     */
    plugin(function ({ addVariant }) {
      addVariant("hover-focus", ["&:hover", "&:focus"]);
      addVariant("group-hover-focus", [
        ":merge(.group):hover &",
        ":merge(.group):focus &",
      ]);
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1fcfa",
          100: "#d1f6f1",
          200: "#a2ede5",
          300: "#71ddd6",
          400: "#3ec3be",
          500: "#25a7a5",
          600: "#1b8586",
          700: "#196b6c",
          800: "#195456",
          900: "#194748",
          950: "#08292b",
        },
        mirage: {
          50: "#f0f3fa",
          100: "#e5eaf5",
          200: "#c9d4e8",
          300: "#9db3d8",
          400: "#6b8cc2",
          500: "#496fa7",
          600: "#37568b",
          700: "#2d4571",
          800: "#28395d",
          900: "#263450",
          950: "#121826",
        },
        "darker-primary": "#273653",
        white: "#FFFAFF",
        "light-gray": "#F2F5F9",
        N: {
          0: N0,
          50: N50,
          75: N75,
          100: N100,
          200: N200,
          300: N300,
          400: N400,
          500: N500,
          600: N600,
          700: N700,
          800: N800,
          900: N900,
        },
        T: {
          50: "#EDFAFA",
          100: "#D5F5F6",
          200: "#BEDAF0",
          300: "#B2D0EC",
          400: "#16BDCA",
          500: "#0694A2",
          600: "#036672",
          700: "#024D4A",
        },
        Y: {
          50: "#FFF9F0",
          100: "#FFF2D9",
          200: "#FFE6B3",
          300: "#F1D4B3",
          350: "#e2cdb0",
          400: "#FFB02E",
          500: "#E68A00",
          600: "#B36B00",
        },
        G: {
          50: "#F7FDF9",
          100: "#EEFBF2",
          200: "#D5F6E1",
          300: "#A8EFD0",
          400: "#5CE2B0",
          500: "#47A380",
          550: "#56b28f",
          600: "#2F6A53",
        },
      },
      text: {
        muted: N700,
        normal: N800,
        headline: N900,
      },
      icons: {
        muted: N500,
        normal: N600,
      },
      border: {
        muted: N300,
        normal: N400,
      },
      separator: N300,
      background: {
        white: N0,
        lighter: N50,
        light: N75,
        normal: N100,
        darker: N200,
      },
      boxShadow: {
        small: "0 5px 9px 0px",
      },
      strokeWidth: {
        3: "3",
        4: "4",
        5: "5",
      },
      fontSize: {
        xsm: "0.6rem",
      },
    },
  },
};
