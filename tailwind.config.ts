import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "hsl(var(--foreground))",
            maxWidth: "100%",
            p: {
              marginTop: "1.25em",
              marginBottom: "1.25em",
              lineHeight: "1.75",
            },
            h1: {
              color: "hsl(var(--foreground))",
              fontWeight: "700",
              fontSize: "2.25em",
              marginTop: "1.5em",
              marginBottom: "0.8em",
              lineHeight: "1.2",
            },
            h2: {
              color: "hsl(var(--foreground))",
              fontWeight: "600",
              fontSize: "1.75em",
              marginTop: "1.5em",
              marginBottom: "0.8em",
              lineHeight: "1.3",
            },
            h3: {
              color: "hsl(var(--foreground))",
              fontWeight: "600",
              fontSize: "1.5em",
              marginTop: "1.5em",
              marginBottom: "0.8em",
              lineHeight: "1.4",
            },
            h4: {
              color: "hsl(var(--foreground))",
              fontWeight: "600",
              fontSize: "1.25em",
              marginTop: "1.5em",
              marginBottom: "0.8em",
              lineHeight: "1.5",
            },
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "underline",
              fontWeight: "500",
              "&:hover": {
                color: "hsl(var(--primary))",
                opacity: "0.8",
              },
            },
            blockquote: {
              fontWeight: "400",
              fontStyle: "italic",
              color: "hsl(var(--muted-foreground))",
              borderLeftWidth: "0.25rem",
              borderLeftColor: "hsl(var(--border))",
              paddingLeft: "1rem",
            },
            ul: {
              listStyleType: "disc",
              paddingLeft: "1.625em",
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: "1.625em",
            },
            li: {
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            img: {
              marginTop: "2em",
              marginBottom: "2em",
            },
            figure: {
              marginTop: "2em",
              marginBottom: "2em",
            },
            figcaption: {
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.875em",
              lineHeight: "1.4",
              marginTop: "0.5em",
              textAlign: "center",
            },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "0.25rem",
              padding: "0.2em 0.4em",
              fontSize: "0.875em",
            },
            pre: {
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "0.375rem",
              padding: "1em",
              overflowX: "auto",
            },
            hr: {
              borderColor: "hsl(var(--border))",
              marginTop: "3em",
              marginBottom: "3em",
            },
          },
        },
        // Add a dark mode variant
        dark: {
          css: {
            color: "hsl(var(--foreground))",
            h1: {
              color: "hsl(var(--foreground))",
            },
            h2: {
              color: "hsl(var(--foreground))",
            },
            h3: {
              color: "hsl(var(--foreground))",
            },
            h4: {
              color: "hsl(var(--foreground))",
            },
            blockquote: {
              color: "hsl(var(--muted-foreground))",
              borderLeftColor: "hsl(var(--border))",
            },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
            },
            pre: {
              backgroundColor: "hsl(var(--muted))",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
