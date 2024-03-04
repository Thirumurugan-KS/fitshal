'use client'
import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [activity, setActivity] = useState({});
  const [selectedLogIndex, setSelectedLogIndex] = useState(null);
  const [extraExercises, setExtraExercises] = useState([]);
  const [friedItems, setFriedItems] = useState(false);
  const [completedExercise, setCompletedExercise] = useState(false);
  const [ateSugar, setAteSugar] = useState(false);
  const [drank2LWater, setDrank2LWater] = useState(false);
  const [deleteLogs, setDeleteLogs] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
  const [weight, setWeight] = useState('');
  const [totalSteps, setTotalSteps] = useState(0); 
  
  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('fitness_logs'));
    if (storedLogs) {
      setLogs(storedLogs);
    }
  }, []);
  
  useEffect(() => {
    if (logs.length > 0 || deleteLogs) {
      localStorage.setItem('fitness_logs', JSON.stringify(logs));
      setDeleteLogs(false);
    }
  }, [logs, deleteLogs]);

  useEffect(() => {
    const previousLog = logs.find(log => log.date === selectedDate);
    if (previousLog && previousLog.weight) {
      setWeight(previousLog.weight);
    } else {
      setWeight('');
    }
  }, [selectedDate, logs]);

  const saveLogAsImage = (date) => {
    const node = document.getElementById(`log-container-${date}`);
    if (!node) {
        console.error(`Log container not found for date ${date}`);
        return;
    }

    toPng(node)
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `${date}_fitness_log.png`;
            link.href = dataUrl;
            link.click();
        })
        .catch((error) => {
            console.error('Error saving image: ', error);
        });
  };

  const addLog = (date) => {
    if (hasLogForDate(date)) {
      const logIndex = logs.findIndex(log => log.date === date);
      editLog(logIndex);
    } else {
      setShowPopup(true);
      setSelectedDate(date);
    }
  };

  const hasLogForDate = (date) => {
    return logs.some(log => log.date === date);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedExercises = [...extraExercises];
      updatedExercises[index][name] = value;
      setExtraExercises(updatedExercises);
    } else {
      setActivity({ ...activity, [name]: value });
    }
  };

  const addExercise = () => {
    setExtraExercises([...extraExercises, { exercise: '', duration: '' }]);
  };

  const saveActivity = () => {
    if (selectedLogIndex !== null) {
      const updatedLogs = [...logs];
      updatedLogs[selectedLogIndex] = {
        ...updatedLogs[selectedLogIndex],
        exercise: activity.exercise || 'N/A',
        duration: activity.duration || 'N/A',
        extraExercises: extraExercises,
        friedItems: friedItems,
        completedExercise: completedExercise,
        ateSugar: ateSugar,
        drank2LWater: drank2LWater,
        weight: weight || null,
        totalSteps: totalSteps
      };
      setLogs(updatedLogs);
      setSelectedLogIndex(null);
    } else {
      const newLog = {
        date: selectedDate,
        exercise: activity.exercise || 'N/A',
        duration: activity.duration || 'N/A',
        extraExercises: extraExercises,
        friedItems: friedItems,
        completedExercise: completedExercise,
        ateSugar: ateSugar,
        drank2LWater: drank2LWater,
        weight: weight || null,
        totalSteps: totalSteps
      };
      setLogs([...logs, newLog]);
    }
    setShowPopup(false);
    setActivity({});
    setExtraExercises([]);
    setFriedItems(false);
    setCompletedExercise(false);
    setAteSugar(false);
    setDrank2LWater(false);
    setTotalSteps(0);
  };

  const deleteLog = (index) => {
    const updatedLogs = [...logs];
    updatedLogs.splice(index, 1);
    setDeleteLogs(true);
    setLogs(updatedLogs);
  };

  const handleStepChanges = (e) => {
    const steps = parseInt(e.target.value);
    setTotalSteps(steps);
  };

  const editLog = (index) => {
    setShowPopup(true);
    setSelectedLogIndex(index);
    setActivity({
      exercise: logs[index].exercise,
      duration: logs[index].duration,
    });
    if (logs[index].extraExercises) {
      setExtraExercises(logs[index].extraExercises);
    } else {
      setExtraExercises([]);
    }
    setFriedItems(logs[index].friedItems || false);
    setCompletedExercise(logs[index].completedExercise || false);
    setAteSugar(logs[index].ateSugar || false);
    setDrank2LWater(logs[index].drank2LWater || false);
    if (logs[index].weight) {
      setWeight(logs[index].weight);
    } else {
      setWeight('');
    }
    if (logs[index].totalSteps) {
      setTotalSteps(logs[index].totalSteps);
    } else {
      setTotalSteps(0);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Fitness Tracker</h1>
        <div id="log-container" className="bg-gray-900 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Daily Log</h2>
          <input type="date" value={selectedDate} onChange={handleDateChange} className="border rounded-md px-2 py-1 mb-4 text-black" />
          {hasLogForDate(selectedDate) ? (
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4" onClick={() => addLog(selectedDate)}>Edit Log</button>
          ) : (
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4" onClick={() => addLog(selectedDate)}>Add Log</button>
          )}
          {/* Rest of the UI remains unchanged... */}
          <ul>
          {logs.map((log, index) => (
  <li key={index} className="border-b py-4 bg-gray-900 m-3 p-3" id={`log-container-${log.date}`}>
    <div className="flex items-center justify-between flex-col-reverse lg:flex-row">
      <div className="text-gray-400">{log.date}</div>
      <div className="flex items-center space-x-4">
        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => editLog(index)}>Edit</button>
        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteLog(index)}>Delete</button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" onClick={() => saveLogAsImage(log.date)}>Image</button>

      </div>
    </div>
    <div className="mt-4 ml-8">
      <div className="flex items-center">
        <span className="font-semibold mr-2">Weight:</span>
        <span>{log.weight || 'N/A'}</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="font-semibold mr-2">Steps:</span>
        <span>{log.totalSteps || 'N/A'}</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="font-semibold mr-2">Exercise:</span>
        <span>{log.exercise || 'N/A'}</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="font-semibold mr-2">Duration:</span>
        <span>{log.duration || 'N/A'}</span>
      </div>
      {log.extraExercises && log.extraExercises.map((extra, i) => (
        <div key={i} className="flex items-center mt-2">
          <span className="font-semibold mr-2">Extra Exercise:</span>
          <span>{extra.exercise || 'N/A'}</span>
          <span className="ml-auto">{extra.duration || 'N/A'}</span>
        </div>
      ))}
    </div>
    <div className="mt-4 ml-8">
      <div className="flex items-center">
        <span className="font-semibold mr-2">Fried Items:</span>
        <span>{log.friedItems ? 'Yes' : 'No'}</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="font-semibold mr-2">Completed Exercise:</span>
        <span>{log.completedExercise ? 'Yes' : 'No'}</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="font-semibold mr-2">Ate Sugar:</span>
        <span>{log.ateSugar ? 'Yes' : 'No'}</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="font-semibold mr-2">Drank 2L Water:</span>
        <span>{log.drank2LWater ? 'Yes' : 'No'}</span>
      </div>
    </div>
  </li>
))}

          </ul>
        </div>
      </div>
      {/* Popup and other components remain unchanged... */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white p-6 rounded-lg shadow-md text-black">
          <h2 className="text-xl font-bold mb-4">{selectedLogIndex !== null ? 'Edit Activity' : 'Add Activity'}</h2>
          <label className="block mb-2">
            Weight:
            <input type="number" name="weight" value={weight} className="border rounded-md px-2 py-1 w-full mb-2" onChange={handleWeightChange} />
          </label>
            <label className="block mb-2">
              Exercise:
              <input type="text" name="exercise" value={activity.exercise || ''} className="border rounded-md px-2 py-1 w-full mb-2" onChange={(e) => handleInputChange(e)} />
            </label>
            <label className="block mb-2">
              Duration:
              <input type="text" name="duration" value={activity.duration || ''} className="border rounded-md px-2 py-1 w-full mb-4" onChange={(e) => handleInputChange(e)} />
            </label>
            <label className="block mb-2">
            Steps :
            <input type="number" name="weight" value={totalSteps} className="border rounded-md px-2 py-1 w-full mb-2" onChange={handleStepChanges} />
          </label>
            <div className="mb-4">
              <input type="checkbox" id="friedItems" checked={friedItems} onChange={() => setFriedItems(!friedItems)} />
              <label htmlFor="friedItems" className="ml-2">Did you eat fried items?</label>
            </div>
            <div className="mb-4">
              <input type="checkbox" id="completedExercise" checked={completedExercise} onChange={() => setCompletedExercise(!completedExercise)} />
              <label htmlFor="completedExercise" className="ml-2">Did you complete the exercise?</label>
            </div>
            <div className="mb-4">
              <input type="checkbox" id="ateSugar" checked={ateSugar} onChange={() => setAteSugar(!ateSugar)} />
              <label htmlFor="ateSugar" className="ml-2">Did you eat sugar?</label>
            </div>
            <div className="mb-4">
              <input type="checkbox" id="drank2LWater" checked={drank2LWater} onChange={() => setDrank2LWater(!drank2LWater)} />
              <label htmlFor="drank2LWater" className="ml-2">Did you drink 2L water?</label>
            </div>
            {extraExercises.map((exercise, index) => (
              <div key={index} className="mb-4">
                <input type="text" name="exercise" value={exercise.exercise || ''} placeholder="Exercise" className="border rounded-md px-2 py-1 w-full mb-2" onChange={(e) => handleInputChange(e, index)} />
                <input type="text" name="duration" value={exercise.duration || ''} placeholder="Duration" className="border rounded-md px-2 py-1 w-full mb-2" onChange={(e) => handleInputChange(e, index)} />
              </div>
            ))}
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={addExercise}>Add Exercise</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4" onClick={saveActivity}>{selectedLogIndex !== null ? 'Save Changes' : 'Save'}</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
