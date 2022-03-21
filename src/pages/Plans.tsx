import React from "react";
import {
  Text,
  Button,
  Container,
  Card,
} from "@mantine/core";
import "./Plans.css";

const PlanCard = () => {
  return (
    <Card className="plan-card" shadow="xs" withBorder>
      <div className="plan-grid-container">
        <div className="plan-grid-items plan-grid-item-1">
          <Text size="xl" weight={500}>
            SmallPlan
          </Text>
        </div>
        <div className="plan-grid-items plan-grid-item-2">
          <Text weight={500}>Duration: 1 month</Text>
          <Text weight={500}>Cost: 15 MATIC</Text>
          {/* <Text weight={500}>Starts in: 2 days</Text> */}
        </div>
        <div className="plan-grid-items plan-grid-item-3">
          <Button variant="light" color="blue" style={{ width: 150 }}>
            Subscribe
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const Plans = () => {
  return (
    <div>
      <Container sx={{ maxWidth: 1080 }} mx="auto">
        <Text
          size="xl"
          weight={500}
          color="blue"
          style={{ marginBottom: 30, marginTop: 30 }}
        >
          Plans
        </Text>
        <PlanCard />
        <PlanCard />
        <PlanCard />
        <PlanCard />
        <PlanCard />
      </Container>
    </div>
  );
};
