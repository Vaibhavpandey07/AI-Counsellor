import { Universities } from "../models/universities.model.js";

const getUnversityRequirementData = (universityCode , countryCode)=>{
    const dataFetched =   fetch(`https://api.worqnow.ai/education/${countryCode}/entry-requirements?university_code=${universityCode}`)
    .then(response => {
        if (!response.ok) {
            console.log('Unable to fetch Data');
        }
        return response.json();
    })
    .then(async(data) => {

        return data.requirements
    })
    .catch(error => {
        // console.error("Fetch error:", error);
    });

    return dataFetched;
}


const getUniversitiesData = (country,countryCode)=>{
    fetch(`https://api.worqnow.ai/education/${countryCode}/universities`)
    .then(response => {
        if (!response.ok) {
            console.log('Unable to fetch Data');
        }
        return response.json();
    })
    .then(async(data) => {
        const dataToSave = await Promise.all( data.data.map(async(element) => {

            const requirements = await getUnversityRequirementData(element.code,countryCode);
            
            const dataChanged = {
                code : element.code ,
                universityName  : element.name ,
                city : element.city ,
                country  : country ,
                countryCode :countryCode,
                website : element.website ,
            
                Description : element.notes ,
                courses : element.courses,
                scholarships : element.scholarships,
                entry_paths : element.entry_paths,
                numberOfStudents : 0 ,
                internationStudentsPercent : 0,
                isInTop200 : false,
                feeBand : element.international_fee_band ,
                requirements : requirements,
            }
            return dataChanged;
        }))

        await Universities.insertMany(dataToSave, { ordered: false });

    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

}


export {getUniversitiesData};







