import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { planAddress, planABI } from "../../components/Contract/contract";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";
import { Check, X, InfoCircle } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  createStyles,
  AppShell,
  Navbar,
  Text,
  Button,
  Modal,
  Container,
  Tooltip,
  Center,
  Card,
  Group,
  Space,
  TextInput,
  NumberInput,
} from "@mantine/core";
import "./ActivePlan.css";

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

export const ActivePlan = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Active Plans");
  const { isAuthenticated } = useMoralis();
  const [activePlans, setActivePlans] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState("");
  const [timestamp, setTimestamp] = useState(0);

  const schema = z.object({
    cost: z
      .number()
      .min(1, { message: "Plan Cost should be more than 0 MATIC" }),
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

  const deletePlan = async (_planId) => {
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
          setDeleteLoading(true);
          // console.log("addController function", _address);
          let tx = await planContract.deletePlan(_planId);
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              `Plan #${_planId} Deleted! https://mumbai.polygonscan.com/tx/${tx.hash}`
            );
          }
          showNotification({
            icon: <Check size={18} />,
            color: "teal",
            title: "Simple Plan Created",
            message: `Plan #${_planId} Deleted successfully `,
          });
          getActivePlans();
          renderActivePlans();
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
          title: "Plan Deletion Failed",
          message: `Only PlanController can execute this`,
        });
      }
    }
    setDeleteLoading(false);
  };

  const submitEditPlan = async (
    _planId,
    _planName,
    _planCost,
    _planStart,
    _planDuration,
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
          setEditLoading(true);
          // console.log("addController function", _address);
          let tx = await planContract.editPlan(
            _planId,
            _planName,
            _planCost,
            _planStart,
            _planDuration,
            _planEnd
          );
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log(
              `Plan #${_planId} Edited Sucessfully! https://mumbai.polygonscan.com/tx/${tx.hash}`
            );
          }
          showNotification({
            icon: <Check size={18} />,
            color: "teal",
            title: "Success",
            message: `${_planName} Edited successfully 🥳`,
          });
          getActivePlans();
          renderActivePlans();
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
    setEditLoading(false);
  };

  const getActivePlans = async () => {
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
            planSubscribers: i.planSubscribers.toString(),
            planCost: i.planCost.toString(),
            planDuration: i.planDuration.toString(),
            planStart: i.planStart.toString(),
            planEnd: i.planEnd.toString(),
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

  const renderActivePlans = () => {
    if (activePlans.length > 0) {
      return (
        <Container sx={{ maxWidth: 1080 }} mx="auto">
          <Text
            size="xl"
            weight={500}
            color="blue"
            style={{ marginBottom: 30 }}
          >
            Active Plans
          </Text>
          {activePlans.map((activePlan, index) => {
            return PlanCard(
              index,
              activePlan.planName,
              activePlan.planId,
              activePlan.planSubscribers,
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
            style={{ marginBottom: 30 }}
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
    _planSubscribers,
    _planCost,
    _planDuration,
    _planStart
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
    const formatTime = (_duration) => {
      let delta = _duration - timestamp;
      if (delta > 0) {
        return `Starts in ${Math.round(
          parseInt(delta.toString()) / (60 * 60)
        )} hours`;
      } else {
        return `Started ${Math.abs(
          Math.round(parseInt(delta.toString()) / (60 * 60))
        )} hours ago`;
      }
    };
    let _displayPlanId = `Plan Id: #${formatId(_planId)}`;
    let _displayPlanSubscribers = `${_planSubscribers} Subscribers`;
    let _displayPlanCost = `Cost: ${ethers.utils.formatEther(_planCost)} MATIC`;
    let _displayPlanDuration = `Duration: ${formatDate(_planDuration)}`;
    let _displayStart = `${formatTime(_planStart)}`;
    return (
      <Card key={_key} className="ap-plan-card" shadow="xs" withBorder>
        <div className="ap-grid-container">
          <div className="ap-grid-items ap-grid-item-1">
            <Text size="xl" weight={500}>
              {_planName}
            </Text>
            <Text size="sm" weight={500}>
              {_displayPlanId}
            </Text>
            <Text size="sm" weight={500}>
              {_displayPlanSubscribers}
            </Text>
          </div>
          <div className="ap-grid-items ap-grid-item-2">
            <Text weight={500}>{_displayPlanCost}</Text>
            <Text weight={500}>{_displayPlanDuration}</Text>
          </div>
          <div className="ap-grid-items ap-grid-item-3">
            <Text weight={500}>{_displayStart}</Text>
            {/* <Text weight={500}>Ends in: 8 days</Text> */}
          </div>
          <div className="ap-grid-items ap-grid-item-4">
            <Button
              onClick={() => {
                setCurrentPlanId(_planId);
                setIsModalVisible(true);
              }}
              disabled={editLoading || timestamp > _planStart}
              variant="outline"
              color="blue"
              style={{ width: 150 }}
            >
              Edit Plan
            </Button>
            <Button
              onClick={() => {
                deletePlan(_planId);
              }}
              disabled={deleteLoading}
              variant="filled"
              color="red"
              style={{ width: 150 }}
            >
              Delete Plan
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  useEffect(() => {
    getBlockDetails();
    getActivePlans();
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
      {renderActivePlans()}
      <Modal
        opened={isModalVisible}
        centered
        overlayOpacity={0.7}
        onClose={() => setIsModalVisible(false)}
        title="Edit Plan"
      >
        <form
          onSubmit={form.onSubmit((values) => {
            let cost = values.cost.toString();
            // Converting ETH (MATIC) to wei (18 digit number) to avoid decimals
            let planCost = ethers.utils.parseUnits(cost, 18);
            submitEditPlan(
              currentPlanId,
              values.name.toString(),
              planCost.toString(),
              values.planStart.toString(),
              values.duration.toString(),
              values.planEnd.toString()
            );
            setIsModalVisible(false);
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
            <Button type="submit">Edit Plan</Button>
          </Group>
        </form>
      </Modal>
    </AppShell>
  );
};
