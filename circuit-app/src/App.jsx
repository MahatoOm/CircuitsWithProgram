import React, { useCallback, useState } from "react";
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
       label: "Battery (9V)" ,
       voltage: 9,
       current: 0,
       resistance: 0, 
    },
  },

  {
    id: "resistor1",
    type: "resistor",
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

  // const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  //  Add a Counter for Unique IDs
const [idCounter, setIdCounter] = useState(2);
  
  

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
    // []

  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  }

  // Create Add Component Function
const addComponent = (type) => {
  const newId = `${type}-${idCounter}`;

  console.log(type);
  console.log(newId);
  
  let newNode = {
    id: newId,
    type: type,
    position: {
      x: Math.random() * 500,
      y: Math.random() * 400,
    },
    data: {},
  };

  console.log(newNode);

  if (type === "battery") {
    newNode.data = {
      label: "Battery (9V)",
      type: 'battery',
      voltage: 9,
      current: 0,
      resistance: 0,
    };
  }

  if (type === "resistor") {
    newNode.data = {
      label: "Resistor (100Ω)",
      type: 'resistor',
      voltage: 0,
      current: 0,
      resistance: 100,
    };
  }

  if (type === "capacitor") {
    newNode.data = {
      label: "Capacitor",
      type: 'capacitor',
      voltage: 0,
      current: 0,
      resistance: 0,
    };
  }

  setNodes((nds) => [...nds, newNode]);
  setIdCounter((prev) => prev + 1);
};


const BatteryNode = ({ data }) => {
  console.log(data);
  console.log("This is battery node")
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
  console.log(data);
  return (
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
          nodeTypes={nodeTypes}
          fitView
          // this makes the loose connection for  handles to connect in any nodes
          connectionMode="loose"
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