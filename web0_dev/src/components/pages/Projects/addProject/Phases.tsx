import SVG from '@/components/general/SVG';
import styles from './Phases.module.scss';
import Text from '@/svgs/Text';
import PlusStroke from '@/svgs/Plus-stroke';
import AddDate from '@/svgs/AddDate';
import Dismiss from '@/svgs/Dismiss';
import { useState } from 'react';
import SingleDatePicker from '@/components/general/ui/date/SingleDatePicker';
import { getDateFormat } from '@/utils/DateHooks';
import Phase from '@/svgs/Phase';
import ClickOutsideWrapper from '@/components/general/CllickOutsideWrapper';

const Phases = ({
	phases,
	setPhases,
	isPhaseOpen,
	setIsPhaseOpen,
}: {
	phases: [string, Date][] | undefined;
	setPhases: React.Dispatch<React.SetStateAction<[string, Date][] | undefined>>;
	isPhaseOpen: boolean;
	setIsPhaseOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [phaseName, setPhaseName] = useState('');
	const [phaseDate, setPhaseDate] = useState<Date>();
	const [isDateOpen, setIsDateOpen] = useState<boolean | string | number>(
		false
	);
	const [isFirstPhaseOpen, setIsFirstPhaseOpen] = useState(true);

	const handleAddPhase = () => {
		if (!isFirstPhaseOpen) {
			setIsFirstPhaseOpen(true);
			return;
		}
		if (!phaseName || !phaseDate) return;
		const newPhase: [string, Date] = [phaseName, phaseDate];
		const updated = phases ? [...phases, newPhase] : [newPhase];
		setPhases(updated);
		setPhaseName('');
		setPhaseDate(undefined);
		setIsPhaseOpen(true);
	};

	const handlePhaseNameChange = (index: number, newName: string) => {
		if (!phases) return;
		const updated = [...phases];
		updated[index] = [newName, updated[index][1]];
		setPhases(updated);
	};

	const handlePhaseDateChange = (index: number, newDate: Date) => {
		if (!phases) return;
		const updated = [...phases];
		updated[index] = [updated[index][0], newDate];
		setPhases(updated);
	};

	const handleRemovePhase = (index: number) => {
		if (
			!phases ||
			(phases.length === 0 && index === -1) ||
			(!isFirstPhaseOpen && phases.length === 1)
		) {
			setPhases(undefined);
			setIsPhaseOpen(false);
			console.log('closed');
			return;
		}
		if (index === -1) {
			setPhaseName('');
			setPhaseDate(undefined);
			setIsFirstPhaseOpen(false);
			return;
		}
		if (!phases) return;
		const updated = phases.filter((_, i) => i !== index);
		setPhases(updated);
	};

	return (
		<>
			{isPhaseOpen && (
				<div className={styles.phases}>
					<div className={styles.topPart}>
						<h3>Phases</h3>
						{phases?.length ? <p>{phases.length}</p> : null}
					</div>

					{phases?.map((phase, index) => (
						<div key={index} className={styles.phase}>
							<div className={styles.leftSide}>
								<Phase fill={'var(--main-75)'} width="16" height="16" />
								<input
									type="text"
									value={phase[0]}
									onChange={(e) => handlePhaseNameChange(index, e.target.value)}
								/>
							</div>
							<div className={styles.rightSide}>
								<SVG
									onClick={() =>
										setIsDateOpen(isDateOpen === index ? false : index)
									}
								>
									{phase[1] ? (
										<p>{getDateFormat(String(phase[1]))}</p>
									) : (
										<AddDate fill={'var(--main-75)'} width="15" height="15" />
									)}
									{isDateOpen === index && (
										<ClickOutsideWrapper
											onClose={() => setIsDateOpen(!isDateOpen)}
										>
											<SingleDatePicker
												date={phase[1]}
												setDate={(d) => handlePhaseDateChange(index, d)}
												setIsDateOpen={setIsDateOpen}
											/>
										</ClickOutsideWrapper>
									)}
								</SVG>
								<SVG onClick={() => handleRemovePhase(index)}>
									<Dismiss fill={'var(--main-75)'} width="15" height="15" />
								</SVG>
							</div>
						</div>
					))}
					{isFirstPhaseOpen && (
						<div className={styles.phase}>
							<div className={styles.leftSide}>
								<Phase fill={'var(--main-45)'} width="16" height="16" />
								<input
									type="text"
									placeholder="Phase Name"
									value={phaseName}
									onChange={(e) => setPhaseName(e.target.value)}
								/>
							</div>
							<div className={styles.rightSide}>
								<SVG
									onClick={() =>
										setIsDateOpen(isDateOpen === 'new' ? false : 'new')
									}
								>
									{phaseDate ? (
										<p>{getDateFormat(String(phaseDate))}</p>
									) : (
										<AddDate fill={'var(--main-75)'} width="15" height="15" />
									)}
									{isDateOpen === 'new' && (
										<ClickOutsideWrapper
											onClose={() => setIsDateOpen(!isDateOpen)}
										>
											<SingleDatePicker
												date={phaseDate}
												setDate={setPhaseDate}
												setIsDateOpen={setIsDateOpen}
											/>
										</ClickOutsideWrapper>
									)}
								</SVG>
								<SVG onClick={() => handleRemovePhase(-1)}>
									<Dismiss fill={'var(--main-75)'} width="15" height="15" />
								</SVG>
							</div>
						</div>
					)}
					<div className={styles.underSide}>
						<SVG onClick={handleAddPhase}>
							<PlusStroke fill={'var(--main)'} width="12" height="12" />
							<span>Add Phase</span>
						</SVG>
					</div>
				</div>
			)}
		</>
	);
};

export default Phases;
