import React, { type ReactNode } from 'react'
import styles from './styles.module.css'
import Heading from '@theme/Heading'

export interface PlatformItem {
	name: string;
	icon: ReactNode;
}

export interface PlatformDisplayProps {
	title: string;
	description: ReactNode;
	platforms: PlatformItem[];
	className?: string;
}

export default function PlatformDisplay({ title, description, platforms, className }: PlatformDisplayProps): ReactNode {
	return (
		<section className={`${styles.platformSection} ${className || ''}`}>
			<div className="container">
				<div className={styles.sectionHeader}>
					<Heading as="h2">{title}</Heading>
					<p>{description}</p>
				</div>
				<div className={styles.platformLogos}>
					{platforms.map((platform, idx) => (
						<div key={idx} className={styles.platformLogo}>
							<div className={styles.platformIcon}>
								{platform.icon}
							</div>
							<span className={styles.platformName}>{platform.name}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
