import { useState, useEffect } from "react";
import dayjs from 'dayjs';

export const useYearPicker = () => {
    const [startYear, setStartYear] = useState(dayjs())
    const [endYear, setEndYear] = useState(dayjs().add(1, 'year'))
    const [error, setError] = useState('')

    // Changed from 50 to 30 years
    useEffect(() => {
        const yearDifference = endYear.diff(startYear, 'year')
        if(yearDifference > 30){ // Changed limit
            setError('Time span cannot exceed 30 years') // Updated error message
            setEndYear(startYear.add(30, 'year')) // Changed limit
        }else{
            setError('')
        }
    },[startYear, endYear])

    const handleStartYearChange = (newValue) => {
        if (!newValue) return

        setStartYear(newValue)
        if(endYear.diff(newValue, 'year') > 30){ // Changed limit
            setEndYear(newValue.add(30, 'year')) // Changed limit
        }
    }

    const handleEndYearChange = (newValue) => {
        if (!newValue) return;
        
        if (newValue.diff(startYear, 'year') > 30) { // Changed limit
          setEndYear(startYear.add(30, 'year')); // Changed limit
        } else {
          setEndYear(newValue);
        }
    }
    
    const handleReset = () => {
        setStartYear(dayjs())
        setEndYear(dayjs().add(1,'year'))
        setError('')
    }

    return {
        startYear,
        endYear,
        error,
        handleStartYearChange,
        handleEndYearChange,
        handleReset
    }
}

export default useYearPicker