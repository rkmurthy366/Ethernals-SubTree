import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TabsProps,
  Tabs,
  createStyles,
  AppShell,
  Navbar,
  useMantineTheme,
} from "@mantine/core";
import { SimplePlan } from "../../components/Admin/SimplePlan";
import { SpecialPlan } from "../../components/Admin/SpecialPlan";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colorScheme === "dark"
            ? theme.white
            : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 5 : 7
            ],
        },
      },
    },
  };
});

const data = [
  { label: "Create Plan", link: "/admin/create-plans" },
  { label: "Active Plans", link: "/admin/active-plans" },
  { label: "Archived Plans", link: "/admin/archieved-plans" },
  { label: "Controllers", link: "/admin/controllers" },
];

function StyledTabs(props: TabsProps) {
  return (
    <Tabs
      variant="outline"
      styles={(theme) => ({
        tabControl: {
          fontSize: theme.fontSizes.md,
          fontWeight: 600,
        },
      })}
      {...props}
    />
  );
}

export const CreatePlan = () => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Create Plan");

  const links = data.map((item) => (
    <Link to={item.link}>
      <span
        className={cx(classes.link, {
          [classes.linkActive]: item.label === active,
        })}
      >
        {item.label}
      </span>
    </Link>
  ));

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" width={{ lg: 300, base: 200 }}>
          <Navbar.Section>{links}</Navbar.Section>
        </Navbar>
      }
    >
      <StyledTabs tabPadding="lg">
        <Tabs.Tab label="Simple Plan">
          <SimplePlan />
        </Tabs.Tab>
        <Tabs.Tab label="Special Plan">
          <SpecialPlan />
        </Tabs.Tab>
      </StyledTabs>
    </AppShell>
  );
};
