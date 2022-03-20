import React, { useState } from "react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { Link } from "react-router-dom";
import {
  createStyles,
  AppShell,
  Navbar,
  useMantineTheme,
  Text,
  Space,
  Button,
  Container,
  Card,
  Center,
  Tooltip,
  TextInput,
} from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";

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

// Check later
const schema = z.object({
  address: z.string().min(42, { message: "Enter valid address including 0x" }),
});

const rightSection = (labelText: {}) => {
  return (
    <Tooltip
      label={labelText}
      placement="end"
      withArrow
      transition="pop-bottom-right"
    >
      <Text color="dimmed">
        <Center>
          <InfoCircle size={18} />
        </Center>
      </Text>
    </Tooltip>
  );
};

const Control = () => {
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      address: "",
    },
  });
  return (
    <Container sx={{ maxWidth: 720 }} mx="auto">
      <Text size="xl" weight={500} color="blue">
        Add Controller
      </Text>
      <Space h="sm" />
      <Container px={0}>
        <form
          onSubmit={form.onSubmit((values) => console.log(values))}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <TextInput
            style={{ flexGrow: 0.95 }}
            required
            label="Controller Address"
            placeholder="Controller Address"
            rightSection={rightSection("Enter Controller Address")}
            size="sm"
            {...form.getInputProps("address")}
          />
          <Button type="submit">Add Controller</Button>
        </form>
      </Container>
      <Space h={40} />
      <Text size="xl" weight={500} color="blue">
        Controllers
      </Text>
      <Space h="sm" />
    </Container>
  );
};

const ControlCard = () => {
  return (
    <Card
      shadow="sm"
      withBorder
      style={{
        width: 720,
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text weight={500}>0x61f8e8397C6481170Fd77521aEBB8B9c19604413</Text>
      <Button variant="light" color="red">
        Remove User
      </Button>
    </Card>
  );
};

export const Controllers = () => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Controllers");

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
      <Control />
      <ControlCard />
      <ControlCard />
    </AppShell>
  );
};
