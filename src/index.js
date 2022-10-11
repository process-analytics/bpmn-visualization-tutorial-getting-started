import { BpmnVisualization, FitType } from "bpmn-visualization";

// BPMN diagram content conveniently retrieved with Vite (as string)
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

// load and filter a pool
bpmnVisualization.load(diagram, {
  fit: { type: FitType.Center },
  modelFilter: {
    pools: [
      {
        // name of the Participant related to the Pool to display
        name: "Process Engine - Invoice Receipt"
      }
    ]
  }
});

// add CSS classes to show running instances
const activitiesRunningInstances = getActivitiesRunningInstances();
const edgesWaitingInstances = getEdgesWaitingInstances();

// Add Overlay on activities
activitiesRunningInstances.forEach((value, key) => {
  // running on time
  if (value.onTime != false) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, {
      position: "top-center",
      label: value.onTime,
      style: {
        font: { color: "white", size: 16 },
        fill: { color: "green", opacity: 50 },
        stroke: { color: "green", width: 2 }
      }
    });
  }
  // running late with risky level
  if (value.risky != false) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, {
      position: "top-left",
      label: value.risky,
      style: {
        font: { color: "white", size: 16 },
        fill: { color: "#FF8C00", opacity: 50 },
        stroke: { color: "#FF8C00", width: 2 }
      }
    });
  }
  // running late with critical level
  if (value.critical != false) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, {
      position: "top-right",
      label: value.critical,
      style: {
        font: { color: "white", size: 16 },
        fill: { color: "red", opacity: 50 },
        stroke: { color: "red", width: 2 }
      }
    });
  }
});

activitiesRunningInstances.forEach((value, key) => {
  if (value.critical != false){
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "task-running-critical");
  }
  else if (value.risky != false){
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "task-running-risky");
  }
  else if (value.onTime != false){
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "task-running-on-time");
  }
});

edgesWaitingInstances.forEach((value, key) => {
  if (value.critical != false){
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "path-waiting-critical");
  } else if (value.risky != false){
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "path-waiting-risky");
  } else if (value.onTime != false){
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "path-waiting-on-time");
  }
});

edgesWaitingInstances.forEach((value, key) => {
  if (value.critical != false) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, [
      {
        position: "middle",
        label: value.critical,
        style: {
          font: { color: "black", size: 16 },
          fill: { color: "red", opacity: 50 },
          stroke: { color: "red", width: 2 }
        }
      }
    ]);
  } else if(value.risky != false){
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, [
      {
        position: "middle",
        label: value.risky,
        style: {
          font: { color: "white", size: 16 },
          fill: { color: "green", opacity: 50 },
          stroke: { color: "green", width: 2 }
        }
      }
    ]);
  }
  else if(value.onTime != false){
    bpmnVisualization.bpmnElementsRegistry.addOverlays(key, [
      {
        position: "middle",
        label: value.onTime,
        style: {
          font: { color: "black", size: 16 },
          fill: { color: "#FF8C00", opacity: 50 },
          stroke: { color: "#FF8C00", width: 2 }
        }
      }
    ]);
  }
});

/**
 * @returns {Map<string, Object>} key: BPMN element id / value: running instances
 */
function getActivitiesRunningInstances() {
  return new Map([
    ["assignApprover", {"onTime": "5", "risky": "0", "critical": "0"}],
    ["approveInvoice", {"onTime": "2", "risky": "3", "critical": "0"}],
    ["reviewInvoice", {"onTime": "4", "risky": "1", "critical": "2"}],
    ["prepareBankTransfer", {"onTime": "0", "risky": "0", "critical": "0"}],
    ["archiveInvoice", {"onTime": "0", "risky": "0", "critical": "0"}],
  ]);
}

/**
 * @returns {Map<string, Object>} key: BPMN element id / value: waiting instances
 */
function getEdgesWaitingInstances() {
  return new Map([
    ["invoiceApproved", {"onTime": "0", "risky": "0", "critical": "2"}],
  ]);
}
