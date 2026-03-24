import React from 'react';
import PwaUpdatePrompt from './components/PwaUpdatePrompt';
import Index from './pages/Index';

// Css
import './assets/css/style.css';
import './assets/vendor/swiper/swiper-bundle.min.css';

function App() {
  return (
    <div className="App">
      <Index />
      <PwaUpdatePrompt />
    </div>
  );
}

export default App;

