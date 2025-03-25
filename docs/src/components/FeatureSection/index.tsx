import React, { type ReactNode } from 'react'
import Feature, { type FeatureItem } from '../Feature'
import styles from './styles.module.css'

export interface FeatureSectionProps {
	features: FeatureItem[];
	className?: string;
}

export default function FeatureSection({ features, className }: FeatureSectionProps): ReactNode {
	return (
		<section className={`${styles.featureSection} ${className || ''}`}>
			<div className="container">
				<div className="row">
					{features.map((featureProps, idx) => (
						<Feature {...featureProps} />
					))}
				</div>
			</div>
		</section>
	)
}
