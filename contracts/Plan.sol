// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface InterfaceTicket {
  function updateTicketDetails(uint _tId, string calldata _planName, uint _planId, uint _subscriptionCost, uint _subscriptionStart, uint _subscriptionEnd) external;
}

contract Plan{
  
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  address Owner;
  uint controllerNum;

  struct planDetails {
    uint planId;
    string planName;
    uint planCost;
    uint planStart;
    uint planDuration;
    uint planEnd;
    bool planValidity;
    uint planSubscribers;
  }

  struct controllerDetails {
    uint controllerId;
    address controllerAddress;
    bool controllerAccess;
  }
  // currency input is in wei (1 eth = 10^18 wei)
  // planCost -> in wei
  // time input is in days
  // planStart -> After how many days from now you want this plan to activate for users to buy
  // planEnd -> After how many days after planStart you want this plan to deactivate disabling users to buy
  // planDuration -> Duration of the plan
  // planValidity -> is the plan live/dead??

  // Mapping of tokenId with planDetails struct
  mapping(uint256 => planDetails) public plans;

  // Mapping of uint with controllerDetails struct
  mapping(uint256 => controllerDetails) public planControllers;
  
  // Mapping of address with bool for planControllers
  mapping(address => bool) public planControllersBool;  

  address public ticketContractAddr;

  // Events
  event createPlanEvent(uint indexed _planId, string _planName, uint _planCost, uint _planDuration);
  event deletePlanEvent(uint indexed _planId);
  event editPlanEvent(uint indexed _planId, string _planName, uint _planCost, uint _planStart, uint _planDuration, uint _planEnd);
  event buyPlanEvent(uint indexed _planId, uint indexed _tId);

  constructor () {
    Owner = msg.sender;
    console.log(Owner);
    controllerNum = 0;
    planControllers[controllerNum].controllerId = controllerNum;
    planControllers[controllerNum].controllerAddress = Owner;
    planControllers[controllerNum].controllerAccess = true;  
    planControllersBool[Owner] = true;  
    console.log("Plan.sol contract is deployed");
  }

  modifier onlyOwner {
    require(msg.sender == Owner, "Only Owner can call this function");
    _;
  }

  function addPlanControllers(address _user) public onlyOwner {
    require(planControllersBool[_user] == false, "this user already added to planController");
    controllerNum += 1;
    planControllers[controllerNum].controllerId = controllerNum;
    planControllers[controllerNum].controllerAddress = _user;
    planControllers[controllerNum].controllerAccess = true;  
    planControllersBool[_user] = true;
  }

  function removePlanControllers(uint _controllerId) public onlyOwner {
    planControllers[_controllerId].controllerAccess = true; 
    planControllersBool[planControllers[_controllerId].controllerAddress] = true;
  }

  modifier onlyPlanController {
    require(planControllersBool[msg.sender], "Only PlanController can call this function");
    _;
  }

  function withdrawMoney() public onlyPlanController {
    address payable to = payable(msg.sender);
    to.transfer(address(this).balance);
  }

  // cannot be edited later because plan starts immediately after plan is created
  function createPlan(string calldata _planName, uint _planCost, uint _planDuration) public onlyPlanController { 
    require(bytes(_planName).length != 0, "planName cannot be empty");
    require(_planDuration != 0, "planDuration cannot be 0 days");
    uint256 newTokenId = _tokenIds.current() + 1;
    planDetails storage newPlan = plans[newTokenId];
    newPlan.planId = newTokenId;
    newPlan.planName = _planName;
    newPlan.planCost = _planCost;
    newPlan.planStart = block.timestamp;
    newPlan.planDuration = _planDuration * 1 days;
    newPlan.planEnd = 0;
    newPlan.planValidity = true;
    emit createPlanEvent(newTokenId, _planName, _planCost, _planDuration);
    _tokenIds.increment();
  }

  // can be edited later as long as plan dint start
  function createSpecialPlan(string calldata _planName, uint _planCost, uint _planStart, uint _planDuration, uint _planEnd) public onlyPlanController {
    require(bytes(_planName).length != 0, "planName cannot be empty");
    require(_planDuration != 0, "planDuration cannot be 0 days");
    uint256 newTokenId = _tokenIds.current() + 1;
    planDetails storage newPlan = plans[newTokenId];
    newPlan.planId = newTokenId;
    newPlan.planName = _planName;
    newPlan.planCost = _planCost;
    newPlan.planStart = block.timestamp + (_planStart * 1 days);
    newPlan.planDuration = _planDuration * 1 days;
    if (_planEnd == 0) {
      newPlan.planEnd = 0;
    }
    else {
      newPlan.planEnd = block.timestamp + ((_planStart + _planEnd) * 1 days);
    }
    newPlan.planValidity = true;
    emit createPlanEvent(newTokenId, _planName, _planCost, _planDuration);
    _tokenIds.increment();
  }

  // only SpecialPlans can be editted
  function editPlan(uint _planId, string calldata _planName, uint _planCost, uint _planStart, uint _planDuration, uint _planEnd) public onlyPlanController {
    planDetails storage Plan = plans[_planId];
    require(block.timestamp < Plan.planStart, "Plan cannot be edited because plan has already started");
    require(Plan.planValidity == true, "Cannot Edit a Deleted Plan");
    Plan.planName = _planName;
    Plan.planCost = _planCost;
    Plan.planDuration = _planDuration * 1 days;
    Plan.planStart = block.timestamp + _planStart * 1 days;
    if (_planEnd == 0) {
      Plan.planEnd = 0;
    }
    else {
      Plan.planEnd = block.timestamp + ((_planStart + _planEnd) * 1 days);
    }
    emit editPlanEvent(_planId, _planName, _planCost, _planStart, _planDuration, _planEnd);
  }

  function deletePlan(uint _planId) public onlyPlanController {
    planDetails storage Plan = plans[_planId];
    require(Plan.planValidity == true, "Cannot delete a deleted Plan");
    Plan.planValidity = false;
  }

  function ticketContract(address _ticketContractAddr) onlyPlanController public {
    ticketContractAddr = _ticketContractAddr;
  }

  // Subscribe to a plan which is active and not deleted
  function buyPlan(uint _planId, uint _tId) external payable{
    require((plans[_planId].planValidity == true) && ((plans[_planId].planEnd == 0) || (block.timestamp < plans[_planId].planEnd)), "Cannot subscribe to a archived plan");
    require(block.timestamp > plans[_planId].planStart, "Cannot subscribe as plan din't start");
    require(msg.value == plans[_planId].planCost, "money sent != planCost");
    planDetails storage Plan = plans[_planId];
    Plan.planSubscribers += 1;
    string memory _planName = Plan.planName;
    uint _subscriptionCost = Plan.planCost;
    uint _subscriptionStart = block.timestamp;
    uint _subscriptionEnd = _subscriptionStart + Plan.planDuration;
    InterfaceTicket(ticketContractAddr).updateTicketDetails(_tId, _planName, _planId, _subscriptionCost, _subscriptionStart, _subscriptionEnd);
    emit buyPlanEvent(_planId, _tId);
  }

  // Returns plans which are active and not deleted
  function fetchActivePlans() public view returns (planDetails[] memory) {
    uint totalPlans = _tokenIds.current();
    uint planCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalPlans; i++) {
      if ((plans[i+1].planValidity == true) && ((plans[i+1].planEnd == 0) || (block.timestamp < plans[i+1].planEnd))) {
        planCount += 1;
      }
    }

    planDetails[] memory items = new planDetails[](planCount);

    for (uint i = 0; i < totalPlans; i++) {
      if ((plans[i+1].planValidity == true) && ((plans[i+1].planEnd == 0) || (block.timestamp < plans[i+1].planEnd))) {
        uint currentId = i + 1;
        planDetails storage currentItem = plans[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
  
  // Returns plans which arent active or deteletd
  function fetchNonActivePlans() public view returns (planDetails[] memory) {
    uint totalPlans = _tokenIds.current();
    uint planCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalPlans; i++) {
      if ((plans[i+1].planValidity == false) || 
        ((plans[i+1].planEnd != 0) && (block.timestamp > plans[i+1].planEnd))) {
        planCount += 1;
      }
    }

    planDetails[] memory items = new planDetails[](planCount);

    for (uint i = 0; i < totalPlans; i++) {
      if ((plans[i+1].planValidity == false) || 
        ((plans[i+1].planEnd != 0) && (block.timestamp > plans[i+1].planEnd))) {
        uint currentId = i + 1;
        items[currentIndex] = plans[currentId];
        currentIndex += 1;
      }
    }
    return items;
  }

  // Returns Active Controllers 
  function fetchControllers() public view returns (controllerDetails[] memory) {
    uint totalController = controllerNum;
    uint controllerCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i <= totalController; i++) {
      if (planControllers[i].controllerAccess == true) {
        controllerCount += 1;
      }
    }

    controllerDetails[] memory items = new controllerDetails[](controllerCount);

    for (uint i = 0; i <= totalController; i++) {
      if (planControllers[i].controllerAccess == true) {
        uint currentId = i;
        items[currentIndex] = planControllers[currentId] ;
        currentIndex += 1;
      }
    }
    return items;
  }

} 