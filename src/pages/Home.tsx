import React, { useState } from "react";
import { ethers } from "ethers";
import { createStyles, Container, Title, Text, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { ticketAddress, ticketABI } from "../components/Contract/contract";
import { useMoralis } from "react-moralis";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: "#11284b",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      "linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, #062343 70%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80)",
    paddingTop: theme.spacing.xl * 3,
    paddingBottom: theme.spacing.xl * 3,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  image: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  content: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: 500,
    fontSize: 48,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      fontSize: 34,
      lineHeight: 1.15,
    },
  },

  description: {
    color: theme.white,
    opacity: 0.75,
    maxWidth: 500,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
    },
  },

  control: {
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 22,

    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },
}));

export function Home() {
  const { classes } = useStyles();
  const { isAuthenticated } = useMoralis();
  const [loading, setLoading] = useState(false);

  async function register() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ticketContract = new ethers.Contract(
          ticketAddress,
          ticketABI,
          signer
        );

        if (isAuthenticated) {
          setLoading(true);
          let tx = await ticketContract.register();
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              "Ticket minted! https://mumbai.polygonscan.com/tx/" + tx.hash
            );
          }
          showNotification({
            icon: <Check size={18} />,
            color: "teal",
            title: "Success",
            message: `Ticket minted! successfully 🥳`,
          });
        } else {
          console.log("Please connect to the wallet");
        }
      }
    } catch (error) {
      console.log(error);
      if (
        error.data.message ==
        "Error: VM Exception while processing transaction: reverted with reason string 'User already has Ticket'"
      ) {
        showNotification({
          icon: <X size={18} />,
          color: "red",
          title: "Failed",
          message: `User already has Ticket`,
        });
      }
    }
    setLoading(false);
  }

  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              A{" "}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "pink", to: "yellow" }}
              >
                fully featured
              </Text>{" "}
              React components library
            </Title>

            <Text className={classes.description} mt={30}>
              Build fully functional accessible web applications with ease –
              Mantine includes more than 100 customizable components and hooks
              to cover you in any situation
            </Text>

            <Button
              variant="gradient"
              gradient={{ from: "pink", to: "yellow" }}
              size="xl"
              className={classes.control}
              mt={40}
              onClick={register}
              disabled={loading}
            >
              Register
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
