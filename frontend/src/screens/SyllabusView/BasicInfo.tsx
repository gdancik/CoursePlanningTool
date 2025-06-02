import Applayout from "../../ApplicationLayout/Applayout";
import React, {useEffect, useState} from "react";
import {loadBasicInfoFields, BasicInfoData} from "../../utils/loadBasicInfoFields";


const BasicInfo = () =>{
    const [info, setInfo] = useState<BasicInfoData[]>([]);


    //Tracks user-entered form data
    const[formData, setFormData] = useState<Record<string, string>>({})

    useEffect(() => {
        loadBasicInfoFields("/data/basic_info_fields.csv").then(setInfo);
    }, []);


    const handleChange = (fieldLabel: string, value: string) =>{
        setFormData(prev)
    }
    //TODO: Backend Integration for loading/saving
    return (
        <div>
            <Applayout/>
            <div></div>

        </div>
    );
};
export default BasicInfo;