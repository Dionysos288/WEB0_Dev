import Link from 'next/link';
import styles from './Footer.module.scss';
const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className={styles.footer}>
			<p>©{year} WEB0</p>
			<Link href={'/'}>Contact Us</Link>
		</footer>
	);
};

export default Footer;
