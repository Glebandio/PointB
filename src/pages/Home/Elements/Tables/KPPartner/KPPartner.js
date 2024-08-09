import KPPartnerButtons from "./KPPartnerButtons";
import './KPPartner.css'; // Connect CSS file
import Folder from './Folder';

export default function KPpartner() {

    return (
        <div className="object-table">
            <KPPartnerButtons />
            <div className="object-3">
                <Folder/>
            </div>
        </div>
    );
}
