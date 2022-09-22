import {
  BpmnVisualization,
  FlowKind,
  ShapeBpmnElementKind
} from "bpmn-visualization";
// BPMN diagram content conveniently retrieved with parcel (as string)
// for other load methods, see https://github.com/process-analytics/bpmn-visualization-examples
import diagram from "./diagram.bpmn";
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

/*get the bpmn elements ids and store them in a list
  used later in processing*/
const activities = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([
  ShapeBpmnElementKind.TASK_USER,
  ShapeBpmnElementKind.TASK_SERVICE
]);
const activityIds = [];
for (let i = 0; i < activities.length; i++) {
  activityIds[i] = activities[i].bpmnSemantic.id;
}

const events = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([
  ShapeBpmnElementKind.EVENT_END,
  ShapeBpmnElementKind.EVENT_START
]);
const eventIds = [];
for (let i = 0; i < events.length; i++) {
  eventIds[i] = events[i].bpmnSemantic.id;
}

const flows = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(
  FlowKind.SEQUENCE_FLOW
);
const flowIds = [];
for (let i = 0; i < flows.length; i++) {
  flowIds[i] = flows[i].bpmnSemantic.id;
}

/* Change the width of elements to visualize frequency information*/

//kpi for the target number of received invoices per month
//It is used to generate a 5-level scale for frequency visualization
const invoicesPerMonthKPI = 1000;
//define a 5-level scale for the frequency
// 0-500, 500-1000, 500-1000, 1000-1500, >1500
const stepLevel = Math.floor(invoicesPerMonthKPI / 2);
const invoicesPerMonthScale = [0, stepLevel, stepLevel * 2, stepLevel * 3];
let elementsFrequency = getElementsFrequency();

elementsFrequency.forEach((value, key) => {
  const frequencyLevel = getFrequencyIndex(value, invoicesPerMonthScale);
  if (activityIds.includes(key)) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(
      key,
      "activity-freq-lvl" + frequencyLevel.toString()
    );
  } else if (eventIds.includes(key)) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(
      key,
      "event-freq-lvl" + frequencyLevel.toString()
    );
  } else if (flowIds.includes(key)) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(
      key,
      "path-freq-lvl" + frequencyLevel.toString()
    );
  }
});

/* Change the color of elements to visualize KPI violation 
    the KPIs used are activity avg throughput time and avg waiting time
    for activity throughput time: change activity fill color
    for activity waiting time: change the incoming edge color
    
    A 3-level severity is used: efficient, risky violation, critical violation
    for example, if the KPI of an activity throughput time is [1, 3], we assign:
    efficient for an avg execution time <=1 
    risky for an avg execution between ]1, 3[
    critical for an avg execition time >= 3*/
//define activities throughput time KPIs
const activitiesThroughputTimeKPI = defineActivitiesThroughputTimeKPI();
//get the avg execution time of activities
let activitiesAvgExecutionTime = getActivitiesAvgExecutionTime();
activitiesAvgExecutionTime.forEach((value, key) => {
  const violationKPI = activitiesThroughputTimeKPI.get(key);
  const violationLevel = getViolationSeverity(value, violationKPI);
  bpmnVisualization.bpmnElementsRegistry.addCssClasses(
    key,
    "activity-violation-lvl" + violationLevel.toString()
  );
});

const edgesWaitingTimeKPI = defineEdgesWaitingTimeKPI();
//get the avg waiting time of edges
let edgesAvgWaitingTime = getEdgesAvgWaitingTime();
edgesAvgWaitingTime.forEach((value, key) => {
  const violationKPI = edgesWaitingTimeKPI.get(key);
  const violationLevel = getViolationSeverity(value, violationKPI);
  bpmnVisualization.bpmnElementsRegistry.addCssClasses(
    key,
    "path-violation-lvl" + violationLevel.toString()
  );
});

//monitorting data: for each activitty [#completed instances, #running on time, #running risky late, #critically critically late ]
let activitiesMonitoringData = getActivitiesMonitoringData();

//for each event, the number process instances completed efficiently, completed late
let endEventsMonitoringData = new Map();
endEventsMonitoringData.set("invoiceNotProcessed", [200, 100]);
endEventsMonitoringData.set("invoiceProcessed", [225, 10]);

//number of process instances waiting on a particular edge
let edgesWaitingInstances = getEdgesWaitingInstances();

// Add Overlay on activities
activitiesMonitoringData.forEach((value, key) => {
  bpmnVisualization.bpmnElementsRegistry.addOverlays(key, [
    {
      //successful
      position: "middle-right",
      label: value[0].toString(),
      style: {
        font: { color: "white", size: 12 },
        fill: { color: "#21618C", opacity: 50 },
        stroke: { color: "Navy", width: 2 }
      }
    },
    {
      //running on time
      position: "top-center",
      label: value[1].toString(),
      style: {
        font: { color: "white", size: 12 },
        fill: { color: "green", opacity: 50 },
        stroke: { color: "OceanGreen", width: 2 }
      }
    },
    {
      //running risky late
      position: "top-left",
      label: value[2].toString(),
      style: {
        font: { color: "black", size: 12 },
        fill: { color: "orange", opacity: 50 },
        stroke: { color: "#8B0000", width: 2 }
      }
    },
    {
      //running critically late
      position: "top-right",
      label: value[3].toString(),
      style: {
        font: { color: "black", size: 12 },
        fill: { color: "red", opacity: 50 },
        stroke: { color: "#6C1F04", width: 2 }
      }
    }
  ]);
});

edgesWaitingInstances.forEach((value, key) => {
  bpmnVisualization.bpmnElementsRegistry.addOverlays(key, [
    {
      position: "middle",
      label: value.toString(),
      style: {
        font: { color: "black", size: 12 },
        fill: { color: "orange", opacity: 50 },
        stroke: { color: "#8B4000", width: 2 }
      }
    }
  ]);
});

endEventsMonitoringData.forEach((value, key) => {
  bpmnVisualization.bpmnElementsRegistry.addOverlays(key, [
    {
      //completed efficiently
      position: "top-right",
      label: value[0].toString(),
      style: {
        font: { color: "white", size: 10 },
        fill: { color: "green", opacity: 50 },
        stroke: { color: "green", width: 2 }
      }
    },
    {
      //completed efficiently
      position: "bottom-right",
      label: value[1].toString(),
      style: {
        font: { color: "white", size: 10 },
        fill: { color: "red", opacity: 50 },
        stroke: { color: "red", width: 2 }
      }
    }
  ]);
});

//add CSS classes
/*iterate over activitiesMonitoringData
  if value[0] which is the running value != 0
    apply CSS
*/

activitiesMonitoringData.forEach((value, key) => {
  if (value[3] !== 0) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(
      key,
      "task-running-critical"
    );
  } else if (value[2] !== 0) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(
      key,
      "task-running-risky"
    );
  } else if (value[1] !== 0) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(
      key,
      "task-running-on-time"
    );
  }
});

edgesWaitingInstances.forEach((value, key) => {
  bpmnVisualization.bpmnElementsRegistry.addCssClasses(key, "running-dashed");
});

function getFrequencyIndex(frequency, scale) {
  for (let i = 0; i < scale.length; i++) {
    if (frequency < scale[i]) {
      return i;
    }
  }
  return scale.length;
}

function getViolationSeverity(value, violationKPI) {
  if (value <= violationKPI[0]) {
    return 0;
  }
  if (value >= violationKPI[1]) {
    return 2;
  }
  return 1;
}

function getElementsFrequency() {
  let frequencyOfVisit = new Map();
  frequencyOfVisit.set("StartEvent_1", 800);
  //outgoing edge
  frequencyOfVisit.set("SequenceFlow_1", 800);
  frequencyOfVisit.set("assignApprover", 800);
  //outgoing edge
  frequencyOfVisit.set("sequenceFlow_178", 700);
  frequencyOfVisit.set("approveInvoice", 690);
  //outgoing edge
  frequencyOfVisit.set("sequenceFlow_180", 650);
  //incoming
  frequencyOfVisit.set("reviewSuccessful", 300);
  frequencyOfVisit.set("reviewInvoice", 400);
  //incoming edge
  frequencyOfVisit.set("invoiceNotApproved", 300);
  //outgoing edge
  frequencyOfVisit.set("sequenceFlow_183", 300);
  frequencyOfVisit.set("prepareBankTransfer", 235);
  //incoming edge
  frequencyOfVisit.set("invoiceApproved", 250);
  //outgoing edge
  frequencyOfVisit.set("SequenceFlow_2", 235);
  frequencyOfVisit.set("archiveInvoice", 235);
  //outgoing edge
  frequencyOfVisit.set("SequenceFlow_3", 235);
  frequencyOfVisit.set("invoiceNotProcessed", 300);
  //incoming edge
  frequencyOfVisit.set("reviewNotSuccessful", 300);
  frequencyOfVisit.set("invoiceProcessed", 235);
  return frequencyOfVisit;
}

function getActivitiesAvgExecutionTime() {
  let activitiesAvgExecutionTime = new Map();
  activitiesAvgExecutionTime.set("assignApprover", 0.7);
  activitiesAvgExecutionTime.set("approveInvoice", 4);
  activitiesAvgExecutionTime.set("prepareBankTransfer", 5);
  activitiesAvgExecutionTime.set("reviewInvoice", 1);
  return activitiesAvgExecutionTime;
}

function getEdgesAvgWaitingTime() {
  let edgesAvgWaitingTime = new Map();
  edgesAvgWaitingTime.set("SequenceFlow_1", 0.3);
  edgesAvgWaitingTime.set("sequenceFlow_178", 1.5);
  edgesAvgWaitingTime.set("invoiceApproved", 6);
  return edgesAvgWaitingTime;
}

function defineActivitiesThroughputTimeKPI() {
  const activitiesThroughputTimeKPI = new Map();
  activitiesThroughputTimeKPI.set("assignApprover", [1.0, 2.0]);
  activitiesThroughputTimeKPI.set("approveInvoice", [1.0, 3.0]);
  activitiesThroughputTimeKPI.set("prepareBankTransfer", [2.0, 4.0]);
  activitiesThroughputTimeKPI.set("reviewInvoice", [2.0, 5]);
  //to be completed
  return activitiesThroughputTimeKPI;
}

function defineEdgesWaitingTimeKPI() {
  const edgesWaitingTimeKPI = new Map();
  edgesWaitingTimeKPI.set("SequenceFlow_1", [0.5, 1.0]);
  edgesWaitingTimeKPI.set("sequenceFlow_178", [1.0, 2.0]);
  edgesWaitingTimeKPI.set("invoiceApproved", [2.0, 4.0]);
  //to be completed
  return edgesWaitingTimeKPI;
}

function getActivitiesMonitoringData() {
  let activitiesMonitoringData = new Map();
  activitiesMonitoringData.set("assignApprover", [700, 10, 0, 0]);
  activitiesMonitoringData.set("approveInvoice", [650, 30, 10, 0]);
  activitiesMonitoringData.set("reviewInvoice", [300, 30, 0, 70]);
  activitiesMonitoringData.set("prepareBankTransfer", [235, 0, 0, 0]);
  activitiesMonitoringData.set("archiveInvoice", [235, 0, 0, 0]);
  return activitiesMonitoringData;
}

function getEdgesWaitingInstances() {
  let edgesWaitingInstances = new Map();
  edgesWaitingInstances.set("sequenceFlow_178", 10);
  edgesWaitingInstances.set("invoiceApproved", 15);
  return edgesWaitingInstances;
}
