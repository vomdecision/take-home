import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { ReactNode, memo } from "react";


type DrawerProps = {
  title: string;
  content: ReactNode;
  visible: boolean;
  onClose?: () => void;
};

// Arbitrary value.
export const DRAWER_ANIMATION_IN_SECONDS = 0.3;
export const DRAWER_ANIMATION_IN_MILLISECONDS =
  DRAWER_ANIMATION_IN_SECONDS * 1000;

/**
 * This is a base and generic drawer component that is customizable based on props passed
 * @param props Drawer properties: title, content, visible...
 * @returns A customized Drawer component
 */
const CustomDrawer = ({
  title,
  content,
  onClose,
  visible,
}: DrawerProps) => {
  if (!visible) {
    return null;
  }

  return (
    <motion.div
      className={`fixed right-0 h-full overflow-y-auto z-40 p-4 bg-N-100 w-2/5 border-l-2 border-border-normal`}
      animate={{
        x: visible ? "0" : "100%",
      }}
      initial={{
        x: "100%"
      }}
      transition={{
        bounce: 0,
        duration: DRAWER_ANIMATION_IN_SECONDS,
      }}
      aria-labelledby="drawer-title"
      data-testid="drawer"
    >
      <div className="flex items-center mb-4">
        <h3
          id="drawer-title"
          className="inline-flex w-full items-center text-lg font-semibold text-text-headline font-lato"
        >
          {title}
        </h3>
        <button
          type="button"
          data-drawer-hide="drawer-close-button"
          aria-controls="drawer-close-button"
          onClick={onClose}
          className="text-gray-500 hover-focus:text-black hover-focus:bg-gray-200 w-8 h-8 absolute right-2.5 flex justify-center items-center rounded-full"
          tabIndex={visible ? 0 : -1}
        >
          <ChevronDoubleRightIcon className="w-6" />
          <span className="sr-only">Close menu</span>
        </button>
      </div>
      {visible && content}
    </motion.div>
  );
};

export const Drawer = memo(CustomDrawer);
