import React, { useState } from "react";
import ReactFlow, { 
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState, } from "reactflow";


import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "battery",
    position: { x: 100, y: 200 },
    data: { label: "Battery (9V)" },
  },
  {
    id: "resistor1",
    position: { x: 400, y: 200 },
    data: { label: "Resistor (100Ω)" },
  },
];

const initialEdges = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const [selectedNode, setSelectedNode] = useState(null);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );


  

  return (
    <div style={{ display: grid,

                height: "100vh", width: '100%' }}>

      {/* Left Panel: Component Library */}
      <div style={{ flex: 2, borderRight: "1px solid gray", padding: "10px" }}>

      
        <h3>Components</h3>

        <div style={{ margin: "10px 0", padding: "5px", border: "1px solid black", cursor: "pointer" }}>
          Battery
        </div>
        <div style={{ margin: "10px 0", padding: "5px", border: "1px solid black", cursor: "pointer" }}>
          Resistor
        </div>
        <div style={{ margin: "10px 0", padding: "5px", border: "1px solid black", cursor: "pointer" }}>
          Capacitor
        </div>
      </div>

      {/* Center Panel: Circuit Canvas */}
      <div style={{ flex: 6, height: "100%" }}>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView

          
          style={{ width: "100%", height: "100%" }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Right Panel: Selected Node Info */}
      <div style={{ flex: 2, borderRight: "1px solid gray", padding: "10px" }}>

        <h3>Node Info</h3>
        {selectedNode ? (
          <div>
            <p>ID: {selectedNode.id}</p>
            <p>Label: {selectedNode.data?.label}</p>
            <p>Voltage: {selectedNode.data?.voltage || "-"}</p>
            <p>Current: {selectedNode.data?.current || "-"}</p>
            <p>Resistance: {selectedNode.data?.resistance || "-"}</p>
          </div>
        ) : (
          <p>No node selected</p>
        )}
      </div>

    </div>
  );
}
