import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  createStyles,
  Text,
  Header,
  Container,
  Group,
  Button,
  Burger,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
  header: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  button: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },
}));

interface HeaderProps {
  links: { link: string; label: string }[];
}

export function HeaderNav({ links }: HeaderProps) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  const items = links.map((links) => (
    <Link to={links.link}>
      <span
        className={cx(classes.link, { [classes.linkActive]: active === links.link })}
        onClick={(event) => {
          setActive(links.link);
        }}
      >
        {links.label}
      </span>
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT}>
      <Container className={classes.header} fluid>
        <Text
          component="span"
          align="center"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          weight={900}
          style={{
            fontFamily: "Verdana, sans-serif",
            fontSize: 30,
            letterSpacing: -1,
          }}
        >
          DinoLabs
        </Text>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Button
          className={classes.button}
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          size="md"
          radius="sm"
        >
          Connect Wallet
        </Button>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />
      </Container>
    </Header>
  );
}
