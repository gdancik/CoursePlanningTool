import React from "react";
import { InformationTextComponent} from "../../../utils/types";

interface InformationTextWrapperProps {
  component: InformationTextComponent;
}

export const InformationTextWrapper: React.FC<InformationTextWrapperProps> = ({
  component,
}) => {
  return component.placeholder ? (
    <p>{component.placeholder}</p>
  ) : (
    <p>
      <br />
    </p>
  );
};