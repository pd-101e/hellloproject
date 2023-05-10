//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Freelancing {
    address mediator;
    constructor (){
        mediator = msg.sender;
    }
    struct Project {
        address payable client;
        address payable freelancer;
        uint amount;
        uint deadline;
        bool workCompleted;
        bool workAccepted;
        bool fundsReleased;
        bool cancelled;
        bool dispute;
    }

    mapping (uint => Project) public projects;
    uint public projectId = 0;

    function createProject(address payable _client, address payable _freelancer, uint _duration) public payable returns(uint) {
        projectId++;
        projects[projectId] = Project(_client, _freelancer, msg.value, block.timestamp + _duration, false, false, false, false, false);
        return projectId;
    }

    function completeWork(uint _projectId) public {
        Project storage project = projects[_projectId];
        require(!project.cancelled,"The project is no longer available");
        require(msg.sender == project.freelancer, "Only the freelancer can complete the work");
        project.workCompleted = true;
    }

    function acceptWork(uint _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.client, "Only the client can accept the work");
        require(project.workCompleted, "Work must be completed before it can be accepted");
        project.workAccepted = true;
    }

    function releaseFunds(uint _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.client, "Only the client can release the funds");
        require(project.workAccepted, "Work must be accepted before funds can be released");
        require(block.timestamp < project.deadline, "Deadline has passed, funds cannot be released");
        require(!project.fundsReleased, "Funds have already been released");

        project.fundsReleased = true;
        project.freelancer.transfer(project.amount);
    }

    function refund(uint _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.freelancer, "Only the freelancer can request a refund");
        require(block.timestamp >= project.deadline, "Refunds can only be requested after the deadline");
        require(!project.fundsReleased, "Funds have already been released");

        project.fundsReleased = true;
        project.client.transfer(project.amount);
    }

    function cancelProject(uint _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.client,"Only the client can cancel the project");
        require(!project.workCompleted,"Work is completed so the project cannot be cancelled");

        project.cancelled = true;
    }

    function raiseDispute(uint _projectId) public{
        Project storage project = projects[_projectId];
        require(msg.sender == project.client||msg.sender == project.freelancer,"Only client and freelancer can raise the dispute");
        require(!project.fundsReleased,"Project funds are released so the dispute cannot be raised");

        project.dispute = true;
    }

    function resolveDispute(uint _projectId,bool Cfavour) public{
        Project storage project = projects[_projectId];
        require(msg.sender == mediator,"Only mediator is allowed to resolve dispute");
        require(!project.dispute,"Dispute is not raised to be resolved");

        if(Cfavour)
        {
            project.client.transfer(project.amount);
        }
        else {
            project.freelancer.transfer(project.amount);
        }
        project.fundsReleased = true;
    }
}