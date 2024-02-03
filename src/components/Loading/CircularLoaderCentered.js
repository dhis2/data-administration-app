import { CircularLoader } from "@dhis2/ui";
import css from './CircularLoaderCentered.module.css';

export const CircularLoaderCentered = () => {
    return <CircularLoader className={css.centered} />;
}
