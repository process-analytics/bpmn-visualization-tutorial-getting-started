# bpmn-visualization 'getting started' tutorial

A getting started demo that uses bpmn-visualization library to visualize runtime monitoring data ⏲️.

## Content
The following information is visualized:
- Running instances and their number ⚙️
- State of instances: whether or not they predefined KPIs ⏱️ are violated:
    - Two KPIs are considered: completion and waiting time of activities.
    - Two levels of violation are defined: risky 🟠 and criticial 🔴.

## Visualization

### Running instances and their number ⚙️
- **animated activity stroke**: to indicate that there are running instances of the corresponding activitiy

- **Overlays on activities**: to indicate the number of instances

### State and KPI violation ⏱️
**Colors meaning**:
- 🟢 Green: no violation
- 🟠 Orange: violation with a risky level
- 🔴 Red: Violation with a critical level

#### Activities:
- **Overlay filling color**: 
    - Green: number of instances running on time according to a predefined completion time KPI
    - Orange: number of instances running late (with a risky level) according to a predefined completion time KPI
    - Red: number of instances running late (with critical level) according to a predefined completion time KPI

- **Speed of the animated stroke:**  The following is applied in order:
    - slow: if there exist instances running late with a critical level.
    - medium: if there exist instances running late with a risky level
    - fast: in case all instances are running on time

- **Shadow:** The following is applied in order:
    - Red: if there exist instances running late with a critical level.
    - Orange: if there exist instances running late with a risky level
    - Green: in case all instances are running on time

#### Edges:
- **Animation**: indicates that there are instances waiting for the next activity to be executed

- **Overlay**: indicates the number of instances waiting for the next activity to be executed

- **Overlay filling color**: The following is applied in order:
    - Red: if there exist instances waiting late with a critical level
    - Orange: if there exist instances waiting late with a risky level

## How to Run

Run
```bash
npm install
npm start
```

Open the URL mentioned in the console
