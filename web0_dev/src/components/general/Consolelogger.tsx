'use client';
import { useEffect } from 'react';

export default function ConsoleLogger() {
	useEffect(() => {
		console.log(`
                 U _____ u   ____    ___      
     __        __\\| ___"|/U | __")u / _"\\  u  
     \\"\\      /"/ |  _|"   \\|  _ \\/| / U |/   
     /\\ \\ /\\ / /\\ | |___    | |_) || \\// |,-. 
    U  \\ V  V /  U|_____|   |____/  \\___/(_/  
    .-,_\\ /\\ /_,-.<<   >>  _|| \\\\_   //       
     \\_)-'  '-(_/(__) (__)(__) (__) (__)      

    Crafted with ❤️ by WEB0 Studio
    Transforming brands with exceptional design and development
    `);
	}, []);
	return null;
}
