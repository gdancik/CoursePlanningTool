import Applayout from "../../ApplicationLayout/Applayout";
import React, {useEffect, useState} from "react";
import {loadBasicInfoFields, BasicInfoData} from "../../utils/loadBasicInfoFields";


const BasicInfo = () =>{
    const [info, setInfo] = useState<BasicInfoData[]>([]);

    useEffect(() => {
        loadBasicInfoFields("/data/basic_info_fields.csv").then(setInfo);
    }, []);

    //TODO: Backend Integration for loading/saving
    return (
        <div>
            <Applayout/>
            <div></div>

        </div>
    );
};
export default BasicInfo;