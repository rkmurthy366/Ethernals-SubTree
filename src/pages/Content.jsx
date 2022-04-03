import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ticketAddress, ticketABI } from "../components/Contract/contract";
import { useMoralis } from "react-moralis";
import { Text, Container } from "@mantine/core";

const endpoint = process.env.REACT_APP_ALCHEMY_End_Point;

export const Content = () => {
  const { account } = useMoralis();
  const [ticketDetails, setTicketDetails] = useState("");
  const [content, setContent] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  // change owner and contractAddress later to account and ticketAddress
  const owner = account;
  const contractAddress = ticketAddress;

  const getTicketId = async (owner, contractAddress) => {
    if (owner) {
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
        let ticketId = parseInt(i, 10).toString();
        setTicketId(ticketId);
        return ticketId;
      }
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

        if (ticketId != "") {
          const i = await ticketContract.getTicketDetails(ticketId);
          if (ticketId && timestamp < i.subscriptionEnd) {
            setContent("Awesome!! you can access the content");
          } else {
            setContent("Please subscribe to a plan to access the content");
          }
        } else {
          console.log("Registration not done");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBlockDetails = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const block = await provider.getBlockNumber();
        // console.log(`latest Block Number: ${block}`);
        const blockInfo = await provider.getBlock(block);
        // console.log(`${block} info => `);
        // console.log(blockInfo);
        // console.log(blockInfo.timestamp);
        setTimestamp(blockInfo.timestamp);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = async () => {
    try {
      getTicketId(owner, contractAddress);
      fetchNFT();
      getBlockDetails();
      if (ticketId == "") {
        setContent("Please Register and Subscribe plan to access the content");
      }
    } catch (error) {}
  };

  useEffect(() => {
    renderContent();
  }, []);

  return (
    <div>
      <Container sx={{ maxWidth: 1080 }} mx="auto">
        <Text
          size="xl"
          weight={500}
          color="blue"
          style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
        >
          {content}
        </Text>
      </Container>
    </div>
  );
};
