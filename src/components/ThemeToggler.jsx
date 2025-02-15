
import React, { useState } from "react";
import { FormGroup, FormControlLabel, Switch } from "@mui/material";
import { ThemeToggle } from "./ThemeSwitch";
import { useTheme } from "../theme/theme";
import styled from "styled-components";
 


export const CustomFormGroup = styled(FormGroup)`
  width: 100%;
  align-items: flex-start
`

const ThemeToggler = ({}) => {
  const [checked, setChecked] = useState(false);
  const { toggleTheme } = useTheme();

  const handleChange = (event) => {
    setChecked(event.target.checked);
    toggleTheme();
  };


  return (
    <CustomFormGroup>
      <FormControlLabel
        control={<ThemeToggle onChange={handleChange} checked={checked} sx={{ m: 1 }} />}
        label="Mode"
      />
    </CustomFormGroup>
  );
};

export default ThemeToggler;