import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  ticketAddress,
  planAddress,
  planABI,
} from "../components/Contract/contract";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { Text, Button, Container, Card } from "@mantine/core";
import "./Plans.css";

const endpoint = process.env.REACT_APP_ALCHEMY_End_Point;
// change owner and contractAddress later to account and ticketAddress
const owner = "0x61f8e8397C6481170Fd77521aEBB8B9c19604413";
const contractAddress = "0x1D9e89582564687CbC498e7C43c7911275Ae7dAE";

export const Plans = () => {
  const { account, isAuthenticated } = useMoralis();
  const [activePlans, setActivePlans] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const subscribe = async (_planId, _tId, _price) => {
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
          let tx = await planContract.buyPlan(_planId, _tId, { value: _price });
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              "Subscribed to Plan Successfully! https://mumbai.polygonscan.com/tx/" +
                tx.hash
            );
            showNotification({
              icon: <Check size={18} />,
              color: "teal",
              title: "Success",
              message: `Subscribed to Plan successfully 🥳`,
            });
          }
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
        message: `Plan Subscription Failed`,
      });
    }
    setLoading(false);
  };

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
      let id = data.ownedNfts[0].id.tokenId;
      let i = id.replace(/[^0-9]/g, "");
      let ticketId = parseInt(i, 10).toString();
      setTicketId(ticketId);
      return ticketId;
    }
  };

  const getPlans = async () => {
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
        const getActivePlans = await planContract.fetchActivePlans();
        const activePlans = getActivePlans.map((i) => {
          let activePlan = {
            planName: i.planName.toString(),
            planId: i.planId.toString(),
            planDuration: i.planDuration.toString(),
            planCost: i.planCost.toString(),
            planStart: i.planStart.toString(),
          };
          return activePlan;
        });
        setActivePlans(activePlans);
      } else {
        alert("Install Metamask");
      }
    } catch (error) {
      console.log(error.data.message);
    }
  };

  const renderPlans = () => {
    if (activePlans.length > 0) {
      return (
        <Container sx={{ maxWidth: 1080 }} mx="auto">
          <Text
            size="xl"
            weight={500}
            color="blue"
            style={{ marginBottom: 30, marginTop: 30 }}
          >
            Plans
          </Text>
          {activePlans.map((activePlan, index) => {
            return PlanCard(
              index,
              activePlan.planName,
              activePlan.planId,
              activePlan.planCost,
              activePlan.planDuration,
              activePlan.planStart
            );
          })}
        </Container>
      );
    } else {
      return (
        <Container sx={{ maxWidth: 1080 }} mx="auto">
          <Text
            size="xl"
            weight={500}
            color="blue"
            style={{ marginBottom: 30, marginTop: 30 }}
          >
            No Active Plans
          </Text>
        </Container>
      );
    }
  };

  const PlanCard = (
    _key,
    _planName,
    _planId,
    _planCost,
    _planDuration,
    _planStart
  ) => {
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
    let _displayPlanCost = `Cost: ${ethers.utils.formatEther(_planCost)} MATIC`;
    let _displayPlanDuration = `Duration: ${formatDate(_planDuration)}`;

    return (
      <Card key={_key} className="plan-card" shadow="xs" withBorder>
        <div className="plan-grid-container">
          <div className="plan-grid-items plan-grid-item-1">
            <Text size="xl" weight={500}>
              {_planName}
            </Text>
          </div>
          <div className="plan-grid-items plan-grid-item-2">
            <Text weight={500}>{_displayPlanDuration}</Text>
            <Text weight={500}>{_displayPlanCost}</Text>
            {/* <Text weight={500}>Starts in: 2 days</Text> */}
          </div>
          <div className="plan-grid-items plan-grid-item-3">
            <Button
              onClick={() => subscribe(_planId, ticketId, _planCost)}
              disabled={loading || timestamp < _planStart}
              variant="outline"
              color="blue"
              style={{ width: 150 }}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  useEffect(() => {
    getBlockDetails();
    getPlans();
    getTicketId(owner, contractAddress);
  }, []);

  return <div>{renderPlans()}</div>;
};
