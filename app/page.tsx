import { Suspense } from "react";
import SearchYouTube from "../components/main/SearchYoutube";

function MainPage() {
  return (
    <section>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchYouTube />
      </Suspense>
    </section>
  );
}

export default MainPage;