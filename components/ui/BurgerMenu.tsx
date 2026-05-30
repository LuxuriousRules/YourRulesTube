"use client"

import Link from "next/link";
import {useState,useEffect,useRef} from "react";
import { useRouter } from "next/navigation";
import style from "./BurgerMenu.module.scss"
import Image from "next/image";

function BurgerMenu () {

    const[open,setOpen]=useState<boolean>(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect (() => {
        const handleClikcOutside = (event:MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) ) {
                setOpen(false);
            }
        }
            if (open) {
                document.addEventListener("mousedown", handleClikcOutside);
            }

             else{
                document.removeEventListener("mousedown",handleClikcOutside);
             }

             return () => {
                document.removeEventListener("mousedown",handleClikcOutside)
             }

    },[open])

    return (
        <div className={style.BurgerMenu} ref={menuRef}>
            <button onClick={() => setOpen(!open)} className={style.icon}>
             <img
             src="/Icon1.png"
             alt="search"
             className={style.icon}
             />
            </button>
            
            
                                <nav className={`${style.nav} ${open ? style.open : ""}`}>
                                 <form
                                     onSubmit={(e) => {
                                         e.preventDefault();
                                         router.push(`/?q=${encodeURIComponent(query)}`);
                                         setOpen(false);
                                     }}
                                 >
                                     <input
                                         className={style.inputMob}
                                         type="text"
                                         value={query}
                                         onChange={(e) => setQuery(e.target.value)}
                                         placeholder="Поиск видео на YourTubeRules"
                                     />
                                 </form>
                                </nav>
            
        </div>
    );
}

export default BurgerMenu;