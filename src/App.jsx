import "./App.css";
import Section1 from "./sections/Section1";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div style={{backgroundColor:"white", height:"100vh"}}>
      <Section1/>
      <ToastContainer />
    </div>
  );
}

export default App;
