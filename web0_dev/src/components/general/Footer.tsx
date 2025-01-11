import Link from 'next/link';
import styles from './Footer.module.scss';
const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className={styles.footer}>
			<h6>©{year} WEB0</h6>
			<Link href={'/'}>Contact Us</Link>
		</footer>
	);
};

export default Footer;
