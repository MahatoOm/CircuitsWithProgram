import React, { useCallback, useState, useEffect } from "react";

import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Handle, Position } from "reactflow";
import { useMemo } from "react";

const initialNodes = [
  {
    id: "battery",
    type: "battery",
    position: { x: 100, y: 200 },
    data: {
       label: "Battery" ,
       voltage: 9,
       current: 0,
       resistance: 0, 
    },
  },

  {
    id: "resistor1",
    type: "resistor",
    position: { x: 400, y: 200 },
    data: { label: "Resistor (Ω)",
      voltage: 0,
      current : 0,
      resistance: "Unknown", 

    },
  },
];


  const initialEdges = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
  initialEdges,

  // console.log("edge"),
    // console.log(edges),
  );

  // const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  //  Add a Counter for Unique IDs
  const [idCounter, setIdCounter] = useState(2);
  
  

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  }

  // Create Add Component Function
const addComponent = (type) => {
  const newId = `${type}-${idCounter}`;

  // console.log(type);
  // console.log(newId);
  
  let newNode = {
    id: newId,
    type: type,
    position: {
      x: Math.random() * 500,
      y: Math.random() * 400,
    },
    data: {},
  };

  // console.log(newNode);

  if (type === "battery") {
    newNode.data = {
      label: newId,
      type: 'battery',
      voltage: "Unknown",
      current: "Unknown",
      resistance: "Unknown",
    };
  }

  if (type === "resistor") {
    newNode.data = {
      label: newId,
      type: 'resistor',
      voltage: "Unknown",
      current: "Unknown",
      resistance: "Unknown",
    };
  }

  if (type === "capacitor") {
    newNode.data = {
      label: newId,
      type: 'capacitor',
      voltage: 0,
      current: 0,
      resistance: 0,
    }; 
    
    if (type === "Bulb") {
    newNode.data = {
      label: newId,
      type: 'capacitor',
      voltage: "Unknown",
      current: "Unknown",
      resistance: "Unknown",
    };
  }

  setNodes((nds) => [...nds, newNode]);
  setIdCounter((prev) => prev + 1);
};

const BatteryNode = ({ data }) => {
  // console.log(data);
  // console.log("This is battery node")
  return (
    <div style={{
      padding: 10,
      border: "2px solid black",
      borderRadius: 5,
      background: "white",
      textAlign: "center"
    }}>

      <div style={{ color: "#343532" ,fontWeight: "bold" }}>
        {data?.label}
      
      </div>

     
        {/* console.log("THis is battery node") */}

      {/* Positive Terminal */}

      <Handle 
        type = "target"
        position={Position.Right}
        id="pos-target"></Handle>

      <Handle
        type="source"
        position={Position.Left}
        id="pos-source"
      />


      {/* Negative Terminal */}
      
      <Handle
        type="target"
        position={Position.Left}
        id="neg-target"
      />
      
      <Handle
        type="source"
        position={Position.Left}
        id="neg-source"
      />

    </div>
  );
};

const ResistorNode = ({ data }) => {
  // console.log(data);
  return (

    
    <div>
    <div style={{
      padding: 10,
      border: "2px solid blue",
      borderRadius: 5,
      background: "white",
      textAlign: "center"
    }}>
      <div style = {{ color:" #343532", fontWeight: "bold" }}>
      {data?.label}
      </div>
      
      

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
      />

      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
      />
 
      
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
      />
    </div>
    <div style={{ fontSize: "12px" }}>
        R: {data.resistance}Ω
        V: {data.voltage}V  
        I: {data.current}A
    </div>
    </div>

  );
};



// const nodeTypes =  ({
//   battery: BatteryNode ,
//   resistor: ResistorNode,
// });


const nodeTypes = useMemo(() => ({
  battery: BatteryNode,
  resistor: ResistorNode
}), []);

// const UniversalNode = ({ data }) => {
//   return (
//     <div
//       style={{
//         padding: 15,
//         border: "2px solid black",
//         borderRadius: 6,
//         background: "white",
//         textAlign: "center",
//         width: 120,
//       }}
//     >
//       {data.label}

//       {/* LEFT */}
//       <Handle
//         type="source"
//         position={Position.Left}
//         id="left"
//       />

//       {/* RIGHT */}
//       <Handle
//         type="source"
//         position={Position.Right}
//         id="right"
//       />

      
//     </div>
//   );
// };


// const createHandles = () => (
//   <>
//     <Handle type="source" position={Position.Left} id="left" />
//     <Handle type="source" position={Position.Right} id="right" />
    
//   </>
// );

  // to get all the edges it a react function
  useEffect(() => {
    console.log("All Edgex", edges);
  },[edges]);






const [result, setResult] = useState(null);
const handleCalculate = () => {
  const result = solveCircuit(nodes, edges);

  console.log("Circuit Result:", result);

  setResult(result);

  if (!result) return;

  // Update each resistor node with calculated voltage/current
  setNodes((nds) =>
    nds.map((node) => {
      const resistorResult = result.resistorResults.find(
        (r) => r.id === node.id
      );

      if (!resistorResult) return node;

      return {
        ...node,
        data: {
          ...node.data,
          voltage: Number(resistorResult.voltageDrop.toFixed(4)),
          current: Number(Math.abs(resistorResult.current).toFixed(4)),
          resistance: resistorResult.resistance,
        },
      };
    })
  );
};

const updateSelectedNodeData = (field, value) => {
  const numberValue = Number(value);

  setNodes((nds) =>
    nds.map((node) =>
      node.id === selectedNode.id
        ? {
            ...node,
            data: {
              ...node.data,
              [field]: numberValue,
            },
          }
        : node
    )
  );

  setSelectedNode((prev) => ({
    ...prev,
    data: {
      ...prev.data,
      [field]: numberValue,
    },
  }));
};




  return (
    <div style={{ display: 'flex',width: "100vw", height: "100vh" }}>

      {/* {LEFT PANAL} */}
      <div>

     
      <div style ={{width: "10%", padding:"10px"}}>
        <h3>Components</h3>

        {/* Connect Buttons to Function */}
        <h4><button onClick={() => addComponent("battery")}>
          Battery
        </button>
        <br></br>
        <br></br>

        <button onClick={() => addComponent("resistor")}>
          Resistor
        </button></h4>

        {/* <button onClick={() => addComponent("capacitor")}>
          Capacitor
        
        </button>  */}
      </div>

     

     {result && (
  <div>
    <h4>Equivalent Circuit Result</h4>
    <p>Equivalent Voltage: {result.voltage} V</p>
    <p>
      Equivalent Resistance:{" "}
      {result.equivalentResistance === Infinity
        ? "Open Circuit"
        : result.equivalentResistance.toFixed(2) + " Ω"}
    </p>
    <p>Equivalent Current: {result.totalCurrent.toFixed(4)} A</p>
  </div>
)}
       </div>



      <div style = {{ flex: 8}}> 
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          // this makes the loose connection for  handles to connect in any nodes
          connectionMode="loose"
          >            
        <Background />
        <Controls />
        </ReactFlow>
        </div>

        {/* <div style = {{flex : 1}}>
          {selectedNode && (
          <div>
            <h4>Component Details</h4>
            <p>Voltage: {selectedNode.data.voltage} V</p>
            <p>Current: {selectedNode.data.current} A</p>
            <p>Resistance: {selectedNode.data.resistance} Ω</p>
          </div>
        )}

      </div> */}

      {/* RIght Column */}

      <div style={{ flex: 1,padding: "10px", borderLeft: "1px solid #ccc" }}>
  {selectedNode ? (
    <div>
      <h1><label>{selectedNode.data.label}</label>
        </h1>

      <h4>Component Details</h4>

      <label>Voltage (V)</label>
      <input
        type="number"
        value={selectedNode.data.voltage}
        onChange={(e) =>
          updateSelectedNodeData("voltage", e.target.value)
        }
      />

      <br /><br />

      <label>Current (A)</label>
      <input
        type="number"
        value={selectedNode.data.current}
        onChange={(e) =>
          updateSelectedNodeData("current", e.target.value)
        }
      />

      <br /><br />

      <label>Resistance (Ω)</label>
      <input
        type="number"
        value={selectedNode.data.resistance}
        onChange={(e) =>
          updateSelectedNodeData("resistance", e.target.value)
        }
      />
    </div>
  ) : (
    <p>Select a component</p>
  )}




 <div style={{padding:"30px", margin: "50px"}}>
         <button onClick={handleCalculate}>
          Calculate
        </button>  

      </div>



    </div>
    </div>
  );
}

}
function solveCircuit(nodes, edges) {
  const parent = {};

  const find = (x) => {
    if (!parent[x]) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  const union = (a, b) => {
    parent[find(a)] = find(b);
  };

  const terminal = (nodeId, handleId) => `${nodeId}:${handleId}`;

  // 1. Convert edges into electrical nets
  edges.forEach((edge) => {
    union(
      terminal(edge.source, edge.sourceHandle),
      terminal(edge.target, edge.targetHandle)
    );
  });

  const battery = nodes.find((n) => n.type === "battery");
  if (!battery) return null;

  const batteryVoltage = Number(battery.data.voltage || 0);

  const positiveNet = find(terminal(battery.id, "pos-target"));
  const negativeNet = find(terminal(battery.id, "neg-target"));

  // 2. Convert resistor nodes into resistor branches
  let components = nodes
    .filter((n) => n.type === "resistor")
    .map((node) => {
      const leftNet = find(terminal(node.id, "left-source"));
      const rightNet = find(terminal(node.id, "right-source"));

      return {
        id: node.id,
        type: "resistor",
        resistance: Number(node.data.resistance || 0),
        a: leftNet,
        b: rightNet,
        originalIds: [node.id],
      };
    })
    .filter((r) => r.resistance > 0 && r.a !== r.b);

  let steps = [];

  let changed = true;

  while (changed) {
    changed = false;

    // 3. Detect parallel resistors
    const parallelGroups = {};

    components.forEach((r) => {
      const key = [r.a, r.b].sort().join("|");

      if (!parallelGroups[key]) {
        parallelGroups[key] = [];
      }

      parallelGroups[key].push(r);
    });

    for (const key in parallelGroups) {
      const group = parallelGroups[key];

      if (group.length > 1) {
        const equivalentResistance =
          1 / group.reduce((sum, r) => sum + 1 / r.resistance, 0);

        const newComponent = {
          id: `parallel-${Date.now()}-${Math.random()}`,
          type: "parallel",
          resistance: equivalentResistance,
          a: group[0].a,
          b: group[0].b,
          originalIds: group.flatMap((r) => r.originalIds),
        };

        steps.push({
          type: "parallel",
          components: group.map((r) => r.id),
          resistance: equivalentResistance,
        });

        components = components.filter((r) => !group.includes(r));
        components.push(newComponent);

        changed = true;
        break;
      }
    }

    if (changed) continue;

    // 4. Detect series resistors
    const netConnections = {};

    components.forEach((r) => {
      if (!netConnections[r.a]) netConnections[r.a] = [];
      if (!netConnections[r.b]) netConnections[r.b] = [];

      netConnections[r.a].push(r);
      netConnections[r.b].push(r);
    });

    for (const net in netConnections) {
      const connected = netConnections[net];

      const isMiddleNet =
        connected.length === 2 &&
        net !== positiveNet &&
        net !== negativeNet;

      if (isMiddleNet) {
        const [r1, r2] = connected;

        const outerA = r1.a === net ? r1.b : r1.a;
        const outerB = r2.a === net ? r2.b : r2.a;

        const equivalentResistance = r1.resistance + r2.resistance;

        const newComponent = {
          id: `series-${Date.now()}-${Math.random()}`,
          type: "series",
          resistance: equivalentResistance,
          a: outerA,
          b: outerB,
          originalIds: [...r1.originalIds, ...r2.originalIds],
        };

        steps.push({
          type: "series",
          components: [r1.id, r2.id],
          resistance: equivalentResistance,
        });

        components = components.filter((r) => r !== r1 && r !== r2);
        components.push(newComponent);

        changed = true;
        break;
      }
    }
  }

  // 5. Final equivalent resistance
  const finalComponent = components.find(
    (r) =>
      (r.a === positiveNet && r.b === negativeNet) ||
      (r.a === negativeNet && r.b === positiveNet)
  );

  if (!finalComponent) {
    return {
      voltage: batteryVoltage,
      equivalentResistance: Infinity,
      totalCurrent: 0,
      resistorResults: [],
      steps,
      message: "Open circuit or unsupported circuit shape",
    };
  }

  const equivalentResistance = finalComponent.resistance;
  const totalCurrent = batteryVoltage / equivalentResistance;

  return {
    voltage: batteryVoltage,
    equivalentResistance,
    totalCurrent,
    resistorResults: nodes
      .filter((n) => n.type === "resistor")
      .map((r) => ({
        id: r.id,
        resistance: Number(r.data.resistance || 0),
        voltageDrop: 0,
        current: 0,
      })),
    steps,
    finalType: finalComponent.type,
  };
}


// function solveCircuit(nodes, edges) {
//   const parent = {};

//   const find = (x) => {
//     if (!parent[x]) parent[x] = x;
//     if (parent[x] !== x) parent[x] = find(parent[x]);
//     return parent[x];
//   };

//   const union = (a, b) => {
//     parent[find(a)] = find(b);
//   };

//   const terminal = (nodeId, handleId) => `${nodeId}:${handleId}`;

//   // 1. Join connected handles into same electrical net
//   edges.forEach((edge) => {
//     union(
//       terminal(edge.source, edge.sourceHandle),
//       terminal(edge.target, edge.targetHandle)
//     );
//   });

//   const battery = nodes.find((n) => n.type === "battery");
//   if (!battery) return null;

//   const batteryVoltage = Number(battery.data.voltage || 0);

//   const positiveNet = find(terminal(battery.id, "pos-target"));
//   const negativeNet = find(terminal(battery.id, "neg-target"));

//   const resistors = nodes
//     .filter((n) => n.type === "resistor")
//     .map((r) => ({
//       id: r.id,
//       resistance: Number(r.data.resistance || 0),
//       a: find(terminal(r.id, "left-source")),
//       b: find(terminal(r.id, "right-source")),
//     }))
//     .filter((r) => r.resistance > 0 && r.a !== r.b);

//   const nets = [...new Set(resistors.flatMap((r) => [r.a, r.b]))];

//   const knownVoltage = {
//     [positiveNet]: batteryVoltage,
//     [negativeNet]: 0,
//   };

//   const unknownNets = nets.filter((net) => knownVoltage[net] === undefined);

//   const index = {};
//   unknownNets.forEach((net, i) => {
//     index[net] = i;
//   });

//   const size = unknownNets.length;
//   const A = Array.from({ length: size }, () => Array(size).fill(0));
//   const B = Array(size).fill(0);

//   resistors.forEach((r) => {
//     const g = 1 / r.resistance;

//     const add = (n1, n2) => {
//       if (knownVoltage[n1] !== undefined) return;

//       const i = index[n1];
//       A[i][i] += g;

//       if (knownVoltage[n2] !== undefined) {
//         B[i] += g * knownVoltage[n2];
//       } else {
//         const j = index[n2];
//         A[i][j] -= g;
//       }
//     };

//     add(r.a, r.b);
//     add(r.b, r.a);
//   });

//   const solved = gaussianSolve(A, B);

//   const netVoltage = {
//     ...knownVoltage,
//   };

//   unknownNets.forEach((net, i) => {
//     netVoltage[net] = solved[i];
//   });

//   let totalCurrent = 0;

//   const resistorResults = resistors.map((r) => {
//     const va = netVoltage[r.a];
//     const vb = netVoltage[r.b];
//     const current = (va - vb) / r.resistance;
//     const voltageDrop = Math.abs(va - vb);

//     if (r.a === positiveNet) totalCurrent += current;
//     if (r.b === positiveNet) totalCurrent -= current;

//     return {
//       id: r.id,
//       resistance: r.resistance,
//       voltageDrop,
//       current,
//     };
//   });

//   const equivalentResistance =
//     totalCurrent !== 0 ? batteryVoltage / Math.abs(totalCurrent) : Infinity;

//   return {
//     voltage: batteryVoltage,
//     equivalentResistance,
//     totalCurrent: Math.abs(totalCurrent),
//     resistorResults,
//     netVoltage,
//   };
// }

// function gaussianSolve(A, B) {
//   const n = B.length;

//   for (let i = 0; i < n; i++) {
//     let maxRow = i;

//     for (let k = i + 1; k < n; k++) {
//       if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
//         maxRow = k;
//       }
//     }

//     [A[i], A[maxRow]] = [A[maxRow], A[i]];
//     [B[i], B[maxRow]] = [B[maxRow], B[i]];

//     const pivot = A[i][i];
//     if (Math.abs(pivot) < 1e-12) continue;

//     for (let j = i; j < n; j++) A[i][j] /= pivot;
//     B[i] /= pivot;

//     for (let k = 0; k < n; k++) {
//       if (k === i) continue;

//       const factor = A[k][i];
//       for (let j = i; j < n; j++) {
//         A[k][j] -= factor * A[i][j];
//       }
//       B[k] -= factor * B[i];
//     }
//   }

//   return B;
// }

