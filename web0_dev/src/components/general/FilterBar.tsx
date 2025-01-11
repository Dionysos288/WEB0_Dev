import SVG from './SVG';
import styles from './FilterBar.module.scss';
import { PlusXL, Filter, Sort, ArrowDown, Search } from '@/svgs';
interface FilterBarProps {
	title?: string;
	ExtraFilters?: string[];
}
const FilterBar: React.FC<FilterBarProps> = ({ title, ExtraFilters }) => {
	return (
		<>
			{title && <h4 className={styles.title}>{title}</h4>}
			<div className={styles.filterContainer}>
				<div className={styles.leftSide}>
					<SVG>
						<PlusXL style={{ fill: '#484643' }} />
					</SVG>
					{ExtraFilters &&
						ExtraFilters.map((filter, index) => (
							<button key={index} className={styles.buttons}>
								{filter}
								<ArrowDown
									style={{
										fill: '#484643',
										opacity: '0.8',
										transform: 'translateY(1.5px)',
									}}
								/>
							</button>
						))}
					<SVG>
						<Filter style={{ fill: '#484643' }} />
					</SVG>
					<SVG>
						<Sort style={{ fill: '#484643' }} />
					</SVG>
				</div>
				<SVG>
					<Search style={{ fill: '#484643' }} />
				</SVG>
			</div>
		</>
	);
};

export default FilterBar;
