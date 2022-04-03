import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { planAddress, planABI } from "../../components/Contract/contract";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";
import { Check, X, InfoCircle } from "tabler-icons-react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { Link } from "react-router-dom";
import {
  createStyles,
  AppShell,
  Navbar,
  Text,
  Space,
  Button,
  Container,
  Card,
  Center,
  Tooltip,
  TextInput,
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

const schema = z.object({
  address: z.string().min(42, { message: "Enter valid address including 0x" }),
});

export const Controllers = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Controllers");
  const { isAuthenticated } = useMoralis();
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(false);

  const addController = async (_address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const planContract = new ethers.Contract(planAddress, planABI, signer);

        if (isAuthenticated) {
          setLoading(true);
          // console.log("addController function", _address);
          let tx = await planContract.addPlanControllers(_address);
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              "Plan Controller Added! https://mumbai.polygonscan.com/tx/" +
                tx.hash
            );
          }
          showNotification({
            icon: <Check size={18} />,
            color: "teal",
            title: "Sucess",
            message: `Plan Controller Added successfully 🥳`,
          });
        } else {
          console.log("Please connect to the wallet");
        }
      }
    } catch (error) {
      console.log(error);
      if (
        error.data.message ==
        "Error: VM Exception while processing transaction: reverted with reason string 'Only Owner can call this function'"
      ) {
        showNotification({
          icon: <X size={18} />,
          color: "red",
          title: "Error",
          message: `Only Owner can call this function`,
        });
      }
    }
    setLoading(false);
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
            onSubmit={form.onSubmit((values) => {
              // console.log("button submit", values.address);
              addController(values.address);
            })}
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
            <Button type="submit" disabled={loading}>
              Add Controller
            </Button>
          </form>
        </Container>
        <Space h={40} />
      </Container>
    );
  };

  const getControllers = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const planContract = new ethers.Contract(
          planAddress,
          planABI,
          provider
        );

        const planControllers = await planContract.fetchControllers();
        const controllers = planControllers.map((i) => {
          let addresses = {
            controllerId: i.controllerId.toString(),
            controllerAddress: i.controllerAddress.toString(),
          };
          return addresses;
        });
        setControllers(controllers);
      } else {
        alert("Install Metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderControllers = () => {
    if (controllers.length > 0) {
      return (
        <Container sx={{ maxWidth: 720 }} mx="auto">
          <Text size="xl" weight={500} color="blue">
            Controllers
          </Text>
          <Space h="sm" />
          {controllers.map((controller) => {
            return ControlCard(
              controller.controllerAddress,
              controller.controllerId
            );
          })}
        </Container>
      );
    }
  };

  const ControlCard = (_address, _controllerId) => {
    return (
      <Card
        shadow="xs"
        withBorder
        key={_controllerId}
        style={{
          width: 720,
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text weight={500}>{_address}</Text>
        <Button
          onClick={() => removeController(_controllerId)}
          variant="outline"
          color="red"
          disabled={loading}
        >
          Remove Controller
        </Button>
      </Card>
    );
  };

  const removeController = async (_controllerId) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const planContract = new ethers.Contract(planAddress, planABI, signer);

        if (isAuthenticated) {
          setLoading(true);
          let tx = await planContract.removePlanControllers(_controllerId);
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              "Plan Controller Removed! https://mumbai.polygonscan.com/tx/" +
                tx.hash
            );
            showNotification({
              icon: <Check size={18} />,
              color: "teal",
              title: "Sucess",
              message: `Plan Controller Deleted successfully`,
            });
          }
        } else {
          console.log("Please connect to the wallet");
        }
      }
    } catch (error) {
      console.log(error);
      if (
        error.data.message ==
        "Error: VM Exception while processing transaction: reverted with reason string 'Only Owner can call this function'"
      ) {
        showNotification({
          icon: <X size={18} />,
          color: "red",
          title: "Error",
          message: `Only Owner can call this function`,
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getControllers();
  }, []);

  const links = data.map((item) => (
    <Link to={item.link} className="link">
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
      {controllers && renderControllers()}
    </AppShell>
  );
};
