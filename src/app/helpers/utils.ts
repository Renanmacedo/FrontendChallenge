export type ThemeColor = "primary" | "secondary" | "dark" | "orange" | "light" | "warn" | "purple" | "success";


const _clsClass = ["sm-primary", "sm-secondary", "sm-orange", "sm-light", "sm-warn"];


/** return class theme */
export class PalletTheme {

    private color: ThemeColor
    
    constructor(color: ThemeColor) {
        this.color = color;
    };

}