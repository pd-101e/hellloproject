import React, { useState } from "react";
import Web3 from "web3";
import Freelancing from "./artifacts/contracts/Freelancing.sol/Freelancing.json";

function App() {
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [projectData, setProjectData] = useState({
    client: "",
    freelancer: "",
    amount: "",
    duration: "",
  });
  const [projectId, setProjectId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBlockchain = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const networkData = Freelancing.networks[networkId];
      if (networkData) {
        const contract = new web3.eth.Contract(
          Freelancing.abi,
          networkData.address
        );
        setContract(contract);
        setAccounts(accounts);
      } else {
        setErrorMessage("Smart contract not deployed to detected network.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    const { client, freelancer, amount, duration } = projectData;
    try {
      await contract.methods
        .createProject(freelancer, client, duration)
        .send({ from: accounts[0], value: amount });
      setProjectData({
        client: "",
        freelancer: "",
        amount: "",
        duration: "",
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCompleteWork = async () => {
    try {
      await contract.methods
        .completeWork(projectId)
        .send({ from: accounts[0] });
      setProjectId(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleAcceptWork = async () => {
    try {
      await contract.methods.acceptWork(projectId).send({ from: accounts[0] });
      setProjectId(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleReleaseFunds = async () => {
    try {
      await contract.methods
        .releaseFunds(projectId)
        .send({ from: accounts[0] });
      setProjectId(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRefund = async () => {
    try {
      await contract.methods.refund(projectId).send({ from: accounts[0] });
      setProjectId(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCancelProject = async () => {
    try {
      await contract.methods
        .cancelProject(projectId)
        .send({ from: accounts[0] });
      setProjectId(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRaiseDispute = async () => {
    try {
      await contract.methods
        .raiseDispute(projectId)
        .send({ from: accounts[0] });
      setProjectId(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleResolveDispute = async () => {
    try {
      await contract.methods
        .resolveDispute(projectId)
        .send({ from: accounts[0] });
      setProjectId(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGetProjects = async () => {
    try {
      const result = await contract.methods.getProjects().call();
      console.log(result);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGetProjectDetails = async () => {
    try {
      const result = await contract.methods.getProjectDetails(projectId).call();
      console.log(result);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="App">
      <h1>Freelancing Smart Contract</h1>
      <button onClick={loadBlockchain}>Load Blockchain</button>
      {errorMessage && <p>{errorMessage}</p>}
      {contract && (
        <div>
          <form onSubmit={handleCreateProject}>
            <h2>Create Project</h2>
            <label htmlFor="client">Client:</label>
            <input
              type="text"
              id="client"
              name="client"
              value={projectData.client}
              onChange={handleInputChange}
            />
            <label htmlFor="freelancer">Freelancer:</label>
            <input
              type="text"
              id="freelancer"
              name="freelancer"
              value={projectData.freelancer}
              onChange={handleInputChange}
            />
            <label htmlFor="amount">Amount:</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={projectData.amount}
              onChange={handleInputChange}
            />
            <label htmlFor="duration">Duration:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={projectData.duration}
              onChange={handleInputChange}
            />
            <button type="submit">Create Project</button>
          </form>
          <h2>Project Actions</h2>
          <label htmlFor="projectId">Enter Project ID:</label>
          <input
            type="text"
            id="projectId"
            name="projectId"
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
          />
          <button onClick={handleCompleteWork}>Complete Work</button>
          <button onClick={handleAcceptWork}>Accept Work</button>
          <button onClick={handleReleaseFunds}>Release Funds</button>
          <button onClick={handleRefund}>Refund</button>
          <button onClick={handleCancelProject}>Cancel Project</button>
          <button onClick={handleRaiseDispute}>Raise Dispute</button>
          <button onClick={handleResolveDispute}>Resolve Dispute</button>
          <h2>Get Project Details</h2>
          <button onClick={handleGetProjects}>Get Projects</button>
          <button onClick={handleGetProjectDetails}>Get Project Details</button>
        </div>
      )}
    </div>
  );
}

export default App;
