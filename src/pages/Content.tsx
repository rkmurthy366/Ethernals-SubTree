import React from "react";
import {
  Text,
  Button,
  Container,
  Card,
} from "@mantine/core";

export const Content = () => {
  return (
    <div>
      <Container sx={{ maxWidth: 1080 }} mx="auto" >
        <Text
          size="xl"
          weight={500}
          color="blue"
          style={{display: "flex",justifyContent: "center", marginTop: 30}}
        >
          Please subscribe to a plan to access the content
        </Text>
        <Text
          size="xl"
          weight={500}
          color="blue"
          style={{display: "flex",justifyContent: "center", marginTop: 30}}
        >
          Awesome!! you can access the content
        </Text>
      </Container>
    </div>
  );
};
