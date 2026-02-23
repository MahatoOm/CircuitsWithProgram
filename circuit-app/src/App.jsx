import React, { useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Left Panel: Component Library */}
      <div
        style={{
          // width: "20%",
          flex: 2,
          borderRight: "1px solid gray",
          padding: "10px",
        }}
      >
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
      <div style={{ 
        // width: "60%"
        flex: 6,
        heitht: 'q\100%',
        // width: '60%'
         }}>
        <ReactFlow
          nodes={[]}
          edges={[]}
          fitView
          style={{ width: "100%", height: "100%" }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Right Panel: Selected Node Info */}
      <div
        style={{
          // width: "20%",
          flex : 2,
          borderLeft: "1px solid gray",
          padding: "10px",
        }}
      >
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