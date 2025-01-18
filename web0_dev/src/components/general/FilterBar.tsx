import SVG from './SVG';
import styles from './FilterBar.module.scss';
import { PlusXL, Filter, Sort, ArrowDown, Search, Views } from '@/svgs';
interface FilterBarProps {
	title?: string;
	views?: boolean;
	search?: boolean;
	ExtraFilters?: string[];
}
const FilterBar: React.FC<FilterBarProps> = ({
	title,
	views = false,
	search = true,
	ExtraFilters,
}) => {
	return (
		<>
			{title && <h2 className={styles.title}>{title}</h2>}
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
					{views && (
						<SVG>
							<Views style={{ fill: '#484643' }} />
						</SVG>
					)}
				</div>
				{search && (
					<SVG>
						<Search style={{ fill: '#484643' }} />
					</SVG>
				)}
			</div>
		</>
	);
};

export default FilterBar;
