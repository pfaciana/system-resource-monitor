"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6784],{707:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>u,frontMatter:()=>i,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"examples/thread-balancing","title":"Thread Load Balancing","description":"This guide demonstrates how to monitor and optimize thread usage across your system.","source":"@site/docs/examples/thread-balancing.md","sourceDirName":"examples","slug":"/examples/thread-balancing","permalink":"/system-resource-monitor/docs/examples/thread-balancing","draft":false,"unlisted":false,"editUrl":"https://github.com/pfaciana/system-resource-monitor/tree/master/docs/docs/examples/thread-balancing.md","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"sidebar_label":"Thread Balancing"},"sidebar":"tutorialSidebar","previous":{"title":"Monitoring Performance","permalink":"/system-resource-monitor/docs/examples/monitoring-performance"},"next":{"title":"Memory Alerts","permalink":"/system-resource-monitor/docs/examples/memory-alerts"}}');var t=o(5105),a=o(3331);const i={sidebar_position:2,sidebar_label:"Thread Balancing"},s="Thread Load Balancing",d={},c=[{value:"Load Distribution Monitoring",id:"load-distribution-monitoring",level:2}];function l(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"thread-load-balancing",children:"Thread Load Balancing"})}),"\n",(0,t.jsx)(n.p,{children:"This guide demonstrates how to monitor and optimize thread usage across your system."}),"\n",(0,t.jsx)(n.h2,{id:"load-distribution-monitoring",children:"Load Distribution Monitoring"}),"\n",(0,t.jsx)(n.p,{children:"This example shows how to monitor thread load distribution in real-time:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:"import {\n  startProfilingCpu,\n  stopProfilingCpu,\n  getThreadUsage,\n  isAnyThreadAbove,\n  areAllThreadsBelow,\n  delay\n} from 'system-resource-monitor';\n\nasync function monitorLoadDistribution() {\n  const HIGH_LOAD = 80;\n  const LOW_LOAD = 20;\n  \n  // Initialize CPU profiling\n  await startProfilingCpu();\n  \n  try {\n    while (true) {\n      const threadUsages = getThreadUsage();\n      \n      // Create a load distribution visualization\n      console.clear();\n      console.log('Thread Load Distribution:\\n');\n      \n      threadUsages.forEach((usage, index) => {\n        const usagePercent = usage * 100;\n        const bars = '='.repeat(Math.floor(usagePercent / 2));\n        const loadIndicator = usagePercent > HIGH_LOAD ? '!' : \n                            usagePercent < LOW_LOAD ? '-' : '|';\n        \n        console.log(\n          `Thread ${index.toString().padStart(2, ' ')}: ` +\n          `[${bars.padEnd(50, ' ')}] ${usagePercent.toFixed(1)}% ${loadIndicator}`\n        );\n      });\n      \n      // Check for load imbalances\n      if (isAnyThreadAbove(HIGH_LOAD)) {\n        console.log('\\n\u26a0\ufe0f Some threads are overloaded');\n      } else if (areAllThreadsBelow(LOW_LOAD)) {\n        console.log('\\n\u2139\ufe0f System is underutilized');\n      }\n      \n      await delay(1000);\n    }\n  } catch (error) {\n    console.error('Load distribution monitoring error:', error);\n  }\n  stopProfilingCpu();\n}\n\nmonitorLoadDistribution()\n"})})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},3331:(e,n,o)=>{o.d(n,{R:()=>i,x:()=>s});var r=o(8101);const t={},a=r.createContext(t);function i(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);