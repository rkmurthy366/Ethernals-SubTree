import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ticketAddress, ticketABI } from "../components/Contract/contract";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";
import { Check, X, InfoCircle } from "tabler-icons-react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  createStyles,
  AppShell,
  Navbar,
  Text,
  Button,
  Card,
  Container,
  Space,
  Center,
  Tooltip,
  TextInput,
} from "@mantine/core";
import { Ticket } from "../components/Ticket";
import "./Profile.css";

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

const data = [{ link: "", label: "Ticket Details" }];
const endpoint = process.env.REACT_APP_ALCHEMY_End_Point;

const schema = z.object({
  address: z.string().min(42, { message: "Enter valid address including 0x" }),
});

const rightSection = (labelText) => {
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

export const Profile = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Ticket Details");
  const { account, isAuthenticated } = useMoralis();
  const [ticketId, setTicketId] = useState("");
  const [ticketDetails, setTicketDetails] = useState("");
  const [loading, setLoading] = useState(false);

  // change owner and contractAddress later to account and ticketAddress
  const owner = account;
  const contractAddress = ticketAddress;

  const transferTicket = async (_address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const ticketContract = new ethers.Contract(
          ticketAddress,
          ticketABI,
          signer
        );

        if (isAuthenticated) {
          setLoading(true);
          // console.log("addController function", _address);
          let tx = await ticketContract.transferTicket(ticketId, _address);
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              `Ticket transferred to ${_address}! https://mumbai.polygonscan.com/tx/${tx.hash}`
            );
          }
          showNotification({
            icon: <Check size={18} />,
            color: "teal",
            title: "Success",
            message: `Ticket Transferred successfully 🥳`,
          });
          fetchNFT();
          renderTicket();
        } else {
          console.log("Please connect to the wallet");
        }
      }
    } catch (error) {
      console.log(error);
      showNotification({
        icon: <X size={18} />,
        color: "red",
        title: "Failed",
        message: `Ticket transfer failed`,
      });
    }
    setLoading(false);
  };

  const getTicketId = async (owner, contractAddress) => {
    if (owner) {
      let ticketId;
      let data;
      try {
        data = await fetch(
          `${endpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`
        ).then((data) => data.json());
      } catch (e) {
        console.log(e);
      }

      // NFT token IDs basically
      if (data.ownnedNfts != []) {
        let id = data.ownedNfts[0].id.tokenId;
        let i = id.replace(/[^0-9]/g, "");
        ticketId = parseInt(i, 10).toString();
        console.log(ticketId, "from getTicketId");
        setTicketId(ticketId);
      }
      return ticketId;
    }
  };

  const fetchNFT = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const ticketContract = new ethers.Contract(
          ticketAddress,
          ticketABI,
          provider
        );

        let Id = await getTicketId(owner, contractAddress);
        console.log("fetchNFT", Id);
        if (ticketId) {
          const i = await ticketContract.tickets(Id);
          let ticket = {
            planId: i.planId.toString(),
            planName: i.planName.toString(),
            subscriber: i.subscriber.toString(),
            subscriptionCost: i.subscriptionCost.toString(),
            subscriptionStart: i.subscriptionStart.toString(),
            subscriptionEnd: i.subscriptionEnd.toString(),
            ticketNum: i.ticketNum.toString(),
            transferCount: i.transferCount.toString(),
          };
          setTicketDetails(ticket);
        } else {
          console.log("Registration not done");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const TransferTicket = () => {
    const form = useForm({
      schema: zodResolver(schema),
      initialValues: {
        address: "",
      },
    });
    return (
      <div>
        <Text size="xl" weight={500} color="blue">
          Transfer Ticket
        </Text>
        <Space h="sm" />
        <Container px={0}>
          <form
            onSubmit={form.onSubmit((values) => {
              // console.log("button submit", values.address);
              transferTicket(values.address);
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
              label="Receiver Address"
              placeholder="Receiver Address"
              rightSection={rightSection("Enter Receiver Address")}
              size="sm"
              {...form.getInputProps("address")}
            />
            <Button
              type="submit"
              disabled={loading}
              variant="filled"
              color="red"
              style={{ width: 150 }}
            >
              Transfer
            </Button>
          </form>
        </Container>
      </div>
    );
  };

  const renderTicket = () => {
    if (ticketId) {
      let i = ticketDetails;
      const formatDate = (_planDuration) => {
        let duration = parseInt(_planDuration) / (24 * 60 * 60);
        if (duration === 30) {
          return `1 Month`;
        } else if (duration === 92) {
          return `3 Months`;
        } else if (duration === 183) {
          return `6 Months`;
        } else if (duration === 365) {
          return `1 Year`;
        } else if (duration === 1) {
          return `1 Day`;
        }
        return `${duration} days`;
      };
      let _displayPlanCost = `Cost: ${ethers.utils.formatEther(
        i.subscriptionCost
      )} MATIC`;
      let _displayPlanName = i.planName;
      let _planDuration = (i.subscriptionEnd - i.subscriptionStart).toString();
      let _displayPlanDuration = `Duration: ${formatDate(_planDuration)}`;
      let _transfers;
      if (i.planName.length > 0) {
        _transfers = (3 - i.transferCount).toString();
      }

      let _displayTransfers = `${_transfers} Transfers Left`;
      return (
        <div>
          <Container sx={{ maxWidth: 1080 }} mx="auto">
            <Card className="plan-card" shadow="xs" withBorder>
              <div className="profile-grid-container">
                <Ticket id={ticketId} />
                <div className="profile-grid-items">
                  <Text size="xl" weight={500} color="blue">
                    Ticket Details
                  </Text>
                  <Space h={10} />
                  <Text size="lg" weight={500}>
                    {_displayPlanName}
                  </Text>
                  <Text size="lg" weight={500}>
                    {_displayPlanCost}
                  </Text>
                  <Text size="lg" weight={500}>
                    {_displayPlanDuration}
                  </Text>
                  <Text size="lg" weight={500}>
                    {_displayTransfers}
                  </Text>
                  <Space h={40} />
                  <TransferTicket />
                </div>
              </div>
            </Card>
          </Container>
        </div>
      );
    } else {
      return (
        <Container sx={{ maxWidth: 1080 }} mx="auto">
          <Text
            size="xl"
            weight={500}
            color="blue"
            style={{ marginBottom: 30 }}
          >
            Register to view your Profile
          </Text>
        </Container>
      );
    }
  };

  useEffect(() => {
    fetchNFT();
  }, []);

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      {item.label}
    </a>
  ));

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" width={{ sm: 200, lg: 300, base: 200 }}>
          <Navbar.Section>{links}</Navbar.Section>
        </Navbar>
      }
    >
      {renderTicket()}
    </AppShell>
  );
};
