// components/ActivityPopup.js
'use client'

// components/ActivityPopup.js
import React, { useState } from 'react';

const ActivityPopup = ({
  activity,
  extraExercises,
  handleInputChange,
  addExercise,
  saveActivity,
  setShowPopup,
}) => {
  const [friedItems, setFriedItems] = useState(false);
  const [completedExercise, setCompletedExercise] = useState(false);
  const [ateSugar, setAteSugar] = useState(false);
  const [drank2LWater, setDrank2LWater] = useState(false);

  const handleCheckboxChange = (name, value) => {
    switch (name) {
      case 'friedItems':
        setFriedItems(value);
        break;
      case 'completedExercise':
        setCompletedExercise(value);
        break;
      case 'ateSugar':
        setAteSugar(value);
        break;
      case 'drank2LWater':
        setDrank2LWater(value);
        break;
      default:
        break;
    }
  };

  const handleSaveActivity = () => {
    const newActivity = {
      activity: {
        exercise: activity.exercise,
        duration: activity.duration,
      },
      extraExercises: extraExercises,
      friedItems: friedItems,
      completedExercise: completedExercise,
      ateSugar: ateSugar,
      drank2LWater: drank2LWater,
    };
    saveActivity(newActivity);
    setShowPopup(false);
  };

  return (
    <div className="bg-black bg-opacity-75 fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md text-black">
        <h2 className="text-xl font-bold mb-4">Add Activity</h2>
        {/* Input fields and checkboxes */}
        {/* ... */}
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSaveActivity}>
          Save
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4" onClick={() => setShowPopup(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ActivityPopup;

