import { BpmnVisualization, ShapeUtil, FlowKind } from "bpmn-visualization";

// BPMN diagram content conveniently retrieved with parcel (as string)
// for other load methods, see https://github.com/process-analytics/bpmn-visualization-examples
import diagram from "./diagram.bpmn?raw";
import "./styles.css";

// 'bpmn-visualization' API documentation: https://process-analytics.github.io/bpmn-visualization-js/api/index.html
const bpmnVisualization = new BpmnVisualization({
  container: "bpmn-container",
  navigation: { enabled: true }
});

const footer = document.querySelector("footer");
const version = bpmnVisualization.getVersion();
footer.innerText = `bpmn-visualization@${version.lib}`;

//load and filter a pool
bpmnVisualization.load(diagram, {
  fit: { type: "Center" },
  modelFilter: {
    pools: [
      {
        // id of the Participant related to the Pool to display
        name: "Process Engine - Invoice Receipt"
      }
    ]
  }
});

//add CSS classes to show running instances
let activitiesMonitoringData = getActivitiesMonitoringData();
let edgesWaitingInstances = getEdgesWaitingInstances();

// Add Overlay on activities
activitiesMonitoringData.forEach((value, key) => {
  //running on time
  if (value[0] !== 0) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, {
      position: "top-center",
      label: value[1].toString(),
      style: {
        font: { color: "black", size: 16 },
        fill: { color: "#0FFF50", opacity: 50 },
        stroke: { color: "#0FFF50", width: 2 }
      }
    });
  }
  //running late with risky level
  if (value[1] !== 0) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, {
      position: "top-left",
      label: value[2].toString(),
      style: {
        font: { color: "black", size: 16 },
        fill: { color: "orange", opacity: 50 },
        stroke: { color: "orange", width: 2 }
      }
    });
  }
  //running late with critical level
  if (value[2] !== 0) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, {
      position: "top-right",
      label: value[3].toString(),
      style: {
        font: { color: "black", size: 16 },
        fill: { color: "red", opacity: 50 },
        stroke: { color: "red", width: 2 }
      }
    });
  }
});

activitiesMonitoringData.forEach((value, key) => {
  if (value[3] !== 0){
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "task-running-critical");
      }
  else if (value[2] !== 0){
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "task-running-risky");
    }
  else if (value[1] !== 0)
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "task-running-on-time");
});

edgesWaitingInstances.forEach((value, key) => {
  bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "path-waiting");
});

edgesWaitingInstances.forEach((value, key) => {
  bpmnVisualization.bpmnElementsRegistry.addOverlays(key, [
    {
      position: "middle",
      label: value.toString(),
      style: {
        font: { color: "black", size: 16 },
        fill: { color: "red", opacity: 50 },
        stroke: { color: "red", width: 2 }
      }
    }
  ]);
});

/**
 * @param {Map<String, list>} activitiesMonitoringData
 */
function getActivitiesMonitoringData() {
  let activitiesMonitoringData = new Map();
  activitiesMonitoringData.set("assignApprover", [5, 0, 0]);
  activitiesMonitoringData.set("approveInvoice", [2, 3, 0]);
  activitiesMonitoringData.set("reviewInvoice", [4, 1, 2]);
  activitiesMonitoringData.set("prepareBankTransfer", [0, 0, 0]);
  activitiesMonitoringData.set("archiveInvoice", [0, 0, 0]);
  return activitiesMonitoringData;
}

/**
 * @param {Map<String, Integer>} edgesWaitingInstances
 */
function getEdgesWaitingInstances() {
  let edgesWaitingInstances = new Map();
  edgesWaitingInstances.set("invoiceApproved", 2);
  return edgesWaitingInstances;
}
