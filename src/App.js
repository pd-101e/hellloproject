import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import constants from "./constant";

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [freelancingContract, setFreelancingContract] = useState();
  const [clientAddress, setClientAddress] = useState("");
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function init() {
      // initialize provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // initialize signer
      const signer = provider.getSigner();
      setSigner(signer);

      // initialize contract
      const abi = constants.abi; // contract ABI
      const address = constants.address; // contract address
      const contract = new ethers.Contract(address, abi, signer);
      setFreelancingContract(contract);

      // fetch existing projects
      const numProjects = await contract.projectId();
      const projects = [];
      for (let i = 1; i <= numProjects; i++) {
        const project = await contract.projects(i);
        projects.push(project);
      }
      setProjects(projects);
    }
    init();
  }, []);

  async function handleCreateProject(event) {
    event.preventDefault();
    const client = clientAddress;
    const freelancer = freelancerAddress;
    const amountInWei = ethers.utils.parseEther(amount);
    const durationInSeconds = parseInt(duration, 10) * 60 * 60 * 24; // convert days to seconds
    const overrides = { value: amountInWei };
    await freelancingContract.createProject(
      client,
      freelancer,
      durationInSeconds,
      overrides
    );
    const numProjects = await freelancingContract.projectId();
    const project = await freelancingContract.projects(numProjects);
    setProjects([...projects, project]);
  }

  return (
    <div>
      <h1>Freelancing Contract</h1>
      <form onSubmit={handleCreateProject}>
        <label>
          Client address:
          <input
            type="text"
            value={clientAddress}
            onChange={(event) => setClientAddress(event.target.value)}
          />
        </label>
        <label>
          Freelancer address:
          <input
            type="text"
            value={freelancerAddress}
            onChange={(event) => setFreelancerAddress(event.target.value)}
          />
        </label>
        <label>
          Amount (ETH):
          <input
            type="text"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <label>
          Duration (days):
          <input
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          />
        </label>
        <button type="submit">Create project</button>
      </form>
      <h2>Projects</h2>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            Project ID: {project.id.toString()}
            <br />
            Client: {project.client}
            <br />
            Freelancer: {project.freelancer}
            <br />
            Amount:{" "}
            {ethers.utils.parseEther(project.amount.toString()).toString()} ETH
            <br />
            Deadline:{" "}
            {new Date(project.deadline.toNumber() * 1000).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
