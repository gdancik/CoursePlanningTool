import React, {useState, useEffect} from "react";
import { CardData, ContentCardSet } from "./ContentCardSet";


export const GradingPolicies = ({ id, data = []}: { id: string, data?:CardData[] }) => {
  
    const [mydata, setData] = useState<CardData[]>(data);
          
    useEffect(() => {        
        if (data) {            
            setData(data);
        }
    }, [data]);

    return (
        <ContentCardSet
            id = {id}  
            setTitle = "Grading Policies"          
            titleLabel="Grading Policy Title"
            titlePlaceholder ="Enter Your Grading Policy (e.g., Late Work, Attendance, Participation)."
            descriptionLabel=""

            descriptionPlaceholder="Policy Details / Criteria: "
            initialCards={mydata} //[{"title": "t1", "description": "d1"}]}
            onChange = {() => {}}           
            minCards={1}
            separateLabel={true}
            maxCards={4}    
        />
    )
}
 export default GradingPolicies;