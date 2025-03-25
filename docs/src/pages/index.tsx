import React, { type ReactNode } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'

import Hero from '../components/Hero'
import FeatureSection from '../components/FeatureSection'
import CodeExample from '../components/CodeExample'
import PlatformDisplay from '../components/PlatformDisplay'
import CTA from '../components/CTA'

// Import SVG icons directly
import WindowsIcon from '@site/static/img/windows-icon.svg'
import LinuxIcon from '@site/static/img/linux-icon.svg'
import MacOSIcon from '@site/static/img/macos-icon.svg'
import CpuIcon from '@site/static/img/cpu-icon.svg'
import MemoryIcon from '@site/static/img/memory-icon.svg'
import ThreadIcon from '@site/static/img/thread-icon.svg'

export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext()

	return (
		<Layout title={siteConfig.title} description="A powerful Node.js library for monitoring system resources including CPU, memory, and thread states across Windows, Linux, and macOS">

			{/* Hero Section */}
			<Hero
				title="System Resource Monitor"
				tagline="A set of Node.js/Bun/Deno utility functions for monitoring system resources"
				primaryButton={{
					text: 'Get Started',
					link: '/docs/category/getting-started',
				}}
				secondaryButton={{
					text: 'API Reference',
					link: '/docs/category/api-reference',
				}}
				stats={[
					{
						value: '64%',
						label: 'CPU Usage',
						percentage: 64,
					},
					{
						value: '8.2GB',
						label: 'Memory Used',
						percentage: 25.6,
					},
					{
						value: '12',
						label: 'Active Threads',
						percentage: 37.5,
					},
				]}
			/>

			{/* Features Section */}
			<FeatureSection
				features={[
					{
						title: 'CPU Monitoring',
						description: 'Track overall and per-core CPU usage with high precision across all major operating systems.',
						icon: <CpuIcon width="96" height="96" style={{ color: 'var(--ifm-color-primary)' }} />,
					},
					{
						title: 'Memory Analysis',
						description: 'Monitor memory usage, detect leaks, and analyze memory consumption patterns in real-time.',
						icon: <MemoryIcon width="96" height="96" style={{ color: 'var(--ifm-color-primary)' }} />,
					},
					{
						title: 'Thread Management',
						description: 'Optimize application performance with detailed thread state tracking and load distribution analysis.',
						icon: <ThreadIcon width="96" height="96" style={{ color: 'var(--ifm-color-primary)' }} />,
					},
				]}
			/>

			{/* Code Example Section */}
			<CodeExample
				title="Simple to Use"
				description="Monitor your system resources with just a few lines of code"
				code={`import {
  getPhysicalCoreCount, getLogicalCoreCount,
  startProfilingCpu, getCpuUsage, getMaxThread, isAnyThreadAbove,
  getMemoryUsage, delay,
} from 'system-resource-monitor'

async function monitorSystem() {
  await startProfilingCpu()
  
  // Get system information
  const coreCount = getPhysicalCoreCount()
  const threadCount = getLogicalCoreCount()

  while (true) {
    console.clear()
    console.log(\`Cores: \${coreCount}, Threads: \${threadCount}\`)
    console.log(\`CPU Usage: \${getCpuUsage(true, 1)}%\`)
    console.log(\`Memory Usage: \${getMemoryUsage(true, 1)}%\`)
    console.log(\`Maximum Thread Usage: \${getMaxThread(true)}%\`)

    // Check for high CPU thread usage
    if (isAnyThreadAbove(80)) {
      console.warn('Warning: High thread usage detected!')
    }

    await delay(1000) // Update every second
  }
}

monitorSystem()`}
				language="typescript"
				featuresTitle="Powerful API, Simple Interface"
				features={[
					'Real-time CPU and memory monitoring',
					'Per-thread usage tracking',
					'Physical and logical core detection',
					'Cross-platform support (Windows, Linux, macOS)',
					'High-performance monitoring with minimal overhead',
				]}
				buttonText="View Documentation"
				buttonLink="/docs/getting-started/basic-usage"
			/>

			{/* Platform Display Section */}
			<PlatformDisplay
				title="Cross-Platform Support"
				description="Works seamlessly across all major operating systems"
				platforms={[
					{
						name: 'Windows',
						icon: <WindowsIcon width="48" height="48" style={{ color: 'var(--ifm-color-primary)' }} />,
					},
					{
						name: 'Linux',
						icon: <LinuxIcon width="48" height="48" style={{ color: 'var(--ifm-color-primary)' }} />,
					},
					{
						name: 'macOS',
						icon: <MacOSIcon width="48" height="48" style={{ color: 'var(--ifm-color-primary)' }} />,
					},
				]}
			/>

			{/* Call to Action Section */}
			<CTA
				title="Ready to Monitor Your System?"
				description="Start optimizing your application performance today"
				buttons={[
					{
						text: 'Installation Guide',
						link: '/docs/getting-started/installation',
						isPrimary: true,
					},
					{
						text: 'GitHub Repository',
						link: 'https://github.com/pfaciana/system-resource-monitor',
						isPrimary: false,
					},
				]}
			/>

		</Layout>
	)
}
