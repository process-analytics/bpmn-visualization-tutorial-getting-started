A geutting started demo that uses bpmn-visualization library to visualize runtime monitoring data.

The following visualization is used:

**Overlays on activities:**

- green: number of instances running on time according to a predefined completion time KPI
- orange: number of instances running late (with a risky level) according to a predefined completion time KPI
- red: number of instances running late (with critical level) according to a predefined completion time KPI

**Color of activities:**

- green: avg execution time of instances is “efficient” according to a predefined KPI (throuhput time)
- orange: avg execution time is “ineffcient with a risky level” according to a predefined KPI (throuhput time)
- red: avg execution time is “ineffcient with a criticial level” according to a predefined KPI (throuhput time)

**Activities with animated shadow:**
means that there are currently running instances.
The shadow color is as following:

- red if at least one instance is running critically late
- else orange if at least one instance is running risky late
- else green (meaning that it’s still on time)

**Activities stroke width:**
shows the frequency of visit according to a predefined frequency indicator of incoming instances per month

**end events**:

- green colored overlays: contain the number of instances completed efficiently according to a completion time KPI
- red colord overlays: contain the number of instances completed late according to a predefined completion KPI

**Overlays on edges**:

- contain the number of instances waiting on that edge
- color = red if at least one instance is running critically late
- else color = orange if at least one instance is running risky late
- else color = green

**Dahed running edges**
means that there are currently running instances.

**Color of edge**

- green: avg waiting time of instances is “efficient” according to a predefined waiting time KPI
- orange: avg waiting time is “ineffcient with a risky level” according to a predefined waiting time KPI
- red: avg waiting time is “ineffcient with a criticial level” according to a predefined waiting time KPI

**Edges width**
shows the frequency of visit according to a predefined frequency indicator of incoming instances per month
