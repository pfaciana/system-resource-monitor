import React, { type ReactNode } from 'react'
import Link from '@docusaurus/Link'
import Heading from '@theme/Heading'
import CodeBlock from '@theme/CodeBlock'
import styles from './styles.module.css'

export interface CodeExampleProps {
	title: string;
	description: ReactNode;
	code: string;
	language: string;
	features: ReactNode[];
	buttonText: string;
	buttonLink: string;
	className?: string;
	featuresTitle?: string;
}

export default function CodeExample({ title, description, code, language, features, buttonText, buttonLink, className, featuresTitle }: CodeExampleProps): ReactNode {
	return (
		<section className={`${styles.codeExampleSection} ${className || ''}`}>
			<div className="container">
				<div className={styles.sectionHeader}>
					<Heading as="h2">{title}</Heading>
					<p>{description}</p>
				</div>
				<div className="row">
					<div className="col col--6">
						<div className={styles.codeSnippet}>
							<CodeBlock
								language={language}
								showLineNumbers
								title="Example Usage"
								children={code}
							/>
						</div>
					</div>
					<div className="col col--6">
						<div className={styles.codeDescription}>
							<Heading as="h3">{featuresTitle}</Heading>
							<ul className={styles.featureList}>
								{features.map((feature, idx) => (
									<li key={idx}>{feature}</li>
								))}
							</ul>
							<Link
								className="button button--outline button--primary"
								to={buttonLink}>
								{buttonText}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
