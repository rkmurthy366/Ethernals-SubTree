import { useState } from "react";
import {
  AppShell,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import TableExample from "./TableExample";

function AppShellExample() {
  const theme = useMantineTheme();

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          // Breakpoint at which navbar will be hidden if hidden prop is true
          hiddenBreakpoint="sm"
          // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section>
            <Text>hello this is title</Text>
          </Navbar.Section>
          <Navbar.Section grow mt="lg">
            <Text>example 1</Text>
            <Text>example 2</Text>
            <Text>example 3</Text>
            <Text>example 4</Text>
          </Navbar.Section>
        </Navbar>
      }
    >
      <TableExample />
    </AppShell>
  );
}

export default AppShellExample;
