import { BpmnVisualization, FitType } from 'bpmn-visualization';

// the '?raw' parameter tells Vite to store the diagram content in a string.
// for more details, see https://vitejs.dev/guide/assets.html#importing-asset-as-string
// for other load methods, see https://github.com/process-analytics/bpmn-visualization-examples
import diagram from './diagram.bpmn?raw';
import './styles.css';

// 'bpmn-visualization' API documentation: https://process-analytics.github.io/bpmn-visualization-js/api/index.html
const bpmnVisualization = new BpmnVisualization({
  container: 'bpmn-container',
  navigation: { enabled: true },
});

const footer = document.querySelector('footer');
const version = bpmnVisualization.getVersion();
footer.innerText = `bpmn-visualization@${version.lib}`;

// load and filter a pool
bpmnVisualization.load(diagram, {
  fit: { type: FitType.Center },
  modelFilter: {
    pools: [
      {
        // name of the Participant related to the Pool to display
        name: 'Process Engine - Invoice Receipt',
      },
    ],
  },
});

// retrieve data of the live instances
const activitiesRunningInstances = getActivitiesRunningInstances();
const edgesWaitingInstances = getEdgesWaitingInstances();

// add Overlays on running activity instances
activitiesRunningInstances.forEach((value, activityId) => {
  // running on time
  if (value.onTime) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-center',
      label: `${value.onTime}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: 'green', opacity: 50 },
        stroke: { color: 'green', width: 2 },
      },
    });
  }
  // running late with risky level
  if (value.risky) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-left',
      label: `${value.risky}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: '#FF8C00', opacity: 50 },
        stroke: { color: '#FF8C00', width: 2 },
      },
    });
  }
  // running late with critical level
  if (value.critical) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-right',
      label: `${value.critical}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: 'red', opacity: 50 },
        stroke: { color: 'red', width: 2 },
      },
    });
  }
});

// add CSS classes to running activity instances
activitiesRunningInstances.forEach((value, activityId) => {
  if (value.critical) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-critical');
  } else if (value.risky) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-risky');
  } else if (value.onTime) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-on-time');
  }
});

// add Overlays on waiting edge instances
edgesWaitingInstances.forEach((value, edgeId) => {
  bpmnVisualization.bpmnElementsRegistry.addOverlays(edgeId, {
    position: 'middle',
    label: `${value}`,
    style: {
      font: { color: 'white', size: 16 },
      fill: { color: 'red', opacity: 50 },
      stroke: { color: 'red', width: 2 },
    },
  });
});

// add CSS classes to waiting edge instances
edgesWaitingInstances.forEach((value, edgeId) => {
  bpmnVisualization.bpmnElementsRegistry.addCssClasses(edgeId, 'path-waiting');
});

/**
 * @returns {Map<string, Object>} key: BPMN element id / value: running instances
 */
function getActivitiesRunningInstances() {
  return new Map([
    ['assignApprover', { onTime: 5, risky: 0, critical: 0 }],
    ['approveInvoice', { onTime: 2, risky: 3, critical: 0 }],
    ['reviewInvoice', { onTime: 4, risky: 1, critical: 2 }],
    ['prepareBankTransfer', { onTime: 0, risky: 0, critical: 0 }],
    ['archiveInvoice', { onTime: 0, risky: 0, critical: 0 }],
  ]);
}

/**
 * @returns {Map<string, number>} key: BPMN element id / value: number waiting instances
 */
function getEdgesWaitingInstances() {
  return new Map([['invoiceApproved', 2]]);
}
