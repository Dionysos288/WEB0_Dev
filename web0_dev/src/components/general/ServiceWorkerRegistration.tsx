'use client';

import { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
	useEffect(() => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			// First, unregister any existing service workers
			navigator.serviceWorker
				.getRegistrations()
				.then((registrations) => {
					registrations.forEach((registration) => {
						registration.unregister();
					});
				})
				.then(() => {
					// Then register the new service worker
					return navigator.serviceWorker.register('/react-py-sw.js', {
						scope: '/react-py-sw.js',
					});
				})
				.then((registration) => {
					console.log(
						'Service Worker registration successful with scope: ',
						registration.scope
					);
				})
				.catch((err) => {
					console.error('Service Worker registration failed: ', err);
				});
		}
	}, []);

	return null;
};

export default ServiceWorkerRegistration;
