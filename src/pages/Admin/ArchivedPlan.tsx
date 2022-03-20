import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  createStyles,
  AppShell,
  Navbar,
  useMantineTheme,
  Text,
  Space,
  Grid,
  Group,
  Button,
  Container,
  Card,
  SimpleGrid,
} from "@mantine/core";

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

const PlanCard = () => {
  return (
    <Card
      shadow="xs"
      withBorder
      style={{
        margin: "auto",
        marginBottom: 20,
        // display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <SimpleGrid cols={3}>
        <div>
          <Text weight={500}>SmallPlan</Text>
          <Text weight={500}>Plan Id: #0001</Text>
          <Text weight={500}>230 Subscribers</Text>
        </div>
        <div>
          <Text weight={500}>Cost: 15 MATIC</Text>
          <Text weight={500}>Duration: 1 month</Text>
        </div>
        <div>
          <Text weight={500}>Plan Started 8 days ago</Text>
          <Text weight={500}>Plan Archived/Ended 5 days ago</Text>
        </div>
      </SimpleGrid>
    </Card>
  );
};

export const ArchivedPlan = () => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Archived Plans");

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
      <Container sx={{ maxWidth: 1080 }} mx="auto">
        <Text size="xl" weight={500} color="blue" style={{ marginBottom: 30 }}>
          Archived Plans
        </Text>
        <PlanCard />
        <PlanCard />
        <PlanCard />
        <PlanCard />
        <PlanCard />
      </Container>
    </AppShell>
  );
};
