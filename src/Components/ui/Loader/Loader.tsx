import React, {FC} from "react";
import { LoaderUi } from "./styled";
import {LinearProgress} from "@material-ui/core";

export const Loader: FC = () => {
    return (
      <LoaderUi>
          <LinearProgress />
      </LoaderUi>
    )
}