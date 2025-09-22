import SyllabusLayout from "../../../SyllabusLayout/SyllabusPageHeader";
import GeneratePageContent from "./GeneratePageContent"
import { JsonComponent} from "../../../utils/jsonRenderer";

interface GenerateSyllabusPageProps {
    json: JsonComponent[];
    formData: Record<string, string>;
    onFieldChange: (label: string, value: string) => void;
    onBack: () => void;
    onNext: () => void;
    onSave: () => void;
    onSaveAndExit: () => void;
    onPreview: () => void;
}
const GenerateSyllabusPage = ({
                                  json, formData, onFieldChange,
                                  onBack, onNext, onSave, onSaveAndExit, onPreview,
                              }: GenerateSyllabusPageProps) => (
    <>
        <SyllabusLayout {...{ onBack, onNext, onSave, onSaveAndExit, onPreview }} />
        <GeneratePageContent json={{content: json}} formData={formData} onFieldChange={onFieldChange} />
    </>
);


export default GenerateSyllabusPage