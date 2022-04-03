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
    .min(1, { message: "Plan Duration should be more than 0 DAYS" }),
  planStart: z
    .number()
    .min(0, { message: "Plan Start should be more than 0 DAYS" }),
  planEnd: z
    .number()
    .min(0, { message: "Plan End should be more than 0 DAYS" }),
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

export const SpecialPlan = () => {
  const { isAuthenticated } = useMoralis();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: "",
      cost: 0,
      duration: 0,
      planStart: 0,
      planEnd: 0,
    },
  });

  const createSpecialPlan = async (
    _planName,
    _planCost,
    _planDuration,
    _planStart,
    _planEnd
  ) => {
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
          //   "createSpecialPlan function",
          //   _planName,
          //   _planCost,
          //   _planStart,
          //   _planDuration,
          //   _planEnd
          // );
          let tx = await planContract.createSpecialPlan(
            _planName,
            _planCost,
            _planStart,
            _planDuration,
            _planEnd
          );
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              "Special Plan Created! https://mumbai.polygonscan.com/tx/" +
                tx.hash
            );
            showNotification({
              icon: <Check size={18} />,
              color: "teal",
              title: "Special Plan Created",
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
            //   values.duration.toString(),
            //   values.planStart.toString(),
            //   values.planEnd.toString()
            // );
            createSpecialPlan(
              values.name.toString(),
              planCost.toString(),
              values.duration.toString(),
              values.planStart.toString(),
              values.planEnd.toString()
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
            min={0}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            size="md"
            {...form.getInputProps("duration")}
          />
          <Space h="md" />
          <NumberInput
            required
            label="Plan Start"
            description="The number of DAYS from today the users will be able to subscribe to this plan"
            min={0}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            size="md"
            {...form.getInputProps("planStart")}
          />
          <Space h="md" />
          <NumberInput
            required
            label="Plan End"
            description="The number of DAYS after Plan Start this Plan Ends & 
            if Plan End = 0, then this plan will last forever until archived"
            min={0}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            size="md"
            {...form.getInputProps("planEnd")}
          />
          <Space h="md" />
          <Group position="right" mt="xl">
            <Button type="submit" disabled={loading}>
              Create Special Plan
            </Button>
          </Group>
        </form>
      </Container>
    </div>
  );
};
