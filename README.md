# bpmn-visualization 'getting started' tutorial

This is a template bootstrap. You can clone it and use it to follow the [getting started tutorial](https://medium.com/@process-analytics/getting-started-with-bpmn-visualization-a54fbafae2df).

The tutorial uses the [bpmn-visualization](https://github.com/process-analytics/bpmn-visualization-js) library to visualize runtime monitoring data ⏲️.

The whole solution is available in the [solution](https://github.com/process-analytics/bpmn-visualization-tutorial-getting-started/tree/solution) branch.

The code of this tutorial is released under the [Apache 2.0](LICENSE) license.

## The deployed solution

To see the deployed solution: https://process-analytics.github.io/bpmn-visualization-tutorial-getting-started/


## How to Run

**NOTE**: this tutorial was tested with Node 16 and npm 8.16.0

Run
```bash
npm install
npm start
```

Open the URL mentioned in the console

Save your code systematically to see the changes in your browser.

## Tutorial Content
The tutorial explains how to visualize the following information using *bpmn-visualization*:
- Running instances and their number ⚙️
- State of instances: whether they predefined KPIs ⏱️ are violated:
    - Two KPIs are considered: completion and waiting time of activities.
    - Two levels of violation are defined: risky 🟠 and critical 🔴.

## Visualization

### Running instances and their number ⚙️
- **animated activity stroke**: to indicate that there are running instances of the corresponding activity


- **Overlays on activities**: to indicate the number of instances

### State and KPI violation ⏱️
**Colors meaning**:
- 🟢 Green: no violation
- 🟠 Orange: violation with a risky level
- 🔴 Red: Violation with a critical level

#### Activities:
- **Overlay filling color**: 
    - 🟢 Green: number of instances running on time according to a predefined completion time KPI
    - 🟠 Orange: number of instances running late (with a risky level) according to a predefined completion time KPI
    - 🔴 Red: number of instances running late (with critical level) according to a predefined completion time KPI

- **Speed of the animated stroke:**  The following is applied in order:
    - slow: if there exist instances running late with a critical level.
    - medium: if there exist instances running late with a risky level
    - fast: in case all instances are running on time

- **Shadow:** The following is applied in order:
    - 🔴 Red: if there exist instances running late with a critical level.
    - 🟠 Orange: if there exist instances running late with a risky level
    - 🟢 Green: in case all instances are running on time

#### Edges:
- **Animation**: indicates that there are instances waiting for the next activity to be executed

- **Overlay**: indicates the number of instances waiting for the next activity to be executed

- **Overlay filling color**: The following is applied in order:
    - 🔴 Red: if there exist instances waiting late with a critical level
    - 🟠 Orange: if there exist instances waiting late with a risky level


