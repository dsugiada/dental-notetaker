import React, { useState, useEffect } from 'react';
import './DentalNotes.scss';
import { useSelector } from 'react-redux';
import useSocket from '../../core/hooks/useSocket';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RootState } from '../../core/store/store';
import useConfig from '../../core/hooks/useConfig';
import Select from 'react-select'; // Ensure this package is installed
import Modal from 'react-modal';

interface Question {
  _id: string;
  text: string;
  options: { text: string }[];
  single: boolean;
}

// interface Patient {
//   _id: string;
//   name: string;
//   // Add more patient fields as needed
// }

interface OptionType {
  value: string;
  label: string;
}

Modal.setAppElement('#root'); // Assuming your app root element has an ID of 'root'

const DentalNotes: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getApiUrl } = useConfig();
  const apiUrl = getApiUrl();

  const theme = useSelector((state: RootState) => state.home.theme);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  const [patients, setPatients] = useState<any[]>([]); // Replace any with your Patient type
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Accessing userId from Redux store
  const userId = useSelector((state: RootState) => state.auth.user.id) //this is dynamically set at login, so can be pulled globally without issue

  //Form socket connection with useSocket hook
  const { socket, send } = useSocket(userId, selectedPatient ?? undefined, selectedPatient !== null);

  const patientOptions = [
    ...patients.map(patient => ({ value: patient._id, label: patient.name })),
    { value: 'new', label: 'Add new patient...' }, // New option to trigger the modal
  ];


  useEffect(() => {
    const fetchPatientSelections = async () => {
      if (!selectedPatient) return;
      
      try {
        const response = await axios.get(`${apiUrl}/examinations/getSelections`, {
          params: {
            clinicianId: userId,
            patientId: selectedPatient,
          },
        });
  
        const selections = response.data; // Assuming this returns an array of selections
        const updatedSelectedOptions = selections.reduce((acc: { [x: string]: any; }, selection: { questionId: string | number; selectedOptions: any; }) => {
          acc[selection.questionId] = selection.selectedOptions;
          return acc;
        }, {});
  
        setSelectedOptions(updatedSelectedOptions);
      } catch (error) {
        console.error('Failed to fetch patient selections:', error);
        toast.warn('Failed to fetch patient selections');
      }
    };
  
    fetchPatientSelections();
  }, [apiUrl, selectedPatient, userId]);


  // Fetch patients list
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${apiUrl}/clinician/${userId}/patients`);
        if (Array.isArray(response.data.result)) {
          setPatients(response.data.result);
        } else {
          // Handle the case where response.data is not an array
          console.error('Received data is not an array', response.data);
          setPatients([]); // Reset to empty array or handle as needed
        }
      } catch (error) {
        console.error('Failed to load patients', error);
        toast.warn('Failed to load patients');
      }
    };
    if (userId) {
      fetchPatients();
    }
  }, [apiUrl, userId]);

  useEffect(() => {
    const fetchQuestionsAndSelections = async () => {
      if (selectedPatient) {
        try {
          const questionsResponse = await axios.get(`${apiUrl}/questions/retrieve`);
          setQuestions(questionsResponse.data.result);
          // You might also want to fetch saved selections for the selected patient here
        } catch (error) {
          console.error('Failed to load questions', error);
          toast.warn('Failed to load questions');
        }
      }
    };

    fetchQuestionsAndSelections();
  }, [apiUrl, selectedPatient]);

  // Dropdown change handler
  const handlePatientChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      if (selectedOption.value === 'new') {
        // Open the modal to add a new patient
        setIsModalOpen(true);
      } else {
        setSelectedPatient(selectedOption.value);
        // Fetch patient-specific questions and selections
      }
    } else {
      // Handle the case when no option is selected (optional)
      setSelectedPatient(null);
    }
  };

  //Receive questions and seletions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/questions/retrieve`);
        setQuestions(response.data.result);
      } catch (error) {
        console.error('Failed to load questions', error);
        toast.warn('Failed to load questions');
      }
    };

    fetchQuestions();

    //Fetch selections from the backend 'selections' DB

  }, [apiUrl]);

  //Receive selection from backend
  useEffect(() => {
    const handleExaminationOptionSelected = (data: {
      userId: string;
      patientId: string;
      questionId: string | number;
      selected: any;
      option: string;
    }) => {
      console.log('Received data on private channel:', data);
      setSelectedOptions(prev => {
        const newSelections = { ...prev };
        const currentSelections = new Set(newSelections[data.questionId] || []);

        if (data.selected) {
          currentSelections.add(data.option);
        } else {
          currentSelections.delete(data.option);
        }

        newSelections[data.questionId] = Array.from(currentSelections);
        return newSelections;
      });
    };

    socket?.on('examinationOptionSelected', handleExaminationOptionSelected);

    return () => {
      socket?.off('examinationOptionSelected', handleExaminationOptionSelected);
    };
  }, [socket, userId]);

  //Send selection to backend
  const handleOptionSelect = (patientId: string, questionId: string, option: string, singleSelect: boolean) => {
    setSelectedOptions(prev => {
      const updated = { ...prev };
      const selections = singleSelect ? new Set<string>() : new Set<string>(updated[questionId] || []);

      if (selections.has(option)) {
        selections.delete(option);
      } else {
        selections.add(option);
      }

      updated[questionId] = Array.from(selections);
      const clinicianId = userId;

      //database update
      axios.post(`${apiUrl}/examinations/saveselections`, {
        clinicianId,
        patientId,
        questionId,
        selectedOptions: Array.from(selections),
      })
        .then(response => {
          console.log('Selection updated successfully:', response.data);
          // Optionally handle response
        })
        .catch(error => {
          console.error('Failed to update selection:', error);
          // Handle error
        });

      //Socket emit
      send('selectExaminationOption', {
        userId,
        patientId,
        questionId,
        option,
        selected: selections.has(option)
      });

      return updated;
    });
  };

  const handleNewPatientSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    // Get the form data
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const referenceNo = formData.get('referenceNo') as string;
    const newPatient = {
      name,
      referenceNo,
      userId
    }

    // ... any other fields ...

    try {
      // Here you would send a request to your API to create the new patient
      const response = await axios.post(`${apiUrl}/patient/add`, newPatient);


      toast.success('Patient added successfully!');

      // Optionally close the modal and update the patient list
      setIsModalOpen(false);
      setPatients([...patients, response.data]); // Assuming your API returns the created patient
    } catch (error) {
      console.error('Failed to add patient', error);
      toast.error('Failed to add patient');
    }
  };

  return (
    <div className={`home-container animate__animated animate__fadeIn animate__delay-1s ${theme}`}>
      <div className="content">
        {/* Content */}
        <div className="dental-notes">
          <Select
            options={patientOptions}
            onChange={handlePatientChange}
          />
          {selectedPatient && questions.map(question => (
            <div key={question._id} className="question">
              <div className="title">{question.text}</div>
              <div className="options">
                {question.options.map((option, index) => {
                  const isSelected = selectedOptions[question._id]?.includes(option.text);
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(selectedPatient, question._id, option.text, question.single)}
                      className={`option-button ${isSelected ? 'selected' : ''}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Add New Patient"
          >
            {/* Modal content for adding a new patient */}
            <h2>Add New Patient</h2>
            <form onSubmit={handleNewPatientSubmit}>
              <label htmlFor="patientName">Name:</label>
              <input type="text" id="patientName" name="name" required />
              <label htmlFor="patientReferenceNo">Reference #:</label>
              <input type="text" id="patientReferenceNo" name="referenceNo" required />
              {/* ... other fields as needed ... */}
              <button type="submit">Add Patient</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DentalNotes;

