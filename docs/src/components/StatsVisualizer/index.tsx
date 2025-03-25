import React, { ReactNode } from 'react'
import styles from './styles.module.css'

export interface StatItemProps {
	value: string;
	label: string;
	percentage: number;
}

function StatItem({ value, label, percentage }: StatItemProps): ReactNode {
	return (
		<div className={styles.statCard}>
			<div className={styles.statValue}>{value}</div>
			<div className={styles.statLabel}>{label}</div>
			<div className={styles.progressBar}>
				<div className={styles.progressFill} style={{ width: `${percentage}%` }} />
			</div>
		</div>
	)
}

interface StatsVisualizerProps {
	stats: StatItemProps[];
	className?: string;
}

export default function StatsVisualizer({ stats, className }: StatsVisualizerProps): ReactNode {
	return (
		<div className={`${styles.statsVisual} ${className || ''}`}>
			{stats.map((stat, idx) => (
				<StatItem value={stat.value} label={stat.label} percentage={stat.percentage} />
			))}
		</div>
	)
}
