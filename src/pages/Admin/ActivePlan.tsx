import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  createStyles,
  AppShell,
  Navbar,
  useMantineTheme,
  Text,
  Button,
  Container,
  Card,
} from "@mantine/core";
import "./ActivePlan.css";

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
    <Card className="ap-plan-card" shadow="xs" withBorder>
      <div className="ap-grid-container">
        <div className="ap-grid-items ap-grid-item-1">
          <Text size="xl" weight={500}>
            SmallPlan
          </Text>
          <Text size="sm" weight={500}>
            Plan Id: #0001
          </Text>
          <Text size="sm" weight={500}>
            230 Subscribers
          </Text>
        </div>
        <div className="ap-grid-items ap-grid-item-2">
          <Text weight={500}>Cost: 15 MATIC</Text>
          <Text weight={500}>Duration: 1 month</Text>
        </div>
        <div className="ap-grid-items ap-grid-item-3">
          <Text weight={500}>Starts in: 2 days</Text>
          <Text weight={500}>Ends in: 8 days</Text>
        </div>
        <div className="ap-grid-items ap-grid-item-4">
          <Button variant="light" color="blue" style={{ width: 150 }}>
            Edit Plan
          </Button>
          <Button variant="light" color="red" style={{ width: 150 }}>
            Delete Plan
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const ActivePlan = () => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Active Plans");

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
          Active Plans
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
