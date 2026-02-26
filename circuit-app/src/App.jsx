import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "battery",
    position: { x: 100, y: 200 },
    data: {
       label: "Battery (9V)" ,
       voltage: 9,
       current: 0,
       resistance: 0, 
    },
  },

  {
    id: "resistor1",
    position: { x: 400, y: 200 },
    data: { label: "Resistor (100Ω)",
      voltage: 0,
      current : 0,
      resistance: 100, 

    },
  },
];


const initialEdges = [];




export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  //  Add a Counter for Unique IDs
const [idCounter, setIdCounter] = useState(2);
  
  

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  }

  // Create Add Component Function
  const addComponent = (type) => {
  const newId = `${type}-${idCounter}`;

  let newNode = {
    id: newId,
    position: {
      x: Math.random() * 500,
      y: Math.random() * 400,
    },
    data: {},
  };

  if (type === "battery") {
    newNode.data = {
      label: "Battery (9V)",
      voltage: 9,
      current: 0,
      resistance: 0,
    };
  }

  if (type === "resistor") {
    newNode.data = {
      label: "Resistor (100Ω)",
      voltage: 0,
      current: 0,
      resistance: 100,
    };
  }

  if (type === "capacitor") {
    newNode.data = {
      label: "Capacitor",
      voltage: 0,
      current: 0,
      resistance: 0,
    };
  }

  setNodes((nds) => [...nds, newNode]);
  setIdCounter((prev) => prev + 1);
};

  return (
    <div style={{ display: 'flex',width: "100vw", height: "100vh" }}>

      {/* {LEFT PANAL} */}
      <div style ={{width: "10%", padding:"10px"}}>
        <h3>Components</h3>

        {/* Connect Buttons to Function */}
        <button onClick={() => addComponent("battery")}>
          Battery
        </button>

        <button onClick={() => addComponent("resistor")}>
          Resistor
        </button>

        <button onClick={() => addComponent("capacitor")}>
          Capacitor
        </button>

      </div>


      <div style = {{ flex: 8}}> 

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          fitView
          >
          <Background />
          <Controls />
        </ReactFlow>
        </div>

        <div style = {{flex : 1}}>
          {selectedNode && (
          <div>
            <h4>Component Details</h4>
            <p>Voltage: {selectedNode.data.voltage} V</p>
            <p>Current: {selectedNode.data.current} A</p>
            <p>Resistance: {selectedNode.data.resistance} Ω</p>
          </div>
        )}
        
      </div>
    </div>
  );
}