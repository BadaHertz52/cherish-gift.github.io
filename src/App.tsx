import { Route, Routes } from 'react-router-dom';
import First from './pages/First';
import Curation from './pages/Curation/index';
import Third from './pages/Third';
import Fourth from './pages/Fourth';
import Button from './pages/Button';
import Main from './pages/Main';
import ModalTest from './components/modals/ModalTest';
import './assets/main.scss';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/first" element={<First />} />
        <Route path="/curation" element={<Curation />} />
        <Route path="/third" element={<Third />} />
        <Route path="/fourth" element={<Fourth />} />
        {/* modal 테스트를 위해 route 추가 , 추후 삭제 예정*/}
        <Route path="modaltest" element={<ModalTest />} />
      </Routes>
    </div>
  );
}

export default App;
