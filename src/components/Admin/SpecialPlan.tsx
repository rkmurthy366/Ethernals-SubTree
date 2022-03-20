import React, { useState } from "react";
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
import { InfoCircle } from "tabler-icons-react";

const schema = z.object({
  cost: z.number().min(1, { message: "Plan Cost should be more than 0 MATIC" }),
  duration: z
    .number()
    .min(1, { message: "Plan Cost should be more than 0 DAYS" }),
  planStart: z
    .number()
    .min(1, { message: "Plan Start should be more than 0 DAYS" }),
  planEnd: z
    .number()
    .min(1, { message: "Plan End should be more than 0 DAYS" }),
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
  return (
    <div>
      <Container sx={{ maxWidth: 720 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
          <NumberInput
            required
            label="Plan Start"
            description="The number of DAYS after which this Plan Starts"
            // rightSection={rightSection("Enter duration of the plan in days")}
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
            description="The number of DAYS after Plan Start the users will be able to subscribe to this plan"
            // rightSection={rightSection("Enter duration of the plan in days")}
            min={0}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            size="md"
            {...form.getInputProps("planEnd")}
          />
          <Space h="md" />
          <Group position="right" mt="xl">
            <Button type="submit">Create Special Plan</Button>
          </Group>
        </form>
      </Container>
    </div>
  );
};
