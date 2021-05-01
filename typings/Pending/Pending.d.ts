import { ReactElement, ReactNode } from "react";
export interface PendingInterface {
    loading: boolean;
    children: ReactNode;
}
export default function Pending({ loading, children }: PendingInterface): ReactElement;
