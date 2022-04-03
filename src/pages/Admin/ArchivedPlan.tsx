import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { planAddress, planABI } from "../../components/Contract/contract";
import { Link } from "react-router-dom";
import {
  createStyles,
  AppShell,
  Navbar,
  Text,
  Container,
  Card,
} from "@mantine/core";
import "./ArchivedPlan.css";

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

const data = [
  { label: "Create Plan", link: "/admin/create-plans" },
  { label: "Active Plans", link: "/admin/active-plans" },
  { label: "Archived Plans", link: "/admin/archieved-plans" },
  { label: "Controllers", link: "/admin/controllers" },
];

export const ArchivedPlan = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Archived Plans");
  const [archivedPlans, setArchivedPlans] = useState([]);

  const fetchArchivedPlans = async () => {
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
        const getArchivedPlans = await planContract.fetchNonActivePlans();
        const archivedPlans = getArchivedPlans.map((i) => {
          let archivedPlan = {
            planId: i.planId.toString(),
            planName: i.planName.toString(),
            planCost: i.planCost.toString(),
            planDuration: i.planDuration.toString(),
            planStart: i.planStart.toString(),
            planEnd: i.planEnd.toString(),
            planSubscribers: i.planSubscribers.toString(),
          };
          return archivedPlan;
        });
        setArchivedPlans(archivedPlans);
      } else {
        alert("Install Metamask");
      }
    } catch (error) {
      console.log(error.data.message);
    }
  };

  const renderArchivedPlans = () => {
    if (archivedPlans.length > 0) {
      return (
        <Container sx={{ maxWidth: 1080 }} mx="auto">
          <Text
            size="xl"
            weight={500}
            color="blue"
            style={{ marginBottom: 30 }}
          >
            Archived Plans
          </Text>
          {archivedPlans.map((archivedPlan, index) => {
            return PlanCard(
              index,
              archivedPlan.planName,
              archivedPlan.planId,
              archivedPlan.planSubscribers,
              archivedPlan.planCost,
              archivedPlan.planDuration
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
            style={{ marginBottom: 30 }}
          >
            No Archived Plans
          </Text>
        </Container>
      );
    }
  };

  const PlanCard = (
    _key,
    _planName,
    _planId,
    _subscribers,
    _planCost,
    _planDuration
  ) => {
    const formatId = (_planId) => {
      if (_planId.length > 3) {
        return _planId;
      } else if (_planId.length > 2) {
        return `0${_planId}`;
      } else if (_planId.length > 1) {
        return `00${_planId}`;
      } else if (_planId.length > 0) {
        return `000${_planId}`;
      }
    };
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

    let _displayPlanId = `Plan Id: #${formatId(_planId)}`;
    let _displayPlanSubscribers = `${_subscribers} Subscribers`;
    let _displayPlanCost = `Cost: ${ethers.utils.formatEther(_planCost)} MATIC`;
    let _displayPlanDuration = `Duration: ${formatDate(_planDuration)}`;

    return (
      <Card key={_key} className="archived-plan-card" shadow="xs" withBorder>
        <div className="archived-grid-container">
          <div className="archived-grid-items archived-grid-item-1">
            <Text size="xl" weight={500}>
              {_planName}
            </Text>
          </div>
          <div className="archived-grid-items archived-grid-item-2">
            <Text weight={500}>{_displayPlanId}</Text>
            <Text weight={500}>{_displayPlanSubscribers}</Text>
          </div>
          <div className="archived-grid-items archived-grid-item-3">
            <Text weight={500}>{_displayPlanCost}</Text>
            <Text weight={500}>{_displayPlanDuration}</Text>
            {/* <Text weight={500}>Plan Started 8 days ago</Text>
            <Text weight={500}>Plan Archived/Ended 5 days ago</Text> */}
          </div>
        </div>
      </Card>
    );
  };

  useEffect(() => {
    fetchArchivedPlans();
  }, []);

  const links = data.map((item) => (
    <Link to={item.link} className="link">
      <span
        className={cx(classes.link, {
          [classes.linkActive]: item.label === active,
        })}
      >
        {item.label}
      </span>
    </Link>
  ));

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" width={{ lg: 300, base: 200 }}>
          <Navbar.Section>{links}</Navbar.Section>
        </Navbar>
      }
    >
      {renderArchivedPlans()}
    </AppShell>
  );
};
