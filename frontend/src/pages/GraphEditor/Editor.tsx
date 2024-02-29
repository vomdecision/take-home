/* eslint-disable react-refresh/only-export-components */
import { DRAWER_ANIMATION_IN_MILLISECONDS } from "components/Drawer";
import { PropsWithChildren, createContext, useState } from "react";
import { CommonDrawerProps, drawers } from "./Drawers";

export enum DrawerName {
  newNode,
}

export type Editor = {
  drawerName: DrawerName;
  drawerVisible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drawerProps: any;
  closeEditorDrawer: () => void;
  showDrawer: <T extends DrawerName>(
    type: T,
    /**
     * The type below automatically suggests the correct props for the chosen Drawer name.
     * If the Drawer has no specific props, it uses only the Common ones.
     */
    props: Parameters<(typeof drawers)[T]>[0] | CommonDrawerProps
  ) => void;
};

export const editor = createContext({} as Editor);

export function EditorProvider({ children }: PropsWithChildren) {
  const [drawerName, setDrawerName] = useState<DrawerName>(DrawerName.newNode);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerProps, setDrawerProps] = useState({});

  const showDrawer: Editor["showDrawer"] = (type, props) => {
    if (drawerVisible) {
      closeEditorDrawer();
    }
    setTimeout(
      () => {
        setDrawerName(type);
        setDrawerProps(props ?? {});
        setDrawerVisible(true);
      },
      drawerVisible ? DRAWER_ANIMATION_IN_MILLISECONDS : 0
    );
  };

  const closeEditorDrawer = () => {
    setDrawerVisible(false);
    setDrawerProps({});
  };

  return (
    <editor.Provider
      value={{
        drawerName,
        closeEditorDrawer,
        drawerVisible,
        showDrawer,
        drawerProps,
      }}
    >
      {children}
    </editor.Provider>
  );
}
