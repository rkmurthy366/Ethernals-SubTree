import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { createStyles, Text, Button, Card, Modal } from "@mantine/core";
import { getEllipsisTxt } from "./formatters";

const useStyles = createStyles((theme) => ({
  button: {
    // [theme.fn.smallerThan("sm")]: {
    //   display: "none",
    // },
  },
}));

const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
  connector: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "20px 5px",
    cursor: "pointer",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    height: "30px",
  },
};

export const ConnectWallet = () => {
  const { classes } = useStyles();
  const { Moralis, authenticate, isAuthenticated, account, logout } =
    useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNetworkModalVisible, setIsNetworkModalVisible] = useState(false);
  const [chainId, setChainId] = useState("");

  const switchNetwork = async () => {
    const chainId = "0x13881"; //Mumbai Testnet
    const chainIdHex = await Moralis.switchNetwork(chainId);
  };

  if (!isAuthenticated || !account) {
    return (
      <>
        <Button
          className={classes.button}
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          size="md"
          radius="sm"
          onClick={async () => {
            try {
              await authenticate({ signingMessage: "Login to DinoLabs" }).then(
                function (user) {
                  console.log("logged in user:", user);
                  console.log("UserAddr ->", user!.get("ethAddress"));
                  localStorage.setItem("connectorId", "injected");
                }
              );
              const chainId = await Moralis.chainId;
              setChainId(chainId);
              if (chainId != "0x13881") {
                setIsNetworkModalVisible(true);
              }
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Connect Wallet
        </Button>
      </>
    );
  }

  return (
    <>
      <div style={styles.account} onClick={() => setIsModalVisible(true)}>
        <Text style={{ marginRight: "5px", ...styles.text }}>
          {getEllipsisTxt(account, 6)}
        </Text>
      </div>
      <Modal
        opened={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Account"
      >
        <Card>
          <Text>{account}</Text>
          <div style={{ marginTop: "10px", padding: "0 10px" }}>
            <a
              href={`https://mumbai.polygonscan.com/address/${account}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Explorer
            </a>
          </div>
          <Button
            onClick={async () => {
              await logout();
              window.localStorage.removeItem("connectorId");
              setIsModalVisible(false);
            }}
          >
            Logout
          </Button>
        </Card>
      </Modal>
      <Modal
        opened={isNetworkModalVisible}
        centered
        overlayOpacity={0.7}
        onClose={() => setIsNetworkModalVisible(false)}
        title="Switch Network"
      >
        <Card>
          <Button
            onClick={async () => {
              switchNetwork();
              setIsNetworkModalVisible(false);
            }}
          >
            Switch to Mumbai Testnet
          </Button>
        </Card>
      </Modal>
    </>
  );
};
