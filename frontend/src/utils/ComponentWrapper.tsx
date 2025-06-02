import { SVGProps } from "react";

const SafeIcon = ({ Icon, ...props }: { Icon: any } & SVGProps<SVGSVGElement>) => {
    return Icon ? <Icon {...props} /> : null;
};
export default SafeIcon;