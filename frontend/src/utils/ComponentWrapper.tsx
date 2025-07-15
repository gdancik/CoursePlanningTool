// This component ensures safe rendering of an SVG icon by checking if the Icon prop is provided.

import { SVGProps } from "react";

// Props: 
// - Icon: the SVG icon component to render (e.g., from react-icons)
// - ...props: any other valid SVG element properties to pass through
const SafeIcon = ({ Icon, ...props }: { Icon: any } & SVGProps<SVGSVGElement>) => {
    // If the Icon is provided, render it with the passed props; otherwise render nothing
    return Icon ? <Icon {...props} /> : null;
};

export default SafeIcon;
