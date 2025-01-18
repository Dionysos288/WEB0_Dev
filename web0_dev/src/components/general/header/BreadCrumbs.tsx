import React from 'react';
import styles from './BreadCrumbs.module.scss';

const BreadCrumbs = () => {
	const list = ['Dashboard', 'Users', 'User Profile'];
	return (
		<>
			{/* last item should be h1 */}
			{list.map((item, index) => (
				<span
					key={index}
					className={index < list.length - 1 ? styles.normal : styles.active}
				>
					{item}
					{index < list.length - 1 && (
						<span style={{ margin: '0px 0px 0px 4px' }}> / </span>
					)}
				</span>
			))}
		</>
	);
};

export default BreadCrumbs;
