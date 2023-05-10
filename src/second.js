import React, { useState } from "react";
import Web3 from "web3";
// import FreelancingContract from "./contracts/Freelancing.json";
import FreelancingContract from "./artifacts/contracts/Freelancing.sol/Freelancing.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [client, setClient] = useState("");
  const [freelancer, setFreelancer] = useState("");
  const [workCompleted, setWorkCompleted] = useState(false);
  const [workAccepted, setWorkAccepted] = useState(false);
  const [fundsReleased, setFundsReleased] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [dispute, setDispute] = useState(false);

  const handleCreateProject = async () => {
    const result = await contract.methods
      .createProject(client, freelancer, duration)
      .send({ from: accounts[0], value: amount });
    console.log(result);
  };

  const handleCompleteWork = async () => {
    const result = await contract.methods
      .completeWork(projectId)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const handleAcceptWork = async () => {
    const result = await contract.methods
      .acceptWork(projectId)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const handleReleaseFunds = async () => {
    const result = await contract.methods
      .releaseFunds(projectId)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const handleRefund = async () => {
    const result = await contract.methods
      .refund(projectId)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const handleCancelProject = async () => {
    const result = await contract.methods
      .cancelProject(projectId)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const handleRaiseDispute = async () => {
    const result = await contract.methods
      .raiseDispute(projectId)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const handleResolveDispute = async (favour) => {
    const result = await contract.methods
      .resolveDispute(projectId, favour)
      .send({ from: accounts[0] });
    console.log(result);
  };

  const connectToWeb3 = async () => {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const contractAddress = FreelancingContract.networks[networkId].address;
    const contract = new web3.eth.Contract(
      FreelancingContract.abi,
      contractAddress
    );
    setWeb3(web3);
    setAccounts(accounts);
    setContract(contract);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectToWeb3}>Connect to Web3</button>
      </header>
      <div>
        <h2>Create Project</h2>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <label>Duration (in seconds):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <br />
        <label>Client:</label>
        <input
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <br />
        <label>Freelancer:</label>
        <input
          type="text"
          value={freelancer}
          onChange={(e) => setFreelancer(e.target.value)}
        />
        <br />
        <button onClick={handleCreateProject}>Create Project</button>
      </div>
      <div>
        <h2>Project Actions</h2>
        <label>Project ID:</label>
        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <br />
        {workCompleted ? (
          <p>Work Completed</p>
        ) : (
          <button onClick={handleCompleteWork}>Complete Work</button>
        )}
        {workAccepted ? (
          <p>Work Accepted</p>
        ) : (
          <button onClick={handleAcceptWork}>Accept Work</button>
        )}
        {fundsReleased ? (
          <p>Funds Released</p>
        ) : (
          <button onClick={handleReleaseFunds}>Release Funds</button>
        )}
        {cancelled ? (
          <p>Cancelled</p>
        ) : (
          <button onClick={handleCancelProject}>Cancel Project</button>
        )}
        {dispute ? (
          <p>Dispute Raised</p>
        ) : (
          <button onClick={handleRaiseDispute}>Raise Dispute</button>
        )}
        {dispute ? (
          <div>
            <button onClick={() => handleResolveDispute(true)}>
              Resolve Dispute in Favour of Client
            </button>
            <button onClick={() => handleResolveDispute(false)}>
              Resolve Dispute in Favour of Freelancer
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
