"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "./SearchBar.module.scss";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <form className={style.wrapp} onSubmit={handleSubmit}>
      <input
        className={style.input}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск на YourTubeRules"
      />
      <button className={style.btn} type="submit">Поиск</button>
    </form>
  );
}
