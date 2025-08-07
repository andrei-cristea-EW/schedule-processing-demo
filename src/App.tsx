import ScheduleInterface from './components/ScheduleInterface';

function App() {
  return (
    <div className="app">
      <div className="main-card">
        <ScheduleInterface />
        <div className="everworker-logo">
          <img src="/logo_everworker.svg" alt="Powered by EverWorker" />
        </div>
      </div>
    </div>
  );
}

export default App;