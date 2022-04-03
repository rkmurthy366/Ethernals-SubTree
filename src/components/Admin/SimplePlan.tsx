import React, { useState } from "react";
import { ethers } from "ethers";
import { planAddress, planABI } from "../Contract/contract";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";
import { Check, X, InfoCircle } from "tabler-icons-react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  Text,
  Space,
  Button,
  Container,
  Group,
  Center,
  Tooltip,
  TextInput,
  NumberInput,
} from "@mantine/core";

const schema = z.object({
  cost: z.number().min(0, { message: "Plan Cost should be more than 0 MATIC" }),
  duration: z
    .number()
    .min(1, { message: "Plan Cost should be more than 0 DAYS" }),
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

export const SimplePlan = () => {
  const { isAuthenticated } = useMoralis();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: "",
      cost: 0,
      duration: 0,
    },
  });

  const createSimplePlan = async (_planName, _planCost, _planDuration) => {
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
          // console.log(
          //   "createSimplePlan function",
          //   _planName,
          //   _planCost,
          //   _planDuration
          // );
          let tx = await planContract.createPlan(
            _planName,
            _planCost,
            _planDuration
          );
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              "Simple Plan Created! https://mumbai.polygonscan.com/tx/" +
                tx.hash
            );
            showNotification({
              icon: <Check size={18} />,
              color: "teal",
              title: "Simple Plan Created",
              message: `${_planName} created successfully 🥳`,
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
        "Error: VM Exception while processing transaction: reverted with reason string 'Only PlanController can call this function'"
      ) {
        showNotification({
          icon: <X size={18} />,
          color: "red",
          title: "Plan Creation Failed",
          message: `Only PlanController can execute this`,
        });
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Container sx={{ maxWidth: 720 }} mx="auto">
        <form
          onSubmit={form.onSubmit((values) => {
            let cost = values.cost.toString();
            // Converting ETH (MATIC) to wei (18 digit number) to avoid decimals
            let planCost = ethers.utils.parseUnits(cost, 18);
            // console.log(
            //   "Form Submit",
            //   values.name.toString(),
            //   planCost.toString(),
            //   values.duration.toString()
            // );
            createSimplePlan(
              values.name.toString(),
              planCost.toString(),
              values.duration.toString()
            );
          })}
        >
          <TextInput
            required
            label="Plan Name"
            placeholder="Plan Name"
            rightSection={rightSection("Enter plan name")}
            size="md"
            {...form.getInputProps("name")}
          />
          <Space h="md" />
          <NumberInput
            required
            label="Plan Cost"
            description="Plan Cost in MATIC"
            // rightSection={rightSection("Enter plan cost in MATIC")}
            min={0}
            precision={3}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            size="md"
            {...form.getInputProps("cost")}
          />
          <Space h="md" />
          <NumberInput
            required
            label="Plan Duration"
            description="Duration of the Plan in DAYS"
            // rightSection={rightSection("Enter duration of the plan in days")}
            min={0}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            size="md"
            {...form.getInputProps("duration")}
          />
          <Space h="md" />
          <Group position="right" mt="xl">
            <Button type="submit" disabled={loading}>
              Create Simple Plan
            </Button>
          </Group>
        </form>
      </Container>
    </div>
  );
};
