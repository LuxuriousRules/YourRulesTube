import {Metadata} from "next";
import Link from "next/link";
import { Raleway } from "next/font/google";
import BurgerMenu from "../components/ui/BurgerMenu";

import SearchBar from "../components/ui/SearchBar";
import style from "./layout.module.scss"
import  "./global.css";



const raleway = Raleway({
  subsets: ["latin", "cyrillic"], 
  weight: ["400", "700"],         
});


export const metadata: Metadata = {
    title:"YourTubeRules",
    description: "best video platphorm",
    viewport: "width=device-width, initial-scale=1"
};

function RootLayout ({children} : {children: React.ReactNode})  {

 return(
    <html lang="ru">
        <body className={`${raleway.className} ${style.body}`}>
        <header>
            <nav className={style.nav}>
                    <h1>YourTubeRules</h1>
                <div className={style.burger}>
                    <BurgerMenu/>
                </div>
                <div className={style.nav__links}>
                   <SearchBar/>   
                </div>    
             </nav>
        </header>
         <main>{children}</main>
         <footer></footer>
        </body>
    </html>
 );
}

export default RootLayout;