---
sidebar_position: 2
---

# Installation

You can install System Resource Monitor using your preferred package manager. The library is written in TypeScript and provides full type definitions out of the box.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm">
  ```bash
  npm install system-resource-monitor
  ```
  </TabItem>
  <TabItem value="pnpm" label="pnpm" default>
  ```bash
  pnpm add system-resource-monitor
  ```
  </TabItem>
  <TabItem value="yarn" label="yarn">
  ```bash
  yarn add system-resource-monitor
  ```
  </TabItem>
</Tabs>

## Requirements

- Node.js 16.x or higher
- TypeScript 4.7+ (if using TypeScript)

:::note
The library is written in TypeScript with strict type checking enabled. Even if you're using JavaScript, you'll get great IDE support through the included type definitions.
:::

## Verifying Installation

You can verify the installation by checking core informat

```javascript
import { getLogicalCoreCount, getPhysicalCoreCount } from 'system-resource-monitor';

console.log(`Logical cores: ${getLogicalCoreCount()}`);
console.log(`Physical cores: ${getPhysicalCoreCount()}`);
```
