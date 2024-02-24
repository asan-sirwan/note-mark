import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

/**
 * The root layout where all the other components reside
 */
export const RootLayout = ({ className, children, ...props }: ComponentProps<"main">) => {
  return (
    <main className={twMerge("flex flex-row h-screen", className)} {...props}>
      {children}
    </main>
  );
};

/**
 * The sidebar of the application
 */
export const Sidebar = ({ className, children, ...props }: ComponentProps<"aside">) => {
  return (
    <aside
      className={twMerge("w-[250px] h-screen overflow-auto", className)}
      {...props}
    >
      {children}
    </aside>
  );
};

/**
 * The main part of the application
 */
export const Content = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge("flex-1 overflow-auto", className)} {...props}>
        {children}
      </div>
    );
  }
);
Content.displayName = "Content";
